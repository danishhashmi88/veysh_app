import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { imagePath } from '../../../constant/imagePath';
import { wp, hp } from '../../../utils/helper';
import { Colors } from '../../../constant/colors';
import { FontFamily, FontSize, OutfitFamily } from '../../../constant/fonts';

// Reusable card component used in HomeScreen and MyCloset
export const OutfitCard = ({ item, index = 0, styles, onPress, IMAGEURL }) => {
  if (!item) return null;

  const imageUri = item?.images?.[0] || item?.image;
  const title = item?.name || item?.title;
  const price = item?.purchase_rent_price || item?.price || 0;

  const getSource = () => {
    if (typeof imageUri === 'string') {
      if (imageUri.startsWith('http')) return { uri: imageUri };
      return { uri: `${IMAGEURL}${imageUri}` };
    }
    return imageUri || imagePath.placeholder;
  };

  return (
    <TouchableOpacity
      style={styles.buyOutfitCard}
      activeOpacity={0.9}
      onPress={() => onPress?.(item)}
    >
      <View style={{ backgroundColor: '#EDEBF3', overflow: 'hidden' }}>
        <Image
          source={getSource()}
          style={styles.buyOutfitImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.buyOutfitContent}>
        <Text style={styles.buyOutfitTitle} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.buyOutfitPrice}>₹{price}</Text>
      </View>
    </TouchableOpacity>
  );
};

const BuyOutfits = ({ styles, data, handleNavigation, IMAGEURL }) => (
  <View style={styles.sectionContainer}>
    <View style={styles.sectionTitleRow}>
      <Text style={styles.sectionTitle}>Pre~loved</Text>
      <TouchableOpacity
        onPress={() => handleNavigation('RentBuyScreen')}
        style={{ flexDirection: 'row', alignItems: 'center' }}
      >
        <Text style={styles.changeText}>View All</Text>
        <Image
          source={imagePath.chevronDown}
          style={[styles.headerChevron, { transform: [{ rotate: '270deg' }] }]}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={(data || []).slice(0, 5)}
      keyExtractor={(item, index) =>
        item?._id?.toString() || item?.id?.toString() || index.toString()
      }
      ListEmptyComponent={() => (
        <View
          style={{
            width: wp(90),
            backgroundColor: Colors.white,
            height: hp(15),
            borderRadius: wp(4),
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View style={{
            width: wp(10),
            height: wp(10),
            borderRadius: wp(3),
            backgroundColor: Colors?.bgGrey,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: hp(1),
          }}>
            <Image source={imagePath.shopping_bag} style={{
              width: wp(6),
              height: wp(6),
              tintColor: Colors.greyVar1,
            }} />
          </View>
          <Text
            style={{
              fontSize: FontSize.FONT_21,
              fontFamily: FontFamily?.Bold, color: Colors.graytext
            }}
          >
            No data found
          </Text>
        </View>
      )}
      renderItem={({ item, index }) => (
        <OutfitCard
          item={item}
          index={index}
          styles={styles}
          IMAGEURL={IMAGEURL}
          onPress={() => handleNavigation('RentItemDetail', { item })}
        />
      )}
    />
  </View>
);

export default BuyOutfits;
