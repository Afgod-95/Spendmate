import { Stack } from 'expo-router';
import React from 'react';
import CustomBackKey from '@/components/CustomBackKey';
import { Platform } from 'react-native';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name='auth-callback/verify'

        options={{
          title: 'Email Verification',
          headerLeft: () => <CustomBackKey />,
          headerTitleStyle: { fontWeight: '600', fontSize: 18 },
          presentation: 'card'
        }}
      />

      <Stack.Screen
        name='login'
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name='register'
        options={{
          headerShown: false,
          presentation: 'card'
        }}

      />

      <Stack.Screen
        name='forgot-password/index'
        options={{
          title: 'Forgot Password',
          headerLeft: () => <CustomBackKey />,
          headerTitleStyle: { fontWeight: '600', fontSize: 18 },
          presentation: Platform.OS === 'ios' ? 'modal' : 'card'
        }}
      />




    </Stack>
  );
}
