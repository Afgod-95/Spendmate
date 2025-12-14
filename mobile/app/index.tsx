import { View, Text } from 'react-native'
import React from 'react'
import { Button, ButtonText } from '@/components/ui/button'
import { Stack, useRouter } from 'expo-router'

const Onboarding = () => {
    const router = useRouter();
    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <View className='flex-1 items-center justify-center'>
                <Text>Onboarding Screen</Text>
                <View className='flex-row gap-4 mt-8' >
                    <Button className='bg-[#007AFF]' onPress={() => router.push('/auth/auth-callback/verify')}>
                        <ButtonText>Verify Email</ButtonText>
                    </Button>

                    <Button className='bg-[#007AFF]'
                        onPress={() => router.push('/auth/login')}
                    >
                        <ButtonText>Login</ButtonText>
                    </Button>   
                </View>

            </View>
        </>
    )
}

export default Onboarding