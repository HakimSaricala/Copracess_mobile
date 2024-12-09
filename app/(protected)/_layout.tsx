/* eslint-disable prettier/prettier */
import { Tabs, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Image, ActivityIndicator } from 'react-native';

import CustomHeader from '~/components/CustomHeader';
import Routes from '~/constants/tabRoutes';
import { useAuth } from '~/context/AuthContext';

const TabsLayout = () => {
  const router = useRouter();
  const { authState } = useAuth();
  const [loading, setLoading] = useState(true);
  const notificationCount = 3;

  useEffect(() => {
    if (!authState?.authenticated) {
      router.replace('/Siginin');
    } else if (authState?.data?.role) {
      setLoading(false);
    }
  }, [authState?.authenticated, authState?.data?.role]);

  const handleProfilePress = () => {
    router.push('/settings');
  };

  const handleNotificationPress = () => {
    console.log('Notification pressed');
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#59A60E" />
      </View>
    );
  }

  // Determine roles after authState is loaded
  const isOilmill =
    authState?.data?.role === 'OIL_MILL_MEMBER' || authState?.data?.role === 'OIL_MILL_MANAGER';
  const isCopraOwner = authState?.data?.role === 'COPRA_BUYER';

  const tabScreens = Routes(isOilmill, isCopraOwner);

  return (
    <>
      <CustomHeader
        notificationCount={notificationCount}
        onNotificationPress={handleNotificationPress}
        onProfilePress={handleProfilePress}
      />

      <Tabs
        screenOptions={{
          tabBarShowLabel: true, // Changed to true to show labels
          tabBarActiveTintColor: '#59A60E',
          tabBarInactiveTintColor: '#080807',

          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: '#E5E5E5',
            height: 80, // Reduced height
            paddingBottom: 10, // Added padding at bottom
            paddingTop: 5, // Added padding at top
          },
          tabBarLabelStyle: {
            // Added label styling
            fontFamily: 'Poppins-Medium',
            fontSize: 12,
            marginTop: 0,
          },
          header: () => null,
        }}>
        {tabScreens.map((screen) => (
          <Tabs.Screen
            key={screen.name}
            name={screen.name}
            options={{
              title: screen.label, // Added title to show the label
              tabBarIcon: ({ color, focused }) => (
                <Image source={screen.icon} className="h-6 w-6" style={{ tintColor: color }} />
              ),
              href: screen.href as any,
            }}
          />
        ))}
      </Tabs>
    </>
  );
};

export default TabsLayout;
