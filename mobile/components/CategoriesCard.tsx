import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { VStack } from './ui/vstack'


import {
    LucideIcon,
    Utensils,
    TrendingUp,
    ShoppingBag,
    Car,
    Home,
    HeartPulse,
    Smartphone,
    Film,
    ArrowRight,
} from 'lucide-react-native'
import { Colors } from '@/constants/theme'


export interface CategoriesCardProps {
    title: string
    icon: LucideIcon
    color: string
}


// mock data for categories
export const categoriesData: CategoriesCardProps[] = [
    {
        title: 'Food & Dining',
        icon: Utensils,
        color: 'orange',
    },
    {
        title: 'Investments',
        icon: TrendingUp,
        color: '#0C986A',
    },
    {
        title: 'Shopping',
        icon: ShoppingBag,
        color: '#800080',
    },

    // ➕ new ones
    {
        title: 'Transportation',
        icon: Car,
        color: '#2563EB',
    },
    {
        title: 'Housing',
        icon: Home,
        color: '#7C3AED',
    },
    {
        title: 'Health',
        icon: HeartPulse,
        color: '#DC2626',
    },
    {
        title: 'Utilities',
        icon: Smartphone,
        color: '#0EA5E9',
    },
    {
        title: 'Entertainment',
        icon: Film,
        color: '#F59E0B',
    },
]


export interface AllCategoriesCardProps {
    icon: LucideIcon
    iconColor: string
    category: string
    type: 'Income' | 'Expense'
    total: string
    onPress?: () => void // optional prop
}



const AllCategoriesCard = ({
    icon: Icon,
    iconColor,
    category,
    type,
    total,
    onPress
}: AllCategoriesCardProps) => {
    return (
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
                    <Text className='text-lg font-medium text-black'>{category}</Text>
                    <View
                        className='py-1 px-3 rounded-2xl'
                        style={{
                            backgroundColor: type === 'Income' ? '#dcfce7' : '#FEE2E2',
                            alignSelf: 'flex-start',
                            maxWidth: 120, 
                        }}
                    >
                        <Text
                            className='font-medium text-center'
                            style={{ color: type === 'Income' ? 'green' : 'red' }}
                            numberOfLines={1} 
                            ellipsizeMode='tail'
                        >
                            {type}
                        </Text>
                    </View>

                    {/* total */}
                    <View className='flex-row items-center gap-2'>
                        {type === 'Expense' ?
                            <Text className='text-sm text-typography-500'>Total spent:</Text> :
                            <Text className='text-sm text-typography-500'>Total income:</Text>
                        }
                        <Text className='text-md text-black font-bold'>
                            ${total}</Text>
                    </View>
                </VStack>
            </View>

            {/* price */}
            <TouchableOpacity className='p-2 rounded-full'
                onPress={onPress}
                style={{ backgroundColor: Colors.light.buttonColor }}
            >
                <ArrowRight color='white' size={24} />
            </TouchableOpacity>
        </View>
    )
}




const CategoriesCard = ({ title, icon: Icon, color }: CategoriesCardProps) => {
    return (
        <VStack space="md" className="flex-col items-center mt-4" style={{ width: 100 }}>
            <View className="p-3 px-4 items-center bg-white rounded-2xl">
                <Icon size={24} color={color} />
            </View>
            <Text
                className="text-md text-typography-700 text-center"
                numberOfLines={2}
                ellipsizeMode="tail"
            >
                {title}
            </Text>
        </VStack>
    );
};


export { CategoriesCard, AllCategoriesCard }
