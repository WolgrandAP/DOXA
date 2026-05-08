import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export function ExpandableFAB() {
  const [expanded, setExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  const toggleMenu = () => {
    const toValue = expanded ? 0 : 1;
    Animated.spring(animation, {
      toValue,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    }).start();
    setExpanded(!expanded);
  };

  const getSubButtonStyles = (index: number) => {
    const translateY = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -80 * index],
    });

    const scale = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    return {
      opacity: animation,
      transform: [{ translateY }, { scale }],
    };
  };

  const rotation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  const backdropOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* BACKGROUND BLUR OVERLAY */}
      {expanded && (
        <TouchableWithoutFeedback onPress={toggleMenu}>
          <Animated.View
            style={[styles.backdrop, { opacity: backdropOpacity }]}
          >
            <BlurView
              intensity={25}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </TouchableWithoutFeedback>
      )}

      <View style={styles.container}>
        {/* Community Option */}
        <Animated.View
          style={[styles.subButtonContainer, getSubButtonStyles(2)]}
        >
          <View style={styles.labelWrapper}>
            <Text style={styles.label}>Community</Text>
          </View>
          <TouchableOpacity
            style={styles.subButton}
            activeOpacity={0.8}
            onPress={() => {
              toggleMenu();
              router.push("/create-community" as any);
            }}
          >
            <BlurView intensity={70} tint="dark" style={styles.blur}>
              <LinearGradient
                colors={[
                  "rgba(192, 132, 252, 0.15)",
                  "rgba(126, 34, 206, 0.05)",
                ]}
                style={styles.innerGradient}
              >
                <Ionicons name="people" size={24} color="#e9d5ff" />
              </LinearGradient>
            </BlurView>
          </TouchableOpacity>
        </Animated.View>

        {/* Post Option */}
        <Animated.View
          style={[styles.subButtonContainer, getSubButtonStyles(1)]}
        >
          <View style={styles.labelWrapper}>
            <Text style={styles.label}>Post</Text>
          </View>
          <TouchableOpacity
            style={styles.subButton}
            activeOpacity={0.8}
            onPress={() => {
              toggleMenu();
              router.push("/create-post" as any);
            }}
          >
            <BlurView intensity={70} tint="dark" style={styles.blur}>
              <LinearGradient
                colors={[
                  "rgba(192, 132, 252, 0.15)",
                  "rgba(126, 34, 206, 0.05)",
                ]}
                style={styles.innerGradient}
              >
                <Ionicons name="document-text" size={24} color="#e9d5ff" />
              </LinearGradient>
            </BlurView>
          </TouchableOpacity>
        </Animated.View>

        {/* Main Button (+) - Vidro Ultra Transparente */}
        <TouchableOpacity
          onPress={toggleMenu}
          activeOpacity={0.9}
          style={styles.mainButtonWrapper}
        >
          <BlurView intensity={35} tint="light" style={styles.mainButtonBlur}>
            <LinearGradient
              // Opacidade reduzida para um efeito mais cristalino
              colors={["rgba(168, 85, 247, 0.3)", "rgba(126, 34, 206, 0.1)"]}
              style={styles.gradient}
            >
              <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                <Ionicons name="add" size={35} color="white" />
              </Animated.View>
            </LinearGradient>
          </BlurView>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 20,
    bottom: 110,
    alignItems: "center",
    width: 65,
    zIndex: 9999,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 9998,
  },
  subButtonContainer: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    right: 0,
    width: 300,
  },
  labelWrapper: {
    backgroundColor: "rgba(15, 10, 30, 0.8)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 15,
    borderWidth: 1,
    borderColor: "rgba(168, 85, 247, 0.25)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  label: {
    color: "#f3e8ff",
    fontSize: 15,
    fontWeight: "700",
  },
  subButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.15)",
    marginRight: 4.5,
  },
  innerGradient: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  mainButtonWrapper: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    overflow: "hidden",
    borderWidth: 1.5,
    // Borda levemente mais visível para compensar a transparência do centro
    borderColor: "rgba(255, 255, 255, 0.09)",
    shadowColor: "#a855f7",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 10,
  },
  mainButtonBlur: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  blur: {
    flex: 1,
  },
});
