import { useSQLiteContext } from 'expo-sqlite';

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
    subject: post.subject || 'd://geral',
    tag: post.tag || '#novo',
    title: post.title,
    description: post.description,
    author: post.author,
    role: post.role || 'Usuário',
    time: post.time || 'agora',
    votes: post.upvotes,
    comments: post.comments_count,
    imageUrl: post.image_url,
    isSaved: post.is_saved === 1
  });

  const getPosts = async () => {
    try {
      const posts = await db.getAllAsync<Post>('SELECT * FROM posts ORDER BY created_at DESC');
      return posts.map(mapPost);
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
      return [];
    }
  };

  const getUserPosts = async (userId: number) => {
    try {
      const posts = await db.getAllAsync<Post>('SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC', [userId]);
      return posts.map(mapPost);
    } catch (error) {
      console.error('Erro ao buscar posts do usuario:', error);
      return [];
    }
  };

  const getSavedPosts = async () => {
    try {
      const posts = await db.getAllAsync<Post>('SELECT * FROM posts WHERE is_saved = 1 ORDER BY created_at DESC');
      return posts.map(mapPost);
    } catch (error) {
      console.error('Erro ao buscar posts salvos:', error);
      return [];
    }
  };

  const getJoinedCommunities = async () => {
    try {
      return await db.getAllAsync<any>('SELECT * FROM communities WHERE is_joined = 1');
    } catch (error) {
      console.error('Erro ao buscar comunidades:', error);
      return [];
    }
  };

  const createPost = async (post: {
    id: string;
    title: string;
    description: string;
    subject?: string;
    tag?: string;
    image_url?: string | null;
  }) => {
    try {
      const result = await db.runAsync(
        `INSERT INTO posts (id, user_id, author, title, description, subject, tag, role, time, image_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          post.id,
          1, 
          'João Victor', 
          post.title,
          post.description,
          post.subject || 'd://novo',
          post.tag || '#discussão',
          'Desenvolvedor', 
          'agora', 
          post.image_url || null
        ]
      );
      return result.changes > 0;
    } catch (error) {
      console.error('Erro ao criar post:', error);
      return false;
    }
  };

  const getFollowingPosts = async () => {
    // Por enquanto, retornando a mesma consulta, mas com outra ordenação ou limite simulando "following"
    try {
      const posts = await db.getAllAsync<Post>('SELECT * FROM posts ORDER BY upvotes DESC LIMIT 5');
      return posts.map(mapPost);
    } catch (error) {
      console.error('Erro ao buscar posts (following):', error);
      return [];
    }
  };

  const createCommunity = async (community: { id: string, name: string, description: string }) => {
    try {
      const result = await db.runAsync(
        `INSERT INTO communities (id, name, members, description, is_joined) VALUES (?, ?, ?, ?, ?)`,
        [community.id, community.name, '1', community.description, 1]
      );
      return result.changes > 0;
    } catch (error) {
      console.error('Erro ao criar comunidade:', error);
      return false;
    }
  };

  const createComment = async (postId: string, text: string) => {
    try {
      const commentId = `comment_${Date.now()}`;
      await db.runAsync(
        `INSERT INTO comments (id, post_id, author, avatar, text, time) VALUES (?, ?, ?, ?, ?, ?)`,
        [commentId, postId, 'João Victor', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop', text, 'agora']
      );
      await db.runAsync(`UPDATE posts SET comments_count = comments_count + 1 WHERE id = ?`, [postId]);
      return true;
    } catch (error) {
      console.error('Erro ao criar comentário:', error);
      return false;
    }
  };

  const getCommunityById = async (id: string) => {
    try {
      return await db.getFirstAsync<any>('SELECT * FROM communities WHERE id = ?', [id]);
    } catch (error) {
      console.error('Erro ao buscar comunidade:', error);
      return null;
    }
  };

  const getPostsByCommunity = async (subject: string) => {
    try {
      const posts = await db.getAllAsync<Post>('SELECT * FROM posts WHERE subject = ? ORDER BY created_at DESC', [subject]);
      return posts.map(mapPost);
    } catch (error) {
      console.error('Erro ao buscar posts da comunidade:', error);
      return [];
    }
  };

  return {
    getPosts,
    getUserPosts,
    getSavedPosts,
    getJoinedCommunities,
    getCommunityById,
    getPostsByCommunity,
    getFollowingPosts,
    createPost,
    createCommunity,
    createComment
  };
}
