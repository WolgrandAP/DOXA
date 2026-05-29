import { useSQLiteContext } from "expo-sqlite";

export interface Post {
    id: string;
    user_id: number;
    author: string;
    title: string;
    description: string | null;
    subject: string;
    tag: string;
    role: string;
    time: string;
    image_url: string | null;
    upvotes: number;
    comments_count: number;
    is_saved: number;
    created_at: string;
}

export function useDatabase() {
    const db = useSQLiteContext();

    const mapPost = (post: Post) => ({
        id: post.id,
        subject: post.subject || "d://geral",
        tag: post.tag || "#novo",
        title: post.title,
        description: post.description,
        author: post.author,
        role: post.role || "Usuário",
        time: post.time || "agora",
        votes: post.upvotes,
        comments: post.comments_count,
        imageUrl: post.image_url,
        isSaved: post.is_saved === 1,
    });

    const getPosts = async () => {
        try {
            const posts = await db.getAllAsync<Post>("SELECT * FROM posts ORDER BY created_at DESC");
            return posts.map(mapPost);
        } catch (error) {
            console.error("Erro ao buscar posts:", error);
            return [];
        }
    };

    const getUserPosts = async (userId: number) => {
        try {
            const posts = await db.getAllAsync<Post>(
                "SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC",
                [userId]
            );
            return posts.map(mapPost);
        } catch (error) {
            console.error("Erro ao buscar posts do usuario:", error);
            return [];
        }
    };

    const getSavedPosts = async (userId: string | number) => {
        try {
            const normalizedUserId = typeof userId === 'string' && !isNaN(Number(userId)) 
                ? parseInt(userId, 10) 
                : userId;

            const posts = await db.getAllAsync<Post>(
                `SELECT p.* FROM posts p 
                INNER JOIN user_saved_posts usp ON p.id = usp.post_id 
                WHERE usp.user_id = ? 
                ORDER BY p.created_at DESC`,
                [normalizedUserId]
            );
            
            return posts && posts.length > 0 ? posts.map(mapPost) : [];
        } catch (error) {
            console.error("Erro ao buscar posts salvos:", error);
            return [];
        }
    };

    const getFollowingPosts = async (userId: number) => {
        try {
            const posts = await db.getAllAsync<Post>(
                "SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC",
                [userId]
            );
            return posts.map(mapPost);
        } catch (error) {
            console.error("Erro ao buscar posts do usuario:", error);
            return [];
        }
        /*try {
            const posts = await db.getAllAsync<Post>(
                `SELECT DISTINCT p.* FROM posts p
         INNER JOIN user_follows uf ON p.user_id = uf.followed_id
         WHERE uf.follower_id = ?
         ORDER BY p.created_at DESC`,
                [userId]
            );
            return posts.map(mapPost);
        } catch (error) {
            console.error("Erro ao buscar posts (following):", error);
            return [];
        }*/
    };

    const getJoinedCommunities = async (userId: number) => {
        try {
            return await db.getAllAsync<any>(
                `SELECT c.* FROM communities c 
         INNER JOIN user_communities uc ON c.id = uc.community_id 
         WHERE uc.user_id = ?`,
                [userId]
            );
        } catch (error) {
            console.error("Erro ao buscar comunidades participando:", error);
            return [];
        }
    };

    const getCreatedCommunities = async (userId: number) => {
        try {
            return await db.getAllAsync<any>(
                "SELECT * FROM communities WHERE creator_id = ?",
                [userId]
            );
        } catch (error) {
            console.error("Erro ao buscar comunidades criadas:", error);
            return [];
        }
    };

    const toggleCommunityJoin = async (id: string, isJoined: boolean) => {
        try {
            await db.runAsync(
                "UPDATE communities SET is_joined = ? WHERE id = ?",
                [isJoined ? 1 : 0, id]
            );
            return true;
        } catch (error) {
            console.error("Erro ao atualizar status da comunidade:", error);
            return false;
        }
    };

    const getCommunityById = async (id: string) => {
        try {
            return await db.getFirstAsync<any>("SELECT * FROM communities WHERE id = ?", [id]);
        } catch (error) {
            console.error("Erro ao buscar comunidade:", error);
            return null;
        }
    };

    const getPostsByCommunity = async (subject: string) => {
        try {
            const posts = await db.getAllAsync<Post>(
                "SELECT * FROM posts WHERE subject = ? ORDER BY created_at DESC",
                [subject]
            );
            return posts.map(mapPost);
        } catch (error) {
            console.error("Erro ao buscar posts da comunidade:", error);
            return [];
        }
    };

    const createPost = async (
        post: {
            id: string;
            title: string;
            description: string;
            subject?: string;
            tag?: string;
            image_url?: string | null;
        },
        userId: number
    ) => {
        try {
            const user = await db.getFirstAsync<any>("SELECT name, bio FROM users WHERE id = ?", [userId]);

            if (!user) {
                console.error("Usuário não encontrado");
                return false;
            }

            const result = await db.runAsync(
                `INSERT INTO posts (id, user_id, author, title, description, subject, tag, role, time, image_url, is_synced)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
                [
                    post.id,
                    userId,
                    user.name,
                    post.title,
                    post.description,
                    post.subject || "d://novo",
                    post.tag || "#discussão",
                    "Usuário",
                    "agora",
                    post.image_url || null,
                ]
            );

            // Tenta sincronizar em background
            import('../services/syncService').then(({ SyncService }) => {
                const sync = new SyncService(db);
                sync.pushSync();
            });

            return result.changes > 0;
        } catch (error) {
            console.error("Erro ao criar post:", error);
            return false;
        }
    };

    const checkCommunityNameExists = async (name: string): Promise<boolean> => {
        try {
            const communityId = name.toLowerCase();
            const existing = await db.getFirstAsync<{ id: string }>(
                "SELECT id FROM communities WHERE id = ? OR name = ?",
                [communityId, `d://${communityId}`]
            );
            return existing !== null;
        } catch (error) {
            console.error("Erro ao verificar nome da comunidade:", error);
            return false;
        }
    };

    const createCommunity = async (
        community: {
            id: string;
            name: string;
            description: string;
            bannerUrl?: string;
        },
        userId: string | number 
    ) => {
        try {
            const normalizedUserId = typeof userId === 'string' && !isNaN(Number(userId)) 
                ? parseInt(userId, 10) 
                : userId;

            const result = await db.runAsync(
                `INSERT INTO communities (id, name, members, description, is_joined, creator_id, banner_url, is_synced)
                VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
                [
                    community.id, 
                    community.name, 
                    "1", 
                    community.description, 
                    1, 
                    normalizedUserId, 
                    community.bannerUrl || null
                ]
            );

            if (result.changes > 0) {
                await db.runAsync(
                    "INSERT OR IGNORE INTO user_communities (user_id, community_id) VALUES (?, ?)",
                    [normalizedUserId, community.id]
                );

                // Tenta sincronizar em background
                import('../services/syncService').then(({ SyncService }) => {
                    const sync = new SyncService(db);
                    sync.pushSync();
                });
            }

            return result.changes > 0;
        } catch (error) {
            console.error("Erro ao criar comunidade:", error);
            return false;
        }
    };

    const createComment = async (postId: string, text: string, userId: number) => {
        try {
            const user = await db.getFirstAsync<any>("SELECT name, avatarUrl FROM users WHERE id = ?", [userId]);

            if (!user) {
                console.error("Usuário não encontrado");
                return false;
            }

            const commentId = `comment_${Date.now()}`;
            await db.runAsync(
                `INSERT INTO comments (id, post_id, author, avatar, text, time) VALUES (?, ?, ?, ?, ?, ?)`,
                [commentId, postId, user.name, user.avatarUrl || "", text, "agora"]
            );

            await db.runAsync("UPDATE posts SET comments_count = comments_count + 1 WHERE id = ?", [postId]);

            return true;
        } catch (error) {
            console.error("Erro ao criar comentário:", error);
            return false;
        }
    };

    const registerUser = async (name: string, email: string, password: string) => {
        try {
            const handle = `@${name.toLowerCase().replace(/\s+/g, "")}${Math.floor(Math.random() * 1000)}`;
            const result = await db.runAsync(
                `INSERT INTO users (name, email, password, handle, avatarUrl, bannerUrl)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    name,
                    email,
                    password,
                    handle,
                    "https://ui-avatars.com/api/?name=" + encodeURIComponent(name) + "&background=random",
                    "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=2000&auto=format&fit=crop",
                ]
            );
            return result.lastInsertRowId;
        } catch (error) {
            console.error("Erro ao registrar usuário:", error);
            return null;
        }
    };

    const loginUser = async (email: string, password: string) => {
        try {
            const user = await db.getFirstAsync<any>(
                "SELECT * FROM users WHERE email = ? AND password = ?",
                [email, password]
            );
            return user || null;
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            return null;
        }
    };

    const getUserById = async (id: number) => {
        try {
            const user = await db.getFirstAsync<any>("SELECT * FROM users WHERE id = ?", [id]);
            return user || null;
        } catch (error) {
            console.error("Erro ao buscar usuário:", error);
            return null;
        }
    };

    return {
        getPosts,
        getUserPosts,
        getSavedPosts,
        getFollowingPosts,
        getJoinedCommunities,
        getCreatedCommunities,
        toggleCommunityJoin,
        getCommunityById,
        getPostsByCommunity,
        createPost,
        createCommunity,
        checkCommunityNameExists,
        createComment,
        registerUser,
        loginUser,
        getUserById,
    };
}