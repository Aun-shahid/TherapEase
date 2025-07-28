import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

export default function TherapistIntro3() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('../auth/login');
  };

  return (
    <View style={styles.container}>
      {/* Top Image */}
      <Image
        source={require('../../../assets/images/onboardingth3.png')}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Bottom Section */}
      <View style={styles.bottomContainer}>
        {/* Text */}
        <Text style={styles.description}>
          Get ready to transform your therapy practice with{' '}
          <Text style={styles.aqua}>smart technology</Text> and{' '}
          <Text style={styles.aqua}>efficient workflows</Text>.
        </Text>

        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.activeDot]} />
        </View>

        {/* Get Started button */}
        <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
          <Text style={styles.getStartedText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" style={styles.arrow} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: height * 0.6,
    transform: [{ scale: 1.3 }, { translateY: -30 }, { translateX: 37 }],
  },
  bottomContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    justifyContent: 'flex-start',
  },
  description: {
    fontSize: 22,
    color: '#49467e',
    textAlign: 'center',
    paddingHorizontal: 10,
    lineHeight: 30,
    fontWeight: '500',
    marginBottom: 24,
  },
  aqua: {
    color: '#53CDD4',
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 30,
  },
  dot: {
    width: 40,
    height: 6,
    borderRadius: 5,
    backgroundColor: '#e0e0e0',
  },
  activeDot: {
    backgroundColor: '#49467e',
  },
  getStartedButton: {
    backgroundColor: '#49467e',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  getStartedText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  arrow: {
    marginLeft: 4,
  },
});
