// import { Stack } from "expo-router";

// export default function RootLayout() {
//   return <Stack />;
// }
// app/_layout.tsx
// app/_layout.tsx
// app/_layout.tsx
// app/_layout.tsx
// app/_layout.tsx
// app/_layout.tsx
import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Slot />
    </SafeAreaProvider>
  );
}






// import { Slot } from "expo-router";
// import { ClerkProvider } from "@clerk/clerk-expo";
// import { tokenCache } from "@clerk/clerk-expo/token-cache";
// import SafeScreen from "@/components/SafeScreen";

// export default function RootLayout() {
//   return (
//     <ClerkProvider tokenCache={tokenCache}>
//       <SafeScreen>
//         <Slot />
//       </SafeScreen>
//     </ClerkProvider>
//   );
// }
