import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { PostCard } from "../../components/PostCard";
import { useDatabase } from "../../database/useDatabase";

export default function CommunityScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getCommunityById, getPostsByCommunity, toggleCommunityJoin } = useDatabase();

  const communityId = id || "";
  const [details, setDetails] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);

  useFocusEffect(
    useCallback(() => {
      async function loadCommunity() {
        if (!communityId) return;
        setLoading(true);
        const commData = await getCommunityById(communityId);
        if (commData) {
          setDetails({
            ...commData,
            banner:
              commData.banner_url ||
              "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop",
          });
          const commPosts = await getPostsByCommunity(commData.name);
          setPosts(commPosts);
        }
        setLoading(false);
      }
      loadCommunity();
    }, [communityId])
  );

  const handleToggleJoin = async () => {
    if (!details || isJoining) return;
    setIsJoining(true);
    const newStatus = details.is_joined === 1 ? 0 : 1;
    const success = await toggleCommunityJoin(communityId, newStatus === 1);
    if (success) setDetails({ ...details, is_joined: newStatus });
    setIsJoining(false);
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#a855f7" />
      </View>
    );
  }

  if (!details) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: "white" }}>Comunidade não encontrada.</Text>
      </View>
    );
  }

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.bannerContainer}>
        <Image source={{ uri: details.banner }} style={styles.bannerImage} />
        <View style={styles.bannerOverlay}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.titleRow}>
          <View style={styles.iconPlaceholder}>
            <Text style={styles.iconText}>{details.name.charAt(4).toUpperCase()}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{details.name}</Text>
            <Text style={styles.members}>{details.members} membros</Text>
          </View>
          <TouchableOpacity
            style={[styles.joinBtn, details.is_joined === 1 && { backgroundColor: "rgba(255,255,255,0.1)" }]}
            onPress={handleToggleJoin}
            disabled={isJoining}
          >
            <Text style={[styles.joinBtnText, details.is_joined === 1 && { color: "#aaa" }]}>
              {isJoining ? "..." : details.is_joined === 1 ? "Sair" : "Participar"}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.description}>{details.description}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#050510", "#050510", "#170326"]} style={StyleSheet.absoluteFill} />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard item={item} />}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum post encontrado nesta comunidade.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050510",
  },
  headerContainer: {
    marginBottom: 16,
  },
  bannerContainer: {
    height: 160,
    width: "100%",
    backgroundColor: "#1a1a2e",
    position: "relative",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 16,
    paddingTop: 48,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(192, 132, 252, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconText: {
    color: "#c084fc",
    fontSize: 24,
    fontWeight: "bold",
  },
  name: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  members: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 2,
  },
  joinBtn: {
    backgroundColor: "#a855f7",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  joinBtnText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  description: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 15,
    lineHeight: 22,
  },
  emptyContainer: {
    padding: 32,
    alignItems: "center",
  },
  emptyText: {
    color: "#aaa",
    fontSize: 16,
    textAlign: "center",
  },
});
