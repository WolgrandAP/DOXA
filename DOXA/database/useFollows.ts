import { useSQLiteContext } from "expo-sqlite";

export function useFollows() {
    const db = useSQLiteContext();

    const followUser = async (followerId: number, followedId: number) => {
        try {
            if (followerId === followedId) {
                console.error("Você não pode seguir a si mesmo");
                return false;
            }

            await db.runAsync(
                "INSERT OR IGNORE INTO user_follows (follower_id, followed_id) VALUES (?, ?)",
                [followerId, followedId]
            );
            return true;
        } catch (error) {
            console.error("Erro ao seguir:", error);
            return false;
        }
    };

    const unfollowUser = async (followerId: number, followedId: number) => {
        try {
            await db.runAsync(
                "DELETE FROM user_follows WHERE follower_id = ? AND followed_id = ?",
                [followerId, followedId]
            );
            return true;
        } catch (error) {
            console.error("Erro ao deixar de seguir:", error);
            return false;
        }
    };

    const isFollowing = async (followerId: number, followedId: number) => {
        try {
            const result = await db.getFirstAsync<any>(
                "SELECT 1 FROM user_follows WHERE follower_id = ? AND followed_id = ?",
                [followerId, followedId]
            );
            return !!result;
        } catch (error) {
            return false;
        }
    };

    const getFollowersCount = async (userId: number) => {
        try {
            const result = await db.getFirstAsync<{ count: number }>(
                "SELECT COUNT(*) as count FROM user_follows WHERE followed_id = ?",
                [userId]
            );
            return result?.count || 0;
        } catch (error) {
            return 0;
        }
    };

    const getFollowingCount = async (userId: number) => {
        try {
            const result = await db.getFirstAsync<{ count: number }>(
                "SELECT COUNT(*) as count FROM user_follows WHERE follower_id = ?",
                [userId]
            );
            return result?.count || 0;
        } catch (error) {
            return 0;
        }
    };

    return {
        followUser,
        unfollowUser,
        isFollowing,
        getFollowersCount,
        getFollowingCount,
    };
}