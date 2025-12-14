import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import React, { useState } from 'react';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LineChart } from 'react-native-gifted-charts';
import { AnyComponent } from 'react-native-reanimated/lib/typescript/createAnimatedComponent/commonTypes';
import { Colors } from '@/constants/theme';

const { width } = Dimensions.get('window');

const InsightsScreen = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Month');

  const spendingAreas = [
    { icon: '🍔', name: 'Food & Dining', amount: '$21,326.28', percentage: '98%', color: '#FF5252', barColor: '#FFE5E5' },
    { icon: '✈️', name: 'Travel', amount: '$800', percentage: '55%', color: '#FF9800', barColor: '#FFF3E0' },
    { icon: '⚡', name: 'Utilities & Bills', amount: '$32,123', percentage: '68%', color: '#FF9800', barColor: '#FFF3E0' },
    { icon: '🛍️', name: 'Shopping', amount: '$800', percentage: '49%', color: '#4CAF50', barColor: '#E8F5E9' },
  ];

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInUp.duration(600)} style={styles.header}>
        <Text style={styles.title}>Insights</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuText}>⋯</Text>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false}>

        <Animated.View entering={FadeInDown.duration(600).delay(100)}>
          <Text style={styles.sectionTitle}>Spending Overview</Text>

          <View style={styles.periodSelector}>
            {['Day', 'Week', 'Month', 'Year'].map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodButton,
                  selectedPeriod === period && styles.periodButtonActive,
                ]}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text
                  style={[
                    styles.periodText,
                    selectedPeriod === period && styles.periodTextActive,
                  ]}
                >
                  {period}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(600).delay(200)}>
          <Text style={styles.sectionTitle}>Top Spending Areas</Text>

          <View style={styles.spendingGrid}>
            {spendingAreas.map((area, index) => (
              <Animated.View
                key={area.name}
                entering={FadeInDown.duration(600).delay(300 + index * 100)}
                style={styles.spendingCard}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.icon}>{area.icon}</Text>
                  <Text style={styles.categoryName}>{area.name}</Text>
                </View>

                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: area?.percentage as any, backgroundColor: area?.color }]} />
                  <View style={[styles.progressBackground, { backgroundColor: area.barColor }]} />
                </View>

                <View style={styles.cardFooter}>
                  <Text style={styles.amount}>{area.amount}</Text>
                  <View style={[styles.percentageBadge, { backgroundColor: area.barColor }]}>
                    <Text style={[styles.percentageText, { color: area.color }]}>
                      {area.percentage}
                    </Text>
                  </View>
                </View>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(600).delay(700)} style={styles.summaryContainer}>
          <Text style={styles.sectionTitle}>Summary Insights</Text>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryText}>
              Food is your highest expense this month.{'\n'}
              You spent 12% less than last month.
            </Text>
            <Text style={styles.congratsText}>Nice work!</Text>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8E8E8',
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  menuButton: {
    width: 48,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 24,
    color: '#1A1A1A',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    paddingHorizontal: 24,
    marginTop: 16,
    marginBottom: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
    marginHorizontal: 24,
    marginBottom: 16,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: Colors.light.buttonColor,
  },
  periodText: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },
  periodTextActive: {
    color: '#FFFFFF',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  expenseDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#2D5F5D',
    gap: 8,
  },

  amountBadge: {
    position: 'absolute',
    top: 80,
    right: 80,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#2D5F5D',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    zIndex: 10,
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D5F5D',
  },
  spendingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  spendingCard: {
    width: (width - 56) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  icon: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F5F5F5',
    borderRadius: 3,
    marginBottom: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  progressFill: {
    position: 'absolute',
    height: '100%',
    borderRadius: 3,
    zIndex: 2,
  },
  progressBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  percentageBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  percentageText: {
    fontSize: 12,
    fontWeight: '600',
  },
  summaryContainer: {
    paddingBottom: 32,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
  },
  summaryText: {
    fontSize: 16,
    color: '#1A1A1A',
    lineHeight: 24,
    marginBottom: 12,
  },
  congratsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
});

export default InsightsScreen;