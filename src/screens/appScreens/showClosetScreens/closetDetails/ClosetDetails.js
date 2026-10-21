import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { styles } from './styles';
import { imagePath } from '../../../../constant/imagePath';
import { Colors } from '../../../../constant/colors';

const { width } = Dimensions.get('window');

import { useDispatch, useSelector } from 'react-redux';
import { deleteItem } from '../../../../redux/thunks/itemsThunk';
import DeleteItemModal from '../../../../component/common/Modal/DeleteItemModal';
import { showToast, showDangerToast, showSuccessToast } from '../../../../utils/toast';
import { SafeAreaView } from 'react-native-safe-area-context';
import ShareModal from '../../../../component/common/Modal/ShareModal';
import { buildSharePostPayload, wp } from '../../../../utils/helper';
import { IMAGEURL } from '../../../../utils/axios';
import Header from '../../../../component/common/UI/Header';
import { EnableRentItemApi, getItemdetailApi } from '../../../../services/user.service';
import RentBuyModal from '../../../../component/common/Modal/RentBuyModal';
import { colorPaletteBrand } from '../../../../constant';

const LIGHT_COLOR_NAMES = ['white', 'cream', 'ivory', 'beige', 'platinum'];

const getItemColorSwatch = colorName => {
  const normalized = String(colorName || '').trim().toLowerCase();
  const matched = colorPaletteBrand.find(
    c => c.name.toLowerCase() === normalized,
  );
  if (matched) {
    return {
      backgroundColor: matched.colorCode,
      needsBorder: matched.showBorder,
    };
  }
  const isLight =
    LIGHT_COLOR_NAMES.includes(normalized) ||
    normalized === '#ffffff' ||
    normalized === '#fff';
  return {
    backgroundColor: normalized.startsWith('#') ? normalized : normalized,
    needsBorder: isLight,
  };
};

const ClosetDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { item: routeItem } = route.params || {};
  const [item, setItem] = useState(routeItem || null);
  console.log("item is", item)
  const { userDetails } = useSelector(state => state.user);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [rentBuyModalVisible, setRentBuyModalVisible] = React.useState(false);
  const [shareModalvisible, setSharemodalvisible] = useState({
    visible: false,
    itemDetail: '',
  });
  console.log("item sis", item)
  useEffect(() => {
    if (routeItem?._id) {
      fetchItemDetails(routeItem._id);
    }
  }, [routeItem]);

  const fetchItemDetails = async (id) => {
    try {
      const response = await getItemdetailApi(id);
      if (response?.success && response?.data) {
        setItem(response?.data);
      }
    } catch (error) {
      console.log('Error fetching item details:', error);
    }
  };

  const closeShareModal = () => {
    setSharemodalvisible({
      visible: false,
      itemDetail: '',
    });
  };

  const handleShareToFeed = () => {
    const prefillFromShare = buildSharePostPayload({ type: 'item', item });
    if (!prefillFromShare?.images?.length) {
      showDangerToast('No item image available to share');
      return;
    }
    navigation.navigate('CreatePosts', { prefillFromShare });
  };

  const handleRentBuySubmit = async (data) => {
    try {
      setRentBuyModalVisible(false);
      const formData = new FormData();
      formData.append('item_id', item?._id);
      formData.append('purchase_rent_price', data?.price);

      if (data.images && data.images.length > 0) {
        data.images.forEach((img, index) => {
          formData.append('images', {
            uri: img.uri,
            type: img.type,
            name: img.name || `image_${index}.jpg`,
          });
        });
      }

      const res = await EnableRentItemApi(formData);
      if (res?.success) {
        showSuccessToast(res?.message || 'Added to Rent/Buy list successfully');
        fetchItemDetails(item._id);
      } else {
        showDangerToast(res?.message || 'Failed to enable rent/buy');
      }
    } catch (error) {
      console.log('Error enabling rent/buy:', error);
      showDangerToast('Something went wrong');
    }
  };

  if (!item) {
    return (
      <View style={styles.container}>
        <Text>Item not found</Text>
      </View>
    );
  }

  const handleDelete = async () => {
    if (!item?._id) return;
    setShowDeleteModal(false);
    try {
      const resultAction = await dispatch(deleteItem(item._id));
      if (deleteItem.fulfilled.match(resultAction)) {
        showToast('Item deleted successfully');
        navigation.goBack();
      } else {
        showDangerToast(resultAction.payload || 'Failed to delete item');
      }
    } catch (error) {
      console.error('Delete error:', error);
      showDangerToast('An error occurred');
    }
  };

  const formatDate = dateString => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const day = date.getDate();
    const suffix = ['th', 'st', 'nd', 'rd'][
      day % 10 > 3 || Math.floor((day % 100) / 10) === 1 ? 0 : day % 10
    ];
    return `${day}${suffix} ${date.toLocaleDateString('en-GB', {
      month: 'short',
      year: 'numeric',
    })}`;
  };

  const getImageSource = () => {
    let imgPath = null;
    if (item.images && item.images.length > 0) {
      imgPath = item.images[0];
    } else if (item.image) {
      imgPath = item.image;
    }

    if (!imgPath) return imagePath.placeholder;

    if (String(imgPath).startsWith('http')) {
      return { uri: imgPath };
    }
    return { uri: `${IMAGEURL}${imgPath}` };
  };

  const formatDisplayValue = (val) => {
    if (!val) return '-';
    if (typeof val !== 'string') return val;
    return val
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const colorList =
    Array.isArray(item.colors) && item.colors.length > 0
      ? item.colors.filter(c => c)
      : item.color
        ? [item.color]
        : [];

  const renderDetailRow = (label, value) => {
    if (
      value === null ||
      value === undefined ||
      value === '' ||
      value === '-' ||
      value.length === 0
    ) {
      return null;
    }

    const displayValue = formatDisplayValue(value);

    return (
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{label}:</Text>
        <Text style={styles.detailValue}>{displayValue}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <Header
        title="Item detail"
        showLeftButton={true}
        onLeftButtonPress={() => navigation.goBack()}
        backgroundColor={Colors.white}
        rightComponent={
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleShareToFeed}
            >
              <Image
                source={imagePath.Share}
                style={styles.actionIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
            {String(userDetails?._id) ===
              String(
                item?.user_id || item?.createdBy?._id || item?.createdBy,
              ) && (
                <>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => {
                      navigation.navigate('AddItemDetails', { itemDetail: item });
                    }}
                  >
                    <Image
                      source={imagePath.edit_pen}
                      style={styles.actionIcon}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => setShowDeleteModal(true)}
                  >
                    <Image
                      source={imagePath.del}
                      style={styles.actionIcon}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </>
              )}
          </View>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Main Image */}
        <View style={styles.imageContainer}>
          <Image
            source={getImageSource()}
            style={styles.mainImage}
            resizeMode="contain"
            resizeMethod="auto"
          />
        </View>

        <View style={styles.contentPadding}>
          {/* Category Pill */}
          <View style={styles.categoryPill}>
            <Text style={styles.categoryPillText}>
              {item.category?.title || item.category_id?.title || 'Category'} ·{' '}
              {item.sub_category?.title || item.sub_category_id?.title || 'Sub'}
            </Text>
          </View>

          {/* Title & Brand */}
          <Text style={styles.itemTitle}>
            {item.title || item.name || 'Unknown Item'}
          </Text>
          {/* <Text style={styles.brandSubtitle}> */}
          {/* {item.brand_name || item.brand_id?.name || item.brand || '-'} ·{' '} */}
          {/* {new Date(
              item.purchased_on || item.purchased_date || Date.now(),
            ).getFullYear()} */}
          {/* </Text> */}

          {/* Stats Box */}
          <View style={styles.statsBox}>
            <View style={styles.statColumn}>
              <Text style={styles.statValueText}>₹{item.price || '0'}</Text>
              <Text style={styles.statLabelText}>Price</Text>
            </View>
            <View style={[styles.statColumn, styles.statBorder]}>
              <Text style={styles.statValueText}>
                {item?.wear_count || '0'}
              </Text>
              <Text style={styles.statLabelText}>Times Worn</Text>
            </View>
            <View style={[styles.statColumn, styles.statBorder]}>
              <Text style={styles.statValueText}>
                {formatDate(item.purchased_on || item.purchased_date)}
              </Text>
              <Text style={styles.statLabelText}>Purchased On</Text>
            </View>
          </View>

          {/* Action Buttons */}
          {String(userDetails?._id) ===
            String(
              item?.user_id || item?.createdBy?._id || item?.createdBy,
            ) && (<View style={[styles.buttonsRow, { flexWrap: 'wrap' }]}>
              <TouchableOpacity
                style={styles.addToOutfitBtnPrimary}
                onPress={() => {
                  navigation.navigate('CreateOutfit', {
                    selectedItem: item,
                  });
                }}
              >
                <Text style={styles.addToOutfitTextPrimary}>Add to Outfit</Text>
              </TouchableOpacity>


              <TouchableOpacity
                style={styles.addToOutfitBtnSecondary}
                onPress={() => {
                  const itemImg = item.image || (item.images && item.images.length > 0 ? item.images[0] : null);
                  navigation.navigate('CreatePlanner', {
                    preselectedItemId: item._id,
                    preselectedItemImage: itemImg,
                  });
                }}
              >
                <Text style={styles.addToOutfitTextSecondary}>
                  Add to Planner
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.addToOutfitBtnPrimary,
                  item?.purchase_rent_toggle && {
                    backgroundColor: Colors.white,
                    borderWidth: 1,
                    borderColor: Colors.themeColor,
                  },
                ]}
                disabled={!!item?.purchase_rent_toggle}
                onPress={() => {
                  setRentBuyModalVisible(true);
                }}
              >
                <Text
                  style={[
                    styles.addToOutfitTextPrimary,
                    item?.purchase_rent_toggle && { color: Colors.themeColor },
                  ]}
                >
                  {item?.purchase_rent_toggle ? '✓ Rent/Buy' : 'Add to Rent/Buy'}
                </Text>
              </TouchableOpacity>
            </View>)}

          {/* Details Heading */}
          <Text style={styles.sectionHeading}>Details</Text>

          {/* Color Mapping */}
          {colorList.length > 0 && (
            <View style={[styles.detailRow, styles.detailRowMultiline]}>
              <Text style={styles.detailLabel}>Color:</Text>
              <View style={styles.colorValuesWrap}>
                {colorList.map((colorName, index) => {
                  const swatch = getItemColorSwatch(colorName);
                  return (
                    <View key={index} style={styles.colorChip}>
                      <View
                        style={[
                          styles.colorCircle,
                          { backgroundColor: swatch.backgroundColor },
                          swatch.needsBorder && styles.colorCircleBordered,
                        ]}
                      />
                      <Text style={styles.colorValueText}>
                        {formatDisplayValue(colorName)}
                        {index < colorList.length - 1 ? ', ' : ''}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {renderDetailRow('Occasion', item.occasion)}
          {renderDetailRow('Mood', item.mood)}
          {renderDetailRow('Season', item.season)}
          {renderDetailRow(
            'Status',
            item.statuses || (item.status === 1 ? 'Active' : 'Donate'),
          )}
          {renderDetailRow(
            'Fabric',
            Array.isArray(item.fabric) ? item.fabric.join(', ') : item.fabric,
          )}
          {renderDetailRow('Care', item.care)}

          {!!item.notes && item.notes !== '-' && (
            <View style={styles.detailRowVertical}>
              <Text style={styles.detailLabel}>Notes:</Text>
              <Text style={styles.notesTextValue}>{item.notes}</Text>
            </View>
          )}

          {/* Tags */}
          {Array.isArray(item.tags) && item.tags.length > 0 && (
            <View style={styles.detailRowVertical}>
              <Text style={styles.detailLabel}>Tags:</Text>
              <View style={styles.tagsWrapper}>
                {item.tags.map((tag, index) => (
                  <View key={index} style={styles.tagPill}>
                    <Text style={styles.tagPillText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Measurements */}
          {(item.size ||
            item.size_name ||
            item.chest ||
            item.measurements?.chest ||
            item.waist ||
            item.measurements?.waist ||
            item.hip ||
            item.measurements?.hip ||
            item.sleeve_length ||
            item.measurements?.sleeve_length ||
            item.inseam ||
            item.measurements?.inseam) && (
              <>
                <View style={styles.measurementsHeaderView}>
                  <Text style={styles.measurementsTitle}>Measurements</Text>
                </View>

                {renderDetailRow('Size', item.size || item.size_name)}
                {renderDetailRow(
                  'Chest',
                  item.chest || item.measurements?.chest
                    ? `${item.chest || item.measurements?.chest} in`
                    : null,
                )}
                {renderDetailRow(
                  'Waist',
                  item.waist || item.measurements?.waist
                    ? `${item.waist || item.measurements?.waist} in`
                    : null,
                )}
                {renderDetailRow(
                  'Hip',
                  item.hip || item.measurements?.hip
                    ? `${item.hip || item.measurements?.hip} in`
                    : null,
                )}
                {renderDetailRow(
                  'Sleeve Length',
                  item.sleeve_length || item.measurements?.sleeve_length
                    ? `${item.sleeve_length || item.measurements?.sleeve_length
                    } in`
                    : null,
                )}
                {renderDetailRow(
                  'Inseam',
                  item.inseam || item.measurements?.inseam
                    ? `${item.inseam || item.measurements?.inseam} in`
                    : null,
                )}
              </>
            )}
        </View>
      </ScrollView>

      <DeleteItemModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDelete}
      />
      <ShareModal
        visible={shareModalvisible?.visible}
        postDetail={shareModalvisible?.postDetail}
        onClose={closeShareModal}
      />

      <RentBuyModal
        visible={rentBuyModalVisible}
        onClose={() => setRentBuyModalVisible(false)}
        onSubmit={handleRentBuySubmit}
      />
    </SafeAreaView>
  );
};

export default ClosetDetails;
