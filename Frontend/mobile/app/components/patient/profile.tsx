import { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useAuthContext } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

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
        <Text style={[styles.loadingText, { color: themeStyle.label }]}>Fetching your profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.wrapper, { backgroundColor: themeStyle.background }] }>
      <TouchableOpacity
        style={{ alignSelf: 'flex-end', margin: 16, padding: 8, backgroundColor: themeStyle.button, borderRadius: 8 }}
        onPress={toggleTheme}
      >
        <Text style={{ color: themeStyle.buttonText, fontWeight: '600' }}>
          Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
        </Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: themeStyle.title }]}>👤 Your Profile</Text>
        {profile ? (
          <>
            <View style={[styles.infoBox, { borderBottomColor: themeStyle.border }] }>
              <Text style={[styles.label, { color: themeStyle.label }]}>ID:</Text>
              <Text style={[styles.value, { color: themeStyle.text }]}>{profile.id}</Text>
            </View>
            <View style={[styles.infoBox, { borderBottomColor: themeStyle.border }] }>
              <Text style={[styles.label, { color: themeStyle.label }]}>Name:</Text>
              <Text style={[styles.value, { color: themeStyle.text }]}>{profile.first_name} {profile.last_name}</Text>
            </View>
            <View style={[styles.infoBox, { borderBottomColor: themeStyle.border }] }>
              <Text style={[styles.label, { color: themeStyle.label }]}>Email:</Text>
              <Text style={[styles.value, { color: themeStyle.text }]}>{profile.email}</Text>
            </View>
            <View style={[styles.infoBox, { borderBottomColor: themeStyle.border }] }>
              <Text style={[styles.label, { color: themeStyle.label }]}>User Type:</Text>
              <Text style={[styles.value, { color: themeStyle.text }]}>{profile.user_type}</Text>
            </View>
            <View style={[styles.infoBox, { borderBottomColor: themeStyle.border }] }>
              <Text style={[styles.label, { color: themeStyle.label }]}>Verified:</Text>
              <Text style={[styles.value, { color: themeStyle.text }]}>{profile.is_verified ? 'Yes' : 'No'}</Text>
            </View>
            <TouchableOpacity style={[styles.logoutButton, { backgroundColor: themeStyle.logoutButton }]} onPress={handleLogout}>
              <Text style={[styles.logoutText, { color: themeStyle.logoutText }]}>Logout</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={[styles.errorText, { color: themeStyle.error }]}>⚠️ Failed to load profile. Please try again.</Text>
        )}
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
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    // color set dynamically
    textAlign: 'center',
    marginBottom: 20,
  },
  infoBox: {
    marginBottom: 16,
    // borderBottomColor set dynamically
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    // color set dynamically
  },
  value: {
    fontSize: 16,
    // color set dynamically
  },
  logoutButton: {
    // backgroundColor set dynamically
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
    elevation: 2,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    // color set dynamically
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    // color set dynamically
  },
});
