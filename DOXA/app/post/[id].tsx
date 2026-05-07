import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MOCK_DATA, MOCK_FOLLOWING, Post } from "@/constants/posts";

const ALL_POSTS = [...MOCK_DATA, ...MOCK_FOLLOWING];

export default function PostDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const post = ALL_POSTS.find((p) => p.id === id);

  const [votes, setVotes] = useState(post?.votes ?? 0);
  const [voted, setVoted] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [imageModalVisible, setImageModalVisible] = useState(false);

  if (!post) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={["#050510", "#050510", "#170326"]}
          style={StyleSheet.absoluteFill}
        />
        <SafeAreaView style={styles.centeredContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#c084fc" />
          <Text style={styles.notFoundText}>Post não encontrado</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.goBackText}>Voltar</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={["#050510", "#050510", "#170326"]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
          keyboardVerticalOffset={10}
        >
        {/* ─── HEADER ─── */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <BlurView intensity={20} tint="dark" style={styles.backBlur}>
              <Ionicons name="arrow-back" size={22} color="#e9d5ff" />
            </BlurView>
          </TouchableOpacity>

          <Text style={styles.headerTitle} numberOfLines={1}>
            {post.subject}
          </Text>

          <TouchableOpacity style={styles.backButton} hitSlop={10}>
            <BlurView intensity={20} tint="dark" style={styles.backBlur}>
              <Ionicons name="bookmark-outline" size={20} color="#e9d5ff" />
            </BlurView>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ─── POST CONTENT ─── */}
          <View style={styles.postCardOuter}>
            <BlurView intensity={15} tint="dark" style={styles.postCard}>
              {/* Subject & Tag */}
              <View style={styles.subjectRow}>
                <View style={styles.subjectContainer}>
                  <Text style={styles.subject}>{post.subject}</Text>
                  <View style={styles.tagBadge}>
                    <Text style={styles.tagText}>{post.tag}</Text>
                  </View>
                </View>
              </View>

              {/* Title */}
              <Text style={styles.postTitle}>{post.title}</Text>

              {/* Description (full, no line limit) */}
              {post.description && (
                <Text style={styles.postDescription}>{post.description}</Text>
              )}

              {/* Image */}
              {post.imageUrl && (
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setImageModalVisible(true)}
                  style={styles.imageContainer}
                >
                  <Image
                    source={{ uri: post.imageUrl }}
                    style={styles.postImage}
                    resizeMode="contain"
                  />
                  <View style={styles.imageOverlay} />
                </TouchableOpacity>
              )}

              {/* Author Info */}
              <Text style={styles.authorInfo}>
                {post.author} • {post.role} • {post.time}
              </Text>

              {/* Actions */}
              <View style={styles.actions}>
                <View style={styles.leftActions}>
                  <TouchableOpacity
                    style={[styles.voteBtn, voted && styles.voteBtnActive]}
                    onPress={() => {
                      if (voted) {
                        setVotes((v) => v - 1);
                      } else {
                        setVotes((v) => v + 1);
                      }
                      setVoted(!voted);
                    }}
                  >
                    <Ionicons
                      name={voted ? "chevron-up" : "chevron-up-outline"}
                      size={20}
                      color="white"
                    />
                    <Text style={styles.actionText}>{votes}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.commentBtn}>
                    <Ionicons
                      name="chatbubble-outline"
                      size={18}
                      color="white"
                    />
                    <Text style={styles.actionText}>{post.comments}</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.shareBtn}>
                  <Ionicons
                    name="share-social-outline"
                    size={18}
                    color="white"
                  />
                  <Text style={styles.actionText}>Compartilhar</Text>
                </TouchableOpacity>
              </View>
            </BlurView>
          </View>

          {/* ─── COMMENTS SECTION ─── */}
          <View style={styles.commentsSection}>
            <View style={styles.commentsTitleRow}>
              <Ionicons name="chatbubbles-outline" size={18} color="#c084fc" />
              <Text style={styles.commentsSectionTitle}>Comentários</Text>
            </View>

            {/* Empty state */}
            <View style={styles.emptyCommentsOuter}>
              <BlurView
                intensity={15}
                tint="dark"
                style={styles.emptyCommentsCard}
              >
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={40}
                  color="rgba(255,255,255,0.15)"
                />
                <Text style={styles.emptyCommentsTitle}>
                  Nenhum comentário ainda
                </Text>
                <Text style={styles.emptyCommentsSubtitle}>
                  Seja o primeiro a comentar neste post
                </Text>
              </BlurView>
            </View>
          </View>
        </ScrollView>

        {/* ─── COMMENT INPUT BAR ─── */}
        <View style={styles.commentBarOuter}>
          <BlurView intensity={30} tint="dark" style={styles.commentBar}>
            <View style={styles.commentInputWrapper}>
              <Ionicons
                name="chatbubble-outline"
                size={18}
                color="rgba(255,255,255,0.3)"
              />
              <TextInput
                style={styles.commentInput}
                placeholder="Escreva um comentário..."
                placeholderTextColor="rgba(255,255,255,0.3)"
                value={commentText}
                onChangeText={setCommentText}
                multiline
                maxLength={500}
              />
            </View>
            <TouchableOpacity
              style={[
                styles.sendButton,
                !commentText.trim() && styles.sendButtonDisabled,
              ]}
              disabled={!commentText.trim()}
            >
              <LinearGradient
                colors={
                  commentText.trim()
                    ? ["#a855f7", "#7e22ce"]
                    : ["rgba(168,85,247,0.3)", "rgba(126,34,206,0.15)"]
                }
                style={styles.sendGradient}
              >
                <Ionicons name="send" size={18} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </BlurView>
        </View>
        </KeyboardAvoidingView>

        {/* ─── FULLSCREEN IMAGE MODAL ─── */}
        {post.imageUrl && (
          <Modal
            visible={imageModalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setImageModalVisible(false)}
          >
            <Pressable
              style={styles.modalBackdrop}
              onPress={() => setImageModalVisible(false)}
            >
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setImageModalVisible(false)}
              >
                <BlurView
                  intensity={40}
                  tint="dark"
                  style={styles.modalCloseBtnBlur}
                >
                  <Ionicons name="close" size={24} color="#fff" />
                </BlurView>
              </TouchableOpacity>
              <Image
                source={{ uri: post.imageUrl }}
                style={styles.modalImage}
                resizeMode="contain"
              />
            </Pressable>
          </Modal>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050510",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  notFoundText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  goBackText: {
    color: "#c084fc",
    fontSize: 15,
    fontWeight: "600",
    marginTop: 8,
  },

  // ── Header ──
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  backBlur: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "#c084fc",
    fontSize: 15,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 12,
  },

  // ── Scroll ──
  scrollContent: {
    paddingBottom: 100,
  },

  // ── Post Card ──
  postCardOuter: {
    marginHorizontal: 16,
    marginTop: 5,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  postCard: {
    padding: 18,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },
  subjectRow: {
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
  postTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "bold",
    lineHeight: 28,
    marginBottom: 12,
  },
  postDescription: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
    maxHeight: 400,
    borderRadius: 14,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "#1a1a2e",
  },
  postImage: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
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
  shareBtn: {
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

  // ── Comments Section ──
  commentsSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  commentsTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  commentsSectionTitle: {
    color: "#f3e8ff",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
  emptyCommentsOuter: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  emptyCommentsCard: {
    padding: 40,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyCommentsTitle: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 14,
  },
  emptyCommentsSubtitle: {
    color: "rgba(255, 255, 255, 0.3)",
    fontSize: 13,
    marginTop: 6,
  },

  // ── Comment Input Bar ──
  commentBarOuter: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
  },
  commentBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 30,
    backgroundColor: "rgba(5,5,16,0.9)",
  },
  commentInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    minHeight: 44,
    maxHeight: 100,
  },
  commentInput: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
    marginLeft: 8,
    paddingVertical: 8,
    maxHeight: 80,
  },
  sendButton: {
    marginLeft: 10,
    borderRadius: 12,
    overflow: "hidden",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendGradient: {
    width: 42,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
  },

  // ── Fullscreen Image Modal ──
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCloseBtn: {
    position: "absolute",
    top: 60,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    zIndex: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  modalCloseBtnBlur: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: "100%",
    height: "80%",
  },
});
