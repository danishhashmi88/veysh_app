import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Platform,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { useNavigation, useIsFocused, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles';
import { imagePath } from '../../../../constant/imagePath';
import { Colors } from '../../../../constant/colors';
import {
  deleteOutfit,
  getOutfitsList,
} from '../../../../redux/thunks/outfitsThunk';
import DeleteItemModal from '../../../../component/common/Modal/DeleteItemModal';
import { showToast, showDangerToast } from '../../../../utils/toast';
import Header from '../../../../component/common/UI/Header';
import { IMAGEURL } from '../../../../utils/axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import NoDataText from '../../../../component/common/UI/NoDataText';

const OutfitHome = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const route = useRoute();
  const { isSelectionMode } = route.params || {};

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const outfitsList = useSelector(state => state.outfits.outfitsList);
  const loading = useSelector(state => state.outfits.loading);
  const success = useSelector(state => state.outfits.success);
  const { userDetails } = useSelector(state => state.user);
  console.log("outfitsList", outfitsList)

  const filteredOutfits = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return outfitsList || [];

    return (outfitsList || []).filter(outfit => {
      const name = (outfit.name || '').toLowerCase();
      const description = (outfit.description || outfit.caption || '').toLowerCase();
      return name.includes(query) || description.includes(query);
    });
  }, [outfitsList, searchText]);

  // Fetch outfits when screen comes into focus
  useEffect(() => {
    if (isFocused) {
      fetchOutfits();
    }
  }, [isFocused]);

  const fetchOutfits = async (isPullRefresh = false) => {
    if (loading && !isPullRefresh) {
      return;
    }

    if (isPullRefresh) setIsRefreshing(true);
    console.log('[OutfitHome] dispatching getOutfitsList API call');
    const payload = {
      page: 1,
      per_page: 100,
      search: {},
      sort: { column: 'createdAt', order: -1 },
    };
    try {
      await dispatch(getOutfitsList(payload));
    } finally {
      if (isPullRefresh) setIsRefreshing(false);
    }
  };

  const handleDeletePress = outfitId => {
    setItemToDelete({ _id: outfitId });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete?._id) return;
    setShowDeleteModal(false);

    try {
      const resultAction = await dispatch(deleteOutfit(itemToDelete._id));
      if (deleteOutfit.fulfilled.match(resultAction)) {
        showToast('Outfit deleted successfully');
      } else {
        showDangerToast(resultAction.payload || 'Failed to delete outfit');
      }
    } catch (error) {
      showDangerToast('An error occurred');
    } finally {
      setItemToDelete(null);
    }
  };

  const handleEditPress = item => {
    navigation.navigate('AddOutfitDetails', { outfitData: item });
  };

  const handleNavigation = screenName => {
    if (screenName === 'CreateOutfit') {
      navigation.navigate('CreateOutfit');
    } else {
      navigation.navigate(screenName);
    }
  };

  const renderItem = ({ item }) => {
    const title = item.name || 'Untitled';

    let imageSource = imagePath.placeholder;
    let imgPath = item.image;

    if (!imgPath && item.images && item.images.length > 0) {
      imgPath = item.images[0];
    }

    if (imgPath) {
      if (imgPath.startsWith('http')) {
        imageSource = { uri: imgPath };
      } else {
        let formattedPath = imgPath;
        if (!formattedPath.includes('uploads/')) {
          formattedPath = `uploads/outfits/${formattedPath}`;
        }
        imageSource = { uri: `${IMAGEURL}${formattedPath}` };
      }
    }

    const price = item?.price ?? item?.selling_price ?? '0';

    return (
      <TouchableOpacity
        style={styles.gridItem}
        onPress={() => {
          if (isSelectionMode) {
            navigation.navigate('CreatePlanner', {
              selectedOutfit: item._id,
              selectedOutfitImage: item.image || (item.images && item.images.length > 0 ? item.images[0] : null)
            });
          } else {
            navigation.navigate('OutfitDetail', { outfitId: item._id });
          }
        }}
        activeOpacity={0.7}
      >
        <Image
          source={imageSource}
          style={styles.itemImage}
          resizeMode="cover"
        />
        <View style={styles.itemTitleContainer}>
          <Text style={styles.itemTitle} numberOfLines={1}>
            {title}
          </Text>
          {/* <Text style={styles.itemPrice}>₹{price}</Text> */}
        </View>
      </TouchableOpacity>
    );
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
        title={isSelectionMode ? "Select Outfit" : "My Outfits"}
        backgroundColor={Colors.white}
      />

      <SafeAreaView
        style={{ flex: 1, backgroundColor: Colors.backGroundColor1 }}
        edges={['left', 'right', 'bottom']}
      >
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Image
              source={imagePath.search}
              style={styles.searchIcon}
              resizeMode="contain"
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search outfits"
              placeholderTextColor={Colors.greyDark2}
              value={searchText}
              onChangeText={setSearchText}
              returnKeyType="search"
              autoCorrect={false}
            />
            {searchText.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchText('')}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.clearSearchText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {loading && outfitsList?.length === 0 ? (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <ActivityIndicator size="large" color={Colors.black} />
          </View>
        ) : (
          <>
            {outfitsList?.length === 0 && success ? (
              <NoDataText
                source={imagePath.outfit}
                title={'No outfits found'}
                subTitle={'Start creating your own outfits!'}
              />
            ) : filteredOutfits?.length === 0 ? (
              <NoDataText
                source={imagePath.search}
                title={'No outfits found'}
                subTitle={`No results for "${searchText.trim()}"`}
              />
            ) : (
              <FlatList
                data={filteredOutfits}
                renderItem={renderItem}
                keyExtractor={item => item._id}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                refreshing={isRefreshing}
                onRefresh={() => fetchOutfits(true)}
                removeClippedSubviews={false}
                extraData={filteredOutfits}
              />
            )}
          </>
        )}

        <View style={styles.fabContainer} pointerEvents="box-none">
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('CreateOutfit')}
          >
            <Image
              source={imagePath.plusbuttom}
              style={styles.fabImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <DeleteItemModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={confirmDelete}
      />
    </View>
  );
};

export default OutfitHome;
