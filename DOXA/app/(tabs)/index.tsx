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
import { ExpandableFAB } from "@/components/ExpandableFAB";

export default function FeedScreen() {
  const [activeTab, setActiveTab] = useState<"recommended" | "following">("recommended");

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#050510", "#050510", "#170326"]} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.logoContainer}>
          <View style={styles.logoGlass}>
            <BlurView intensity={20} tint="light" style={styles.logoBlur}>
              <Ionicons name="terminal" size={28} color="#a855f7" />
            </BlurView>
          </View>
        </View>

        <View style={styles.headerTabs}>
          <TouchableOpacity
            onPress={() => setActiveTab("recommended")}
            style={[styles.tabButton, activeTab === "recommended" && styles.activeTabBorder]}
          >
            <Text style={[styles.tabLabel, activeTab === "recommended" ? styles.activeText : styles.inactiveText]}>
              Recommended
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("following")}
            style={[styles.tabButton, activeTab === "following" && styles.activeTabBorder]}
          >
            <Text style={[styles.tabLabel, activeTab === "following" ? styles.activeText : styles.inactiveText]}>
              Following
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.feedWrapper}>
          <View style={{ flex: 1, display: activeTab === "recommended" ? "flex" : "none" }}>
            <RecommendedFeed />
          </View>
          <View style={{ flex: 1, display: activeTab === "following" ? "flex" : "none" }}>
            <FollowingFeed />
          </View>
        </View>
      </SafeAreaView>

      <ExpandableFAB />
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
    paddingBottom: 15,
  },
  logoGlass: {
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  logoBlur: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
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
});
