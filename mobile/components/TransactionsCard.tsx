import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { LucideIcon, Dot } from 'lucide-react-native'
import { VStack } from './ui/vstack'

export interface TransactionsCardProps {
  icon: LucideIcon
  iconColor: string
  title: string
  category: string
  type: 'Income' | 'Expense'
  date: string
  amount: string
  onPress?: () => void // optional prop
}

const TransactionsCard = ({
  icon: Icon,
  iconColor,
  title,
  category,
  type,
  date,
  amount,
  onPress
}: TransactionsCardProps) => {
  const CardContent = (
    <View className='w-full flex-row items-center justify-between bg-white rounded-2xl p-3'>
      <View className='flex-row items-start gap-2'>
        {/* icon */}
        <View
          className='p-4 rounded-2xl'
          style={{ backgroundColor: '#F4F7F6' }}
        >
          <Icon size={24} color={iconColor} />
        </View>

        <VStack space='xs'>
          <Text className='text-lg font-medium text-black'>{title}</Text>
          <View className='flex-row items-center gap-1'>
            <Text className='text-sm text-typography-500'>{category}</Text>
            <Dot size={24} color='gray' />
            {/* pill */}
            <View
              className='px-5 py-1 rounded-2xl'
              style={{ backgroundColor: type === 'Income' ? '#dcfce7' : '#FEE2E2' }}
            >
              <Text className='font-medium' style={{ color: type === 'Income' ? 'green' : 'red' }}>
                {type}
              </Text>
            </View>
          </View>
          {/* date */}
          <Text className='text-sm text-typography-500'>{date}</Text>
        </VStack>
      </View>

      {/* price */}
      <View>
        <Text className='text-lg font-bold text-black'>{amount}</Text>
      </View>
    </View>
  )

  // If onPress is provided, wrap with TouchableOpacity
  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        {CardContent}
      </TouchableOpacity>
    )
  }

  return CardContent
}

export default TransactionsCard
