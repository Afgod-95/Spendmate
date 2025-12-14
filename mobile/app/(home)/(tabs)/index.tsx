import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native'
import React from 'react'
import { Colors } from '@/constants/theme'
import {
  BellDotIcon,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react-native'
import { VStack } from '@/components/ui/vstack'
import { ScrollView } from 'react-native-gesture-handler'
import SectionHeader from '@/components/SectionHeader'
import { router } from 'expo-router'
import { CategoriesCard, categoriesData } from '@/components/CategoriesCard'
import TransactionsCard from '@/components/TransactionsCard'
import { transactionsData } from '@/data/recentTransactions'
import Animated, {
  FadeInUp,
  FadeInDown,
} from 'react-native-reanimated'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const isTablet = SCREEN_WIDTH >= 768

const Index = () => {
  return (
    <View
      className="flex-1 px-5"
      style={{
        backgroundColor: Colors.light.background,
        paddingTop: Platform.OS === 'ios' ? 60 : 10,
      }}
    >
      {/* HEADER */}
      <Animated.View
        entering={FadeInDown.duration(600)}
        className="flex-row w-full items-center justify-between"
      >
        <Text className="text-4xl font-bold text-black">Overview</Text>

        <View className="flex-row gap-2 items-center">
          <TouchableOpacity className="p-3 rounded-2xl bg-white">
            <BellDotIcon />
          </TouchableOpacity>
          <TouchableOpacity className="p-3 rounded-2xl bg-white">
            <BellDotIcon />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* BALANCE CARD */}
      <Animated.View
        entering={FadeInUp.delay(100).duration(600)}
        className="relative w-full mt-8"
      >
        <View
          className="absolute w-full rounded-3xl"
          style={{
            height: 120,
            backgroundColor: Colors.light.background,
            top: -10,
            zIndex: 1
          }}
        />

        <View
          className="absolute w-1/2 rounded-3xl"
          style={{
            height: 120,
            backgroundColor: Colors.light.buttonColor,
            top: -25,
            zIndex: 0
          }}
        />

        <View
          className="w-full rounded-3xl p-4"
          style={{ backgroundColor: Colors.light.buttonColor, zIndex: 2 }}
        >
          <VStack space="sm">
            <View className="flex-row items-center gap-2">
              <View
                className="p-2 rounded-full"
                style={{ backgroundColor: Colors.light.background }}
              >
                <Wallet size={20} />
              </View>
              <Text className="text-xl text-white">Net Balance</Text>
            </View>

            <Text className="text-3xl font-bold text-white">$1,000.00</Text>
          </VStack>

          <View className="flex-row gap-2 mt-4">
            {/* INCOME */}
            <View
              className="w-1/2 p-3 rounded-2xl"
              style={{ backgroundColor: Colors.light.background }}
            >
              <VStack space="xs">
                <View className="flex-row items-center gap-2">
                  <View className="bg-green-200 p-2 rounded-full">
                    <TrendingUp size={18} color="#166534" />
                  </View>
                  <Text>Total Income</Text>
                </View>
                <Text className="text-2xl font-bold">$2,000.00</Text>
              </VStack>
            </View>

            {/* EXPENSE */}
            <View
              className="w-1/2 p-3 rounded-2xl"
              style={{ backgroundColor: Colors.light.background }}
            >
              <VStack space="xs">
                <View className="flex-row items-center gap-2">
                  <View className="bg-red-200 p-2 rounded-full">
                    <TrendingDown size={18} color="#991B1B" />
                  </View>
                  <Text>Total Expenses</Text>
                </View>
                <Text className="text-2xl font-bold">$1,500.00</Text>
              </VStack>
            </View>
          </View>
        </View>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} className="mt-4">
        {/* CATEGORIES */}
        <Animated.View entering={FadeInUp.delay(200)}>
          <SectionHeader
            title="Categories"
            actionLabel="See All"
            onPress={() => router.push('/(home)/(tabs)/categories')}
          />
        </Animated.View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categoriesData.map((item, index) => (
            <Animated.View
              key={item.title}
              entering={FadeInUp.delay(300 + index * 80)}
              style={{ marginRight: 12 }}
            >
              <CategoriesCard {...item} />
            </Animated.View>
          ))}
        </ScrollView>

        {/* TRANSACTIONS */}
        <Animated.View entering={FadeInUp.delay(400)}>
          <SectionHeader
            title="Transactions"
            actionLabel="See All"
            onPress={() => router.push('/(home)/transactions')}
          />
        </Animated.View>

        <View
          className="mt-4"
          style={{
            flexDirection: isTablet ? 'row' : 'column',
            flexWrap: isTablet ? 'wrap' : 'nowrap',
            justifyContent: 'space-between',
          }}
        >
          {transactionsData.map((item, index) => (
            <Animated.View
              key={item.title}
              entering={FadeInUp.delay(500 + index * 100)}
              style={{
                width: isTablet ? '48%' : '100%',
                marginBottom: 16,
              }}
            >
              <TransactionsCard {...item} />
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

export default Index
