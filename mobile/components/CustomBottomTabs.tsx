import { View, Platform, StyleSheet, Pressable } from 'react-native';
import { useLinkBuilder, useTheme } from '@react-navigation/native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useState } from 'react';
import { ChartArea, Hexagon, House, UserCircle } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import TransactionBottomSheet from './TransactionsBottomSheet';

// Icon component placeholders
const HomeIcon = ({ color, size }: { color: string; size: number }) => (
  <House size={size} color={color} />
);

const CategoriesIcon = ({ color, size }: { color: string; size: number }) => (
  <Hexagon size={size} color={color} />
);

const InsightsIcon = ({ color, size }: { color: string; size: number }) => (
  <ChartArea size={size} color={color} />
);

const ProfileIcon = ({ color, size }: { color: string; size: number }) => (
  <UserCircle size={size} color={color}/>
);

const PlusIcon = ({ color, size }: { color: string; size: number }) => (
  <View style={styles.plusIcon}>
    <View style={[styles.plusHorizontal, { backgroundColor: color, width: size * 0.7, height: 3 }]} />
    <View style={[styles.plusVertical, { backgroundColor: color, width: 3, height: size * 0.7 }]} />
  </View>
);

// Map route names to icons
const iconMap: Record<string, React.ComponentType<{ color: string; size: number }>> = {
  index: HomeIcon,
  categories: CategoriesIcon,
  insights: InsightsIcon,
  profile: ProfileIcon,
};


export function CustomBottomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();
  const { buildHref } = useLinkBuilder();
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

  const activeColor = Colors.light.buttonColor;
  const inactiveColor = colors.text;
  const iconSize = 24;

  // Split routes into two groups for the plus button in the middle
  const midPoint = Math.ceil(state.routes.length / 2);
  const leftRoutes = state.routes.slice(0, midPoint);
  const rightRoutes = state.routes.slice(midPoint);

  const renderTabButton = (route: typeof state.routes[0], index: number) => {
    const { options } = descriptors[route.key];
    const isFocused = state.index === index;
    const IconComponent = iconMap[route.name] || HomeIcon;

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name, route.params);
      }
    };

    const onLongPress = () => {
      navigation.emit({
        type: 'tabLongPress',
        target: route.key,
      });
    };

    return (
      <Pressable
        key={route.name}
        accessibilityState={isFocused ? { selected: true } : {}}
        accessibilityLabel={options.tabBarAccessibilityLabel}
        testID={options.tabBarButtonTestID}
        onPress={onPress}
        onLongPress={onLongPress}
        style={styles.tabButton}
      >
        <View style={styles.tabContent}>
          {isFocused && (
            <View style={[styles.activeIndicator, { backgroundColor: activeColor }]} />
          )}
          <IconComponent
            color={isFocused ? activeColor : inactiveColor}
            size={iconSize}
          />
        </View>
      </Pressable>
    );
  };

  return (
    <>
      <View style={[styles.container, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        {/* Left tabs */}
        {leftRoutes.map((route, index) => renderTabButton(route, index))}

        {/* Center Plus Button */}
        <Pressable
          style={styles.plusButtonContainer}
          onPress={() => setIsBottomSheetVisible(true)}
          accessibilityLabel="Add new item"
        >
          <View style={[styles.plusButton, { backgroundColor: activeColor }]}>
            <PlusIcon color="#FFFFFF" size={28} />
          </View>
        </Pressable>

        {/* Right tabs */}
        {rightRoutes.map((route, index) => renderTabButton(route, midPoint + index))}
      </View>

      {/* Bottom Sheet */}
      <TransactionBottomSheet
        isVisible = {isBottomSheetVisible}
        onClose={() => setIsBottomSheetVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 100,
   
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingTop: 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: 8,
  },
  activeIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
    top: 0,
  },
  plusButtonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
  },
  plusButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  plusIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusHorizontal: {
    position: 'absolute',
    borderRadius: 2,
  },
  plusVertical: {
    position: 'absolute',
    borderRadius: 2,
  },
});