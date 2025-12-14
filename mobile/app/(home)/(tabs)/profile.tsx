import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Pressable, Image } from 'react-native';
import React, { useState } from 'react';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  useAnimatedScrollHandler, 
  useSharedValue, 
  useAnimatedStyle,
  interpolate,
 Extrapolation
} from 'react-native-reanimated';
import { BellDot, Camera } from 'lucide-react-native';
import SectionHeader from '@/components/SectionHeader';
import { Colors } from '@/constants/theme';
import  UserInfoCard, { userinfoData, other, accountSettings, SecurityPrivacy } from '@/components/UserInfoCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 768;



const ProfileScreen = () => {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Animated style for avatar
  const avatarStyle = useAnimatedStyle(() => {
    const size = interpolate(
      scrollY.value,
      [0, 150],
      [200, 60],
     Extrapolation.CLAMP
    );

    const translateX = interpolate(
      scrollY.value,
      [0, 150],
      [SCREEN_WIDTH / 2 - 100, 20],
     Extrapolation.CLAMP
    );

    const translateY = interpolate(
      scrollY.value,
      [0, 150],
      [120, 60],
     Extrapolation.CLAMP
    );

    return {
      width: size,
      height: size,
      transform: [
        { translateX },
        { translateY },
      ],
    };
  });

  // Animated style for camera button
  const cameraStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 100],
      [1, 0],
     Extrapolation.CLAMP
    );

    const scale = interpolate(
      scrollY.value,
      [0, 100],
      [1, 0],
     Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ scale }],
    };
  });

  // Animated style for header title
  const headerTitleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [100, 150],
      [1, 1],
     Extrapolation.CLAMP
    );

    return {
      opacity,
    };
  });


  const backgroundBarStyles = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 150],
      [1, 0],
     Extrapolation.CLAMP
    );

    return {
      opacity,
    };
  });

  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.fixedHeader}>
        <Animated.Text style={[styles.headerTitle, headerTitleStyle]}>
          My Profile
        </Animated.Text>
        <TouchableOpacity style={styles.menuButton}>
          <BellDot size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Background bar */}
      <Animated.View
        style={[
          styles.backgroundBar, 
          { backgroundColor: Colors.light.bgPrimary }, backgroundBarStyles
        ]}
      />

      {/* Animated Avatar */}
      <Animated.View style={[styles.avatarWrapper, avatarStyle]}>
        <Image
          style={styles.avatar}
          source={{ uri: 'https://englishleaflet.com/wp-content/uploads/2025/04/whatsapp-dp-80-e1744744670618.jpg' }}
        />
        <Animated.View style={[styles.cameraButton, cameraStyle]}>
          <Pressable
            style={styles.cameraButtonInner}
            onPress={() => console.log('Change photo')}
          >
            <Camera size={24} color="#000" />
          </Pressable>
        </Animated.View>
      </Animated.View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Spacer for header */}
        <View style={{ height: 200 }} />

        <View style={styles.content}>
          <SectionHeader title="User Info" />
          <View style={[styles.section, isTablet && styles.sectionTablet]}>
            {userinfoData.map((item, index) => (
              <Animated.View
                key={item.title}
                entering={FadeInUp.delay(500 + index * 100)}
                style={[styles.cardWrapper, isTablet && styles.cardWrapperTablet]}
              >
                <UserInfoCard {...item} />
              </Animated.View>
            ))}
          </View>

          <Animated.View entering={FadeInUp.duration(200)}>
            <SectionHeader title="Account Settings" />
          </Animated.View>
          <View style={[styles.section, isTablet && styles.sectionTablet]}>
            {accountSettings.map((item, index) => (
              <Animated.View
                key={item.title}
                entering={FadeInDown.delay(500 + index * 100)}
                style={[styles.cardWrapper, isTablet && styles.cardWrapperTablet]}
              >
                <UserInfoCard {...item} />
              </Animated.View>
            ))}
          </View>

          <Animated.View entering={FadeInUp.duration(200)}>
            <SectionHeader title="Security & Privacy" />
          </Animated.View>
          <View style={[styles.section, isTablet && styles.sectionTablet]}>
            {SecurityPrivacy.map((item, index) => (
              <Animated.View
                key={item.title}
                entering={FadeInDown.delay(500 + index * 100)}
                style={[styles.cardWrapper, isTablet && styles.cardWrapperTablet]}
              >
                <UserInfoCard {...item} />
              </Animated.View>
            ))}
          </View>

          <Animated.View entering={FadeInUp.duration(200)}>
            <SectionHeader title="Other/Extras" />
          </Animated.View>
          <View style={[styles.section, isTablet && styles.sectionTablet]}>
            {other.map((item, index) => (
              <Animated.View
                key={item.title}
                entering={FadeInDown.delay(500 + index * 100)}
                style={[styles.cardWrapper, isTablet && styles.cardWrapperTablet]}
              >
                <UserInfoCard {...item} />
              </Animated.View>
            ))}
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fixedHeader: {
    height: 120,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: Colors.light.bgPrimary,
    zIndex: 100,
    borderBottomColor: '#E1E8ED',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  menuButton: {
    width: 48,
    height: 48,
    backgroundColor: '#F5F8FA',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundBar: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    height: 150,
    zIndex: 1,
  },
  avatarWrapper: {
    position: 'absolute',
    zIndex: 50,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 1000,
    backgroundColor: Colors.light.background,
    borderWidth: 4,
    borderColor: Colors.light.background,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 8,
    right: 12,
  },
  cameraButtonInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    paddingHorizontal: 20
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
    color: '#000',
  },
  section: {
    marginTop: 16,
  },
  sectionTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: '100%',
    marginBottom: 10,
  },
  cardWrapperTablet: {
    width: '48%',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F5F8FA',
    borderRadius: 12,
    gap: 12,
  },
  cardIcon: {
    fontSize: 24,
  },
  cardTitle: {
    fontSize: 14,
    color: '#657786',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});

export default ProfileScreen;