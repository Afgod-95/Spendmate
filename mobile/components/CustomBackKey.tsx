import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { ChevronLeft } from 'lucide-react-native'
import { useRouter } from 'expo-router'

const CustomBackKey = () => {
    const router = useRouter()
  return (
    <TouchableOpacity className="flex-row items-center"
        onPress = {() => router.back()} 
    >
      <ChevronLeft size={24} color="black" />
    </TouchableOpacity>
  )
}

export default CustomBackKey