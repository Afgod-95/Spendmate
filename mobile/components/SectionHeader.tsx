import { View, Text } from 'react-native'
import React from 'react'
import { Button, ButtonText } from '@/components/ui/button'
import { Colors } from '@/constants/theme'

interface SectionHeaderProps {
  title: string
  actionLabel?: string
  onPress?: () => void
}

const SectionHeader = ({ title, actionLabel, onPress }: SectionHeaderProps) => {
  return (
    <View className="w-full flex-row items-center justify-between mt-4">
      <Text className="text-black text-xl font-medium">
        {title}
      </Text>

      {actionLabel && (
        <Button
          className="rounded-full"
          style={{ backgroundColor: Colors.light.buttonColor }}
          onPress={onPress}
        >
          <ButtonText className='text-white'>{actionLabel}</ButtonText>
        </Button>
      )}
    </View>
  )
}

export default SectionHeader
