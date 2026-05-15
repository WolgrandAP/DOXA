import React, { useState, useRef, useEffect, useCallback } from "react";
import { useSQLiteContext } from "expo-sqlite";
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
  Animated,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useDatabase } from "@/database/useDatabase";

interface Post {
  id: string;
  user_id?: number; 
  author: string;
  title: string;
  description: string;
  image_url: string | null;
  upvotes: number;
  comments_count: number;
  is_saved: number;
  created_at: string;
}

export default function PostDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const db = useSQLiteContext(); 
  const { createComment } = useDatabase();

  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [votes, setVotes] = useState(0);
  const [voted, setVoted] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);

  
  const shareAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const loadData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      
      const postData = await db.getFirstAsync<any>(
        'SELECT * FROM posts WHERE id = ?', 
        [id]
      );

      if (postData) {
        setPost(postData);
        setVotes(postData.upvotes || 0);
        setIsSaved(postData.is_saved === 1);
      }

      const commentsData = await db.getAllAsync<any>(
        'SELECT * FROM comments WHERE post_id = ? ORDER BY time DESC',
        [id]
      );
      
      const parsedComments = commentsData.map(c => ({
        ...c,
        replies: typeof c.replies === 'string' ? JSON.parse(c.replies) : (c.replies || [])
      }));

      setComments(parsedComments);

    } catch (error) {
      console.error("Erro ao carregar dados do SQLite:", error);
    } finally {
      setLoading(false);
    }
  }, [id, db]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleLike = async () => {
    const newVoted = !voted;
    const newVotes = newVoted ? votes + 1 : votes - 1;

    if (newVoted) {
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.4, duration: 100, useNativeDriver: false }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: false }),
      ]).start();
    }

    setVotes(newVotes);
    setVoted(newVoted);

    try {
      await db.runAsync(
        'UPDATE posts SET upvotes = ? WHERE id = ?',
        [newVotes, id]
      );
    } catch (e) {
      console.error("Erro ao salvar like:", e);
    }
  };

  const handleSave = async () => {
    const newSaveStatus = !isSaved ? 1 : 0;
    try {
      await db.runAsync(
        'UPDATE posts SET is_saved = ? WHERE id = ?',
        [newSaveStatus, id]
      );
      setIsSaved(!isSaved);
    } catch (e) {
      console.error("Erro ao salvar post:", e);
    }
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim() || !id) return;
    
    const success = await createComment(id, commentText.trim());
    if (success) {
      setCommentText(""); 
      loadData(); 
    }
  };

  const handleLikeComment = (_commentId: string, _replyId?: string) => {};

  const toggleShareModal = (visible: boolean) => {
    if (visible) {
      setShareModalVisible(true);
      Animated.timing(shareAnimation, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    } else {
      Animated.timing(shareAnimation, { toValue: 0, duration: 250, useNativeDriver: true }).start(() => setShareModalVisible(false));
    }
  };

  if (loading) return <ActivityIndicator style={{flex:1}} />;

  if (!post) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={["#050510", "#050510", "#170326"]} style={StyleSheet.absoluteFill} />
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

            <TouchableOpacity
              style={styles.backButton}
              hitSlop={10}
              onPress={() => setIsSaved(!isSaved)}
            >
              <BlurView intensity={20} tint="dark" style={styles.backBlur}>
                <Ionicons
                  name={isSaved ? "bookmark" : "bookmark-outline"}
                  size={20}
                  color={isSaved ? "#ffffff" : "#e9d5ff"}
                />
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
                    <TouchableOpacity
                      onPress={() => {
                        const communityId = post.subject?.replace(/^d:\/\//, "") || "";
                        if (communityId) router.push(`/community/${communityId}` as any);
                      }}
                      hitSlop={8}
                    >
                      <Text style={styles.subject}>{post.subject}</Text>
                    </TouchableOpacity>
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
                      onPress={handleLike}
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
                      <Ionicons
                        name="chatbubble-outline"
                        size={18}
                        color="white"
                      />
                      <Text style={styles.actionText}>{post.comments}</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={styles.shareBtn}
                    onPress={() => toggleShareModal(true)}
                  >
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
                <Ionicons
                  name="chatbubbles-outline"
                  size={18}
                  color="#c084fc"
                />
                <Text style={styles.commentsSectionTitle}>Comentários</Text>
              </View>

              {/* Empty state */}
              {comments.length === 0 && (
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
              )}

              {/* List of comments */}
              <View style={styles.commentsList}>
                {comments.map((comment) => (
                  <View key={comment.id} style={styles.commentContainer}>
                    <View style={styles.commentItemOuter}>
                      <BlurView
                        intensity={10}
                        tint="dark"
                        style={styles.commentItem}
                      >
                        <View style={styles.commentHeader}>
                          <Image
                            source={{ uri: comment.avatar }}
                            style={styles.commentAvatar}
                          />
                          <View style={styles.commentInfo}>
                            <View style={styles.commentAuthorRow}>
                              <Text style={styles.commentAuthor}>
                                {comment.author}
                              </Text>
                              <Text style={styles.commentTime}>
                                {comment.time}
                              </Text>
                            </View>
                            <Text style={styles.commentText}>
                              {comment.text}
                            </Text>

                            <View style={styles.commentActions}>
                              <TouchableOpacity
                                style={styles.commentActionBtn}
                                onPress={() => handleLikeComment(comment.id)}
                              >
                                <Ionicons
                                  name={
                                    comment.isLiked ? "heart" : "heart-outline"
                                  }
                                  size={14}
                                  color={
                                    comment.isLiked
                                      ? "#ef4444"
                                      : "rgba(255,255,255,0.4)"
                                  }
                                />
                                <Text
                                  style={[
                                    styles.commentActionText,
                                    comment.isLiked &&
                                      styles.commentActionTextActive,
                                  ]}
                                >
                                  {comment.likes}
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.commentActionBtn}>
                                <Ionicons
                                  name="chatbubble-outline"
                                  size={14}
                                  color="rgba(255,255,255,0.4)"
                                />
                                <Text style={styles.commentActionText}>
                                  Responder
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      </BlurView>
                    </View>

                    {/* Replies Rendering */}
                    {comment.replies.length > 0 && (
                      <View style={styles.repliesContainer}>
                        <View style={styles.replyLine} />
                        <View style={{ flex: 1, gap: 10 }}>
                          {comment.replies.map((reply: any) => (
                            <View
                              key={reply.id}
                              style={styles.commentItemOuter}
                            >
                              <BlurView
                                intensity={5}
                                tint="dark"
                                style={[styles.commentItem, styles.replyItem]}
                              >
                                <View style={styles.commentHeader}>
                                  <Image
                                    source={{ uri: reply.avatar }}
                                    style={[
                                      styles.commentAvatar,
                                      styles.replyAvatar,
                                    ]}
                                  />
                                  <View style={styles.commentInfo}>
                                    <View style={styles.commentAuthorRow}>
                                      <Text style={styles.commentAuthor}>
                                        {reply.author}
                                      </Text>
                                      <Text style={styles.commentTime}>
                                        {reply.time}
                                      </Text>
                                    </View>
                                    <Text style={styles.commentText}>
                                      {reply.text}
                                    </Text>

                                    <View style={styles.commentActions}>
                                      <TouchableOpacity
                                        style={styles.commentActionBtn}
                                        onPress={() =>
                                          handleLikeComment(
                                            comment.id,
                                            reply.id,
                                          )
                                        }
                                      >
                                        <Ionicons
                                          name={
                                            reply.isLiked
                                              ? "heart"
                                              : "heart-outline"
                                          }
                                          size={14}
                                          color={
                                            reply.isLiked
                                              ? "#ef4444"
                                              : "rgba(255,255,255,0.4)"
                                          }
                                        />
                                        <Text
                                          style={[
                                            styles.commentActionText,
                                            reply.isLiked &&
                                              styles.commentActionTextActive,
                                          ]}
                                        >
                                          {reply.likes}
                                        </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                          style={styles.commentActionBtn}
                                        >
                                          <Ionicons
                                            name="chatbubble-outline"
                                            size={14}
                                            color="rgba(255,255,255,0.4)"
                                          />
                                          <Text style={styles.commentActionText}>
                                            Responder
                                          </Text>
                                        </TouchableOpacity>
                                      </View>
                                  </View>
                                </View>
                              </BlurView>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>
                ))}
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
                onPress={handleSubmitComment}
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

        {/* ─── SHARE BOTTOM SHEET MODAL (ANIMATED OVERLAY) ─── */}
        {shareModalVisible && (
          <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
            <Animated.View
              style={[
                StyleSheet.absoluteFill,
                {
                  opacity: shareAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                  }),
                },
              ]}
            >
              <Pressable
                style={styles.shareModalBackdrop}
                onPress={() => toggleShareModal(false)}
              >
                <BlurView
                  intensity={25}
                  tint="dark"
                  style={StyleSheet.absoluteFill}
                />
              </Pressable>
            </Animated.View>

            <Animated.View
              style={[
                styles.shareModalContent,
                {
                  transform: [
                    {
                      translateY: shareAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [600, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.shareModalHandle} />

              <Text style={styles.shareModalTitle}>Compartilhar via</Text>

              <View style={styles.shareOptionsGrid}>
                {/* Opção 1: Copiar Link */}
                <TouchableOpacity style={styles.shareOptionBtn}>
                  <View
                    style={[
                      styles.shareIconCircle,
                      { backgroundColor: "#3b82f6" },
                    ]}
                  >
                    <Ionicons name="link-outline" size={24} color="#fff" />
                  </View>
                  <Text style={styles.shareOptionText}>Copiar Link</Text>
                </TouchableOpacity>

                {/* Opção 2: WhatsApp */}
                <TouchableOpacity style={styles.shareOptionBtn}>
                  <View
                    style={[
                      styles.shareIconCircle,
                      { backgroundColor: "#25D366" },
                    ]}
                  >
                    <Ionicons name="logo-whatsapp" size={24} color="#fff" />
                  </View>
                  <Text style={styles.shareOptionText}>WhatsApp</Text>
                </TouchableOpacity>

                {/* Opção 3: Twitter/X */}
                <TouchableOpacity style={styles.shareOptionBtn}>
                  <View
                    style={[
                      styles.shareIconCircle,
                      { backgroundColor: "#1DA1F2" },
                    ]}
                  >
                    <Ionicons name="logo-twitter" size={24} color="#fff" />
                  </View>
                  <Text style={styles.shareOptionText}>Twitter</Text>
                </TouchableOpacity>

                {/* Opção 4: Mais Opções (Nativo) */}
                <TouchableOpacity style={styles.shareOptionBtn}>
                  <View
                    style={[
                      styles.shareIconCircle,
                      { backgroundColor: "rgba(255,255,255,0.1)" },
                    ]}
                  >
                    <Ionicons
                      name="ellipsis-horizontal"
                      size={24}
                      color="#fff"
                    />
                  </View>
                  <Text style={styles.shareOptionText}>Mais</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.shareCancelBtn}
                onPress={() => toggleShareModal(false)}
              >
                <Text style={styles.shareCancelText}>Cancelar</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
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

  scrollContent: {
    paddingBottom: 100,
  },

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

  shareModalBackdrop: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "flex-end",
  },
  shareModalContent: {
    backgroundColor: "#170326",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  shareModalHandle: {
    width: 40,
    height: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  shareModalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 24,
  },
  shareOptionsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  shareOptionBtn: {
    alignItems: "center",
    width: 70,
  },
  shareIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  shareOptionText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    textAlign: "center",
  },
  shareCancelBtn: {
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  shareCancelText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  commentsList: {
    gap: 12,
  },
  commentItemOuter: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  commentItem: {
    padding: 14,
    backgroundColor: "rgba(255,255,255,0.02)",
  },
  commentHeader: {
    flexDirection: "row",
  },
  commentAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  commentInfo: {
    flex: 1,
  },
  commentAuthorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  commentAuthor: {
    color: "#f3e8ff",
    fontSize: 14,
    fontWeight: "700",
    marginRight: 8,
  },
  commentTime: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 11,
  },
  commentText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  commentActions: {
    flexDirection: "row",
    gap: 16,
  },
  commentActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  commentActionText: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 12,
  },
  commentActionTextActive: {
    color: "#ef4444",
  },
  commentContainer: {
    marginBottom: 8,
  },
  repliesContainer: {
    flexDirection: "row",
    marginTop: 10,
    marginLeft: 20,
  },
  replyLine: {
    width: 2,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginRight: 15,
    borderRadius: 1,
    marginBottom: 10,
  },
  replyItem: {
    padding: 10,
  },
  replyAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
});
