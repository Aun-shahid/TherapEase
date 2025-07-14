// import { Text, View } from "react-native";

// export default function Index() {
//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <Text>Edit app/index.tsx to edit this screen.</Text>
//     </View>
//   );
// }

// app/index.tsx
// app/index.tsx
// import { useEffect } from 'react';
// import { router } from 'expo-router';
// import { View, Text } from 'react-native';

// export default function Home() {
//   useEffect(() => {
//     // Automatically navigate to the Register screen
//     router.replace('/auth/register');
//   }, []);

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Redirecting to registration...</Text>
//     </View>
//   );
// }

// app/index.tsx
// app/index.tsx
import { useEffect } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("access_token");
      if (token) {
        // You can enhance this by checking if token is expired
        router.replace("/patient/dashboard");
      } else {
        router.replace("/auth/login");
      }
    };

    checkAuth();
  }, []);

  return null;
}
