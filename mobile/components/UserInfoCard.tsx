import { View, Text, Pressable, TouchableOpacity } from 'react-native'
import React from 'react'
import { ChevronRight, Clipboard, Edit, FileText, HelpCircle, Info, Lock, LucideIcon, LucideLogOut, Mail, Share, Shield, UserCircle } from 'lucide-react-native'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { router } from 'expo-router'

interface UserInfoCardProps {
  title: string
  icon: LucideIcon
  onPress?: () => void
}

export const userinfoData: UserInfoCardProps[] = [
    {
        title: 'Afari Boadu Godwin',
        icon: UserCircle
    },

     {
        title: 'afgod98@gmail.com',
        icon: Mail
    },

     {
        title: 'Edit Profile',
        icon: Edit,
        onPress: () => console.log('Edit profile')
    },
]


export const accountSettings: UserInfoCardProps[] = [
    {
        title: 'Change Password',
        icon: Lock,
        onPress: () => console.log('change password')
    },

     {
        title: 'Update Email',
        icon: Mail,
        onPress: () => console.log('change password')
    },

    {
        title: 'Two Factor Authentication (2FA)',
        icon: Shield,
        onPress: () => console.log('Edit profile')
    },
]


export const SecurityPrivacy: UserInfoCardProps[] = [
    {
        title: 'Privacy Policy',
        icon: FileText,
        onPress: () => console.log('change password')
    },

     {
        title: 'Terns & Conditions',
        icon: Clipboard,
        onPress: () => console.log('change password')
    },

    {
        title: 'Logout',
        icon: LucideLogOut,
        onPress: () => router.push('/auth/login')
    },
]



export const other: UserInfoCardProps[] = [
    {
        title: 'About Spendmate',
        icon: Info,
        onPress: () => console.log('change password')
    },

     {
        title: 'Help & Support',
        icon: HelpCircle,
        onPress: () => console.log('change password')
    },

    {
        title: 'Invite a Friend',
        icon: Share,
        onPress: () => router.push('/auth/login')
    },
]


const UserInfoCard = ({ title, icon: Icon, onPress }: UserInfoCardProps) => {
  const cardContent = (
    <View className="w-full flex-row items-center justify-between p-4 bg-white rounded-2xl">
      <View className="flex-row items-center gap-2">
        <View className="flex items-center p-3 rounded-xl" style = {{backgroundColor: '#F4F7F6'}}>
          <Icon size={24} color="black" />
        </View>
        <Text className="text-md text-black">{title}</Text>
      </View>

      {onPress ? (
        <ChevronRight size={24} color="black" />
      ) : null}
    </View>
  )

  if (onPress) {
    return (
      <Animated.View entering={FadeInUp.duration(500)}>
        <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
          {cardContent}
        </TouchableOpacity>
      </Animated.View>
    )
  }

  return <Animated.View entering={FadeInUp.duration(500)}>{cardContent}</Animated.View>
}

export default UserInfoCard
