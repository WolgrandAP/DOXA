import React, { useState } from "react";
import { Stack } from "expo-router";
import { SQLiteProvider } from 'expo-sqlite';
import { initializeDatabase } from '../database/initialize';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SplashScreen } from "../components/SplashScreen";

export default function RootLayout() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SQLiteProvider databaseName="doxa_v3.db" onInit={initializeDatabase}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#050510" },
          }}
        >
          <Stack.Screen name="(auth)" options={{ headerShown: false }}/>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="create-post"
            options={{
              presentation: "modal",
              animation: "slide_from_bottom",
            }}
          />
          <Stack.Screen
            name="create-community"
            options={{
              presentation: "modal",
              animation: "slide_from_bottom",
            }}
          />
          <Stack.Screen
            name="post/[id]"
            options={{
              animation: "slide_from_right",
            }}
          />
        </Stack>

        {!splashDone && (
          <SplashScreen onFinish={() => setSplashDone(true)} />
        )}
      </SQLiteProvider>
    </GestureHandlerRootView>
  );
}
