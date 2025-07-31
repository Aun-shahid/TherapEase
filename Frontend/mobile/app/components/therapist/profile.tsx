



import { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
  Pressable,
} from 'react-native';
import { useAuthContext } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { 
    profile, 
    profileLoading, 
    error, 
    fetchProfile, 
    logout 
  } = useAuthContext();

  const { theme, themeStyle, toggleTheme } = useTheme();

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e: any) {
      console.log('Logout error:', e?.message);
    }
  };

  if (profileLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: themeStyle.background }] }>
        <ActivityIndicator size="large" color={themeStyle.text} />
        <Text style={[styles.loadingText, { color: themeStyle.label }]}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.wrapper, { backgroundColor: themeStyle.background }] }>
      <View>
        <Pressable 
          style={styles.backButton} 
          onPress={() => router.push('./dashboard')}
        >
          <AntDesign name="arrowleft" size={24} color={themeStyle.text} />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
          style={{ alignSelf: 'flex-end', marginBottom: 12, padding: 8, backgroundColor: themeStyle.button, borderRadius: 8 }}
          onPress={toggleTheme}
        >
          <Text style={{ color: themeStyle.buttonText, fontWeight: '600' }}>
            Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
          </Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: themeStyle.title }]}>👤 Your Profile</Text>
        {profile ? (
          <>
            <View style={[styles.card, { backgroundColor: themeStyle.card }] }>
              <Text style={[styles.label, { color: themeStyle.label }]}>ID</Text>
              <Text style={[styles.value, { color: themeStyle.text }]}>{profile.id}</Text>
            </View>
            <View style={[styles.card, { backgroundColor: themeStyle.card }] }>
              <Text style={[styles.label, { color: themeStyle.label }]}>Name</Text>
              <Text style={[styles.value, { color: themeStyle.text }]}>{profile.first_name} {profile.last_name}</Text>
            </View>
            <View style={[styles.card, { backgroundColor: themeStyle.card }] }>
              <Text style={[styles.label, { color: themeStyle.label }]}>Email</Text>
              <Text style={[styles.value, { color: themeStyle.text }]}>{profile.email}</Text>
            </View>
            <View style={[styles.card, { backgroundColor: themeStyle.card }] }>
              <Text style={[styles.label, { color: themeStyle.label }]}>User Type</Text>
              <Text style={[styles.value, { color: themeStyle.text }]}>{profile.user_type}</Text>
            </View>
            <View style={[styles.card, { backgroundColor: themeStyle.card }] }>
              <Text style={[styles.label, { color: themeStyle.label }]}>Verified</Text>
              <Text style={[styles.value, { color: themeStyle.text }]}>{profile.is_verified ? 'Yes' : 'No'}</Text>
            </View>
          </>
        ) : (
          <Text style={[styles.errorText, { color: themeStyle.error }]}>⚠️ Failed to load profile.</Text>
        )}
        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: themeStyle.logoutButton }]} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={themeStyle.logoutText} />
          <Text style={[styles.logoutButtonText, { color: themeStyle.logoutText }]}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    // backgroundColor set dynamically
  },
  container: {
    padding: 24,
    alignItems: 'center',
    marginTop:50
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    // color set dynamically
  },
  illustration: {
    width: 220,
    height: 160,
    marginBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    // color set dynamically
    textAlign: 'center',
    marginBottom: 24,
  },
  card: {
    width: '100%',
    // backgroundColor set dynamically
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    // color set dynamically
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    // color set dynamically
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#524f85',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 30,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    // color set dynamically
    marginBottom: 16,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 10,
  }
});

