// app/create-post.tsx
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
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
    Alert,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useSQLiteContext } from "expo-sqlite";
import { useDatabase } from "@/database/useDatabase";

export default function CreatePostScreen() {
    const router = useRouter();
    const { createPost } = useDatabase();
    const db = useSQLiteContext();
    const { user } = useAuth();

    const [subject, setSubject] = useState("");
    const [communities, setCommunities] = useState<any[]>([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [media, setMedia] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        async function loadCommunities() {
            try {
                if (!user?.id) return;

                const comms = await db.getAllAsync<any>(
                    'SELECT * FROM communities WHERE is_joined = 1 OR creator_id = ?',
                    [user.id]
                );
                setCommunities(comms);
                if (comms.length > 0) {
                    setSubject(comms[0].name);
                }
            } catch (error) {
                console.error("Erro ao carregar comunidades:", error);
            }
        }
        if (user) {
            loadCommunities();
        }
    }, [db, user]);

    const handlePublish = async () => {
        if (!title.trim()) {
            Alert.alert("Título obrigatório", "Adicione um título ao seu post.");
            return;
        }
        if (!description.trim()) {
            Alert.alert("Descrição obrigatória", "Escreva o conteúdo do seu post.");
            return;
        }

        if (!user) {
            Alert.alert("Erro", "Você deve estar logado para criar um post.");
            return;
        }

        const success = await createPost(
            {
                id: `post_${Date.now()}`,
                title,
                description,
                subject: subject.trim() ? subject : undefined,
                image_url: media,
            },
            user.id
        );

        if (success) {
            Alert.alert("Post publicado!", "Seu post enviado com sucesso.", [
                { text: "OK", onPress: () => router.back() },
            ]);
        } else {
            Alert.alert("Erro", "Falha ao salvar post.");
        }
    };

    const pickMedia = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
            Alert.alert(
                "Permissão necessária",
                "Precisamos de acesso à galeria para anexar mídia."
            );
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images", "videos"],
            allowsEditing: true,
            quality: 0.8,
        });

        if (!result.canceled && result.assets.length > 0) {
            setMedia(result.assets[0].uri);
            setMediaType(result.assets[0].type === "video" ? "video" : "image");
        }
    };

    const removeMedia = () => {
        setMedia(null);
        setMediaType(null);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Background Gradient */}
            <LinearGradient
                colors={["#050510", "#050510", "#170326"]}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    style={{ flex: 1 }}
                >
                    {/* ─── HEADER ─── */}
                    <View style={styles.header}>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={styles.backButton}
                        >
                            <BlurView intensity={20} tint="dark" style={styles.backBlur}>
                                <Ionicons name="close" size={24} color="#e9d5ff" />
                            </BlurView>
                        </TouchableOpacity>

                        <Text style={styles.headerTitle}>Novo Post</Text>

                        <TouchableOpacity
                            onPress={handlePublish}
                            activeOpacity={0.8}
                            style={styles.publishButtonWrapper}
                        >
                            <LinearGradient
                                colors={["#a855f7", "#7e22ce"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.publishButton}
                            >
                                <Text style={styles.publishText}>Publicar</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {/* ─── FORM CONTENT ─── */}
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Glass Card Container */}
                        <View style={styles.cardOuter}>
                            <BlurView intensity={15} tint="dark" style={styles.glassCard}>
                                {/* Seleção de Comunidade */}
                                {communities.length > 0 ? (
                                    <View style={{ marginBottom: 16 }}>
                                        <Text
                                            style={{
                                                color: "rgba(255,255,255,0.6)",
                                                fontSize: 13,
                                                fontWeight: "600",
                                                marginBottom: 8,
                                                marginLeft: 2,
                                            }}
                                        >
                                            Postar em:
                                        </Text>
                                        <TextInput
                                            style={{
                                                backgroundColor: "rgba(255,255,255,0.05)",
                                                borderRadius: 10,
                                                paddingHorizontal: 12,
                                                paddingVertical: 8,
                                                color: "#fff",
                                                marginBottom: 12,
                                                borderWidth: 1,
                                                borderColor: "rgba(255,255,255,0.1)",
                                            }}
                                            placeholder="Pesquisar comunidade..."
                                            placeholderTextColor="rgba(255,255,255,0.3)"
                                            value={searchQuery}
                                            onChangeText={setSearchQuery}
                                        />
                                        <ScrollView
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            contentContainerStyle={{ gap: 8 }}
                                        >
                                            {communities
                                                .filter(
                                                    (c) =>
                                                        c.name
                                                            .toLowerCase()
                                                            .includes(searchQuery.toLowerCase()) ||
                                                        c.id
                                                            .toLowerCase()
                                                            .includes(searchQuery.toLowerCase())
                                                )
                                                .map((comm) => (
                                                    <TouchableOpacity
                                                        key={comm.id}
                                                        activeOpacity={0.7}
                                                        onPress={() => setSubject(comm.name)}
                                                        style={{
                                                            paddingHorizontal: 12,
                                                            paddingVertical: 6,
                                                            borderRadius: 12,
                                                            borderWidth: 1,
                                                            borderColor:
                                                                subject === comm.name
                                                                    ? "rgba(168,85,247,0.8)"
                                                                    : "rgba(255,255,255,0.1)",
                                                            backgroundColor:
                                                                subject === comm.name
                                                                    ? "rgba(168,85,247,0.2)"
                                                                    : "transparent",
                                                        }}
                                                    >
                                                        <Text
                                                            style={{
                                                                color:
                                                                    subject === comm.name
                                                                        ? "#f3e8ff"
                                                                        : "rgba(255,255,255,0.6)",
                                                                fontSize: 13,
                                                                fontWeight:
                                                                    subject === comm.name ? "700" : "500",
                                                            }}
                                                        >
                                                            {comm.name}
                                                        </Text>
                                                    </TouchableOpacity>
                                                ))}
                                        </ScrollView>
                                    </View>
                                ) : (
                                    <TextInput
                                        style={[
                                            styles.titleInput,
                                            {
                                                fontSize: 16,
                                                color: "#c084fc",
                                                fontWeight: "600",
                                                marginBottom: 8,
                                            },
                                        ]}
                                        placeholder="d://comunidade (Opcional)"
                                        placeholderTextColor="rgba(192, 132, 252, 0.4)"
                                        value={subject}
                                        onChangeText={setSubject}
                                        maxLength={40}
                                        multiline={false}
                                        autoCapitalize="none"
                                    />
                                )}

                                <View style={styles.divider} />

                                {/* Título */}
                                <TextInput
                                    style={styles.titleInput}
                                    placeholder="Título do post"
                                    placeholderTextColor="rgba(255,255,255,0.3)"
                                    value={title}
                                    onChangeText={setTitle}
                                    maxLength={120}
                                    multiline={false}
                                />

                                {/* Divider */}
                                <View style={styles.divider} />

                                {/* Descrição */}
                                <TextInput
                                    style={styles.descriptionInput}
                                    placeholder="Escreva o conteúdo do seu post..."
                                    placeholderTextColor="rgba(255,255,255,0.25)"
                                    value={description}
                                    onChangeText={setDescription}
                                    multiline
                                    textAlignVertical="top"
                                    scrollEnabled={false}
                                />

                                {/* Media Preview */}
                                {media && (
                                    <View style={styles.mediaPreviewContainer}>
                                        <Image
                                            source={{ uri: media }}
                                            style={styles.mediaPreview}
                                            resizeMode="cover"
                                        />
                                        <View style={styles.mediaOverlay} />

                                        {/* Badge de tipo */}
                                        {mediaType === "video" && (
                                            <View style={styles.videoBadge}>
                                                <Ionicons
                                                    name="videocam"
                                                    size={14}
                                                    color="#e9d5ff"
                                                />
                                                <Text style={styles.videoBadgeText}>Vídeo</Text>
                                            </View>
                                        )}

                                        {/* Botão remover */}
                                        <TouchableOpacity
                                            onPress={removeMedia}
                                            style={styles.removeMediaBtn}
                                        >
                                            <BlurView
                                                intensity={50}
                                                tint="dark"
                                                style={styles.removeMediaBlur}
                                            >
                                                <Ionicons name="close" size={18} color="#fff" />
                                            </BlurView>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </BlurView>
                        </View>

                        {/* ─── TOOLBAR (Mídia) ─── */}
                        <View style={styles.toolbarOuter}>
                            <BlurView intensity={15} tint="dark" style={styles.toolbar}>
                                <TouchableOpacity
                                    onPress={pickMedia}
                                    style={styles.toolbarButton}
                                    activeOpacity={0.7}
                                >
                                    <LinearGradient
                                        colors={[
                                            "rgba(192, 132, 252, 0.15)",
                                            "rgba(126, 34, 206, 0.05)",
                                        ]}
                                        style={styles.toolbarIconGradient}
                                    >
                                        <Ionicons
                                            name="image-outline"
                                            size={22}
                                            color="#c084fc"
                                        />
                                    </LinearGradient>
                                    <Text style={styles.toolbarLabel}>Foto / Vídeo</Text>
                                </TouchableOpacity>
                            </BlurView>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#050510",
    },

    // ── Header ──
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 15,
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
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "700",
    },
    publishButtonWrapper: {
        borderRadius: 12,
        overflow: "hidden",
    },
    publishButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    publishText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "700",
    },

    // ── Scroll Content ──
    scrollContent: {
        paddingBottom: 120,
    },

    // ── Glass Card ──
    cardOuter: {
        marginHorizontal: 16,
        marginTop: 5,
        borderRadius: 20,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.12)",
    },
    glassCard: {
        padding: 18,
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        minHeight: 280,
    },

    // ── Inputs ──
    titleInput: {
        color: "#ffffff",
        fontSize: 22,
        fontWeight: "bold",
        lineHeight: 28,
        paddingVertical: 8,
    },
    divider: {
        height: 1,
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        marginVertical: 12,
    },
    descriptionInput: {
        color: "rgba(255, 255, 255, 0.85)",
        fontSize: 16,
        lineHeight: 24,
        minHeight: 160,
        paddingVertical: 4,
    },

    // ── Media Preview ──
    mediaPreviewContainer: {
        width: "100%",
        height: 200,
        borderRadius: 14,
        marginTop: 16,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
    },
    mediaPreview: {
        width: "100%",
        height: "100%",
        backgroundColor: "#1a1a2e",
    },
    mediaOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.1)",
    },
    videoBadge: {
        position: "absolute",
        top: 10,
        left: 10,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(15, 10, 30, 0.8)",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "rgba(168, 85, 247, 0.25)",
    },
    videoBadgeText: {
        color: "#e9d5ff",
        fontSize: 12,
        fontWeight: "600",
        marginLeft: 4,
    },
    removeMediaBtn: {
        position: "absolute",
        top: 10,
        right: 10,
        width: 32,
        height: 32,
        borderRadius: 16,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.2)",
    },
    removeMediaBlur: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    // ── Toolbar ──
    toolbarOuter: {
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 16,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.12)",
    },
    toolbar: {
        flexDirection: "row",
        padding: 14,
        backgroundColor: "rgba(255, 255, 255, 0.03)",
    },
    toolbarButton: {
        flexDirection: "row",
        alignItems: "center",
    },
    toolbarIconGradient: {
        width: 42,
        height: 42,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(168, 85, 247, 0.2)",
    },
    toolbarLabel: {
        color: "#f3e8ff",
        fontSize: 14,
        fontWeight: "600",
        marginLeft: 12,
    },
});