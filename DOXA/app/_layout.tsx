import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#050510" },
      }}
    >
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
  );
}
