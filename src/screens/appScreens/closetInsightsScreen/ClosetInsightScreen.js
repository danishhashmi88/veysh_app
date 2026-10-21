import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  StyleSheet,
  InteractionManager,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../../hooks/useTheme';
import { Colors as AppColors, CHART_PALETTE } from '../../../constant/colors';
import { ClosetInsights } from '../../../services/user.service';
import { getStyles } from './styles';
import { imagePath } from '../../../constant/imagePath';
import DonutChart from './components/DonutChart';
import BarChart from './components/BarChart';
import LineChart from './components/LineChart';
import { hp, wp } from '../../../utils/helper';
import Header from '../../../component/common/UI/Header';
import { FontSize } from '../../../constant/fonts';

const ClosetInsightScreen = () => {
  const navigation = useNavigation();
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const [loading, setLoading] = useState(true);
  const [insightData, setInsightData] = useState(null);
  const [activeTab, setActiveTab] = useState('Most Worn'); // 'Most Worn' or 'Never Worn'
  const [readyToRender, setReadyToRender] = useState(false);

  useEffect(() => {
    const interactionPromise = InteractionManager.runAfterInteractions(() => {
      setReadyToRender(true);
      fetchInsights();
    });
    return () => interactionPromise.cancel();
  }, []);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const response = await ClosetInsights();
      if (response && response.data) {
        console.log('Closet Insights response:', response);
        console.log(
          'Most Worn Categories:',
          JSON.stringify(response.data.mostWornCategory, null, 2),
        );
        console.log(
          'Closet Composition (donut chart):',
          JSON.stringify(response.data.closetComposition, null, 2),
        );
        console.log(
          'Closet Growth (line chart):',
          JSON.stringify(response.data.closet_growth, null, 2),
        );
        console.log(
          'Outfit Frequency (line chart):',
          JSON.stringify(response.data.outfit_frequency, null, 2),
        );
        console.log(
          'Monthly Closet Spend (bar chart):',
          JSON.stringify(response.data.monthly_closet_spend, null, 2),
        );
        setInsightData(response.data);
        console.log('--- Closet Insights Diagnostic ---', {
          availableKeys: Object.keys(response.data),
          closetComposition: response.data.closetComposition,
          closet_growth: response.data.closet_growth,
          outfit_frequency: response.data.outfit_frequency,
          monthly_closet_spend: response.data.monthly_closet_spend,
          mostWornCategory: response.data.mostWornCategory,
          mostWornCount: response.data.mostWornItems?.length || 0,
          leastWornCount: response.data.leastWornItems?.length || 0,
          neverWornCount: response.data.neverWornItems?.length || 0,
        });
      }
    } catch (error) {
      console.log('Error fetching closet insights:', error);
    } finally {
      setLoading(false);
    }
  };

  // We no longer use a global guard for readyToRender to ensure a smooth transition.
  // The screen structure will render immediately, and sections will show loaders.

  const renderLoader = (height = hp(10)) => (
    <View style={{ height, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="small" color={Colors.themeColor} />
    </View>
  );

  const data = insightData || {}; 
  const itemsToShow =
    activeTab === 'Most Worn'
      ? data.mostWornItems
      : activeTab === 'Least Worn'
        ? data.leastWornItems
        : data.neverWornItems;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.backGroundColor1 }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <Header
        showLeftButton={true}
        onLeftButtonPress={() => navigation.goBack()}
        title="Closet Insights"
        backgroundColor={Colors.white}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingTop: wp(5) }]}
      >
        {/* Total Outfit Value Gradient Card */}
        <LinearGradient
          colors={[Colors.gradientPurple1, Colors.gradientPurple2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.totalValueCard}
        >
          {loading ? (
            <View style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="small" color={Colors.white} />
            </View>
          ) : (
            <View style={{ marginTop: -hp(0), paddingHorizontal: wp(6) }}>
              <Text style={styles.totalValueTitle}>Total closet Value</Text>
              <Text style={styles.totalValueAmount}>
                ₹{data.total_closet_value || 0}
              </Text>
            </View>
          )}
        </LinearGradient>

        {/* Summary Cards 2x2 Grid */}
        <View style={styles.summaryRow}>
          {loading ? (
            <View style={{ flex: 1, height: hp(20), justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="small" color={Colors.themeColor} />
            </View>
          ) : (
            <>
              <View style={styles.summaryCard}>
                <View
                  style={[styles.iconContainer, { backgroundColor: '#FFF9E5' }]}
                >
                  <Image
                    source={imagePath.Shirticon}
                    style={{
                      width: wp(5.5),
                      height: wp(5.5),
                      tintColor: '#FFB800',
                    }}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.summaryValue}>{data.total_clothing || 0}</Text>
                <Text style={styles.summaryLabel}>Total Clothing</Text>
              </View>

              {/* <View style={styles.summaryCard}>
                <View
                  style={[styles.iconContainer, { backgroundColor: '#FDF0FF' }]}
                >
                  <Image
                    source={imagePath.shoeIcon}
                    style={{
                      width: wp(5.5),
                      height: wp(5.5),
                      tintColor: '#E156F9',
                    }}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.summaryValue}>{data.footwearCount || 0}</Text>
                <Text style={styles.summaryLabel}>Total Footwear</Text>
              </View> */}

              {/* <View style={styles.summaryCard}>
                <View
                  style={[styles.iconContainer, { backgroundColor: '#F0F4FF' }]}
                >
                  <Image
                    source={imagePath.glassesInsight}
                    style={{
                      width: wp(5.5),
                      height: wp(5.5),
                      tintColor: '#5C67EA',
                    }}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.summaryValue}>
                  {data.accessoriesCount || 0}
                </Text>
                <Text style={styles.summaryLabel}>Total Accessories</Text>
              </View> */}

              <View style={styles.summaryCard}>
                <View
                  style={[styles.iconContainer, { backgroundColor: '#F0FFF4' }]}
                >
                  <Image
                    source={imagePath.pantInsight}
                    style={{
                      width: wp(5.5),
                      height: wp(5.5),
                      tintColor: '#34A853',
                    }}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.summaryValue}>{data.total_outfit || 0}</Text>
                <Text style={styles.summaryLabel}>Outfits Created</Text>
              </View>
            </>
          )}
        </View>

        {/* Closet Composition */}
        <View style={[styles.chartContainer, { marginTop: hp(2.5) }]}>
          <Text style={styles.sectionTitle}>Closet Composition</Text>
          {loading ? (
            renderLoader(hp(20))
          ) : (
            <DonutChart
              data={data.closetComposition || []}
              colors={CHART_PALETTE}
            />
          )}
        </View>

        {/* Most Worn Categories */}
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Most Worn Categories</Text>
          {loading ? (
            renderLoader(hp(20))
          ) : (
            <BarChart
              data={data.mostWornCategory || []}
              xKey="name"
              yKey="totalWearCount"
              color="#4ECDC4"
            />
          )}
        </View>

        {/* Items Toggle & List */}
        <View style={styles.toggleCardContainer}>
          <View style={styles.toggleContainer}>
            {['Most Worn', 'Least Worn', 'Never Worn'].map(tab => {
              const isActive = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  style={[styles.toggleButton, isActive && styles.activeToggle]}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      isActive
                        ? styles.activeToggleText
                        : styles.inactiveToggleText,
                    ]}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {loading ? (
            renderLoader(hp(15))
          ) : itemsToShow && itemsToShow.length > 0 ? (
            console.log("itemsToShow", JSON.stringify(itemsToShow)),
            itemsToShow.map((item, index) => (
              <TouchableOpacity
                onPress={() => { navigation.navigate("ClosetDetails", { item: item }) }}
                key={item._id || index} style={styles.itemCard}>
                <Image
                  source={
                    item.images && item.images[0]
                      ? { uri: item.images[0] }
                      : imagePath.outfit
                  }
                  style={styles.itemImage}
                />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View
              style={[{ height: hp(10), justifyContent: 'center', alignItems: 'center' }]}
            >
              <Text style={styles.noDataText}>No data available</Text>
            </View>
          )}
        </View>
        <View style={{ height: hp(2) }} />

        {/* Closet Growth */}
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Closet Growth</Text>
          {loading ? (
            renderLoader(hp(20))
          ) : (
            <LineChart
              data={data.closet_growth || []}
              xKey="month"
              yKey="count"
              color="#FF9F1C"
            />
          )}
        </View>

        {/* Outfit Frequency */}
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Outfit Frequency</Text>
          {loading ? (
            renderLoader(hp(20))
          ) : (
            <LineChart
              data={data.outfit_frequency || []}
              xKey="month"
              yKey="count"
              color="#4ECDC4"
            />
          )}
        </View>

        {/* Monthly Closet Spend */}
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Monthly Closet Spend</Text>
          {loading ? (
            renderLoader(hp(20))
          ) : (
            <BarChart
              data={data.monthly_closet_spend || []}
              xKey="month"
              yKey="spend"
              color="#4ECDC4"
            />
          )}
        </View>

        {/* Most Owned Brand */}
        <View style={[styles.brandCardContainer, { marginBottom: hp(4) }]}>
          <Text style={styles.brandCardTitle}>Most Owned Brand</Text>
          {loading ? (
            renderLoader(hp(10))
          ) : data.mostOwnedBrand && data.mostOwnedBrand.length > 0 ? (
            data.mostOwnedBrand.slice(0, 5).map((brand, index) => (
              <View key={index} style={styles.brandCard}>
                <View>
                  <Text style={styles.brandName}>{brand.brand_name}</Text>
                  {/* <Text style={styles.brandCategory}>{brand.category}</Text> */}
                </View>
                <View style={styles.brandBadge}>
                  <Text style={styles.brandBadgeText}>{brand.totalCount || 0} Items</Text>
                </View>
              </View>
            ))
          ) : (
            <View
              style={[{ height: hp(10), justifyContent: 'center', alignItems: 'center' }]}
            >
              <Text style={styles.noDataText}>No data available</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ClosetInsightScreen;
