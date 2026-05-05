import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";

import { RecommendedFeed } from "@/components/RecommendedFeed";
import { FollowingFeed } from "@/components/FollowingFeed";

export default function FeedScreen() {
  const [activeTab, setActiveTab] = useState<"recommended" | "following">(
    "recommended",
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={["#050510", "#050510", "#170326"]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={{ flex: 1 }}>
        {/* APP LOGO SECTION */}
        <View style={styles.logoContainer}>
          <Ionicons name="terminal" size={32} color="#a855f7" />
          {/* Se tiver uma imagem: <Image source={require('@/assets/logo.png')} style={styles.logo} /> */}
        </View>

        {/* TOP TABS NAVIGATION */}
        <View style={styles.headerTabs}>
          <TouchableOpacity
            onPress={() => setActiveTab("recommended")}
            style={[
              styles.tabButton,
              activeTab === "recommended" && styles.activeTabBorder,
            ]}
          >
            <Text
              style={[
                styles.tabLabel,
                activeTab === "recommended"
                  ? styles.activeText
                  : styles.inactiveText,
              ]}
            >
              Recommended
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("following")}
            style={[
              styles.tabButton,
              activeTab === "following" && styles.activeTabBorder,
            ]}
          >
            <Text
              style={[
                styles.tabLabel,
                activeTab === "following"
                  ? styles.activeText
                  : styles.inactiveText,
              ]}
            >
              Following
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.feedWrapper}>
          <View
            style={{
              flex: 1,
              display: activeTab === "recommended" ? "flex" : "none",
            }}
          >
            <RecommendedFeed />
          </View>

          <View
            style={{
              flex: 1,
              display: activeTab === "following" ? "flex" : "none",
            }}
          >
            <FollowingFeed />
          </View>
        </View>
      </SafeAreaView>

      {/* FAB - Ajustado bottom para não bater na navbar */}
      <TouchableOpacity style={styles.fabContainer} activeOpacity={0.7}>
        <BlurView intensity={30} tint="light" style={styles.fabBlur}>
          <LinearGradient
            colors={["rgba(168, 85, 247, 0.4)", "rgba(126, 34, 206, 0.2)"]}
            style={styles.fabGradient}
          >
            <Ionicons name="add" size={32} color="white" />
          </LinearGradient>
        </BlurView>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050510",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    paddingBottom: 5,
  },
  headerTabs: {
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  tabButton: {
    marginHorizontal: 15,
    paddingBottom: 10,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  activeTabBorder: {
    borderBottomColor: "#a855f7",
  },
  tabLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
  activeText: {
    color: "white",
  },
  inactiveText: {
    color: "#6b7280",
  },
  feedWrapper: {
    flex: 1,
  },
  fabContainer: {
    position: "absolute",
    right: 25,
    bottom: 110, // Subi o botão para ficar acima da barra de navegação
    borderRadius: 30,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    zIndex: 99,
    shadowColor: "#a855f7",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  fabBlur: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  fabGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
