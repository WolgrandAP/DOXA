import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { PostCard } from "../../components/PostCard";
import { useDatabase } from "../../database/useDatabase";
import { useSQLiteContext } from "expo-sqlite";

const { width } = Dimensions.get("window");

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { getPosts } = useDatabase();
  const db = useSQLiteContext();

  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [allCommunities, setAllCommunities] = useState<any[]>([]);

  useEffect(() => {
    async function loadSearchData() {
      try {
        const posts = await getPosts();
        setAllPosts(posts);

        const comms = await db.getAllAsync<any>('SELECT * FROM communities');
        setAllCommunities(comms);
      } catch (error) {
        console.error("Erro na busca", error);
      }
    }
    loadSearchData();
  }, [db]);

  // Filtering logic
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return allPosts.filter((post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allPosts]);

  const filteredCommunities = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return allCommunities.filter((community) =>
      community.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allCommunities]);

  const recommendedCommunities = useMemo(() => {
    return allCommunities.slice(0, 5);
  }, [allCommunities]);

  const renderCommunityItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.communityResultCard}
      onPress={() => router.push(`/community/${item.id}` as any)}
    >
      <BlurView intensity={10} tint="light" style={styles.communityResultBlur}>
        <View style={[styles.communityResultImage, { backgroundColor: "rgba(192, 132, 252, 0.2)", justifyContent: "center", alignItems: "center" }]}>
          <Text style={{ color: "#c084fc", fontSize: 20, fontWeight: "bold" }}>{item.name.charAt(4).toUpperCase()}</Text>
        </View>
        <View style={styles.communityResultInfo}>
          <Text style={styles.communityResultName}>{item.name}</Text>
          <Text style={styles.communityResultMembers}>{item.members} membros</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.4)" />
      </BlurView>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={["#050510", "#050510", "#170326"]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        {/* Search Header */}
        <View style={styles.header}>
          <View style={styles.searchBarContainer}>
            <BlurView intensity={20} tint="light" style={styles.searchBarBlur}>
              <Ionicons name="search" size={20} color="rgba(255,255,255,0.5)" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Pesquisar no DOXA..."
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={searchQuery}
                onChangeText={setSearchQuery}
                selectionColor="#a855f7"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons name="close-circle" size={20} color="rgba(255,255,255,0.5)" />
                </TouchableOpacity>
              )}
            </BlurView>
          </View>
        </View>

        {!searchQuery ? (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Recommended Communities Section */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Comunidades Recomendadas</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recommendedContainer}
            >
              {recommendedCommunities.map((community) => (
                <TouchableOpacity
                  key={community.id}
                  style={styles.recommendedCard}
                  onPress={() => router.push(`/community/${community.id}` as any)}
                >
                  <View style={[styles.recommendedImage, { backgroundColor: "rgba(192, 132, 252, 0.2)", justifyContent: "center", alignItems: "center" }]}>
                    <Text style={{ color: "#c084fc", fontSize: 40, fontWeight: "bold" }}>{community.name.charAt(4).toUpperCase()}</Text>
                  </View>
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.8)"]}
                    style={styles.recommendedGradient}
                  >
                    <Text style={styles.recommendedName} numberOfLines={1}>
                      {community.name}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Trending Section Placeholder */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Bombando no DOXA</Text>
            </View>
            <View style={styles.trendingCard}>
              <BlurView intensity={10} tint="light" style={styles.trendingBlur}>
                {[
                  "#javascript",
                  "#reactnative",
                  "#ai",
                  "#coding",
                  "#gaming",
                  "#typescript",
                  "#design",
                  "#filosofia",
                  "#musica",
                  "#tecnologia",
                ].map((tag, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.trendingItem}
                    onPress={() => setSearchQuery(tag.replace("#", ""))}
                  >
                    <Text style={styles.trendingTag}>{tag}</Text>
                    <Ionicons name="trending-up" size={16} color="#a855f7" />
                  </TouchableOpacity>
                ))}
              </BlurView>
            </View>
          </ScrollView>
        ) : (
          <FlatList
            data={[
              ...filteredCommunities.map((c) => ({ ...c, type: "community" })),
              ...filteredPosts.map((p) => ({ ...p, type: "post" })),
            ]}
            keyExtractor={(item) => `${item.type}-${item.id}`}
            contentContainerStyle={styles.resultsList}
            renderItem={({ item }) => {
              if (item.type === "community") {
                return renderCommunityItem({ item });
              }
              return <PostCard item={item} />;
            }}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={64} color="rgba(255,255,255,0.1)" />
                <Text style={styles.emptyText}>Nenhum resultado encontrado para "{searchQuery}"</Text>
              </View>
            }
          />
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
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBarContainer: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  searchBarBlur: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: "white",
    fontSize: 16,
    height: "100%",
  },
  scrollContent: {
    paddingBottom: 100,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  recommendedContainer: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  recommendedCard: {
    width: 140,
    height: 180,
    marginRight: 12,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#1a1a2e",
  },
  recommendedImage: {
    width: "100%",
    height: "100%",
  },
  recommendedGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    justifyContent: "flex-end",
    padding: 12,
  },
  recommendedName: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  trendingCard: {
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  trendingBlur: {
    padding: 16,
  },
  trendingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  trendingTag: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 16,
    fontWeight: "600",
  },
  resultsList: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  communityResultCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  communityResultBlur: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  communityResultImage: {
    width: 50,
    height: 50,
    borderRadius: 12,
    marginRight: 12,
  },
  communityResultInfo: {
    flex: 1,
  },
  communityResultName: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  communityResultMembers: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
    paddingHorizontal: 32,
  },
  emptyText: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
  },
});
