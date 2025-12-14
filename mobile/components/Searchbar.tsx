import { View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Input, InputIcon, InputSlot, InputField } from './ui/input'
import { Search, Mic, SlidersHorizontal } from 'lucide-react-native'
import { Button, ButtonIcon } from './ui/button'

const Searchbar = () => {
    return (
        <View className='flex-row w-full items-center gap-2 mt-4 mb-3'>
            {/* Search Input */}
            <Input className='flex-1 rounded-lg h-12 bg-white border-0'>
                <InputSlot className="pl-3">
                    <InputIcon as={Search} />
                </InputSlot>
                <InputField placeholder="Search..." />

                <Button style={{ backgroundColor: 'transparent' }}>
                    <ButtonIcon
                        as={Mic}
                        style={{ color: 'gray', paddingRight: 2 }}
                    />
                </Button>
            </Input>

            {/* Filter Button */}
            <TouchableOpacity
                className='bg-white rounded-lg items-center justify-center'
                style={{ height: 45, width: 48 }} // same as input height
            >
                <SlidersHorizontal />
            </TouchableOpacity>
        </View>
    )
}

export default Searchbar
