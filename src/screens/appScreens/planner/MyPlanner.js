import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  StatusBar,
  Platform,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getPlannerList } from '../../../redux/thunks/plannerThunk';
import Header from '../../../component/common/UI/Header';

import { Colors } from '../../../constant/colors';
import { hp, wp } from '../../../utils/helper';
import {
  FontSize,
  FontWeight,
  FontFamily,
  OutfitFamily,
} from '../../../constant/fonts';
import { imagePath } from '../../../constant/imagePath';
import CalendarDropdown from '../../../component/common/Calendar/CalendarDropdown';
import { IMAGEURL } from '../../../utils/axios';
import NoDataText from '../../../component/common/UI/NoDataText';

const CARD_WIDTH = wp(80);
const SPACING = wp(4);
const SNAP_INTERVAL = CARD_WIDTH + SPACING * 2;

const MyPlanner = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { plannerList, loading, error } = useSelector(state => state.planner);
  const [viewMode, setViewMode] = useState('grid');
  const calendarRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState('');
  const scrollX = useRef(new Animated.Value(0)).current;
  const [selectedMonth, setSelectedMonth] = useState(
    (new Date().getMonth() + 1).toString().padStart(2, '0'),
  );

  console.log(plannerList, 'plannerList');

  const fetchPlannerData = useCallback(
    monthValue => {
      if (!monthValue) return;

      const payload = {
        global_search: '',
        page: 1,
        per_page: 100,
      };

      if (monthValue !== 'ALL') {
        payload.month = parseInt(monthValue, 10);
        payload.sort_by = 'event_date';
      }

      dispatch(getPlannerList(payload));
    },
    [dispatch],
  );

  useFocusEffect(
    useCallback(() => {
      fetchPlannerData(selectedMonth);
    }, [fetchPlannerData, selectedMonth]),
  );

  const onMonthSelect = item => {
    if (item.value !== selectedMonth) {
      setSelectedMonth(item.value);
    } else {
      fetchPlannerData(item.value);
    }
  };

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

  const renderHeader = () => (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <Header
        showLeftButton={true}
        onLeftButtonPress={() => navigation.goBack()}
        title="My Planner"
        rightComponent={
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: wp(2),
            }}
          >
            <TouchableOpacity
              style={styles.calendarNavButton}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Calendar', { selectedMonth })}
            >
              <Image source={imagePath.calend} style={styles.calendarIcon} />
            </TouchableOpacity>

            <CalendarDropdown
              onSelect={onMonthSelect}
              selectedMonthValue={selectedMonth}
            />
          </View>
        }
        backgroundColor={Colors.white}
      />
    </>
  );

  const renderToggle = () => (
    <View style={styles.toggleContainer}>
      <TouchableOpacity
        style={[
          styles.toggleButton,
          viewMode === 'grid' ? styles.activeToggle : styles.inactiveToggle,
        ]}
        onPress={() => setViewMode('grid')}
        activeOpacity={0.9}
      >
        <Text
          style={[
            styles.toggleText,
            viewMode === 'grid'
              ? styles.activeToggleText
              : styles.inactiveToggleText,
          ]}
        >
          Grid View
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.toggleButton,
          viewMode === 'list' ? styles.activeToggle : styles.inactiveToggle,
        ]}
        onPress={() => setViewMode('list')}
        activeOpacity={0.9}
      >
        <Text
          style={[
            styles.toggleText,
            viewMode === 'list'
              ? styles.activeToggleText
              : styles.inactiveToggleText,
          ]}
        >
          List View
        </Text>
      </TouchableOpacity>
    </View>
  );

  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: true,
      listener: event => {
        const index = Math.round(
          event.nativeEvent.contentOffset.x / SNAP_INTERVAL,
        );
        if (index !== activeIndex && index >= 0 && index < plannerList.length) {
          setActiveIndex(index);
        }
      },
    },
  );

  const formatDate = dateString => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  };

  const renderGridItem = ({ item, index }) => {
    const inputRange = [
      (index - 1) * SNAP_INTERVAL,
      index * SNAP_INTERVAL,
      (index + 1) * SNAP_INTERVAL,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.85, 1, 0.85],
      extrapolate: 'clamp',
    });

    const rotate = scrollX.interpolate({
      inputRange,
      outputRange: ['-8deg', '0deg', '8deg'],
      extrapolate: 'clamp',
    });

    const translateY = scrollX.interpolate({
      inputRange,
      outputRange: [hp(2), 0, hp(2)],
      extrapolate: 'clamp',
    });

    const images = getPlannerImages(item);

    return (
      <Animated.View
        style={[
          styles.gridCard,
          {
            transform: [{ scale }, { rotateZ: rotate }, { translateY }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.gridImageContainer}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('ItemDetail', { item })}
        >
          {images.length > 0 ? (
            images.length === 1 ? (
              <Image
                source={images[0]}
                style={styles.gridMainImage}
                resizeMode="cover"
              />
            ) : (
            <View style={styles.multiImageContainerGrid}>
                {images.map((img, idx) => (
                  <Image
                    key={idx}
                    source={img}
                    style={styles.multiImageGrid}
                    resizeMode="cover"
                  />
                ))}
              </View>
            )
          ) : (
            <View
              style={[
                styles.gridMainImage,
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
                  fontSize: FontSize.FONT_16,
                }}
              >
                No Image Found
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderListItem = ({ item }) => {
    const images = getPlannerImages(item);

    return (
      <TouchableOpacity
        style={styles.listCard}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('ItemDetail', { item })}
      >
        <View style={styles.listDetails}>
          <View style={styles.dateBadgeList}>
            <Text style={styles.dateTextList}>
              {formatDate(item.event_date)}
            </Text>
          </View>
          <Text style={styles.itemTitleList} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.itemDescriptionList} numberOfLines={2}>
            {item.notes || ''}
          </Text>
        </View>
        <View style={styles.listImageContainer}>
          {images.length > 0 ? (
            images.length === 1 ? (
              <Image
                source={images[0]}
                style={styles.listImage}
                resizeMode="cover"
              />
            ) : (
            <View style={styles.multiImageList}>
                {images.slice(0, 4).map((img, idx) => (
                  <View key={idx} style={styles.smallImageListItemContainer}>
                    <Image
                      source={img}
                      style={styles.smallImageListItem}
                      resizeMode="cover"
                    />
                    {idx === 3 && images.length > 4 && (
                      <View style={styles.moreImagesOverlay}>
                        <Text style={styles.moreImagesText}>+{images.length - 3}</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )
          ) : (
            <View
              style={[
                styles.listImage,
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
      </TouchableOpacity>
    );
  };

  const activeItem = plannerList[activeIndex];

  const renderEmptyState = () => (
    <NoDataText
      source={imagePath.EventHome}
      title={'No planners found'}
      subTitle={'You haven\'t added anything to your planner yet.'}
    />
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />

      {renderHeader()}
      {renderToggle()}

      {viewMode === 'grid' ? (
        <View style={{ flex: 1 }}>
          {!plannerList || plannerList.length === 0 ? (
            renderEmptyState()
          ) : (
            <>
              <View style={{ height: hp(45), justifyContent: 'center' }}>
                <Animated.FlatList
                  data={plannerList}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  snapToInterval={SNAP_INTERVAL}
                  decelerationRate="fast"
                  contentContainerStyle={styles.gridListContent}
                  keyExtractor={item => item._id || item.id}
                  onScroll={handleScroll}
                  renderItem={renderGridItem}
                  scrollEventThrottle={16}
                />
              </View>

              {activeItem && (
                <View style={styles.activeDetailSection}>
                  <View style={styles.dateBadge}>
                    <Text style={styles.dateText}>
                      {formatDate(activeItem.event_date)}
                    </Text>
                  </View>
                  <Text style={styles.itemTitle}>{activeItem.name}</Text>
                  <Text style={styles.itemDescription}>
                    {activeItem.notes || ''}
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          {!plannerList || plannerList.length === 0 ? (
            renderEmptyState()
          ) : (
            <FlatList
              data={plannerList}
              keyExtractor={item => item._id || item.id}
              renderItem={renderListItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={() => <View style={{ height: hp(15) }} />}
            />
          )}
        </View>
      )}
      {/* Optional: Small loading indicator during background refresh */}
      {/* {loading && (
                <View style={styles.miniLoader}>
                    <ActivityIndicator size="small" color="#7C10D8" />
                </View>
            )} */}

      <View style={styles.fabContainer} pointerEvents="box-none">
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate('CreatePlanner')}
        >
          <Image
            source={imagePath.plusbuttom}
            style={styles.fabImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.fabBot} activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('AiHomeScreen', {
              // initialMessage: 'Analyze my closet and suggest a perfect outfit!',
              isScanning: true,
            })
          }
        >
          <Image
            source={imagePath.BaeAIcon}
            style={{ width: wp(11), height: wp(11) }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MyPlanner;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backGroundColor1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(5),
    paddingTop: Platform.OS === 'ios' ? hp(7) : hp(6),
    paddingBottom: hp(2),
    backgroundColor: Colors.white,
  },
  backButton: {
    width: wp(10),
    height: wp(10),
    backgroundColor: Colors.bgGrey,
    borderRadius: wp(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon: {
    width: wp(6),
    height: wp(6),
    tintColor: Colors.black,
  },
  headerTitle: {
    flex: 1,
    fontSize: wp(6),
    fontFamily: FontFamily.Bold,
    textAlign: 'center',
    color: Colors.black,
    marginRight: wp(15),
  },
  calendarNavButton: {
    marginRight: wp(3),
    padding: wp(1),
    backgroundColor: Colors.greyDark,
    borderRadius: 20,
  },
  calendarIcon: {
    width: wp(6),
    height: wp(6),
    tintColor: Colors.black,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    paddingHorizontal: wp(5),
    marginTop: hp(2),
    marginBottom: hp(3),
    gap: wp(4),
  },
  toggleButton: {
    flex: 1,
    height: hp(5.2),
    borderRadius: wp(100),
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeToggle: {
    backgroundColor: Colors.gradientPurple1,
  },
  inactiveToggle: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderGrey ,
  },
  toggleText: {
    fontSize: FontSize.FONT_14,
    fontFamily: FontFamily.OutfitMedium,
  },
  activeToggleText: {
    color: Colors.white,
    fontFamily: FontFamily.OutfitMedium,
  },
  inactiveToggleText: {
    color: Colors.graytext,
    fontFamily: FontFamily.OutfitMedium,
  },

  gridListContent: {
    paddingHorizontal: wp(6),
    alignItems: 'center',
  },
  gridCard: {
    width: CARD_WIDTH,
    height: hp(40),
    marginHorizontal: SPACING,
    backgroundColor: Colors.white,
    borderRadius: wp(5),
    padding: wp(1),
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  gridImageContainer: {
    flex: 1,
    borderRadius: wp(4),
    overflow: 'hidden',
  },
  gridMainImage: {
    width: '100%',
    height: '100%',
  },
  activeDetailSection: {
    alignItems: 'center',
    paddingHorizontal: wp(8),
    marginTop: hp(2),
  },
  dateBadge: {
    backgroundColor: Colors.voiletLight, // Light purple
    paddingHorizontal: wp(4),
    paddingVertical: hp(0.5),
    borderRadius: wp(100),
    marginBottom: hp(1.5),
  },
  dateText: {
    fontSize: FontSize.FONT_15,
    color: Colors.gradientPurple1, // Purple
    fontFamily: FontFamily?.Bold
  },
  itemTitle: {
    fontSize: FontSize.FONT_22,
    fontFamily: FontFamily.Bold,
    color: Colors.black,
    marginBottom: hp(1),
  },
  itemDescription: {
    fontSize: FontSize.FONT_13,
    color: Colors.graytext,
    fontFamily: FontFamily?.OutfitMedium,
    textAlign: 'center',
    lineHeight: hp(2.2),
  },
  listContent: {
    paddingHorizontal: wp(5),
    paddingTop: hp(1),
    flexGrow: 1,
  },
  listCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: wp(4),
    padding: wp(4),
    marginBottom: hp(2),
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  listDetails: {
    flex: 1,
    marginRight: wp(4),
  },
  listImage: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(3),
    backgroundColor: Colors.bgGrey,
  },
  listImageContainer: {
    width: wp(20),
    height: wp(20),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  multiImageContainerGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: wp(1),
    padding: wp(1),
  },
  multiImageGrid: {
    width: (CARD_WIDTH - wp(8)) / 3,
    height: (CARD_WIDTH - wp(8)) / 3,
    borderRadius: wp(2),
  },
  multiImageList: {
    width: wp(20),
    height: wp(20),
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  smallImageListItemContainer: {
    width: wp(9),
    height: wp(9),
    borderRadius: wp(1),
    overflow: 'hidden',
  },
  moreImagesOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreImagesText: {
    color: Colors.white,
    fontSize: 10,
    fontFamily: FontFamily.Bold,
  },
  smallImageListItem: {
    width: wp(9),
    height: wp(9),
    borderRadius: wp(1),
  },
  dateBadgeList: {
    backgroundColor: Colors.voiletLight,
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.4),
    borderRadius: wp(100),
    alignSelf: 'flex-start',
    marginBottom: hp(1),
  },
  dateTextList: {
    fontSize: FontSize.FONT_14,
    color: Colors.gradientPurple1,
    fontFamily: FontFamily?.Bold
  },
  itemTitleList: {
    fontSize: FontSize.FONT_19,
    // fontWeight: FontWeight.FONT_700,
    color: Colors.black,
    marginBottom: hp(0.5),
    fontFamily: FontFamily?.Bold,
  },
  itemDescriptionList: {
    fontSize: FontSize.FONT_13,
    color: Colors.graytext,
    lineHeight: hp(1.8),
    fontFamily: FontFamily?.OutfitMedium,
  },
  // FAB
  fabContainer: {
    position: 'absolute',
    bottom: hp(4),
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(5),
  },
  fabGradient: {
    width: wp(16),
    height: wp(16),
    borderRadius: wp(8),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: Colors.gradientPurple1,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  fabContainer: {
    position: 'absolute',
    bottom: hp(4),
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  fabImage: {
    width: wp(24),
    height: wp(24),
  },
  fabBot: {
    position: 'absolute',
    right: wp(7),
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  fabBotText: {
    fontSize: FontSize.FONT_10,
    color: Colors.gradientPurple1,
    fontFamily: FontFamily.OutfitMedium,
    marginTop: -wp(1),
  },
  calendarImage: {
    height: 20,
    width: 20,
  },

  // Loading, Error, Empty States
  emptyCenterContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(8),
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(8),
  },
  loadingText: {
    marginTop: hp(2),
    fontSize: FontSize.FONT_16,
    color: Colors.graytext,
    fontFamily: FontFamily.OutfitMedium,
  },
  errorText: {
    fontSize: FontSize.FONT_16,
    color: Colors.red,
    textAlign: 'center',
    marginBottom: hp(2),
    fontFamily: FontFamily.OutfitMedium,
  },
  retryButton: {
    backgroundColor: Colors.themeColor,
    paddingHorizontal: wp(8),
    paddingVertical: hp(1.5),
    borderRadius: wp(5),
    fontFamily: FontFamily.OutfitMedium,
  },
  retryButtonText: {
    color: Colors.white,
    fontSize: FontSize.FONT_14,
    fontFamily: FontFamily.OutfitMedium,
  },
  emptyText: {
    fontSize: FontSize.FONT_18,
    color: Colors.black,
    marginBottom: hp(1),
    fontFamily: FontFamily.OutfitMedium,
  },
  emptySubText: {
    fontSize: FontSize.FONT_14,
    color: Colors.graytext,
    textAlign: 'center',
    fontFamily: FontFamily.OutfitMedium,
  },
  miniLoader: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? hp(7) : hp(5),
    right: wp(15),
    zIndex: 999,
  },
  button: {
    backgroundColor: Colors.black,
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    borderRadius: wp(10),
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    marginRight: 5,
  },
});
