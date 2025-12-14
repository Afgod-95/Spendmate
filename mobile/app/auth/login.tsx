import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/theme'
import { SafeAreaProvider} from 'react-native-safe-area-context'
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input'
import { FormControl } from '@/components/ui/form-control'
import { VStack } from '@/components/ui/vstack'
import { EyeClosed, Eye } from 'lucide-react-native'
import { Button, ButtonText } from '@/components/ui/button'
import { Link, useRouter } from 'expo-router'

const SigninScreen = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const router = useRouter();
  const handleState = () => {
    setShowPassword(prev => !prev)
  }

  const handleLogin = async () => {
      router.push('/(home)/(tabs)')
  }

  return (
   <SafeAreaProvider className="flex-1" style={{ backgroundColor: Colors.light.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start' }}
        className={`px-4 bg-[${Colors.light.background}]`}
      >
        <VStack className='items-center mt-10' >
          {/* Header */}
          <Text className="text-2xl text-center text-black font-semibold">
            Welcome back
          </Text>

          <Text className="mt-2 text-center text-gray-600 text-md w-72">
            Log in to continue tracking your expenses and managing your money.
          </Text>
        </VStack>


        {/* Form */}
        <FormControl className="mt-6 w-full">
          <VStack space="md">
            {/* Email */}
            <VStack space="sm">
              <Text className="text-typography-500">Email</Text>
              <Input
                variant="outline"
                size="xl"
                isDisabled={false}
                isInvalid={false}
                isReadOnly={false}
              >
                <InputField type="text" placeholder="Enter your email" className='text-lg' />
              </Input>
            </VStack>

            {/* Password */}
            <VStack space="sm" className='mt-2'>
              <Text className="text-typography-500">Password</Text>
              <Input
                variant="outline"
                size="xl"
                isDisabled={false}
                isInvalid={false}
                isReadOnly={false}
              >
                <InputField
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className='text-lg'
                />
                <InputSlot className="pr-3" onPress={handleState}>
                  <InputIcon as={showPassword ? Eye : EyeClosed} />
                </InputSlot>
              </Input>

              {/* Forgot password */}
              <Link href={"/auth/forgot-password" as any}>
                <Text className="mt-4 text-right text-md text-blue-600">
                  Forgot password?
                </Text>
              </Link>
            </VStack>
          </VStack>
        </FormControl>

        {/* Login Button */}
        <Button className="mt-6 w-full h-12 mb-7 rounded-md" 
          style = {{backgroundColor: Colors.light.buttonColor}}
          onPress={handleLogin}
        >
          <ButtonText>Log in</ButtonText>
        </Button>

        {/* Sign up link */}
        <Link href={'/auth/register'}>
          <Text className="mt-4 text-center text-gray-600">
            Don’t have an account?{' '}
            <Text className="text-blue-600 font-semibold">Sign up</Text>
          </Text>
        </Link>
      </ScrollView>
    </SafeAreaProvider>
  )
}

export default SigninScreen
