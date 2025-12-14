import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol.ios';
import { CustomBottomTabBar } from '@/components/CustomBottomTabs';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs tabBar = {(props) => <CustomBottomTabBar {...props} />}>
        <Tabs.Screen name="index" options={{ headerShown: false }} />
        <Tabs.Screen name="categories" options={{ headerShown: false }} />
        <Tabs.Screen name="insights" options={{ headerShown: false }} />
        <Tabs.Screen name="profile" options={{ headerShown: false }} />
    </Tabs>
  );
}
