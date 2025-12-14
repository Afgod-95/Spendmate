import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/theme'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input'
import { FormControl } from '@/components/ui/form-control'
import { VStack } from '@/components/ui/vstack'
import { EyeClosed, Eye } from 'lucide-react-native'
import { Button, ButtonText } from '@/components/ui/button'
import { Link } from 'expo-router'

const RegisterScreen = () => {
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)

  return (
    <SafeAreaProvider className="flex-1" style={{ backgroundColor: Colors.light.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start' }}
        style={{ backgroundColor: Colors.light.background }}
        className="px-4"
      >
        {/* Header */}
        <VStack className="items-center mt-8">
          <Text className="text-2xl text-center text-black font-semibold">
            Create an account
          </Text>

          <Text className="mt-2 text-center text-gray-600 text-md w-72">
            Sign up to start tracking your expenses and managing your money.
          </Text>
        </VStack>

        {/* Form */}
        <FormControl className="mt-6 w-full">
          <VStack space="md">
            {/* Username */}
            <VStack space="sm">
              <Text className="text-typography-500">Username</Text>
              <Input variant="outline" size="xl">
                <InputField type="text" placeholder="eg: John Doe" className='text-lg' />
              </Input>
            </VStack>

            {/* Email */}
            <VStack space="sm">
              <Text className="text-typography-500">Email</Text>
              <Input variant="outline" size="xl">
                <InputField type="text" placeholder="eg:johndoe@gmail.com" className='text-lg'/>
              </Input>
            </VStack>

            {/* Password */}
            <VStack space="sm">
              <Text className="text-typography-500">Password</Text>
              <Input variant="outline" size="xl">
                <InputField
                  type={showPassword ? 'text' : 'password'}
                  placeholder=""
                  className='text-lg'
                />
                <InputSlot
                  className="pr-3"
                  onPress={() => setShowPassword(prev => !prev)}
                >
                  <InputIcon as={showPassword ? Eye : EyeClosed} />
                </InputSlot>
              </Input>
            </VStack>

            {/* Confirm Password */}
            <VStack space="sm">
              <Text className="text-typography-500">Confirm Password</Text>
              <Input variant="outline" size="xl">
                <InputField
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder=""
                  className='text-lg'
                />
                <InputSlot
                  className="pr-3"
                  onPress={() => setShowConfirmPassword(prev => !prev)}
                >
                  <InputIcon as={showConfirmPassword ? Eye : EyeClosed} />
                </InputSlot>
              </Input>
            </VStack>


          </VStack>
        </FormControl>

        {/* Sign Up Button */}
        <Button
          className="mt-6 w-full h-12 mb-6 rounded-md"
          style={{ backgroundColor: Colors.light.buttonColor }}
        >
          <ButtonText>Create account</ButtonText>
        </Button>

        {/* Login link */}
        <Link href="/auth/login">
          <Text className="text-center text-gray-600">
            Already have an account?{' '}
            <Text className="text-blue-600 font-semibold">
              Log in
            </Text>
          </Text>
        </Link>
      </ScrollView>
    </SafeAreaProvider>
  )
}

export default RegisterScreen
