import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { Calendar as RNCalendar } from 'react-native-calendars';
import { getPlannerList } from '../../../redux/thunks/plannerThunk';
import Header from '../../../component/common/UI/Header';
import { Colors } from '../../../constant/colors';
import { hp, wp } from '../../../utils/helper';
import { FontFamily, FontSize, FontWeight } from '../../../constant/fonts';
import { imagePath } from '../../../constant/imagePath';
import { IMAGEURL } from '../../../utils/axios';


const Calendar = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { selectedMonth } = route.params || {};

  const { plannerList } = useSelector(state => state.planner);

  const initialDate = useMemo(() => {
    if (selectedMonth && selectedMonth !== 'ALL') {
      const year = new Date().getFullYear();
      return `${year}-${selectedMonth.toString().padStart(2, '0')}-01`;
    }
    return new Date().toISOString().split('T')[0];
  }, [selectedMonth]);

  const [selectedDate, setSelectedDate] = useState(initialDate);

  useEffect(() => {
    if (selectedMonth && selectedMonth !== 'ALL') {
      const year = new Date().getFullYear();
      setSelectedDate(
        `${year}-${selectedMonth.toString().padStart(2, '0')}-01`,
      );
    }
  }, [selectedMonth]);

  const handleMonthChange = month => {
    setSelectedDate(month.dateString);

    const payload = {
      global_search: '',
      page: 1,
      per_page: 100,
      month: month.month,
      sort_by: 'event_date',
    };
    dispatch(getPlannerList(payload));
  };

  // Map planner items to dates
  const markedDates = useMemo(() => {
    const marks = {};
    plannerList.forEach(item => {
      const date = item.event_date.split('T')[0];
      if (!marks[date]) {
        marks[date] = {
          hasEvent: true,
          items: [],
          image: getOutfitImage(item),
        };
      }
      marks[date].items.push(item);
    });
    return marks;
  }, [plannerList]);

  function getOutfitImage(item) {
    if (item?.outfit) {
      let imgPath = item.outfit.image;
      if (!imgPath && item.outfit.images && item.outfit.images.length > 0) imgPath = item.outfit.images[0];
      if (imgPath) {
        if (imgPath.startsWith('http')) return { uri: imgPath };
        let formattedPath = imgPath;
        if (!formattedPath.includes('uploads/')) formattedPath = `uploads/outfits/${formattedPath}`;
        return { uri: `${IMAGEURL}${formattedPath}` };
      }
    }

    if (item?.item) {
      let imgPath = (item.item.images && item.item.images.length > 0) ? item.item.images[0] : item.item.image;
      if (imgPath) {
        if (imgPath.startsWith('http')) return { uri: imgPath };
        return { uri: `${IMAGEURL}${imgPath}` };
      }
    }

    if (item?.images && item.images.length > 0) {
      const imgPath = item.images[0];
      if (imgPath) {
        if (imgPath.startsWith('http')) return { uri: imgPath };
        return { uri: `${IMAGEURL}${imgPath}` };
      }
    }

    return null;
  }

  const selectedDayItems = markedDates[selectedDate]?.items || [];

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
        title="Monthly Calendar"
        backgroundColor={Colors.white}
      />
    </>
  );

  const renderOutfitItem = ({ item }) => (
    <TouchableOpacity
      style={styles.outfitCard}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('ItemDetail', { item })}
    >
      <View style={styles.outfitInfo}>
        <View style={styles.dateBadgeList}>
           <Text style={styles.dateTextList}>{formatDate(item.event_date)}</Text>
        </View>
        <Text style={styles.outfitName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.outfitDescription} numberOfLines={2}>
          {item.notes || 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.'}
        </Text>
      </View>
      {getOutfitImage(item) ? (
        <Image source={getOutfitImage(item)} style={styles.outfitImage} />
      ) : (
        <View style={[styles.outfitImage, { backgroundColor: Colors.bgGrey, justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ fontFamily: FontFamily.OutfitMedium, color: Colors.graytext, fontSize: 10, textAlign: 'center' }}>No Image{`\n`}Found</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const formatDate = dateString => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <View style={styles.container}>
      {renderHeader()}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: hp(10) }}
      >
        <View style={styles.calendarContainer}>
          <RNCalendar
            current={selectedDate}
            onDayPress={day => setSelectedDate(day.dateString)}
            onMonthChange={handleMonthChange}
            renderArrow={direction => (
              <Image
                source={
                  direction === 'left'
                    ? imagePath.arrow_left
                    : imagePath.arrow_left
                }
                style={{
                  width: 20,
                  height: 20,
                  tintColor: '#374151',
                  transform:
                    direction === 'right' ? [{ rotate: '180deg' }] : [],
                }}
                resizeMode="contain"
              />
            )}
            theme={{
              calendarBackground: 'transparent',
              textSectionTitleColor: '#9CA3AF',
              selectedDayBackgroundColor: '#4F10B8',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#4F10B8',
              dayTextColor: '#374151',
              textDisabledColor: '#D1D5DB',
              arrowColor: '#374151',
              textDayFontSize: 14,
              textMonthFontSize: 18,
              textMonthFontWeight: FontWeight.FONT_700,
              textDayHeaderFontSize: 12,
            }}
            dayComponent={({ date, state }) => {
              const marking = markedDates[date.dateString];
              const isSelected = selectedDate === date.dateString;
              const hasEvent = !!marking;

              return (
                <TouchableOpacity
                  style={[styles.dayContainer]}
                  onPress={() => setSelectedDate(date.dateString)}
                >
                  <View
                    style={[
                      styles.dayBackground,
                      (isSelected || (hasEvent && !isSelected)) &&
                      styles.purpleCircle,
                      !isSelected &&
                      hasEvent && { backgroundColor: '#4F10B820' },
                      isSelected && { backgroundColor: '#4F10B8' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        state === 'disabled' && { color: '#D1D5DB' },
                        isSelected && { color: '#fff', fontWeight: FontWeight.FONT_700 },
                        !isSelected &&
                        hasEvent && { color: '#4F10B8', fontWeight: FontWeight.FONT_700 },
                      ]}
                    >
                      {date.day}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {selectedDayItems.length > 0 && (
          <View style={styles.outfitsListContainer}>
            {selectedDayItems.map((item, index) => (
              <View key={item._id || index}>{renderOutfitItem({ item })}</View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* <TouchableOpacity 
        style={styles.fab} 
        activeOpacity={0.8}
      >
        <Image 
          source={imagePath.vector_icon} 
          style={styles.fabIcon} 
          resizeMode="contain" 
        />
        <Text style={styles.fabBotText}>BAE!</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backGroundColor1,
  },
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
    borderRadius: wp(5),
    backgroundColor: Colors.bgGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: wp(5),
    height: wp(5),
    tintColor: Colors.black,
  },
  headerTitle: {
    flex: 1,
    fontSize: wp(6),
    fontFamily: FontFamily.Bold,
    textAlign: 'center',
    color: Colors.black,
    marginLeft: wp(10), // Offset for the back button width to center title
  },
  calendarContainer: {
    backgroundColor: Colors.backGroundColor1,
    paddingHorizontal: wp(4),
    marginTop: hp(1),
  },

  dayContainer: {
    width: wp(10),
    height: hp(5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayBackground: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  dayText: {
    fontSize: 14,
    color: '#374151',
  },

  outfitsListContainer: {
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
  },
  outfitCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: hp(2),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  outfitImage: {
    width: wp(18),
    height: wp(18),
    borderRadius: 12,
  },
  outfitInfo: {
    flex: 1,
    marginRight: 16,
  },
  dateBadgeList: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.4),
    borderRadius: wp(100),
    alignSelf: 'flex-start',
    marginBottom: hp(1),
  },
  dateTextList: {
    fontSize: FontSize.FONT_10,
    color: '#8B5CF6',
    fontWeight: FontWeight.FONT_600,
  },
  outfitName: {
    fontSize: FontSize.FONT_16,
    fontWeight: FontWeight.FONT_700,
    color: Colors.black,
    marginBottom: 4,
  },
  outfitDescription: {
    fontSize: 12,
    color: Colors.graytext,
    lineHeight: 16,
  },
  fab: {
    position: 'absolute',
    bottom: hp(4),
    right: wp(5),
    width: wp(14),
    height: wp(14),
    borderRadius: wp(7),
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.bgGrey,
  },
  fabIcon: {
    width: 24,
    height: 24,
    tintColor: Colors.themeColor,
  },
  fabBotText: {
    fontSize: 8,
    color: Colors.themeColor,
    fontWeight: FontWeight.FONT_700,
    marginTop: -2,
  },
});

export default Calendar;
