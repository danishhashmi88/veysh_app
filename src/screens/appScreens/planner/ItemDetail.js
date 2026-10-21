import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppButton from '../../../component/common/Buttons/AppButton';
import Header from '../../../component/common/UI/Header';
import { Colors } from '../../../constant/colors';
import { hp, wp } from '../../../utils/helper';
import { useTheme } from '../../../hooks/useTheme';
import { FontFamily, FontSize, FontWeight } from '../../../constant/fonts';
import { imagePath } from '../../../constant/imagePath';
import CalenderModal from '../../../component/common/Modal/CalenderModal';
import moment from 'moment';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeleteItemModal from '../../../component/common/Modal/DeleteItemModal';
import { deleteEvent } from '../../../redux/thunks/plannerThunk';
import { showDangerToast, showToast } from '../../../utils/toast';
import { useDispatch, useSelector } from 'react-redux';
import { IMAGEURL } from '../../../utils/axios';

const { width } = Dimensions.get('window');

const ItemDetail = () => {
  const Colors = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route.params || {};
  console.log("item11", item)
  const { userDetails } = useSelector(state => state.user);
  const calendarRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // Mock data if no item passed or for related items
  const relatedItems = [
    item?.image || imagePath.outfit, // Use placeholders or fallbacks
    item?.image || imagePath.outfit,
    item?.image || imagePath.outfit,
  ];

  const getPlannerImages = item => {
    let images = [];

    if (item?.outfit) {
      let imgPath = item.outfit.image;
      if (!imgPath && item.outfit.images && item.outfit.images.length > 0)
        imgPath = item.outfit.images[0];
      if (imgPath) {
        if (imgPath.startsWith('http')) images.push({ uri: imgPath });
        else {
          let formattedPath = imgPath;
          if (!formattedPath.includes('uploads/'))
            formattedPath = `uploads/outfits/${formattedPath}`;
          images.push({ uri: `${IMAGEURL}${formattedPath}` });
        }
      }
    } else if (item?.items && item.items.length > 0) {
      item.items.forEach(it => {
        let imgPath =
          it.images && it.images.length > 0 ? it.images[0] : it.image;
        if (imgPath) {
          if (imgPath.startsWith('http')) images.push({ uri: imgPath });
          else images.push({ uri: `${IMAGEURL}${imgPath}` });
        }
      });
    } else if (item?.item) {
      let it = item.item;
      let imgPath = it.images && it.images.length > 0 ? it.images[0] : it.image;
      if (imgPath) {
        if (imgPath.startsWith('http')) images.push({ uri: imgPath });
        else images.push({ uri: `${IMAGEURL}${imgPath}` });
      }
    }

    if (images.length === 0 && item?.images && item.images.length > 0) {
      const imgPath = item.images[0];
      if (imgPath) {
        if (imgPath.startsWith('http')) images.push({ uri: imgPath });
        else images.push({ uri: `${IMAGEURL}${imgPath}` });
      }
    }

    return images;
  };

  const formatDateTime = (date, time) => {
    if (!date) return '10th Jan 2025 10:30 pm';
    return `${moment(date).format('Do MMM YYYY')} ${time || ''}`;
  };

  const confirmDelete = async () => {
    if (!item?._id) return;
    setShowDeleteModal(false);
    try {
      console.log('fsfdf', item?._id);
      const resultAction = await dispatch(deleteEvent(item?._id));
      if (deleteEvent.fulfilled.match(resultAction)) {
        showToast('Event deleted successfully');
        navigation.goBack();
      } else {
        showDangerToast(resultAction.payload || 'Failed to delete item');
      }
    } catch (error) {
      showDangerToast('An error occurred');
    }
  };
  const handleEdit = item => {
    const eventDate = moment(item.event_date).startOf('day');
    const today = moment().startOf('day');

    if (eventDate.isBefore(today)) {
      showDangerToast('You cannot edit past events.');
      return;
    }

    // If today OR future → allow edit
    navigation.navigate('CreatePlanner', { eventDetail: item });
  };
  const handleCopy = item => {
    navigation.navigate('CreatePlanner', { eventDetail: item, isCopy: true });
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
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <Header
        showLeftButton={true}
        onLeftButtonPress={() => navigation.goBack()}
        title="Event Detail"
        headerTextStyle={{
          fontSize: FontSize.FONT_26,
          fontFamily: FontFamily.Bold,
        }}
        rightComponent={
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleCopy(item)}
            >
              <Image
                source={imagePath.copy}
                style={styles.actionIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleEdit(item)}
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
          </View>
        }
        backgroundColor={Colors.white}
      />
      <SafeAreaView
        style={[styles.container, { paddingTop: 0 }]}
        edges={['left', 'right', 'bottom']}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Item Info */}
          {/* <View style={styles.mainInfoContainer}>
            <View style={styles.mainImageWrapper}>
              {getOutfitImage(item) ? (
                <Image
                  source={getOutfitImage(item)}
                  style={styles.mainImage}
                  resizeMode="cover"
                />
              ) : (
                <View
                  style={[
                    styles.mainImage,
                    {
                      backgroundColor: Colors.bgGrey,
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontFamily: FontFamily.OutfitMedium,
                      color: Colors.graytext,
                      fontSize: 10,
                      textAlign: 'center',
                    }}
                  >
                    No Image{`\n`}Found
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.infoTextWrapper}>
              <Text style={styles.itemTitle}>{item?.name}</Text>
              <Text style={styles.itemDate}>
                {formatDateTime(item?.event_date, item?.event_time)}
              </Text>
            </View>
          </View> */}

          {/* Description */}
          {/* <Text style={styles.descriptionText}>{item?.notes}</Text> */}

          <View style={styles.ootdCard}>
            {(() => {
              const images = getPlannerImages(item);
              if (images.length === 0) {
                return (
                  <View
                    style={[
                      styles.ootdImage,
                      {
                        backgroundColor: Colors.bgGrey,
                        justifyContent: 'center',
                        alignItems: 'center',
                      },
                    ]}
                  >
                    <Text
                      style={{
                        fontFamily: FontFamily.OutfitMedium,
                        color: Colors.graytext,
                        fontSize: FontSize.FONT_18,
                      }}
                    >
                      No Image Found
                    </Text>
                  </View>
                );
              }
              if (images.length === 1) {
                return (
                  <Image
                    source={images[0]}
                    style={styles.ootdImage}
                    resizeMode="cover"
                  />
                );
              }
              return (
                <View style={{ flex: 1 }}>
                  <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.horizontalScrollImages}
                    onMomentumScrollEnd={(e) => {
                      const offset = e.nativeEvent.contentOffset.x;
                      const index = Math.round(offset / wp(84));
                      // We could use an index state here if we wanted to show 1/5
                    }}
                  >
                    {images.map((img, index) => (
                      <View key={index} style={styles.ootdImageMultipleContainer}>
                        <Image
                          source={img}
                          style={styles.ootdImageMultiple}
                          resizeMode="cover"
                        />
                        <View style={styles.paginationBadge}>
                          <Text style={styles.paginationText}>
                            {index + 1} / {images.length}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              );
            })()}
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.sectionHeading}>Event Details</Text>
            {renderDetailRow('Event Name', item?.name)}
            {renderDetailRow(
              item?.outfit && item?.outfit?._id ? 'Outfit Name' : 'Item Name',
              item?.outfit?.name || 
              (getPlannerImages(item).length > 1 && item?.items 
                ? item.items.map(it => it.name || it.title).filter(Boolean).join(', ') 
                : (item?.item?.name || item?.item?.title || (item?.items?.[0]?.name || item?.items?.[0]?.title)))
            )}
            {renderDetailRow(
              'Date & Time',
              formatDateTime(item?.event_date, item?.event_time),
            )}

            {!!item?.notes && item.notes !== '-' && (
              <View style={styles.detailRowVertical}>
                <Text style={styles.detailLabel}>Style Notes:</Text>
                <Text style={styles.notesTextValue}>{item.notes}</Text>
              </View>
            )}{(() => {
              const hasOutfitDetails = !!(
                item?.outfit?.category?.title ||
                item?.outfit?.occasion ||
                item?.outfit?.season ||
                (Array.isArray(item?.outfit?.tags) &&
                  item?.outfit?.tags.length > 0)
              );

              const hasItemDetails = !!(
                item?.item?.category?.title ||
                item?.item?.category_id?.title ||
                item?.item?.brand_name ||
                item?.item?.price ||
                item?.item?.color ||
                item?.item?.fabric ||
                item?.item?.occasion
              );

              if (item?.outfit && item.outfit?._id && hasOutfitDetails) {
                return (
                  <>
                    <Text style={[styles.sectionHeading, { marginTop: hp(2) }]}>
                      Outfit Details
                    </Text>
                    {renderDetailRow('Category', item.outfit.category?.title)}
                    {renderDetailRow('Occasion', item.outfit.occasion)}
                    {renderDetailRow('Season', item.outfit.season)}

                    {Array.isArray(item.outfit.tags) &&
                      item.outfit.tags.length > 0 && (
                        <View style={styles.detailRowVertical}>
                          <Text style={styles.detailLabel}>Tags:</Text>
                          <View style={styles.tagsWrapper}>
                            {item.outfit.tags.map((tag, index) => (
                              <View key={index} style={styles.tagPill}>
                                <Text style={styles.tagPillText}>{tag}</Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      )}
                  </>
                );
              } else if (item?.items && item.items.length > 0) {
                return (
                  <>
                    {item.items.map((it, index) => {
                      const hasDetails = !!(
                        it.category?.title ||
                        it.category_id?.title ||
                        it.brand_name ||
                        it.price ||
                        it.color ||
                        it.fabric ||
                        it.occasion
                      );
                      if (!hasDetails) return null;
                      return (
                        <View key={it._id || index} style={{ marginTop: hp(2) }}>
                          <Text style={styles.sectionHeading}>
                            Item Details ({it.name})
                          </Text>
                          {renderDetailRow(
                            'Category',
                            it.category?.title ||
                            it.category_id?.title,
                          )}
                          {renderDetailRow('Brand', it.brand_name)}
                          {renderDetailRow(
                            'Price',
                            it.price ? `₹${it.price}` : null,
                          )}
                          {it.color && (
                            <View style={styles.detailRow}>
                              <Text style={styles.detailLabel}>Color:</Text>
                              <View style={styles.colorValueContainer}>
                                <View
                                  style={[
                                    styles.colorCircle,
                                    {
                                      backgroundColor:
                                        it.color?.toLowerCase() || '#ccc',
                                    },
                                  ]}
                                />
                                <Text style={styles.detailValue}>
                                  {it.color}
                                </Text>
                              </View>
                            </View>
                          )}
                          {renderDetailRow(
                            'Fabric',
                            Array.isArray(it.fabric)
                              ? it.fabric.join(', ')
                              : it.fabric,
                          )}
                          {renderDetailRow('Occasion', it.occasion)}
                        </View>
                      );
                    })}
                  </>
                );
              } else if (item?.item && item.item?._id && hasItemDetails) {
                let it = item.item;
                return (
                  <>
                    <Text style={[styles.sectionHeading, { marginTop: hp(2) }]}>
                      Item Details
                    </Text>
                    {renderDetailRow(
                      'Category',
                      it.category?.title ||
                      it.category_id?.title,
                    )}
                    {renderDetailRow('Brand', it.brand_name)}
                    {renderDetailRow(
                      'Price',
                      it.price ? `₹${it.price}` : null,
                    )}
                    {it.color && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Color:</Text>
                        <View style={styles.colorValueContainer}>
                          <View
                            style={[
                              styles.colorCircle,
                              {
                                backgroundColor:
                                  it.color?.toLowerCase() || '#ccc',
                              },
                            ]}
                          />
                          <Text style={styles.detailValue}>
                            {it.color}
                          </Text>
                        </View>
                      </View>
                    )}
                    {renderDetailRow(
                      'Fabric',
                      Array.isArray(it.fabric)
                        ? it.fabric.join(', ')
                        : it.fabric,
                    )}
                    {renderDetailRow('Occasion', it.occasion)}
                  </>
                );
              }
              return null;
            })()}
            {(item?.remind_me_1day_before || item?.remind_me_2hours_before) && (
              <>
                <Text style={[styles.sectionHeading, { marginTop: hp(2) }]}>
                  Reminders
                </Text>
                {item?.remind_me_1day_before && (
                  <View style={styles.reminderRow}>
                    <View style={styles.bullet} />
                    <Text style={styles.reminderText}>
                      1 day before event
                    </Text>
                  </View>
                )}
                {item?.remind_me_2hours_before && (
                  <View style={styles.reminderRow}>
                    <View style={styles.bullet} />
                    <Text style={styles.reminderText}>
                      2 hours before event
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>

          {/* <Text style={styles.descriptionText}>{item?.notes}</Text> */}
        </ScrollView><TouchableOpacity
          onPress={() => navigation.navigate('AiHomeScreen', { initialMessage: '', isScanning: true })}
          style={styles.botIconContainer}
        ><Image source={imagePath.BaeAIcon} style={styles.botIcon} /></TouchableOpacity><CalenderModal
          ref={calendarRef}
          minDate={'2024-01-01'}
          maxDate={'2025-12-31'}
          onPress={date => {
            setSelectedDate(date);
            console.log('Selected Date:', date);
          }}
        />
        <DeleteItemModal
          visible={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onDelete={confirmDelete}
          deleteMessage={'Are you sure you want to delete the event?'}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backGroundColor1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    paddingHorizontal: wp(4),
    paddingTop: hp(1),
    paddingBottom: hp(1),
  },
  backButton: {
    width: wp(10),
    height: wp(10),
    backgroundColor: Colors.backGroundColor1,
    borderRadius: wp(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FontSize.FONT_26,
    color: Colors.black,
    textAlign: 'center',
    fontFamily: FontFamily.Bold,
  },
  rightIconBtn: {
    padding: wp(2),
  },
  headerIcon: {
    width: wp(6),
    height: wp(6),
    tintColor: Colors.black,
  },
  actionButton: {
    width: wp(10),
    height: wp(10),
    backgroundColor: Colors.bgGrey,
    borderRadius: wp(5),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: wp(2),
  },
  actionIcon: {
    width: wp(5),
    height: wp(5),
    tintColor: Colors.black,
  },
  scrollContent: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(15),
  },
  mainInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(1),
    marginBottom: hp(2),
  },
  mainImageWrapper: {
    width: wp(25),
    height: wp(30),
    borderRadius: wp(4),
    overflow: 'hidden',
    marginRight: wp(4),
    backgroundColor: Colors.backGroundColor1,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  infoTextWrapper: {
    flex: 1,
  },
  itemTitle: {
    fontSize: FontSize.FONT_18, // Adjusted based on look
    color: Colors.black,
    marginBottom: hp(0.5),
    fontFamily: FontFamily.OutfitMedium,
  },
  itemDate: {
    fontSize: FontSize.FONT_12,
    color: Colors.graytext,
    fontFamily: FontFamily.OutfitMedium,
  },
  descriptionText: {
    fontSize: FontSize.FONT_14,
    color: Colors.graytext,
    lineHeight: 20,
    marginBottom: hp(3),
    fontFamily: FontFamily.OutfitMedium,
  },
  sectionTitle: {
    fontSize: FontSize.FONT_16,
    color: Colors.black,
    marginBottom: hp(1.5),
    fontFamily: FontFamily.OutfitMedium,
  },
  relatedItemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Or scrollable? Design shows 3 items, looks like row
    gap: wp(3),
  },
  relatedItemCard: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(3),
    overflow: 'hidden',
    backgroundColor: '#F9F9F9',
  },
  relatedItemImage: {
    width: '100%',
    height: '100%',
  },
  sectionHeading: {
    fontFamily: FontFamily.OutfitMedium,
    fontSize: FontSize.FONT_18,
    color: Colors.black,
    marginBottom: wp(1),
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: wp(3),
  },
  detailLabel: {
    fontFamily: FontFamily.OutfitMedium,
    color: Colors.graytext,
    fontSize: FontSize.FONT_14,
  },
  detailValue: {
    fontFamily: FontFamily.OutfitMedium,
    color: Colors.black,
    textAlign: 'right',
    maxWidth: '65%',
    fontSize: FontSize.FONT_14,
  },
  detailRowVertical: {
    marginBottom: wp(3),
  },
  notesTextValue: {
    fontFamily: FontFamily.OutfitMedium,
    color: Colors.black,
    marginTop: wp(1),
    fontSize: FontSize.FONT_14,
    lineHeight: 20,
  },
  tagsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: wp(1),
  },
  tagPill: {
    backgroundColor: Colors.voiletLight,
    paddingHorizontal: wp(3),
    paddingVertical: wp(1),
    borderRadius: wp(4),
    marginRight: wp(2),
    marginBottom: wp(1),
  },
  tagPillText: {
    color: Colors.themeColor,
    fontFamily: FontFamily.OutfitMedium,
    fontSize: FontSize.FONT_12,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: wp(4),
    paddingVertical: hp(3),
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.backGroundColor1,
    gap: wp(4),
  },
  deleteButton: {
    backgroundColor: Colors.black,
    borderRadius: wp(10), // Fully rounded
    marginBottom: 0, // Override AppButton margin
    marginTop: 0,
    width: '100%',
  },
  editButton: {
    // backgroundColor: '#C084FC', // Purple theme
    // AppButton might leverage gradient or primary color.
    // If AppButton doesn't support custom bgColor prop cleanly or uses gradient, we might need a wrapper.
    // Assuming standard AppButton is primary.
    marginBottom: 0,
    marginTop: 0,
    borderRadius: wp(10),
    width: '100%',
  },
  botIconContainer: {
    position: 'absolute',
    bottom: hp(12), // Above footer
    right: wp(4),
    width: wp(12),
    height: wp(12),
    backgroundColor: Colors.backGroundColor1,
    borderRadius: wp(6),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  botIcon: {
    width: wp(10),
    height: wp(10),
    // tintColor: '#7C10D8',
  },
  ootdCard: {
    width: '100%',
    height: wp(92), // Square height (width - padding)
    borderTopLeftRadius: wp(6),
    borderTopRightRadius: wp(6),
    borderBottomLeftRadius: wp(6),
    borderBottomRightRadius: wp(6),
    backgroundColor: Colors.outfitBGColor,
    padding: wp(4), // Slightly more padding to give items breathing room
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: hp(1),
    marginTop: hp(2),
    // Removed overflow: 'hidden' to allow sharp image corners in the middle
  },
  ootdImage: {
    width: '100%',
    height: '100%',
    borderRadius: wp(5),
    overflow: 'hidden',
  },
  ootdImageMultiple: {
    width: wp(84), // Subtracting ootdCard padding
    height: '100%',
    borderRadius: wp(5),
    overflow: 'hidden',
  },
  ootdImageMultipleContainer: {
    width: wp(84),
    height: '100%',
    position: 'relative',
  },
  paginationBadge: {
    position: 'absolute',
    bottom: hp(2),
    right: wp(4),
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    borderRadius: wp(5),
  },
  paginationText: {
    color: Colors.white,
    fontFamily: FontFamily.OutfitMedium,
    fontSize: FontSize.FONT_12,
  },
  horizontalScrollImages: {
    // gap: wp(2), // Removed gap as it interferes with paging width
  },
  sectionHeader: {
    marginBottom: hp(1),
    marginTop: hp(1),
    color: Colors.black,
  },
  detailsContainer: {
    marginTop: hp(1),
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(0.5),
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.orange,
    marginRight: wp(2),
  },
  reminderText: {
    fontSize: FontSize.FONT_14,
    fontFamily: FontFamily.OutfitMedium,
    color: Colors.black,
  },
  colorValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorRightSide: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  colorCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: wp(2),
    borderWidth: 1,
    borderColor: Colors.backGroundColor1,
  },
});

export default ItemDetail;
