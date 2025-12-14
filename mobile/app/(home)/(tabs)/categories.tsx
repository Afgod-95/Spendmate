import { View, Text, Platform, Dimensions, FlatList } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/theme'
import { Button, ButtonText } from '@/components/ui/button'
import Searchbar from '@/components/Searchbar'
import { AllCategoriesCardProps, AllCategoriesCard } from '@/components/CategoriesCard'
import { Plus } from 'lucide-react-native'
import { allCategoriesData } from '@/data/categories'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated'

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 768; // threshold for tablet

const CategoriesScreen = () => {

  const renderItem = ({ item }: { item: AllCategoriesCardProps }) => (
    <View
      style={{
        width: isTablet ? '48%' : '100%',
        marginBottom: 16,
      }}
    >
      <AllCategoriesCard {...item} />
    </View>
  )

  return (
    <View className='flex-1 items-center px-5'
      style={{
        backgroundColor: Colors.light.background,
        paddingTop: Platform.OS === 'ios' ? 60 : 10
      }}
    >
      {/* header */}
      <View className='flex flex-row w-full items-center justify-between'>
        <Animated.Text className='font-bold text-black' style={{ fontSize: 20 }}
          entering={FadeInUp.duration(600)}
        >
          Categories</Animated.Text>
        <Animated.View
          entering={FadeInUp.duration(600).delay(100)}
        >
          <Button className='flex-row h-12 gap-2 items-center rounded-md'
            style={{ backgroundColor: Colors.light.buttonColor }}
          >
            <Plus size={20} color={'white'} />
            <ButtonText className='text-white'>Add Category</ButtonText>
          </Button>
        </Animated.View>

      </View>

      {/* Search Box */}
      <Animated.View
        entering={FadeInUp.duration(600).delay(200)}
      >
        <Searchbar />
      </Animated.View>

      {/* Categories List */}
      <FlatList
        data={allCategoriesData}
        renderItem={({ item }) => (
          <Animated.View
            entering={FadeInDown.duration(600).delay(300)}
          >
            {renderItem({ item })}
          </Animated.View>
        )}
        keyExtractor={(item, index) => index.toString()}
        numColumns={isTablet ? 2 : 1}
        columnWrapperStyle={isTablet ? { justifyContent: 'space-between' } : undefined}
        contentContainerStyle={{ marginTop: 16, paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

export default CategoriesScreen
