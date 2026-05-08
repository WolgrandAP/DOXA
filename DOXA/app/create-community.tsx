// app/create-community.tsx
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
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const AVAILABLE_TOPICS = [
  "Filosofia",
  "Teologia",
  "Política",
  "Ciência",
  "Tecnologia",
  "História",
  "Psicologia",
  "Sociologia",
  "Economia",
  "Direito",
  "Educação",
  "Arte",
  "Literatura",
  "Música",
  "Saúde",
  "Matemática",
  "Física",
  "Biologia",
  "Astronomia",
  "Engenharia",
  "Programação",
  "Inteligência Artificial",
  "Ética",
  "Meio Ambiente",
  "Esportes",
  "Cultura",
  "Religião",
  "Debates",
  "Notícias",
  "Memes",
];

const MAX_TOPICS = 3;

export default function CreateCommunityScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const isFormValid =
    name.trim().length > 0 &&
    description.trim().length > 0 &&
    selectedTopics.length >= 1 &&
    selectedTopics.length <= MAX_TOPICS;

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) => {
      if (prev.includes(topic)) {
        return prev.filter((t) => t !== topic);
      }
      if (prev.length >= MAX_TOPICS) return prev;
      return [...prev, topic];
    });
  };

  const handleCreate = () => {
    if (!isFormValid) return;
    // TODO: lógica real de criação
    Alert.alert("Comunidade criada!", `"${name}" foi criada com sucesso.`, [
      { text: "OK", onPress: () => router.back() },
    ]);
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

            <Text style={styles.headerTitle}>Nova Comunidade</Text>

            <TouchableOpacity
              onPress={handleCreate}
              activeOpacity={isFormValid ? 0.8 : 1}
              disabled={!isFormValid}
              style={[
                styles.createButtonWrapper,
                !isFormValid && styles.createButtonDisabled,
              ]}
            >
              <LinearGradient
                colors={
                  isFormValid
                    ? ["#a855f7", "#7e22ce"]
                    : ["rgba(168,85,247,0.3)", "rgba(126,34,206,0.15)"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.createButton}
              >
                <Text
                  style={[
                    styles.createText,
                    !isFormValid && styles.createTextDisabled,
                  ]}
                >
                  Criar
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* ─── FORM CONTENT ─── */}
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* ─── Glass Card: Nome & Descrição ─── */}
            <View style={styles.cardOuter}>
              <BlurView intensity={15} tint="dark" style={styles.glassCard}>
                {/* Nome */}
                <TextInput
                  style={styles.nameInput}
                  placeholder="Nome da comunidade"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  value={name}
                  onChangeText={setName}
                  maxLength={60}
                />
                {!name.trim() && (
                  <Text style={styles.requiredHint}>Nome Obrigatório</Text>
                )}

                {/* Divider */}
                <View style={styles.divider} />

                {/* Descrição */}
                <TextInput
                  style={styles.descriptionInput}
                  placeholder="Descreva o propósito da comunidade..."
                  placeholderTextColor="rgba(255,255,255,0.25)"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  textAlignVertical="top"
                  scrollEnabled={false}
                  maxLength={500}
                />
                {!description.trim() && (
                  <Text style={styles.requiredHint}>Descrição Obrigatória</Text>
                )}
              </BlurView>
            </View>

            {/* ─── Tópicos ─── */}
            <View style={styles.topicsSection}>
              <View style={styles.topicsTitleRow}>
                <Ionicons name="pricetags-outline" size={18} color="#c084fc" />
                <Text style={styles.topicsSectionTitle}>Tópicos</Text>
                <View style={[
                  styles.topicCountBadge,
                  selectedTopics.length >= MAX_TOPICS && styles.topicCountBadgeFull,
                ]}>
                  <Text style={styles.topicCountText}>
                    {selectedTopics.length}/{MAX_TOPICS}
                  </Text>
                </View>
              </View>
              <Text style={styles.topicsSubtitle}>
                {selectedTopics.length === 0
                  ? "Selecione pelo menos 1 tópico (máximo 3)"
                  : selectedTopics.length >= MAX_TOPICS
                    ? "Limite de tópicos atingido"
                    : `Selecione até mais ${MAX_TOPICS - selectedTopics.length} tópico${MAX_TOPICS - selectedTopics.length > 1 ? "s" : ""}`}
              </Text>

              <View style={styles.topicsCardOuter}>
                <BlurView intensity={15} tint="dark" style={styles.topicsCard}>
                  <View style={styles.topicsGrid}>
                    {AVAILABLE_TOPICS.map((topic) => {
                      const isSelected = selectedTopics.includes(topic);
                      return (
                        <TouchableOpacity
                          key={topic}
                          onPress={() => toggleTopic(topic)}
                          activeOpacity={0.7}
                          style={[
                            styles.topicChip,
                            isSelected && styles.topicChipSelected,
                          ]}
                        >
                          {isSelected ? (
                            <LinearGradient
                              colors={[
                                "rgba(168, 85, 247, 0.35)",
                                "rgba(126, 34, 206, 0.2)",
                              ]}
                              style={styles.topicChipGradient}
                            >
                              <Ionicons
                                name="checkmark"
                                size={14}
                                color="#e9d5ff"
                                style={{ marginRight: 4 }}
                              />
                              <Text style={styles.topicTextSelected}>
                                {topic}
                              </Text>
                            </LinearGradient>
                          ) : (
                            <View style={styles.topicChipInner}>
                              <Text style={styles.topicText}>{topic}</Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </BlurView>
              </View>
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
  createButtonWrapper: {
    borderRadius: 12,
    overflow: "hidden",
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
  createButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  createText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  createTextDisabled: {
    color: "rgba(255,255,255,0.5)",
  },

  // ── Scroll ──
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
  },

  // ── Inputs ──
  nameInput: {
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
    minHeight: 100,
    paddingVertical: 4,
  },
  requiredHint: {
    color: "#f87171",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 6,
  },

  // ── Topics Section ──
  topicsSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  topicsTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  topicsSectionTitle: {
    color: "#f3e8ff",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
  topicCountBadge: {
    marginLeft: 10,
    backgroundColor: "#7e22ce",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  topicCountBadgeFull: {
    backgroundColor: "#dc2626",
  },
  topicCountText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  topicsSubtitle: {
    color: "rgba(255, 255, 255, 0.4)",
    fontSize: 13,
    marginBottom: 14,
  },
  topicsCardOuter: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  topicsCard: {
    padding: 14,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },
  topicsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  // ── Topic Chip ──
  topicChip: {
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  topicChipSelected: {
    borderColor: "rgba(168, 85, 247, 0.4)",
  },
  topicChipGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  topicChipInner: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  topicText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 13,
    fontWeight: "600",
  },
  topicTextSelected: {
    color: "#e9d5ff",
    fontSize: 13,
    fontWeight: "700",
  },
});
