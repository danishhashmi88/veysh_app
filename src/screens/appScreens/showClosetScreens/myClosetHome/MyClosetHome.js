import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity, // Sirf cards aur list items ke liye
  FlatList,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import styles from './styles';
import Header from '../../../../component/common/UI/Header';
import { imagePath } from '../../../../constant/imagePath';
import { Colors } from '../../../../constant/colors';
import {
  getCategoryType,
  categoryIconMap,
  categoryOrder,
} from '../../../../constant/index';
import DeleteItemModal from '../../../../component/common/Modal/DeleteItemModal';
import SortModal from '../../../../component/common/Modal/SortModal';
import { useDispatch, useSelector } from 'react-redux';
import {
  getItemsList,
  deleteItem,
  getCategories,
} from '../../../../redux/thunks/itemsThunk';
import { showDangerToast, showToast } from '../../../../utils/toast';
import { hp, wp } from '../../../../utils/helper';
import { IMAGEURL } from '../../../../utils/axios';
import AppButton from '../../../../component/common/Buttons/AppButton';
import { FontSize } from '../../../../constant/fonts';

const getCategoryIcon = itemTitle => {
  if (!itemTitle) return imagePath.firstCloset;
  const type = getCategoryType(itemTitle);
  if (type === 'all' && itemTitle.toLowerCase() !== 'all') {
    return imagePath.shirt;
  }
  return categoryIconMap[type] || imagePath.shirt;
};

const getCategoryOrder = title => {
  if (typeof title !== 'string') return 4;
  if (title === 'All') return 0;
  const type = getCategoryType(title);
  if (type === 'all') return 4;
  return categoryOrder[type] || 4;
};

// 🟢 CATEGORY COMPONENT (Yahan TouchableOpacity theek hai kyunki ye list item filter hai)
const CategoryItem = React.memo(({ item, isActive, onPress }) => {
  if (!item) return null;

  const title = item?.title || 'Unknown';
  const textColor = isActive ? Colors.white : Colors.graytext;

  return (
    <TouchableOpacity style={styles.categoryItem} onPress={() => onPress(item)}>
      <View style={[styles.categoryIconBg, isActive && styles.bgActive]}>
        <Text style={[styles.categoryText, { color: textColor }]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

// 🟢 CUSTOM CLOSET CARD (Yahan TouchableOpacity zaroori hai kyunki onLongPress chahiye)
const ClosetCard = React.memo(({ item, onPress, onLongPress }) => {
  if (!item) return null;
  const title = item?.name || item?.title || 'Unknown Item';

  const brand = item?.brand_name || item?.brand_id?.name || item?.brand || '-';
  const year =
    item?.year ||
    item?.purchase_year ||
    new Date(
      item?.purchased_on || item?.purchased_date || Date.now(),
    ).getFullYear();
  const price = item?.price ?? item?.mrp ?? item?.selling_price ?? '0';

  let imageSource = imagePath.firstCloset;
  if (item.images && item.images.length > 0) {
    const imagePathStr = item.images[0];
    if (typeof imagePathStr === 'string' && imagePathStr.trim().length > 0) {
      if (imagePathStr.startsWith('http')) {
        imageSource = { uri: imagePathStr };
      } else {
        imageSource = { uri: `${IMAGEURL}${imagePathStr}` };
      }
    }
  } else if (item.image) {
    imageSource =
      typeof item.image === 'number' ? item.image : { uri: item.image };
  }

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => onPress(item)}
      onLongPress={() => onLongPress(item)}
      activeOpacity={0.9}
    >
      <Image source={imageSource} style={styles.cardImage} resizeMode="cover" />
      <View style={styles.cardDetails}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {title}
        </Text>
        {/* <Text style={styles.cardSubtitle}>
          {brand} • {year}
        </Text> */}
        <Text style={styles.cardPrice}>₹{price}</Text>
      </View>
    </TouchableOpacity>
  );
});

// 🟢 EMPTY STATE
const EmptyState = React.memo(({ searchText, currentFilters }) => {
  const isFiltered =
    searchText || (currentFilters && Object.keys(currentFilters).length > 0);
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.iconContainer}>
        <Image
          source={imagePath.shirt_filled}
          style={styles.icon}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.emptyTitle}>
        {'No item found'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {'Closet looks empty. Add your first item now.'}
      </Text>
    </View>
  );
});

