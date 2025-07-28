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

export default function TherapistIntro1() {
  const router = useRouter();

  const handleNext = () => {
    router.push('./therapistintro2');
  };

  return (
    <View style={styles.container}>
      {/* Top Image */}
      <Image
        source={require('../../../assets/images/onboardingth1.png')}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Bottom Section */}
      <View style={styles.bottomContainer}>
        {/* Text */}
        <Text style={styles.description}>
          <Text style={styles.aqua}>AI-powered tools</Text> to simplify your{' '}
          <Text style={styles.aqua}>therapy practice</Text> and support you every step of the way.
        </Text>

        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        {/* Next button */}
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Ionicons name="arrow-forward" size={24} color="#fff" />
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
    transform: [{ scale: 1.3 }, { translateY: -30 }, { translateX: 57 }],
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
  nextButton: {
    backgroundColor: '#49467e',
    borderRadius: 999,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
});
