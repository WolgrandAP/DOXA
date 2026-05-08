import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { PostCard } from "@/components/PostCard";
import { MOCK_DATA } from "@/constants/posts";

export function RecommendedFeed() {
  return (
    <FlatList
      data={MOCK_DATA}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <PostCard item={item} />}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
      initialNumToRender={10}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingTop: 10,
    paddingBottom: 120,
  },
});
