import { View, Text, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '@/constants/theme'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Input, InputField } from '@/components/ui/input'
import { FormControl } from '@/components/ui/form-control'
import { VStack } from '@/components/ui/vstack'
import { Button, ButtonText } from '@/components/ui/button'
import { supabase } from '@/lib/supabase' // import your supabase client

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleReset = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email')
      return
    }
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'yourapp://auth/reset-password',
      })

      setLoading(false)

      if (error) {
        Alert.alert('Error', error.message)
      } else {
        Alert.alert(
          'Success',
          'If your email is registered, a password reset link has been sent.'
        )
      }
    }
    catch (error: any) {
      Alert.alert(
        'Error',
        error.message
      )
    }
  }

  return (
    <SafeAreaProvider className="flex-1" style={{ backgroundColor: Colors.light.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', paddingHorizontal: 16 }}
      >
        <VStack className="items-center mt-10">
          <Text className="text-2xl text-center text-black font-semibold">
            Forgot your Password?
          </Text>
          <Text className="mt-2 text-center text-gray-600 w-72">
            No worries! Enter your email below and we will send you a link to reset your password.
          </Text>
        </VStack>

        <FormControl className="mt-6 w-full">
          <VStack space="md">
            <VStack space="sm">
              <Text className="text-typography-500">Email</Text>
              <Input variant="outline" size="xl">
                <InputField
                  type="text"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  className="text-lg"
                />
              </Input>
            </VStack>
          </VStack>
        </FormControl>

        <Button
          className="mt-6 w-full h-12 mb-7 rounded-md"
          style={{ backgroundColor: Colors.light.buttonColor }}
          onPress={handleReset}
          disabled={loading}
        >
          <ButtonText>{loading ? 'Sending...' : 'Send Reset Link'}</ButtonText>
        </Button>
      </ScrollView>
    </SafeAreaProvider>
  )
}

export default ForgotPassword
