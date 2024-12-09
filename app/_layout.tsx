// app/_layout.tsx
import '../global.css';
import { useFonts } from 'expo-font';
import { SplashScreen, useSegments, useRouter, Slot } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';

import { AuthProvider, useAuth } from '~/context/AuthContext';

enableScreens();
SplashScreen.preventAutoHideAsync();
const AuthenticationGuard = ({ children }: { children: React.ReactNode }) => {
  const { authState } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  useEffect(() => {
    if (!isNavigationReady) {
      setIsNavigationReady(true);
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';

    // Handle navigation based on authentication state
    if (!authState?.authenticated && !inAuthGroup) {
      router.replace('/(auth)/Siginin');
    } else if (authState?.authenticated && inAuthGroup) {
      if (authState?.data.role === 'COPRA_BUYER') {
        router.replace('/(protected)/buyerhome');
      } else {
        router.replace('/(protected)/oilhome');
      }
    }
  }, [authState?.authenticated, segments, isNavigationReady]);

  return <>{children}</>;
};
export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  const [fontsLoaded] = useFonts({
    'Poppins-Black': require('../assets/fonts/Poppins-Black.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-ExtraBold': require('../assets/fonts/Poppins-ExtraBold.ttf'),
    'Poppins-ExtraLight': require('../assets/fonts/Poppins-ExtraLight.ttf'),
    'Poppins-Light': require('../assets/fonts/Poppins-Light.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Thin': require('../assets/fonts/Poppins-Thin.ttf'),
  });

  useEffect(() => {
    const prepare = async () => {
      try {
        if (fontsLoaded) {
          await SplashScreen.hideAsync();
        }
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        setIsReady(true);
      }
    };

    prepare();
  }, [fontsLoaded]);

  if (!isReady || !fontsLoaded) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: '#FBF6EE' }} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AuthenticationGuard>
          <Slot />
        </AuthenticationGuard>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
