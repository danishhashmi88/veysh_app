import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { imagePath } from '../../../constant/imagePath';
import CountUpText from '../animations/CountUpText';
import { InsightsSkeleton } from '../animations/HomeSkeletons';

const WardrobeInsights = ({ styles, handleNavigation, insightData, loading }) => (
  <View style={styles.sectionContainer}>
    <View style={styles.sectionTitleRow}>
      <Text style={styles.sectionTitle}>Closet Insights</Text>
      <TouchableOpacity
        onPress={() => handleNavigation('ClosetInsightsScreen')}
        style={{ flexDirection: 'row', alignItems: 'center' }}
      >
        <Text style={styles.changeText}>Full View</Text>
        <Image
          source={imagePath.chevronDown}
          style={[styles.headerChevron, { transform: [{ rotate: '270deg' }] }]}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>

    {loading ? (
      <InsightsSkeleton />
    ) : (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.insightsScroll}
      >
        {/* Card 1: Total Closet Value */}
        <View style={styles.insightCard}>
          <View
            style={[styles.insightIconCircle, { backgroundColor: '#FFF4E5' }]}
          >
            <Image
              source={imagePath.moneybag}
              style={[styles.insightIcon, { tintColor: '#F5A623' }]}
              resizeMode="contain"
            />
          </View>
          <CountUpText
            style={styles.insightValue}
            prefix="₹"
            value={insightData?.total_closet_value || 0}
          />
          <Text style={styles.insightLabel} numberOfLines={1}>Total Closet Value</Text>
        </View>

        {/* Card 2: Total Items */}
        <View style={styles.insightCard}>
          <View
            style={[styles.insightIconCircle, { backgroundColor: '#FDF4FF' }]}
          >
            <Image
              source={imagePath.shirtIN}
              style={[styles.insightIcon, { tintColor: '#E81CFF' }]}
              resizeMode="contain"
            />
          </View>
          <CountUpText
            style={styles.insightValue}
            value={insightData?.total_clothing || 0}
          />
          <Text style={styles.insightLabel} numberOfLines={1}>Total Items</Text>
        </View>

        {/* Card 3: Avg Cost/Worn */}
        <View style={styles.insightCard}>
          <View
            style={[styles.insightIconCircle, { backgroundColor: '#ECFDF5' }]}
          >
            <Image
              source={imagePath.chartBar}
              style={[styles.insightIcon, { tintColor: '#10B981' }]}
              resizeMode="contain"
            />
          </View>
          <CountUpText
            style={styles.insightValue}
            prefix="₹"
            value={Math.round(insightData?.average_closet_value || 0)}
          />
          <Text style={styles.insightLabel} numberOfLines={1}>Avg Cost/Worn</Text>
        </View>
      </ScrollView>
    )}
  </View>
);

export default WardrobeInsights;
