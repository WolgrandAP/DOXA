import { SQLiteDatabase } from 'expo-sqlite';
import { api } from './api';

export class SyncService {
    private db: SQLiteDatabase;

    constructor(database: SQLiteDatabase) {
        this.db = database;
    }

    async pushSync() {
        try {
            console.log("📤 Iniciando Push Sync...");
            
            const unsyncedPosts = await this.db.getAllAsync<any>("SELECT * FROM posts WHERE is_synced = 0");
            const unsyncedCommunities = await this.db.getAllAsync<any>("SELECT * FROM communities WHERE is_synced = 0");
            const unsyncedComments = await this.db.getAllAsync<any>("SELECT * FROM comments WHERE is_synced = 0");
            const unsyncedUsers = await this.db.getAllAsync<any>("SELECT * FROM users WHERE is_synced = 0");

            console.log(`Found: ${unsyncedPosts.length} posts, ${unsyncedCommunities.length} communities, ${unsyncedComments.length} comments, ${unsyncedUsers.length} users to sync`);

            // Buscar relacionamentos não sincronizados
            const userSavedPosts = await this.db.getAllAsync<any>("SELECT * FROM user_saved_posts");
            const userCommunities = await this.db.getAllAsync<any>("SELECT * FROM user_communities");
            const userFollows = await this.db.getAllAsync<any>("SELECT * FROM user_follows");

            const pushPayload = {
                posts: unsyncedPosts,
                communities: unsyncedCommunities,
                comments: unsyncedComments,
                users: unsyncedUsers,
                userSavedPosts: userSavedPosts,
                userCommunities: userCommunities,
                userFollows: userFollows
            };

            if (unsyncedPosts.length > 0 || unsyncedCommunities.length > 0 || unsyncedComments.length > 0 || unsyncedUsers.length > 0) {
                console.log("📤 Enviando dados para o servidor...");
                const response = await api.post('/sync/push', pushPayload);
                console.log("✅ Response do servidor:", response.status);

                // Marca como sincronizado no SQLite local
                if (unsyncedPosts.length > 0) {
                    await this.db.runAsync("UPDATE posts SET is_synced = 1 WHERE is_synced = 0");
                    console.log("✅ Posts marcados como sincronizados");
                }
                if (unsyncedCommunities.length > 0) {
                    await this.db.runAsync("UPDATE communities SET is_synced = 1 WHERE is_synced = 0");
                    console.log("✅ Comunidades marcadas como sincronizadas");
                }
                if (unsyncedComments.length > 0) {
                    await this.db.runAsync("UPDATE comments SET is_synced = 1 WHERE is_synced = 0");
                    console.log("✅ Comentários marcados como sincronizados");
                }
                if (unsyncedUsers.length > 0) {
                    await this.db.runAsync("UPDATE users SET is_synced = 1 WHERE is_synced = 0");
                    console.log("✅ Usuários marcados como sincronizados");
                }

                console.log("✅ Push Sync finalizado com sucesso!");
            } else {
                console.log("ℹ️ Nenhum dado para sincronizar");
            }
        } catch (error) {
            console.error("❌ Erro ao fazer Push Sync:", error);
            throw error; // Propagar erro para retry logic
        }
    }

    async pullSync() {
        try {
            console.log("📥 Iniciando Pull Sync...");
            
            const response = await api.get('/sync/pull');
            const data = response.data;

            console.log("📥 Recebendo dados do servidor...");

            // Insere os posts recebidos do servidor no SQLite local
            for (const post of data.posts || []) {
                try {
                    await this.db.runAsync(`
                        INSERT OR IGNORE INTO posts (id, user_id, author, title, description, subject, tag, role, time, image_url, created_at, updated_at, is_synced)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
                    `, [
                        post.id,
                        post.author?.id || post.userId || 1,
                        post.author?.name || "Autor",
                        post.title,
                        post.description,
                        post.subject,
                        post.tag,
                        post.role,
                        post.time || "agora",
                        post.imageUrl,
                        post.createdAt || new Date().toISOString(),
                        post.updatedAt || new Date().toISOString()
                    ]);
                } catch (e) {
                    console.warn("⚠️ Erro ao inserir post:", post.id, e);
                }
            }
            if ((data.posts || []).length > 0) {
                console.log(`✅ ${data.posts.length} posts sincronizados`);
            }

            // Insere as comunidades recebidas do servidor
            for (const comm of data.communities || []) {
                try {
                    await this.db.runAsync(`
                        INSERT OR IGNORE INTO communities (id, name, members, description, is_joined, creator_id, banner_url, created_at, updated_at, is_synced)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
                    `, [
                        comm.id,
                        comm.name,
                        comm.members || "0",
                        comm.description,
                        1,
                        comm.creator?.id || comm.creatorId || 1,
                        comm.bannerUrl,
                        comm.createdAt || new Date().toISOString(),
                        comm.updatedAt || new Date().toISOString()
                    ]);
                } catch (e) {
                    console.warn("⚠️ Erro ao inserir comunidade:", comm.id, e);
                }
            }
            if ((data.communities || []).length > 0) {
                console.log(`✅ ${data.communities.length} comunidades sincronizadas`);
            }

            // Insere os comentários recebidos
            for (const comment of data.comments || []) {
                try {
                    await this.db.runAsync(`
                        INSERT OR IGNORE INTO comments (id, post_id, user_id, text, time, likes, created_at, updated_at, is_synced)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
                    `, [
                        comment.id,
                        comment.post?.id || comment.postId,
                        comment.author?.id || comment.userId || 1,
                        comment.text,
                        comment.time || "agora",
                        comment.likes || 0,
                        comment.createdAt || new Date().toISOString(),
                        comment.updatedAt || new Date().toISOString()
                    ]);
                } catch (e) {
                    console.warn("⚠️ Erro ao inserir comentário:", comment.id, e);
                }
            }
            if ((data.comments || []).length > 0) {
                console.log(`✅ ${data.comments.length} comentários sincronizados`);
            }

            // Sincroniza relacionamentos
            for (const rel of data.userSavedPosts || []) {
                try {
                    await this.db.runAsync(
                        "INSERT OR IGNORE INTO user_saved_posts (user_id, post_id) VALUES (?, ?)",
                        [rel.userId, rel.postId]
                    );
                } catch (e) {
                    console.warn("⚠️ Erro ao sincronizar saved post:", e);
                }
            }

            for (const rel of data.userCommunities || []) {
                try {
                    await this.db.runAsync(
                        "INSERT OR IGNORE INTO user_communities (user_id, community_id) VALUES (?, ?)",
                        [rel.userId, rel.communityId]
                    );
                } catch (e) {
                    console.warn("⚠️ Erro ao sincronizar user community:", e);
                }
            }

            for (const rel of data.userFollows || []) {
                try {
                    await this.db.runAsync(
                        "INSERT OR IGNORE INTO user_follows (follower_id, followed_id) VALUES (?, ?)",
                        [rel.followerId, rel.followedId]
                    );
                } catch (e) {
                    console.warn("⚠️ Erro ao sincronizar follow:", e);
                }
            }

            console.log("✅ Pull Sync finalizado com sucesso!");
        } catch (error) {
            console.error("❌ Erro ao fazer Pull Sync:", error);
            throw error; // Propagar erro para retry logic
        }
    }
}
