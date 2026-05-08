import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";

export function PostCard({ item }: { item: any }) {
  const router = useRouter();
  const [votes, setVotes] = useState(item.votes);
  const [voted, setVoted] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleLike = () => {
    if (!voted) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.4,
          duration: 100,
          useNativeDriver: false,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          useNativeDriver: false,
        }),
      ]).start();
      setVotes((v: number) => v + 1);
    } else {
      setVotes((v: number) => v - 1);
    }
    setVoted(!voted);
  };

  return (
    <Pressable
      onPress={() => router.push(`/post/${item.id}` as any)}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.containerPressed,
      ]}
    >
      <BlurView intensity={15} tint="dark" style={styles.glassCard}>
        <View style={styles.header}>
          <View style={styles.subjectContainer}>
            <Text style={styles.subject}>{item.subject}</Text>
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>{item.tag}</Text>
            </View>
          </View>
          <TouchableOpacity
            hitSlop={10}
            onPress={(e) => {
              e.stopPropagation?.();
              setIsSaved(!isSaved);
            }}
          >
            <Ionicons
              name={isSaved ? "bookmark" : "bookmark-outline"}
              size={20}
              color={isSaved ? "#ffffff" : "#fff"}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>{item.title}</Text>

        {item.description && (
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        )}

        {item.imageUrl && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.postImage}
              resizeMode="cover"
            />
            <View style={styles.imageOverlay} />
          </View>
        )}

        <Text style={styles.authorInfo}>
          {item.author} • {item.role} • {item.time}
        </Text>

        <View style={styles.actions}>
          <View style={styles.leftActions}>
            <TouchableOpacity
              style={[styles.voteBtn, voted && styles.voteBtnActive]}
              onPress={(e) => {
                e.stopPropagation?.();
                handleLike();
              }}
            >
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Ionicons
                  name={voted ? "heart" : "heart-outline"}
                  size={20}
                  color={voted ? "#ef4444" : "white"}
                />
              </Animated.View>
              <Text style={styles.actionText}>{votes}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.commentBtn}>
              <Ionicons name="chatbubble-outline" size={18} color="white" />
              <Text style={styles.actionText}>{item.comments}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  containerPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.985 }],
  },
  glassCard: {
    padding: 18,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  subjectContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  subject: {
    color: "#c084fc",
    fontSize: 13,
    fontWeight: "700",
    marginRight: 8,
  },
  tagBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagText: {
    color: "#aaa",
    fontSize: 11,
  },
  title: {
    color: "#ffffff",
    fontSize: 19,
    fontWeight: "bold",
    lineHeight: 25,
    marginBottom: 8,
  },
  description: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
  },
  imageContainer: {
    width: "100%",
    height: 180,
    borderRadius: 14,
    marginBottom: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  postImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#1a1a2e",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.15)",
  },
  authorInfo: {
    color: "rgba(255, 255, 255, 0.4)",
    fontSize: 12,
    marginBottom: 18,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  leftActions: {
    flexDirection: "row",
    gap: 12,
  },
  voteBtn: {
    flexDirection: "row",
    backgroundColor: "#7e22ce",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 85,
    height: 40,
  },
  voteBtnActive: {
    backgroundColor: "#9333ea",
  },
  commentBtn: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  actionText: {
    color: "white",
    marginLeft: 6,
    fontWeight: "600",
    fontSize: 14,
  },
});
