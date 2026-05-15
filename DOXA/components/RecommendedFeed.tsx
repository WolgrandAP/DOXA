import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, ActivityIndicator, View, Text } from "react-native";
import { PostCard } from "@/components/PostCard";
import { useDatabase } from "@/database/useDatabase";

export function RecommendedFeed() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { getPosts } = useDatabase();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await getPosts();
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
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <PostCard item={item} />}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
      initialNumToRender={10}
      onRefresh={fetchPosts}
      refreshing={loading}
      ListEmptyComponent={<Text style={styles.emptyText}>Nenhum post encontrado.</Text>}
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
  }
});
