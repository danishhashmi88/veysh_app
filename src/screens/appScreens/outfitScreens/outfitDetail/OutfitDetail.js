import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  Dimensions,
  Platform,
  StyleSheet,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import styles from './styles';
import { useNavigation, useRoute } from '@react-navigation/native';
import { imagePath } from '../../../../constant/imagePath';
import { Colors } from '../../../../constant/colors';
import { wp, hp, buildSharePostPayload } from '../../../../utils/helper';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteOutfit,
  getOutfitDetails,
} from '../../../../redux/thunks/outfitsThunk';
import { clearOutfitDetail } from '../../../../redux/slices/outfitsSlice';
import Header from '../../../../component/common/UI/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontSize, FontFamily } from '../../../../constant/fonts';
import { addToLookbookApi } from '../../../../services/user.service';
import { showSuccessToast, showDangerToast, showToast } from '../../../../utils/toast';
import ShareModal from '../../../../component/common/Modal/ShareModal';
import DeleteItemModal from '../../../../component/common/Modal/DeleteItemModal';
import RentBuyModal from '../../../../component/common/Modal/RentBuyModal';
import { EnableRentOutfitApi } from '../../../../services/user.service';
import { IMAGEURL, BASEURL } from '../../../../utils/axios';
import LinearGradient from 'react-native-linear-gradient';
import { Color } from 'react-native/types_generated/Libraries/Animated/AnimatedExports';
import AppButton from '../../../../component/common/Buttons/AppButton';

const { width } = Dimensions.get('window');

const OutfitDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  const [shareModalvisible, setSharemodalvisible] = useState({
    visible: false,
    postDetail: '',
  });

  const closeShareModal = () => {
    setSharemodalvisible({
      visible: false,
      postDetail: '',
    });
  };

  const { outfitId } = route.params || {};
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [rentBuyModalVisible, setRentBuyModalVisible] = useState(false);

  const { outfitDetail, detailLoading } = useSelector(state => state.outfits);
  const { userDetails } = useSelector(state => state.user);
  console.log("outfitdetail", outfitDetail)
  useEffect(() => {
    if (outfitId) {
      dispatch(getOutfitDetails(outfitId));
    }
    return () => {
      dispatch(clearOutfitDetail());
    };
  }, [outfitId, dispatch]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleEdit = () => {
    navigation.navigate('AddOutfitDetails', { outfitData: outfitDetail });
  };

  const confirmDelete = async () => {
    setDeleteModalVisible(false);
    const resultAction = await dispatch(deleteOutfit(outfitId));
    if (deleteOutfit.fulfilled.match(resultAction)) {
      navigation.goBack();
    }
  };

  const handleDelete = () => {
    setDeleteModalVisible(true);
  };

  const handleAddToLookbook = async () => {
    try {
      const formData = new FormData();
      formData.append('type', 'outfit');
      formData.append('outfit_id', outfitId);
      formData.append('isLookbook', outfitDetail?.isLookBook ? false : true);
      const res = await addToLookbookApi(formData);
      if (res?.success) {
        showSuccessToast(
          res?.message?.replace('Item', 'Outfit') || 'Outfit added to lookbook',
        );
        // Dispatch to refresh UI automatically
        dispatch(getOutfitDetails(outfitId));
      } else {
        showDangerToast(res?.message || 'Failed to add outfit to lookbook');
      }
    } catch (error) {
      console.log('Error adding outfit to lookbook:', error);
      showDangerToast('Something went wrong');
    }
  };

  const handleAddToPlanner = () => {
    const outfitImg = outfitDetail?.image || (outfitDetail?.images && outfitDetail?.images.length > 0 ? outfitDetail?.images[0] : null);
    navigation.navigate('CreatePlanner', {
      preselectedOutfitId: outfitId,
      preselectedOutfitImage: outfitImg,
    });
  };

  const handleShareToFeed = () => {
    const prefillFromShare = buildSharePostPayload({
      type: 'outfit',
      outfit: outfitDetail,
    });
    if (!prefillFromShare?.images?.length) {
      showDangerToast('No outfit image available to share');
      return;
    }
    navigation.navigate('CreatePosts', { prefillFromShare });
  };

  const handleRentBuySubmit = async (data) => {
    try {
      setRentBuyModalVisible(false);
      const formData = new FormData();
      formData.append('o_id', outfitId);
      formData.append('purchase_rent_price', data.price);

      if (data.images && data.images.length > 0) {
        data.images.forEach((img, index) => {
          formData.append('images', {
            uri: img.uri,
            type: img.type,
            name: img.name || `image_${index}.jpg`,
          });
        });
      }

      const res = await EnableRentOutfitApi(formData);
      if (res?.success) {
        showSuccessToast(res?.message || 'Added to Rent/Buy list successfully');
        dispatch(getOutfitDetails(outfitId));
      } else {
        showDangerToast(res?.message || 'Failed to enable rent/buy');
      }
    } catch (error) {
      console.log('Error enabling rent/buy for outfit:', error);
      showDangerToast('Something went wrong');
    }
  };

  const getOutfitImage = () => {
    let imgPath = null;
    if (outfitDetail?.image) {
      imgPath = outfitDetail.image;
    } else if (outfitDetail?.images && outfitDetail.images.length > 0) {
      imgPath = outfitDetail.images[0];
    }

    if (!imgPath) return imagePath.placeholder;

    if (imgPath.startsWith('http')) return { uri: imgPath };

    let formattedPath = imgPath;
    if (!formattedPath.includes('uploads/')) {
      formattedPath = `uploads/outfits/${formattedPath}`;
    }

    return { uri: `${IMAGEURL}${formattedPath}` };
  };

  const formatDate = dateString => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate();
    const suffix = ['th', 'st', 'nd', 'rd'][
      day % 10 > 3 || Math.floor((day % 100) / 10) === 1 ? 0 : day % 10
    ];
    return `${day}${suffix} ${date.toLocaleDateString('en-GB', {
      month: 'short',
      year: 'numeric',
    })} ${date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })}`;
  };

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
    return (
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{label}:</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <Header
        showLeftButton={true}
        onLeftButtonPress={handleBack}
        title="Outfit Detail"
        rightComponent={
          <View style={styles.headerActions}>
            {String(userDetails?._id) ===
              String(outfitDetail?.createdBy?._id || outfitDetail?.createdBy) && (
                <>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleEdit}
                  >
                    <Image
                      source={imagePath.edit_pen}
                      style={styles.actionIcon}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleDelete}
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
        backgroundColor={Colors.white}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Main Image */}
        <View style={styles.imageContainer}>
          <Image
            source={getOutfitImage()}
            style={styles.mainImage}
            resizeMode="contain"
          />
        </View>

        {detailLoading ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: hp(10),
            }}
          >
            <Text>Loading...</Text>
          </View>
        ) : (
          <View style={styles.contentPadding}>
            {/* Category Pill */}
            <View style={styles.categoryPill}>
              <Text style={styles.categoryPillText}>
                {outfitDetail?.category?.title ||
                  outfitDetail?.category_id?.title ||
                  'Outfit'}
              </Text>
            </View>

            {/* Title */}
            <Text style={styles.itemTitle}>
              {outfitDetail?.name || 'Outfit Name'}
            </Text>
            <Text style={styles.brandSubtitle}>
              {formatDate(
                outfitDetail?.createdAt || outfitDetail?.createdAtDate,
              )}
            </Text>

            {/* Action Buttons Row */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginBottom: wp(4) }}>
              {/* Add to Lookbook Button */}
              {(() => {
                const isLookbookActive =
                  outfitDetail?.isSaved ||
                  outfitDetail?.isInLookbook ||
                  (outfitDetail?.lookbookBy || []).includes(userDetails?._id);

                return (
                  <TouchableOpacity
                    style={[
                      styles.addToOutfitBtnPrimary,
                      { marginBottom: wp(3), marginRight: wp(3) },
                      isLookbookActive && {
                        backgroundColor: Colors.white,
                        borderWidth: 1,
                        borderColor: Colors.themeColor,
                      },
                    ]}
                    disabled={isLookbookActive}
                    onPress={handleAddToLookbook}
                  >
                    <Text
                      style={[
                        styles.addToOutfitTextPrimary,
                        isLookbookActive && { color: Colors.themeColor },
                      ]}
                    >
                      {isLookbookActive ? '✓ Added to Lookbook' : 'Add to Lookbook'}
                    </Text>
                  </TouchableOpacity>
                );
              })()}

              {/* Add to Rent/Buy Button */}
              {String(userDetails?._id) ===
                String(outfitDetail?.createdBy?._id || outfitDetail?.createdBy) ? (<TouchableOpacity
                  style={[
                    styles.addToOutfitBtnPrimary,
                    { marginBottom: wp(3) },
                    outfitDetail?.purchase_rent_toggle && {
                      backgroundColor: Colors.white,
                      borderWidth: 1,
                      borderColor: Colors.themeColor,
                    },
                  ]}
                  disabled={!!outfitDetail?.purchase_rent_toggle}
                  onPress={() => {
                    setRentBuyModalVisible(true);
                  }}
                >
                  <Text
                    style={[
                      styles.addToOutfitTextPrimary,
                      outfitDetail?.purchase_rent_toggle && { color: Colors.themeColor },
                    ]}
                  >
                    {outfitDetail?.purchase_rent_toggle ? '✓ Added to Rent/Buy' : 'Add to Rent/Buy'}
                  </Text>
                </TouchableOpacity>)
                : (
                  <View style={{ flex: 1 }} />
                )}
            </View>

            {/* Details Heading */}
            <Text style={styles.sectionHeading}>Details</Text>

            {/* Tags */}
            {Array.isArray(outfitDetail?.tags) &&
              outfitDetail.tags.length > 0 && (
                <View style={styles.detailRowVertical}>
                  <Text style={styles.detailLabel}>Tags:</Text>
                  <View style={styles.tagsWrapper}>
                    {outfitDetail.tags.map((tag, index) => (
                      <View key={index} style={styles.tagPill}>
                        <Text style={styles.tagPillText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

            {renderDetailRow(
              'Occasion',
              outfitDetail?.occasion || outfitDetail?.occasion_id?.title,
            )}
            {renderDetailRow(
              'Suitable for',
              outfitDetail?.suitable || outfitDetail?.season,
            )}

            {!!outfitDetail?.notes && outfitDetail.notes !== '-' && (
              <View style={styles.detailRowVertical}>
                <Text style={[styles.detailLabel]}>Style Notes:</Text>
                <Text style={styles.notesTextValue}>{outfitDetail.notes}</Text>
              </View>
            )}

            {/* Description */}
            {!!outfitDetail?.description &&
              outfitDetail.description !== '-' && (
                <View style={[styles.detailRowVertical, { marginTop: wp(2) }]}>
                  <Text style={styles.sectionHeading}>Description</Text>
                  <Text
                    style={[
                      styles.notesTextValue,
                      {
                        color: Colors.graytext,
                        lineHeight: wp(5),
                        fontFamily: FontFamily.OutfitMedium,
                      },
                    ]}
                  >
                    {outfitDetail.description}
                  </Text>
                </View>
              )}
          </View>
        )}
      </ScrollView>

      {/* Floating Footer with Actions */}
      {!detailLoading && (
        <View style={styles.footerContainer}>
          {String(userDetails?._id) ===
            String(outfitDetail?.createdBy?._id || outfitDetail?.createdBy) ? (
            <TouchableOpacity
              style={styles.footerButtonLeft}
              onPress={handleAddToPlanner}
            >
              <Text style={styles.footerButtonTextLeft}>Add to Planner</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ flex: 1 }} />
          )}

          <AppButton
            style={styles.footerButtonRight}
            onPress={handleShareToFeed}
            title="Share"
          />

        </View>
      )}

      <ShareModal
        visible={shareModalvisible?.visible}
        postDetail={shareModalvisible?.postDetail}
        onClose={closeShareModal}
      />

      <DeleteItemModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onDelete={confirmDelete}
        deleteMessage="Are you sure you want to delete this outfit?"
      />

      <RentBuyModal
        visible={rentBuyModalVisible}
        onClose={() => setRentBuyModalVisible(false)}
        onSubmit={handleRentBuySubmit}
      />
    </SafeAreaView>
  );
};

export default OutfitDetail;
