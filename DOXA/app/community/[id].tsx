import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, SafeAreaView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { PostCard } from "../../components/PostCard";
import { MOCK_DATA } from "../../constants/posts";

// Map community IDs to details for the header
const COMMUNITY_DETAILS: Record<string, any> = {
  "dev_pt": { name: "d://dev_pt", members: "15k", description: "Comunidade para desenvolvedores que falam português.", banner: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2000&auto=format&fit=crop" },
  "tecnologia": { name: "d://tecnologia", members: "250k", description: "Notícias e discussões sobre o mundo da tecnologia.", banner: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000&auto=format&fit=crop" },
  "gaming": { name: "d://gaming", members: "1.2m", description: "O maior fórum de jogos da rede DOXA.", banner: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2000&auto=format&fit=crop" },
  "meuSetup": { name: "d://meuSetup", members: "89k", description: "Compartilhe e avalie setups de outras pessoas.", banner: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2000&auto=format&fit=crop" },
};

export default function CommunityScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const communityId = typeof id === 'string' ? id : '';
  const details = COMMUNITY_DETAILS[communityId] || { 
    name: `d://${communityId}`, 
    members: "10k", 
    description: "Comunidade da rede DOXA.",
    banner: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop" 
  };

  const communityPosts = MOCK_DATA.filter(post => post.subject === `d://${communityId}`);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.bannerContainer}>
        <Image source={{ uri: details.banner }} style={styles.bannerImage} />
        <View style={styles.bannerOverlay}>
          <SafeAreaView>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
          </SafeAreaView>
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
          <TouchableOpacity style={styles.joinBtn}>
            <Text style={styles.joinBtnText}>Participar</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.description}>{details.description}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#050510", "#050510", "#170326"]}
        style={StyleSheet.absoluteFill}
      />
      <FlatList
        data={communityPosts}
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
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
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
