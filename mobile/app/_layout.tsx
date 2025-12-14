import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { GestureHandlerRootView } from "react-native-gesture-handler";


import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {

  return (
    <GluestackUIProvider mode="light">
      <GestureHandlerRootView className = 'flex-1'>
        <Slot />
        <StatusBar style="auto" />
      </GestureHandlerRootView>
    </GluestackUIProvider>



  );
}
