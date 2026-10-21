import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../../hooks/useTheme';
import { wp, hp } from '../../../utils/helper';
import { imagePath } from '../../../constant/imagePath';
import Back from '../../../component/common/Buttons/Back';
import { FontSize, FontFamily, OutfitFamily } from '../../../constant/fonts';
import { getRentItemsDetailsApi } from '../../../services/user.service';
import moment from 'moment';
import { Colors } from '../../../constant/colors';
import AppButton from '../../../component/common/Buttons/AppButton';
import Header from '../../../component/common/UI/Header';
import { onShareNative } from '../../../utils/helper';

const { width } = Dimensions.get('window');

const RentItemDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const Colors = useTheme();
  const { item: initialItem } = route.params || {};

  const [item, setItem] = useState(initialItem);
  console.log("itm e isss", item)
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  useEffect(() => {
    if (initialItem?._id) {
      fetchItemDetails();
    }
  }, [initialItem?._id]);

  const fetchItemDetails = async () => {
    try {
      setLoading(true);
      const res = await getRentItemsDetailsApi({ o_id: initialItem._id });
      if (res?.success) {
        setItem(res.data);
      }
    } catch (e) {
      console.log('RentItemDetail error:', e);
    } finally {
      setLoading(false);
    }
  };

  const images = item?.images || [];

  const onScroll = event => {
    const slide = Math.ceil(
      event.nativeEvent.contentOffset.x /
      event.nativeEvent.layoutMeasurement.width,
    );
    if (slide !== activeImageIndex) {
      setActiveImageIndex(slide);
    }
  };

  const renderDetailRow = (label, value) => (
    <View style={styles.detailRow}>
      <Text style={[styles.detailLabel, { color: Colors.graytext }]}>
        {label}:
      </Text>
      <Text style={[styles.detailValue, { color: Colors.black }]}>
        {value || 'N/A'}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: Colors.white }]}>
      <Header
        title="Item detail"
        showLeftButton={true}
        onLeftButtonPress={() => navigation.goBack()}
        backgroundColor={Colors.white}

      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: hp(18) }}
      >
        {/* Header Image Carousel */}
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
          >
            {images.length > 0 ? (
              images.map((img, index) => (
                <Image
                  key={index}
                  source={{ uri: img }}
                  style={styles.mainImage}
                  resizeMode="contain"
                  resizeMethod="resize"
                />
              ))
            ) : (
              <Image
                source={imagePath.placeholder}
                style={styles.mainImage}
                resizeMode="cover"
              />
            )}
          </ScrollView>

          {/* Carousel dots */}
          <View style={styles.pagination}>
            {images.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      i === activeImageIndex
                        ? Colors.white
                        : 'rgba(255,255,255,0.5)',
                  },
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.content}>
          {/* Category breadcrumb */}
          <View
            style={[
              styles.categoryPill,
              { backgroundColor: Colors.baeInternalColor },
            ]}
          >
            <Text style={[styles.categoryText, { color: '#9333EA' }]}>
              {item?.category?.title || 'Category'}
              {item?.sub_category?.title ? ` · ${item.sub_category.title}` : ''}
            </Text>
          </View>

          <Text style={[styles.itemName, { color: Colors.blackVar2 }]}>
            {item?.name}
          </Text>
          <Text style={styles.itemPrice}>
            ₹
            {item?.purchase_rent_price?.toLocaleString() ||
              item?.price?.toLocaleString() ||
              0}
          </Text>
          <Text style={styles.depositText}>
            Deposit (for rent): ₹{item?.purchase_rent_deposit_price || 200}
          </Text>

          {/* Quick Info Bar */}
          <View
            style={[styles.quickInfoBar, { backgroundColor: Colors.bgGrey }]}
          >
            <View style={styles.quickInfoItem}>
              <View style={styles.labelRow}>
                <View
                  style={[
                    styles.colorDot,
                    {
                      backgroundColor:
                        (item?.colors && item?.colors.length > 0)
                        && item?.colors[0]

                    },
                  ]}
                />
                <Text style={[styles.quickInfoValue, { color: Colors.black }]}>
                  {(item?.colors && item.colors.length > 0)
                    ? item?.colors[0].charAt(0).toUpperCase() + item?.colors[0].slice(1)
                    : "-"}
                </Text>
              </View>
              <Text style={[styles.quickInfoLabel, { color: Colors.graytext }]}>
                Color
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.quickInfoItem}>
              <Text style={[styles.quickInfoValue, { color: Colors.black }]}>
                {item?.size || 'XL'}
              </Text>
              <Text style={[styles.quickInfoLabel, { color: Colors.graytext }]}>
                Size
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.quickInfoItem}>
              <Text style={[styles.quickInfoValue, { color: Colors.black }]}>
                {item?.wear_count || 0}
              </Text>
              <Text style={[styles.quickInfoLabel, { color: Colors.graytext }]}>
                Wear Count
              </Text>
            </View>
          </View>

          {/* Details Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionHeading, { color: Colors.black }]}>
              Details
            </Text>

            {renderDetailRow('Owner Name', item?.createdBy?.full_name || item?.createdBy?.username || 'Anonymous')}
            {renderDetailRow('Owner Email', item?.createdBy?.email || 'N/A')}
            {renderDetailRow('Fabric', item?.fabric || 'Cotton')}
            {renderDetailRow('Brand', item?.brand_name || 'Gucci')}
            {renderDetailRow(
              'Date of purchase',
              item?.purchased_on
                ? moment(item.purchased_on).format('Do MMM YYYY')
                : '-',
            )}
            {/* {renderDetailRow('Location', item?.location || 'New Delhi, India')} */}
          </View>

          {/* Description Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionHeading, { color: Colors.black }]}>
              Description
            </Text>
            <Text style={[styles.descriptionText, { color: Colors.graytext }]}>
              {item?.description || 'No description provided.'}
            </Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <AppButton
          title="Contact Now"
          onPress={() => {
            navigation.navigate('ContactUsDetails', {
              item: item,
            });
          }}
          width={wp(90)}
          loading={loading}
          disabled={loading}
        />

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageContainer: {
    width: width,
    height: hp(40),
    position: 'relative',
    backgroundColor: '#fff',
  },
  mainImage: {
    width: width,
    height: hp(40),
  },
  actionButton: {
    width: wp(10),
    height: wp(10),
    backgroundColor: Colors.bgGrey,
    borderRadius: wp(5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    width: wp(5),
    height: wp(5),
    tintColor: Colors.black,
  },
  pagination: {
    position: 'absolute',
    bottom: hp(2),
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: wp(1.5),
  },
  dot: {
    width: wp(2),
    height: wp(2),
    borderRadius: wp(1),
  },
  content: {
    padding: wp(5),
    paddingTop: hp(2),
  },
  categoryPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    borderRadius: wp(4),
    marginBottom: hp(1.5),
  },
  categoryText: {
    fontFamily: OutfitFamily.Medium,
    fontSize: FontSize.FONT_12,
  },
  itemName: {
    fontFamily: FontFamily.Bold,
    fontSize: FontSize.FONT_22,
    marginBottom: hp(0.5),
  },
  itemPrice: {
    fontFamily: OutfitFamily.Regular,
    fontSize: FontSize.FONT_18,
    marginBottom: hp(0.5),
    color: Colors.black,
  },
  depositText: {
    fontFamily: OutfitFamily.Regular,
    fontSize: FontSize.FONT_14,
    marginBottom: hp(3),
    color: Colors.themeColor,
  },
  quickInfoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: wp(4),
    paddingVertical: hp(1.5),
    marginBottom: hp(4),
  },
  quickInfoItem: {
    flex: 1,
    alignItems: 'center',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1.5),
  },
  colorDot: {
    width: wp(2.5),
    height: wp(2.5),
    borderRadius: wp(1.25),
  },
  quickInfoValue: {
    fontFamily: OutfitFamily.Regular,
    fontSize: FontSize.FONT_16,
  },
  quickInfoLabel: {
    fontFamily: OutfitFamily.Regular,
    fontSize: FontSize.FONT_12,
    marginTop: hp(0.2),
  },
  divider: {
    width: 1,
    height: hp(4),
    backgroundColor: Colors.greyBorder,
  },
  section: {
    marginBottom: hp(4),
  },
  sectionHeading: {
    fontFamily: OutfitFamily.Regular,
    fontSize: FontSize.FONT_18,
    marginBottom: hp(2),
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(1.5),
  },
  detailLabel: {
    fontFamily: OutfitFamily.Regular,
    fontSize: FontSize.FONT_14,
    flex: 1,
  },
  detailValue: {
    fontFamily: OutfitFamily.Regular,
    fontSize: FontSize.FONT_14,
    flex: 1,
    textAlign: 'right',
  },
  descriptionText: {
    fontFamily: OutfitFamily.Regular,
    fontSize: FontSize.FONT_14,
    lineHeight: 22,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: Colors.white,
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
    paddingBottom: hp(4),
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 10,
  },
  buttonWrapper: {
    width: '100%',
    height: hp(5.8),
    borderRadius: wp(4),
    overflow: 'hidden',
  },
  contactButton: {
    width: wp(90),
    height: hp(5.8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactButtonText: {
    color: Colors.white,
    fontFamily: OutfitFamily.Regular,
    fontSize: FontSize.FONT_18,
  },
});

export default RentItemDetail;
