import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../hooks/useTheme';
import { wp, hp } from '../../../utils/helper';
import { imagePath } from '../../../constant/imagePath';
import Header from '../../../component/common/UI/Header';
import { FontSize, FontFamily } from '../../../constant/fonts';
import { getRentItemsListApi } from '../../../services/user.service';
import NoDataText from '../../../component/common/UI/NoDataText';

const RentBuyScreen = () => {
  const navigation = useNavigation();
  const Colors = useTheme();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log("item ssi", items)
  useEffect(() => {
    fetchRentItems();
  }, []);

  const fetchRentItems = async () => {
    try {
      setLoading(true);
      const res = await getRentItemsListApi();
      const rentItems =
        res?.data?.data?.rent_items || res?.data?.rent_items || [];
      const rentOutfits =
        res?.data?.data?.rent_outfits || res?.data?.rent_outfits || [];

      // Combine items and outfits, adding a type flag if needed for navigation/details
      const combinedList = [
        ...rentItems.map(item => ({ ...item, type: 'item' })),
        ...rentOutfits.map(outfit => ({ ...outfit, type: 'outfit' })),
      ];

      setItems(combinedList);
    } catch (e) {
      console.log('RentBuyScreen error:', e);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    const imageUri = item?.images?.[0] || null;
    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: Colors.white }]}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('RentItemDetail', { item })}
      >
        <View style={[styles.imageWrapper, { backgroundColor: '#EDEBF3' }]}>
          <Image
            source={imageUri ? { uri: imageUri } : imagePath.placeholder}
            style={styles.itemImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.info}>
          <Text
            style={[styles.name, { color: Colors.black }]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text style={[styles.price, { color: Colors.themeColor }]}>
            ₹{item.purchase_rent_price ?? item.price ?? 0}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <NoDataText
      source={imagePath.outfitHome}
      title={'No items or outfits found'}
      subTitle={'You don’t have any items or outfits available for rent / purchase'}
    />
  );

  return (
    <View
      style={[styles.container, { backgroundColor: Colors.backGroundColor1 }]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <Header
        showLeftButton={true}
        onLeftButtonPress={() => navigation.goBack()}
        title="Rent / Buy"
        backgroundColor={Colors.white}
      />

      {loading ? (
        <ActivityIndicator
          size="large"
          color={Colors.themeColor}
          style={{ marginTop: hp(10) }}
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => item._id?.toString()}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={[
            styles.list,
            items.length === 0 && styles.emptyList,
          ]}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(5),
    paddingVertical: hp(1.5),
    gap: wp(4),
  },
  headerTitle: {
    fontFamily: FontFamily.Bold,
    fontSize: FontSize.FONT_26,
  },
  list: {
    padding: wp(3),
    paddingBottom: hp(5),
  },
  emptyList: { flex: 1 },
  row: {
    justifyContent: 'space-between',
    marginBottom: hp(1.5),
  },
  card: {
    width: wp(44),
    borderRadius: wp(4),
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 1,
  },
  imageWrapper: {
    width: '100%',
    height: hp(22),
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  info: { padding: wp(3) },
  name: {
    fontFamily: FontFamily.OutfitMedium,
    fontSize: FontSize.FONT_14,
    marginBottom: hp(0.3),
  },
  price: {
    fontFamily: FontFamily.OutfitMedium,
    fontSize: FontSize.FONT_14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: FontFamily.OutfitRegular,
    fontSize: FontSize.FONT_14,
    textAlign: 'center',
  },
});

export default RentBuyScreen;
