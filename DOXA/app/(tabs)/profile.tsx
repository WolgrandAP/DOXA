import React, { useState, useCallback, useEffect } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect, useRouter } from "expo-router";
import {
    View,
    Text,
    StyleSheet,
    Image,
    FlatList,
    TouchableOpacity,
    Modal,
} from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { PostCard } from "../../components/PostCard";
import { EditProfileModal } from "../../components/EditProfileModal";
import { useDatabase } from "../../database/useDatabase";
import { useAuth, User } from "../../contexts/AuthContext";

interface HeaderItem { id: string; type: 'header'; title: string; }
interface EmptyItem { id: string; type: 'empty'; text: string; }
interface CommunityItem { id: string | number; type: 'community'; name: string; description: string; members: number; }
interface PostItem { id: string; type: 'post'; title?: string; content?: string; [key: string]: any; }

type ProfileListData = HeaderItem | EmptyItem | CommunityItem | PostItem;

const INITIAL_USER = {
    name: "",
    handle: "",
    bio: "",
    followers: 0,
    following: 0,
    avatarUrl: "",
    bannerUrl: "",
    communities: [],
};

export default function ProfileScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"posts" | "communities" | "saved">("posts");
    const [user, setUser] = useState(INITIAL_USER);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isAvatarModalVisible, setIsAvatarModalVisible] = useState(false);
    const [dbData, setDbData] = useState<ProfileListData[]>([]);
    
    const db = useSQLiteContext();
    const { getUserPosts, getSavedPosts, getJoinedCommunities, getCreatedCommunities } = useDatabase();
    const { user: authUser, updateUser, signOut } = useAuth();

    useEffect(() => {
        if (!authUser) {
            router.replace('/(auth)/login');
        }
    }, [authUser]);

    useEffect(() => {
        if (authUser) {
            setUser({
                name: authUser.name || "",
                handle: authUser.handle || "",
                bio: authUser.bio || "",
                followers: authUser.followers || 0,
                following: authUser.following || 0,
                avatarUrl: authUser.avatarUrl || "https://ui-avatars.com/api/?name=User&background=random",
                bannerUrl: authUser.bannerUrl || "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=2000&auto=format&fit=crop",
                communities: [],
            });
        }
    }, [authUser]);

    useFocusEffect(
        useCallback(() => {
            if (!authUser?.id) return;
            let isActive = true;
            const currentUserId = authUser.id;

            async function loadTabData() {
                try {
                    let data: ProfileListData[] = [];

                    if (activeTab === "posts") {
                        const rawPosts = await getUserPosts(currentUserId);
                        data = (rawPosts || []).map((post: any) => ({ ...post, type: "post" }));
                    } else if (activeTab === "saved") {
                        const rawSaved = await getSavedPosts(currentUserId);
                        data = (rawSaved || []).map((post: any) => ({ ...post, type: "post" }));
                    } else if (activeTab === "communities") {
                        const [createdComms, joinedComms] = await Promise.all([
                            getCreatedCommunities(currentUserId),
                            getJoinedCommunities(currentUserId),
                        ]);

                        let combinedData: ProfileListData[] = [];

                        if (createdComms && createdComms.length > 0) {
                            combinedData.push({ id: "header_created", type: "header", title: "Minhas Comunidades" });
                            combinedData = combinedData.concat(
                                createdComms.map((c: any) => ({ ...c, type: "community" }))
                            );
                        }
                        if (joinedComms && joinedComms.length > 0) {
                            combinedData.push({ id: "header_joined", type: "header", title: "Participando" });
                            combinedData = combinedData.concat(
                                joinedComms.map((c: any) => ({ ...c, type: "community" }))
                            );
                        }

                        data = combinedData;

                        if (data.length === 0) {
                            data.push({ id: "empty_comms", type: "empty", text: "Nenhuma comunidade encontrada." });
                        }
                    }

                    if (isActive) {
                        setDbData(data);
                    }
                } catch (error) {
                    console.error("Erro ao carregar dados da aba:", error);
                }
            }

            loadTabData();

            return () => {
                isActive = false;
            };
        }, [activeTab, authUser?.id])
    );

    const handleSaveProfile = async (updatedUser: typeof INITIAL_USER) => {
        if (!authUser) return;
        try {
            await db.runAsync(
                "UPDATE users SET name = ?, handle = ?, bio = ?, avatarUrl = ?, bannerUrl = ? WHERE id = ?",
                [updatedUser.name, updatedUser.handle, updatedUser.bio, updatedUser.avatarUrl, updatedUser.bannerUrl, authUser.id]
            );
            
            setUser(updatedUser);
            if (updateUser) {
                updateUser(updatedUser as Partial<User>);
            }
            setIsEditModalVisible(false);
        } catch (error) {
            console.error("Erro ao salvar perfil:", error);
        }
    };

    const renderHeader = () => {
        const profileData = authUser ? {
            name: authUser.name || user.name,
            handle: authUser.handle || user.handle,
            bio: authUser.bio || user.bio,
            following: authUser.following ?? user.following,
            followers: authUser.followers ?? user.followers,
            avatarUrl: authUser.avatarUrl || user.avatarUrl,
            bannerUrl: authUser.bannerUrl || user.bannerUrl,
        } : user;

        return (
            <View style={styles.headerContainer}>
                <View style={styles.bannerContainer}>
                    {profileData.bannerUrl ? (
                        <Image source={{ uri: profileData.bannerUrl }} style={styles.bannerImage} />
                    ) : null}
                    <View style={styles.bannerOverlay} />
                </View>

                <View style={styles.profileInfoContainer}>
                    <View style={styles.avatarRow}>
                        <TouchableOpacity
                            style={styles.avatarContainer}
                            activeOpacity={0.8}
                            onPress={() => setIsAvatarModalVisible(true)}
                        >
                            {profileData.avatarUrl ? (
                                <Image source={{ uri: profileData.avatarUrl }} style={styles.avatarImage} />
                            ) : null}
                        </TouchableOpacity>
                        
                        <View style={styles.actionButtonsContainer}>
                            <TouchableOpacity style={styles.editProfileButton} onPress={() => setIsEditModalVisible(true)}>
                                <Text style={styles.editProfileText}>Editar Perfil</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
                                <Ionicons name="log-out-outline" size={18} color="#ef4444" style={{ marginRight: 4 }} />
                                <Text style={styles.logoutText}>Sair</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Text style={styles.name}>{profileData.name || "Usuário"}</Text>
                    <Text style={styles.handle}>@{String(profileData.handle || "").replace("@", "")}</Text>
                    {profileData.bio ? <Text style={styles.bio}>{profileData.bio}</Text> : null}

                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{profileData.following}</Text>
                            <Text style={styles.statLabel}>Seguindo</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{profileData.followers}</Text>
                            <Text style={styles.statLabel}>Seguidores</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.tabsContainer}>
                    {(["posts", "communities", "saved"] as const).map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.tab, activeTab === tab && styles.activeTab]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                                {tab === "posts" ? "Posts" : tab === "communities" ? "Comunidades" : "Salvos"}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        );
    };

    const renderCommunityItem = ({ item }: { item: CommunityItem }) => (
        <View style={styles.communityCardWrapper}>
            <BlurView intensity={15} tint="dark" style={styles.communityCard}>
                <View style={styles.communityHeader}>
                    <View style={styles.communityIconPlaceholder}>
                        <Text style={styles.communityIconText}>
                            {item.name ? String(item.name).charAt(0).toUpperCase() : "C"}
                        </Text>
                    </View>
                    <View style={styles.communityInfo}>
                        <Text style={styles.communityName}>{item.name || "Comunidade"}</Text>
                        <Text style={styles.communityMembers}>{item.members ?? 0} membros</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.joinButton}
                        onPress={() => router.push(`/community/${item.id}`)}
                    >
                        <Text style={styles.joinButtonText}>Ver</Text>
                    </TouchableOpacity>
                </View>
                {item.description ? <Text style={styles.communityDescription}>{item.description}</Text> : null}
            </BlurView>
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient 
                colors={["#050510", "#050510", "#170326"]} 
                style={StyleSheet.absoluteFill} 
                pointerEvents="none" 
            />

            <FlatList
                data={dbData}
                keyExtractor={(item, index) => `${item.type}_${item.id || index}`}
                renderItem={({ item }) => {
                    if (item.type === 'header') return <Text style={styles.sectionHeader}>{item.title}</Text>;
                    if (item.type === 'empty') return <Text style={styles.emptyText}>{item.text}</Text>;
                    if (item.type === 'community') return renderCommunityItem({ item: item as CommunityItem });
                    
                    return <PostCard item={item} initialSaved={activeTab === "saved"} />;
                }}
                ListHeaderComponent={renderHeader()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                style={styles.flatList}
            />

            <EditProfileModal
                visible={isEditModalVisible}
                onClose={() => setIsEditModalVisible(false)}
                user={user}
                onSave={handleSaveProfile}
            />

            <Modal
                visible={isAvatarModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsAvatarModalVisible(false)}
            >
                <View style={styles.fullScreenModal}>
                    <TouchableOpacity style={styles.closeModalButton} onPress={() => setIsAvatarModalVisible(false)}>
                        <Ionicons name="close" size={32} color="white" />
                    </TouchableOpacity>
                    {user.avatarUrl ? (
                        <Image source={{ uri: user.avatarUrl }} style={styles.fullScreenImage} resizeMode="contain" />
                    ) : null}
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
        paddingBottom: 40,
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
        marginTop: -40,
    },
    avatarImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    actionButtonsContainer: {
        flexDirection: "row",
        gap: 8,
        marginTop: 10,
    },
    editProfileButton: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.3)",
    },
    editProfileText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "rgba(239, 68, 68, 0.4)",
        backgroundColor: "rgba(239, 68, 68, 0.05)",
    },
    logoutText: {
        color: "#ef4444",
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
    sectionHeader: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 12,
    },
    emptyText: {
        color: "#aaa",
        fontSize: 15,
        textAlign: "center",
        marginTop: 30,
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