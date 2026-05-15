import React, { useRef, useEffect, useState } from "react";
import { FlatList, StyleSheet, ActivityIndicator, View, Text } from "react-native";
import { PostCard } from "@/components/PostCard";
import { useDatabase } from "@/database/useDatabase";

export function FollowingFeed() {
  const listRef = useRef<FlatList>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { getFollowingPosts } = useDatabase();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await getFollowingPosts();
      setPosts(data);
    } finally {
      setLoading(false);
    }
  };

  if (loading && posts.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#a855f7" />
      </View>
    );
  }

  return (
    <FlatList
      ref={listRef}
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <PostCard item={item} />}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
      onRefresh={fetchPosts}
      refreshing={loading}
      ListEmptyComponent={<Text style={styles.emptyText}>Nenhum post encontrado de quem você segue.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingTop: 10,
    paddingBottom: 120,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 20,
  },
});
