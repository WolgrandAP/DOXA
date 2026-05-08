import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
} from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { PostCard } from "../../components/PostCard";
import { MOCK_DATA } from "../../constants/posts";
import { EditProfileModal } from "../../components/EditProfileModal";

// Mock User Data
const INITIAL_USER = {
  name: "João Victor",
  handle: "@joaov",
  bio: "Desenvolvedor Full Stack apaixonado por tecnologia e design. Tentando sobreviver aos legados e criar coisas novas 🚀",
  followers: 1240,
  following: 342,
  avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop",
  bannerUrl: "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=2000&auto=format&fit=crop",
  communities: [
    { id: "dev_pt", name: "d://dev_pt", members: "15k", description: "Comunidade para desenvolvedores que falam português." },
    { id: "tecnologia", name: "d://tecnologia", members: "250k", description: "Notícias e discussões sobre o mundo da tecnologia." },
    { id: "gaming", name: "d://gaming", members: "1.2m", description: "O maior fórum de jogos da rede DOXA." },
    { id: "meuSetup", name: "d://meuSetup", members: "89k", description: "Compartilhe e avalie setups de outras pessoas." },
  ]
};

export default function ProfileScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"posts" | "communities" | "saved">("posts");
  const [user, setUser] = useState(INITIAL_USER);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAvatarModalVisible, setIsAvatarModalVisible] = useState(false);

  // Override author in mock posts so they look like they belong to the user
  const userPosts = MOCK_DATA.slice(0, 5).map(post => ({
    ...post,
    author: user.name,
  }));

  // Mock saved posts
  const savedPosts = MOCK_DATA.slice(5, 10);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Banner */}
      <View style={styles.bannerContainer}>
        <Image source={{ uri: user.bannerUrl }} style={styles.bannerImage} />
        <View style={styles.bannerOverlay} />
      </View>

      {/* Profile Info */}
      <View style={styles.profileInfoContainer}>
        <View style={styles.avatarRow}>
          <TouchableOpacity 
            style={styles.avatarContainer} 
            activeOpacity={0.8}
            onPress={() => setIsAvatarModalVisible(true)}
          >
            <Image source={{ uri: user.avatarUrl }} style={styles.avatarImage} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.editProfileButton} onPress={() => setIsEditModalVisible(true)}>
            <Text style={styles.editProfileText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.handle}>{user.handle}</Text>
        
        <Text style={styles.bio}>{user.bio}</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.following}</Text>
            <Text style={styles.statLabel}>Seguindo</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.followers}</Text>
            <Text style={styles.statLabel}>Seguidores</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "posts" && styles.activeTab]}
          onPress={() => setActiveTab("posts")}
        >
          <Text style={[styles.tabText, activeTab === "posts" && styles.activeTabText]}>
            Posts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "communities" && styles.activeTab]}
          onPress={() => setActiveTab("communities")}
        >
          <Text style={[styles.tabText, activeTab === "communities" && styles.activeTabText]}>
            Comunidades
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "saved" && styles.activeTab]}
          onPress={() => setActiveTab("saved")}
        >
          <Text style={[styles.tabText, activeTab === "saved" && styles.activeTabText]}>
            Salvos
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCommunityItem = ({ item }: { item: any }) => (
    <View style={styles.communityCardWrapper}>
      <BlurView intensity={15} tint="dark" style={styles.communityCard}>
        <View style={styles.communityHeader}>
          <View style={styles.communityIconPlaceholder}>
            <Text style={styles.communityIconText}>{item.name.charAt(4).toUpperCase()}</Text>
          </View>
          <View style={styles.communityInfo}>
            <Text style={styles.communityName}>{item.name}</Text>
            <Text style={styles.communityMembers}>{item.members} membros</Text>
          </View>
          <TouchableOpacity style={styles.joinButton} onPress={() => router.push(`/community/${item.id}` as any)}>
            <Text style={styles.joinButtonText}>Ver</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.communityDescription}>{item.description}</Text>
      </BlurView>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Background com gradiente Dark/Glitch */}
      <LinearGradient
        colors={["#050510", "#050510", "#170326"]}
        style={StyleSheet.absoluteFill}
      />
      <FlatList
        data={(activeTab === "posts" ? userPosts : activeTab === "saved" ? savedPosts : user.communities) as any[]}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }: { item: any }) => (activeTab === "posts" || activeTab === "saved") ? <PostCard item={item} initialSaved={activeTab === "saved"} /> : renderCommunityItem({ item })}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        style={styles.flatList}
      />
      <EditProfileModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        user={user}
        onSave={(updatedUser) => setUser(updatedUser)}
      />

      {/* Fullscreen Avatar Modal */}
      <Modal visible={isAvatarModalVisible} transparent={true} animationType="fade" onRequestClose={() => setIsAvatarModalVisible(false)}>
        <View style={styles.fullScreenModal}>
          <TouchableOpacity style={styles.closeModalButton} onPress={() => setIsAvatarModalVisible(false)}>
            <Ionicons name="close" size={32} color="white" />
          </TouchableOpacity>
          <Image source={{ uri: user.avatarUrl }} style={styles.fullScreenImage} resizeMode="contain" />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050510",
  },
  flatList: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 120,
  },
  headerContainer: {
    marginBottom: 10,
  },
  bannerContainer: {
    height: 140,
    width: "100%",
    backgroundColor: "#1a1a2e",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  profileInfoContainer: {
    paddingHorizontal: 16,
  },
  avatarRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: "#050510",
    overflow: "hidden",
    backgroundColor: "#2a2a3e",
    marginTop: -40, // Pull up to overlap with banner
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  editProfileButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    marginTop: 10,
  },
  editProfileText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 2,
  },
  handle: {
    fontSize: 15,
    color: "#aaa",
    marginBottom: 12,
  },
  bio: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 22,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 20,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statNumber: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  statLabel: {
    color: "#aaa",
    fontSize: 14,
  },
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: "#c084fc",
  },
  tabText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#aaa",
  },
  activeTabText: {
    color: "#fff",
  },
  communityCardWrapper: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  communityCard: {
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },
  communityHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  communityIconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(192, 132, 252, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  communityIconText: {
    color: "#c084fc",
    fontSize: 20,
    fontWeight: "bold",
  },
  communityInfo: {
    flex: 1,
  },
  communityName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  communityMembers: {
    color: "#aaa",
    fontSize: 13,
    marginTop: 2,
  },
  joinButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  joinButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  communityDescription: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    lineHeight: 20,
  },
  fullScreenModal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeModalButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 25,
  },
  fullScreenImage: {
    width: "100%",
    aspectRatio: 1,
    maxWidth: 400,
    maxHeight: 400,
  },
});
