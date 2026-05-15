import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const logoScale = useRef(new Animated.Value(1)).current;
  const logoOpacity = useRef(new Animated.Value(1)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animação estilo Twitter (X)
    Animated.sequence([
      // Segura por um momento
      Animated.delay(600),

      // Encolhe um pouquinho para dar impulso
      Animated.timing(logoScale, {
        toValue: 0.85,
        duration: 200,
        useNativeDriver: true,
      }),

      // Expande massivamente e some
      Animated.parallel([
        Animated.timing(logoScale, {
          toValue: 50,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 0,
          duration: 300,
          delay: 150,
          useNativeDriver: true,
        }),
        Animated.timing(containerOpacity, {
          toValue: 0,
          duration: 400,
          delay: 100,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      onFinish();
    });
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: containerOpacity }]} pointerEvents="none">
      <Animated.View
        style={[
          styles.logoWrapper,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <Text style={styles.logoLetter}>D</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    backgroundColor: "#050510", // Cor de fundo do app
  },
  logoWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  logoLetter: {
    fontSize: 90,
    fontWeight: "900",
    color: "#ffffff",
  },
});

