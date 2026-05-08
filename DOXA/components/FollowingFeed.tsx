import React, { useRef, useEffect } from "react";
import { FlatList, StyleSheet } from "react-native";
import { PostCard } from "@/components/PostCard";
import { MOCK_FOLLOWING } from "@/constants/posts";

export function FollowingFeed() {
  const listRef = useRef<FlatList>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current) {
      listRef.current?.scrollToOffset({ offset: 0, animated: false });
      hasInitialized.current = true;
    }
  }, []);

  return (
    <FlatList
      ref={listRef}
      data={MOCK_FOLLOWING}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <PostCard item={item} />}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingTop: 10,
    paddingBottom: 120,
  },
});
