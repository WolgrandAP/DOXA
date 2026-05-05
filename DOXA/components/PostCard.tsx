import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

export function PostCard({ item }: { item: any }) {
  return (
    <View style={styles.container}>
      <BlurView intensity={15} tint="dark" style={styles.glassCard}>
        <View style={styles.header}>
          <View style={styles.subjectContainer}>
            <Text style={styles.subject}>{item.subject}</Text>
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>{item.tag}</Text>
            </View>
          </View>
          <TouchableOpacity hitSlop={10}>
            <Ionicons name="bookmark-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>{item.title}</Text>

        {item.description && (
          <Text style={styles.description} numberOfLines={3}>
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
            <TouchableOpacity style={styles.voteBtn}>
              <Ionicons name="chevron-up" size={20} color="white" />
              <Text style={styles.actionText}>{item.votes}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.commentBtn}>
              <Ionicons name="chatbubble-outline" size={18} color="white" />
              <Text style={styles.actionText}>{item.comments}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.openBtn}>
            <Ionicons name="book-outline" size={18} color="white" />
            <Text style={styles.actionText}>Abrir</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
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
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftActions: {
    flexDirection: "row",
    gap: 12,
  },
  voteBtn: {
    flexDirection: "row",
    backgroundColor: "#7e22ce",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  commentBtn: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  openBtn: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
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
