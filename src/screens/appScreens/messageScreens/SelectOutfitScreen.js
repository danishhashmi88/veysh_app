import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { wp, hp, getImageUrl } from '../../../utils/helper';
import { Colors } from '../../../constant/colors';
import { imagePath } from '../../../constant/imagePath';
import styles from './styles';
import AppButton from '../../../component/common/Buttons/AppButton';
import Header from '../../../component/common/UI/Header';
import { FontFamily, FontSize } from '../../../constant/fonts';
import { getOutfitsList } from '../../../redux/thunks/outfitsThunk';
import NoDataText from '../../../component/common/UI/NoDataText';


const SelectOutfitScreen = () => {
  const navigation = useNavigation();
  const route = useRoute(); // Added useRoute
  const { user } = route.params || {}; // Get original user
  const dispatch = useDispatch();
  const { outfitsList, loading } = useSelector(state => state.outfits);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const payload = {
      page: 1,
      per_page: 100,
      search: {},
      sort: { column: 'createdAt', order: -1 },
    };
    dispatch(getOutfitsList(payload));
  }, []);

  const renderItem = ({ item }) => {
    const isSelected = selectedId === item._id;
    const outfitImage = Array.isArray(item?.images) && item?.images?.length > 0
      ? getImageUrl(item.images[0])
      : imagePath.placeholder;

    const title = item.name || 'Untitled';
    const price = item?.price ?? item?.selling_price ?? '0';

    return (
      <TouchableOpacity
        style={[styles.outfitCard, isSelected && styles.selectedCard]}
        onPress={() => setSelectedId(item._id)}
        activeOpacity={0.8}
      >
        <Image
          source={typeof outfitImage === 'string' ? { uri: outfitImage } : outfitImage}
          style={styles.outfitGridImage}
          resizeMode="cover"
        />
        <View style={styles.outfitDetails}>
          <Text style={styles.outfitName} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.outfitPrice}>₹{price}</Text>
        </View>
        {isSelected && (
          <View style={styles.checkBadge}>
            <Image source={imagePath.white_tick} style={styles.checkIcon} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const handleSend = () => {
    const selectedOutfit = outfitsList.find(o => o._id === selectedId);
    if (selectedOutfit) {
      // First, pop the current screen
      navigation.goBack();
      // Then navigate to ChatScreen with the and the newly selected outfit
      // This ensures we jump back to the existing Chat instance with updated params
      navigation.navigate('ChatScreen', { selectedOutfit, user });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      <Header
        showLeftButton={true}
        onLeftButtonPress={() => navigation.goBack()}
        title="Select Outfit"
        headerTextStyle={{
          fontSize: FontSize.FONT_26,
          fontFamily: FontFamily.Bold,
          color: Colors.black,
        }}
        backgroundColor={Colors.white}
      />
      {outfitsList?.length === 0 ? (
        <NoDataText
          source={imagePath.outfit}
          title={'No outfits found'}
          iconStyle={{ backgroundColor: Colors.greyDark }}
          subTitle={'Start creating your own outfits!'}
        />
      ) : (
        <FlatList
          data={outfitsList}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapperGrid}
          contentContainerStyle={styles.outfitGridContainer}
          showsVerticalScrollIndicator={false}
        />)}

      {/* Footer */}
      <View style={styles.footer}>
        <AppButton
          style={[
            styles.footerSendButton,
            !selectedId && styles.disabledButton,
          ]}
          onPress={handleSend}
          disabled={!selectedId}
          title="Send"
        />
      </View>
    </View>
  );
};

export default SelectOutfitScreen;
