import React, { useEffect, useState, useRef } from 'react';
import { Animated, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Spinner } from '@/components/ui/spinner';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Colors } from '@/constants/theme';

// verify.tsx
export const veryScreenOptions = {
  title: 'Email Verification',
  headerShown: true,
};


const Verify = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ code?: string }>();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        if (!params.code) {
          setStatus('error');
          return;
        }

        const { error } = await supabase.auth.exchangeCodeForSession(params.code);

        if (error) {
          console.error(error);
          setStatus('error');
        } else {
          setStatus('success');
          setTimeout(() => router.replace('/(home)/(tabs)'), 2000);
        }
      } catch (err) {
        console.error(err);
        setStatus('error');
      }
    };

    verifyEmail();
  }, [params.code]);

  return (
    <View className="flex-1 justify-center items-center px-6">
      <Animated.View style={{ opacity: fadeAnim, width: '100%', alignItems: 'center' }}>
        <View className="w-[90%] max-w-md bg-white p-6 rounded-xl shadow-2xl/50 items-center">
          {status === 'loading' && (
            <>
              <Spinner size={"small"} color="#8b5cf6" />
              <Text className="mt-4 text-center text-base text-gray-700">
                Verifying your email...
              </Text>
            </>
          )}

          {status === 'success' && (
            <Text className="text-center text-lg font-bold text-green-600">
              ✅ Email verified! Redirecting...
            </Text>
          )}

          {status === 'error' && (
            <>
              <Text className="text-center text-lg font-bold text-red-500">
                ❌ Verification failed
              </Text>
              <Text className="mt-2 text-center text-sm text-gray-500">
                Please check your link or try signing up again.
              </Text>
              <Button
                className={`mt-4 w-full bg-red-500 text-white`}
                onPress={() => router.replace('/auth/register')}
              >
                <ButtonText> Back to signup </ButtonText>
              </Button>
            </>
          )}
        </View>
      </Animated.View>
    </View>
  );
};

export default Verify;