const MyClosetHome = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const [searchText, setSearchText] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({});
  console.log("curent fil", currentFilters)
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [currentSort, setCurrentSort] = useState({
    column: 'price_sort',
    order: 1,
  });
  const justAppliedFilter = useRef(false);

  const {
    itemsList = [],
    ItemCategoryList = [],
    loading,
  } = useSelector(state => state.items);

  useEffect(() => {
    dispatch(getCategories({ type: 'item' }));
  }, []);

  const allCategories = React.useMemo(() => {
    return (Array.isArray(ItemCategoryList) ? ItemCategoryList : [])
      .filter(cat => cat && typeof cat === 'object')
      .map(cat => ({ ...cat, icon: getCategoryIcon(cat?.title) }))
      .sort((a, b) => getCategoryOrder(a?.title) - getCategoryOrder(b?.title));
  }, [ItemCategoryList]);
  const allCategoryIcon = React.useMemo(
    () => ({
      _id: 'ALL',
      title: 'All',
      icon: imagePath.firstCloset,
    }),
    [],
  );

  const [activeCategoryId, setActiveCategoryId] = useState('ALL');

  const handleCategoryPress = React.useCallback(
    item => {
      if (!item?._id) return;
      setActiveCategoryId(String(item._id));
      const newFilters = { ...currentFilters };

      if (item._id === 'ALL') {
        delete newFilters.category;
      } else {
        newFilters.category = item._id;
      }

      setCurrentFilters(newFilters);

      const payload = {
        global_search: searchText || '',
        page: 1,
        per_page: 50,
        sort: currentSort,
        search: Object.keys(newFilters).length > 0 ? newFilters : undefined,
      };

      dispatch(getItemsList(payload));
    },
    [currentFilters, searchText, currentSort, dispatch],
  );

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleLongPressItem = React.useCallback(item => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  }, []);

  const confirmDelete = async () => {
    if (!itemToDelete?._id) return;
    setShowDeleteModal(false);
    try {
      const resultAction = await dispatch(deleteItem(itemToDelete._id));
      if (deleteItem.fulfilled.match(resultAction)) {
        showToast('Item deleted successfully');
      } else {
        showDangerToast(resultAction.payload || 'Failed to delete item');
      }
    } catch (error) {
      showDangerToast('An error occurred');
    }
  };

  useEffect(() => {
    if (isFocused) {
      if (justAppliedFilter.current) {
        justAppliedFilter.current = false;
        return;
      }
      const payload = {
        global_search: searchText || '',
        page: 1,
        per_page: 50,
        sort: currentSort,
        search:
          Object.keys(currentFilters).length > 0 ? currentFilters : undefined,
      };
      dispatch(getItemsList(payload));
    }
  }, [isFocused]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const payload = {
        global_search: searchText || '',
        page: 1,
        per_page: 50,
        sort: currentSort,
        search:
          Object.keys(currentFilters).length > 0 ? currentFilters : undefined,
      };
      dispatch(getItemsList(payload));
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchText]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      <Header
        backgroundColor={Colors.white}
        leftComponent={
          <Text numberOfLines={1} style={styles.headerTitle}>
            My Closet
          </Text>
        }
        rightComponent={
          <View style={styles.headerIconsRow}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => setShowSearchInput(!showSearchInput)}
            >
              <Image source={imagePath.searchImage} style={styles.actionIcon} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() =>
                navigation.navigate('FilterClosetData', {
                  initialFilters: currentFilters,
                  onApply: filters => {
                    justAppliedFilter.current = true;
                    setCurrentFilters(filters);
                    dispatch(
                      getItemsList({
                        global_search: searchText,
                        page: 1,
                        per_page: 50,
                        search: filters || {},
                        sort: currentSort,
                      }),
                    );
                  },
                })
              }
            >
              <Image source={imagePath.filterIcon} style={styles.actionIcon} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => setIsSortModalOpen(true)}
            >
              <Image
                source={imagePath.sortIcon}
                style={styles.actionIcon}
              />
            </TouchableOpacity>
          </View>
        }
      />

      <View style={styles.topSection}>
        {showSearchInput && (
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Image
                source={imagePath.search}
                style={[styles.actionIcon, { tintColor: Colors?.greyDark2 }]}
                resizeMode="contain"
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search"
                placeholderTextColor={Colors.greyDark2}
                value={searchText}
                onChangeText={setSearchText}
                autoFocus
              />
            </View>
          </View>
        )}

        <View style={styles.categoryListContainer}>
          <CategoryItem
            item={allCategoryIcon}
            isActive={activeCategoryId === 'ALL'}
            onPress={handleCategoryPress}
          />
          <FlatList
            data={allCategories}
            renderItem={({ item }) => (
              <CategoryItem
                item={item}
                isActive={activeCategoryId === String(item?._id)}
                onPress={handleCategoryPress}
              />
            )}
            keyExtractor={(item, index) =>
              item?._id ? String(item._id) : String(index)
            }
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>

      {/* 🟢 LOWER SECTION */}
      <FlatList
        key={`list-${activeCategoryId}`}
        data={itemsList}
        renderItem={({ item }) => (
          <ClosetCard
            item={item}
            onPress={i => navigation.navigate('ClosetDetails', { item: i })}
            onLongPress={handleLongPressItem}
          />
        )}
        keyExtractor={(item, index) =>
          item?._id ? String(item._id) : String(index)
        }
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          paddingHorizontal: wp(4),
        }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: hp(15),
          paddingTop: hp(2),
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              searchText={searchText}
              currentFilters={currentFilters}
            />
          ) : null
        }
      />
      <TouchableOpacity
        style={styles.chatWidget}
        onPress={() =>
          navigation.navigate('AiHomeScreen', {
            initialMessage: '',
            isScanning: true,
          })
        }
      >
        <Image source={imagePath.BaeAIcon} style={styles.messIcon} />
      </TouchableOpacity>

      <AppButton
        style={styles.fabBtn}
        onPress={() => navigation.navigate('AddItemDetails')}
        title={"+"}
      />

      <DeleteItemModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={confirmDelete}
      />
      <SortModal
        visible={isSortModalOpen}
        onClose={() => setIsSortModalOpen(false)}
        currentSort={currentSort}
        onApply={newSort => {
          setCurrentSort(newSort);
          setIsSortModalOpen(false);
          dispatch(
            getItemsList({
              global_search: searchText || '',
              page: 1,
              per_page: 50,
              search: currentFilters || {},
              sort: newSort,
            }),
          );
        }}
      />
    </View>
  );
};

export default MyClosetHome;
