import React, { useCallback, useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';

type TransactionBottomSheetProps = {
    isVisible: boolean;
    onClose?: () => void;
};

const SCREEN_HEIGHT = Dimensions.get('window').height;

const TransactionBottomSheet = ({ isVisible, onClose }: TransactionBottomSheetProps) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [isMounted, setIsMounted] = useState(false);

    // snap points
    const snapPoints = ['50%'];

    // open/close effect
    useEffect(() => {
        if (isVisible) {
            setIsMounted(true);
            // Small delay to ensure the component is mounted before expanding
            setTimeout(() => {
                bottomSheetRef.current?.expand();
            }, 50);
        } else {
            bottomSheetRef.current?.close();
        }
    }, [isVisible]);

    const handleSheetChanges = useCallback((index: number) => {
        console.log('Sheet index:', index);
        if (index === -1) {
            // Delay unmounting to allow close animation to complete
            setTimeout(() => {
                setIsMounted(false);
                onClose?.();
            }, 100);
        }
    }, [onClose]);

    // Custom backdrop that appears/disappears with the sheet
    const renderBackdrop = useCallback(
        (props: BottomSheetBackdropProps) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                opacity={0.5}
                pressBehavior="close"
            />
        ),
        []
    );

    // Don't render anything if not mounted
    if (!isMounted) return null;

    return (
        <GestureHandlerRootView style={styles.gestureHandler} pointerEvents="box-none">
            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                enablePanDownToClose={true}
                backgroundStyle={styles.sheetBackground}
                backdropComponent={renderBackdrop}
            >
                <BottomSheetView style={styles.contentContainer}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Awesome 🎉</Text>
                    {/* Add your content here */}
                </BottomSheetView>
            </BottomSheet>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    gestureHandler: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 999,
    },
    sheetBackground: {
        backgroundColor: 'white',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    contentContainer: {
        padding: 24,
        alignItems: 'center',
    },
});

export default TransactionBottomSheet;