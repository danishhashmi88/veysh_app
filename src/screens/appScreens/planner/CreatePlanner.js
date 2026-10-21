import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../../component/common/UI/Header';
import LabelInput from '../../../component/common/Inputs/LabelInput';
import AppButton from '../../../component/common/Buttons/AppButton';
import TextSwitch from '../../../component/Settings/TextSwitch';
import { Colors } from '../../../constant/colors';
import { hp, wp, getImageUrl } from '../../../utils/helper';
import { FontFamily, FontSize, FontWeight } from '../../../constant/fonts';
import { imagePath } from '../../../constant/imagePath';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import { getOutfitsList } from '../../../redux/thunks/outfitsThunk';
import {
  addPlannerEvent,
  updateEvent,
  getOutfitOfTheDay,
} from '../../../redux/thunks/plannerThunk';
import {
  updateDraftPlannerData,
  clearDraftPlannerData
} from '../../../redux/slices/plannerSlice';
import { getItemsList } from '../../../redux/thunks/itemsThunk';
import { SafeAreaView } from 'react-native-safe-area-context';
import { showToast, showDangerToast } from '../../../utils/toast';
import { IMAGEURL } from '../../../utils/axios';

const { width } = Dimensions.get('window');

const CreatePlanner = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { outfitsList, loading: outfitsLoading } = useSelector(
    state => state.outfits,
  );
  const { itemsList, loading: itemsLoading } = useSelector(
    state => state.items,
  );
  const { draftPlannerData } = useSelector(state => state.planner);
  const route = useRoute();
  const { eventDetail, preselectedOutfitId, preselectedOutfitImage, preselectedItemId, preselectedItemImage, isCopy, planForToday } =
    route.params || {};
  console.log('itemdetaiklk', eventDetail);
  console.log('preselectedOutfitId', preselectedOutfitId);
  console.log('preselectedOutfitImage', preselectedOutfitImage);


  const [eventName, setEventName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [rawDate, setRawDate] = useState(new Date());
  const [rawTime, setRawTime] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [activeTab, setActiveTab] = useState('My Outfit');
  const [selectedOutfit, setSelectedOutfit] = useState(null);
  const [selectedOutfitImage, setSelectedOutfitImage] = useState(null);
  console.log("selectedOutfitImage", selectedOutfitImage)
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]); // Array of {id, image}
  const [selectedItemImage, setSelectedItemImage] = useState(null);
  const [dayReminder, setDayReminder] = useState(false);
  const [hourReminder, setHourReminder] = useState(false);
  const isInitialized = useRef(false);

  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [errors, setErrors] = useState({
    eventName: '',
    date: '',
    selection: '',
  });
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [shouldDisableDayReminder, setShouldDisableDayReminder] = useState(true);
  const [shouldDisableHourReminder, setShouldDisableHourReminder] = useState(true);

  useEffect(() => {
    if (!date) {
      setShouldDisableDayReminder(true);
      setShouldDisableHourReminder(true);
      return;
    }

    const isTodaySelected = moment(date, 'YYYY-MM-DD').isSame(moment(), 'day');
    setShouldDisableDayReminder(isTodaySelected);

    let isLessThan2Hours = false;
    if (isTodaySelected && time && rawTime) {
      const selectedDateTime = moment(rawTime);
      const combinedDateTime = moment().set({
        hour: selectedDateTime.get('hour'),
        minute: selectedDateTime.get('minute'),
        second: 0,
      });

      const twoHoursFromNow = moment().add(2, 'hours');
      if (combinedDateTime.isBefore(twoHoursFromNow)) {
        isLessThan2Hours = true;
      }
    }

    setShouldDisableHourReminder(!time || (isTodaySelected && isLessThan2Hours));
  }, [date, time, rawTime]);

  useEffect(() => {
    if (shouldDisableDayReminder && dayReminder) setDayReminder(false);
    if (shouldDisableHourReminder && hourReminder) setHourReminder(false);
  }, [shouldDisableDayReminder, shouldDisableHourReminder, dayReminder, hourReminder]);


  const tabs = ['My Outfit', 'My Items'];
  useEffect(() => {
    if (isInitialized.current) return;

    // Load draft text fields if any
    if (draftPlannerData?.isDraftActive) {
      setEventName(draftPlannerData.name || '');
      setDate(draftPlannerData.date || '');
      setTime(draftPlannerData.time || '');
      setNotes(draftPlannerData.notes || '');
      setDayReminder(draftPlannerData.dayReminder);
      setHourReminder(draftPlannerData.hourReminder);
    }
    // Load eventDetail if editing
    if (eventDetail) {
      setEventName(eventDetail?.name || '');
      setNotes(eventDetail?.notes || '');
      setDayReminder(eventDetail?.remind_me_1day_before);
      setHourReminder(eventDetail?.remind_me_2hours_before);
      if (eventDetail.event_date) {
        const parsedDate = new Date(eventDetail.event_date);
        setRawDate(parsedDate);
        setDate(moment(parsedDate).format('YYYY-MM-DD'));
      }
      if (eventDetail.event_time) {
        const parsedTime = moment(eventDetail.event_time, 'hh:mm a');
        setRawTime(parsedTime.toDate());
        setTime(parsedTime.format('hh:mm a'));
      }
      if (eventDetail.outfit) {
        setSelectedOutfit(eventDetail.outfit?._id);
        const outfitImg =
          eventDetail.outfit?.image ||
          (eventDetail.outfit?.images && eventDetail.outfit?.images.length > 0
            ? eventDetail.outfit?.images[0]
            : null);
        setSelectedOutfitImage(outfitImg);
      } else if (eventDetail.items && eventDetail.items.length > 0) {
        const itemsData = eventDetail.items.map(i => ({
          id: i._id,
          image:
            i.image || (i.images && i.images.length > 0 ? i.images[0] : null),
        }));
        setSelectedItems(itemsData);
        if (itemsData.length > 0) {
          setSelectedItem(itemsData[0].id);
          setSelectedItemImage(itemsData[0].image);
        }
      } else if (eventDetail.item) {
        setSelectedItem(eventDetail.item?._id);
        const itemImg =
          eventDetail.item?.image ||
          (eventDetail.item?.images && eventDetail.item?.images.length > 0
            ? eventDetail.item?.images[0]
            : null);
        setSelectedItemImage(itemImg);
        setSelectedItems([{ id: eventDetail.item?._id, image: itemImg }]);
      }
    }
    // Load preselected IDs from parameters (creates new planner with this item/outfit)
    if (preselectedOutfitId) {
      setSelectedOutfit(preselectedOutfitId);
      if (preselectedOutfitImage) setSelectedOutfitImage(preselectedOutfitImage);
    } else if (preselectedItemId) {
      setSelectedItem(preselectedItemId);
      if (preselectedItemImage) setSelectedItemImage(preselectedItemImage);
      setSelectedItems([{ id: preselectedItemId, image: preselectedItemImage }]);
    } else if (planForToday && !draftPlannerData?.date) {
      const todayDate = new Date();
      setRawDate(todayDate);
      setDate(moment(todayDate).format('YYYY-MM-DD'));
    }

    isInitialized.current = true;
  }, [eventDetail, preselectedOutfitId, preselectedItemId, draftPlannerData, planForToday]);

  // Handle Return Params from selection screens
  // useEffect(() => {
  //   if (route.params?.selectedOutfit) {
  //     setSelectedOutfit(route.params.selectedOutfit);
  //     setSelectedOutfitImage(route.params.selectedOutfitImage);
  //     setSelectedItem(null);
  //     setSelectedItemImage(null);
  //     if (errors.selection) setErrors(prev => ({ ...prev, selection: '' }));
  //   }
  //   if (route.params?.selectedItem) {
  //     setSelectedItem(route.params.selectedItem);
  //     setSelectedItemImage(route.params.selectedItemImage);
  //     setSelectedOutfit(null);
  //     setSelectedOutfitImage(null);
  //     if (errors.selection) setErrors(prev => ({ ...prev, selection: '' }));
  //   }
  // }, [route.params]);


  const handleOutfitSelect = () => {
    dispatch(updateDraftPlannerData({
      name: eventName,
      date: date,
      time: time,
      notes: notes,
      dayReminder: dayReminder,
      hourReminder: hourReminder,
    }));
    navigation.navigate('ItemHomes', {
      onSelect: (data) => {
        console.log('Received:', data);
        if (data && data.type === 'Outfit') {
          setSelectedOutfit(data.selectedOutfit);
          setSelectedOutfitImage(data.selectedOutfitImage);
          setSelectedItem(null);
          setSelectedItemImage(null);
          setSelectedItems([]);
        }
      },
      type: 'Outfit',
      initialSelectedIds: selectedOutfit ? [selectedOutfit] : [],
    });
  };

  const handleItemSelect = () => {
    dispatch(updateDraftPlannerData({
      name: eventName,
      date: date,
      time: time,
      notes: notes,
      dayReminder: dayReminder,
      hourReminder: hourReminder,
    }));
    navigation.navigate('ItemHomes', {
      onSelect: (data) => {
        console.log('Received:', data);
        if (data && data.type === 'item') {
          setSelectedItems(data.selectedItems || []);
          setSelectedOutfit(null);
          setSelectedOutfitImage(null);
          // For backward compatibility if needed:
          if (data.selectedItems?.length > 0) {
            setSelectedItem(data.selectedItems[0].id);
            setSelectedItemImage(data.selectedItems[0].image);
          } else {
            setSelectedItem(null);
            setSelectedItemImage(null);
          }
        }
      },
      type: 'item',
      initialSelectedIds: selectedItems.map(i => i.id),
    });
  };

  const handleSave = async () => {
    let hasError = false;
    const newErrors = { eventName: '', date: '', selection: '' };

    if (!eventName.trim()) {
      newErrors.eventName = 'Event Name is required';
      hasError = true;
    }
    if (!date) {
      newErrors.date = 'Date is required';
      hasError = true;
    }
    if (!selectedOutfit && selectedItems.length === 0) {
      newErrors.selection = 'Please select an outfit or item';
      hasError = true;
    }
    // Time and Notes are NOT mandatory as per user request


    setErrors(newErrors);

    if (hasError) {
      showDangerToast('Please fill all mandatory fields');
      return;
    }

    const payload = {
      name: eventName,
      outfit_id: selectedOutfit,
      item_id: selectedItems.length > 0 ? (selectedItems.length === 1 ? selectedItems[0].id : selectedItems.map(i => i.id)) : null,
      item_ids: selectedItems.map(i => i.id),
      notes: notes,
      remind_me_1day_before: dayReminder,
      remind_me_2hours_before: hourReminder,
      event_date: date,
      event_time: time,
    };
    console.log('paylofgdfgdsfad is', payload);
    if (eventDetail && !isCopy) {
      payload.o_id = eventDetail?._id;
    }
    console.log('--- SAVE PLANNER DIAGNOSTIC ---', {
      isCopy,
      isEdit,
      hasEventDetail: !!eventDetail,
      eventId: eventDetail?._id,
      payload_o_id: payload.o_id,
      payload_name: payload.name,
    });

    try {
      const resultAction =
        eventDetail && !isCopy
          ? await dispatch(updateEvent(payload))
          : await dispatch(addPlannerEvent(payload));
      // const resultAction = await dispatch(addPlannerEvent(payload));
      console.log("resultAction", resultAction)
      if (
        (!isCopy && eventDetail && updateEvent.fulfilled.match(resultAction)) ||
        ((isCopy || !eventDetail) &&
          addPlannerEvent.fulfilled.match(resultAction))
      ) {
        dispatch(clearDraftPlannerData());
        await dispatch(getOutfitOfTheDay());
        showToast(
          eventDetail && !isCopy
            ? 'Planner updated successfully'
            : isCopy
              ? 'Planner copied successfully'
              : 'Planner added successfully',
        );
        navigation.goBack();
      } else {
        showDangerToast(
          resultAction.payload ||
          `Failed to ${isEdit ? 'update' : 'add'} planner`,
        );
      }
    } catch (error) {
      console.error('Save Error:', error);
      showDangerToast('An unexpected error occurred');
    }
  };


  const additionalItems = [
    imagePath.planner3,
    imagePath.planner3,
    imagePath.planner3,
    imagePath.planner3,
  ].filter(Boolean);

  // const renderHeader = () => (
  //   <Back
  //     style={{ backgroundColor: Colors.bgGrey }}
  //     headerTitle={eventDetail ? 'Update Event' : 'Create Event'}
  //   />
  // );

  const isEdit = !!eventDetail && !isCopy;

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      <Header
        showLeftButton={true}
        onLeftButtonPress={() => navigation.goBack()}
        title={
          isCopy ? 'Create Event' : isEdit ? 'Update Event' : 'Create Event'
        }
        headerTextStyle={{
          fontSize: wp(6),
          fontFamily: FontFamily.Bold,
        }}
        backgroundColor={Colors.white}
      />
      <SafeAreaView
        style={[styles.container, { paddingTop: 0 }]}
        edges={['left', 'right', 'bottom']}
      >
        <StatusBar
          barStyle="dark-content"
          translucent
          backgroundColor="transparent"
        />
        {/* {renderHeader()} */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Form Fields */}
          <LabelInput
            title="Event Name *"
            placeholder="Enter Event Name"
            value={eventName}
            onChangeText={text => {
              setEventName(text);
              if (errors.eventName)
                setErrors(prev => ({ ...prev, eventName: '' }));
            }}
            errorText={errors.eventName}
          />

          <LabelInput
            title="Date *"
            placeholder="Select Date"
            value={date}
            onChangeText={setDate}
            type="touchable"
            showRightIcon={true}
            rightIcon={imagePath.calenderTime}
            onRightIconPress={() => {
              setDatePickerOpen(true);
              if (errors.date) setErrors(prev => ({ ...prev, date: '' }));
            }}
            errorText={errors.date}
          />

          <LabelInput
            title="Time"
            placeholder="Select Time"
            value={time}
            onChangeText={setTime}
            type="touchable"
            showRightIcon={true}
            rightIcon={imagePath.clockTime || imagePath.mini_arrow}
            onRightIconPress={() => {
              if (!date) {
                showDangerToast('Please select a date first');
                return;
              }
              setTimePickerOpen(true)
            }}
          />

          <LabelInput
            title="Notes"
            placeholder="Enter Style Notes"
            value={notes}
            onChangeText={setNotes}
            multiline
            inputHeight={hp(10)}
          />

          {/* Select Outfits/Items Section */}
          <Text style={styles.sectionTitle}>Select Outfit or Item *</Text>

          <View style={styles.selectionLinkContainer}>
            <TouchableOpacity
              style={[styles.selectionCard, selectedOutfit && styles.activeSelectionCard]}
              onPress={handleOutfitSelect}
            >
              <View style={styles.selectionIconBg}>
                <Image source={imagePath.outfit || imagePath.closet} style={styles.selectionIcon} />
              </View>
              <Text style={styles.selectionLabel}>My Outfits</Text>

            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.selectionCard, selectedItems.length > 0 && styles.activeSelectionCard]}
              onPress={handleItemSelect}
            >
              <View style={styles.selectionIconBg}>
                <Image source={imagePath.outfitPlanner} style={styles.selectionIcon} />
              </View>
              <Text style={styles.selectionLabel}>My Items</Text>

            </TouchableOpacity>
          </View>

          {/* Selected Preview */}
          {(selectedOutfitImage || selectedItems.length > 0) && (
            <View style={styles.previewContainer}>
              <Text style={styles.previewLabel}>Selected {selectedOutfit ? 'Outfit' : 'Item(s)'}:</Text>
              
              {selectedOutfit ? (
                <View style={styles.previewCard}>
                  <Image
                    source={{ uri: getImageUrl(selectedOutfitImage) }}
                    style={styles.previewImage}
                    resizeMode="contain"
                  />
                  <TouchableOpacity
                    style={styles.removePreview}
                    onPress={() => {
                      setSelectedOutfit(null);
                      setSelectedOutfitImage(null);
                    }}
                  >
                    <Text style={styles.removeText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.selectedItemsScroll}
                >
                  {selectedItems.map((item, index) => (
                    <View key={item.id} style={styles.selectedItemPreviewCard}>
                      <Image
                        source={{ uri: getImageUrl(item.image) }}
                        style={styles.selectedItemPreviewImage}
                        resizeMode="contain"
                      />
                      <TouchableOpacity
                        style={styles.removePreviewSmall}
                        onPress={() => {
                          const updatedItems = selectedItems.filter(i => i.id !== item.id);
                          setSelectedItems(updatedItems);
                          if (updatedItems.length === 0) {
                            setSelectedItem(null);
                            setSelectedItemImage(null);
                          } else {
                            setSelectedItem(updatedItems[0].id);
                            setSelectedItemImage(updatedItems[0].image);
                          }
                        }}
                      >
                        <Text style={styles.removeTextSmall}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>
          )}

          {errors.selection ? (
            <Text
              style={{
                color: Colors.red || 'red',
                fontSize: FontSize.FONT_12,
                marginTop: hp(1),
                marginLeft: wp(1),
              }}
            >
              {errors.selection}
            </Text>
          ) : null}

          {/* Reminder */}
          <Text style={styles.sectionTitle}>Reminder</Text>
          <TextSwitch
            label="Remind me 1 day before"
            value={dayReminder}
            onValueChange={setDayReminder}
            useShadow={false}
            style={styles.reminderSwitch}
            disabled={shouldDisableDayReminder}
          />
          <TextSwitch
            label="Remind me 2 hours before"
            value={hourReminder}
            onValueChange={setHourReminder}
            useShadow={false}
            style={styles.reminderSwitch}
            disabled={shouldDisableHourReminder}
          />

          <AppButton
            title="Save"
            marginTop={hp(3)}
            marginBottom={hp(4)}
            loading={outfitsLoading || itemsLoading}
            onPress={handleSave}
          />
        </ScrollView>

        <DatePicker
          modal
          open={datePickerOpen}
          date={rawDate}
          mode="date"
          minimumDate={today} // ⛔ past dates & past years blocked
          onConfirm={date => {
            setDatePickerOpen(false);
            setRawDate(date);
            setDate(moment(date).format('YYYY-MM-DD'));
          }}
          onCancel={() => {
            setDatePickerOpen(false);
          }}
        />

        <DatePicker
          modal
          open={timePickerOpen}
          date={rawTime}
          mode="time"
          minimumDate={date && moment(date, 'YYYY-MM-DD').isSame(moment(), 'day') ? new Date() : undefined}
          onConfirm={time => {
            setTimePickerOpen(false);
            setRawTime(time);
            setTime(moment(time).format('hh:mm a'));
          }}
          onCancel={() => {
            setTimePickerOpen(false);
          }}
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
  scrollContent: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(5),
    marginTop: hp(2),
  },
  sectionTitle: {
    fontSize: FontSize.FONT_16,
    fontFamily: FontFamily.OutfitMedium,
    color: Colors.blackVar2,
    marginTop: hp(2),
    marginBottom: hp(1.5),
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: hp(2),
    gap: wp(2),
  },
  tabButton: {
    paddingVertical: hp(0.8),
    paddingHorizontal: wp(4),
    borderRadius: wp(5),
    backgroundColor: Colors.white,
    borderRadius: 20,
    overflow: 'hidden',
  },
  activeTabButton: {
    backgroundColor: Colors.voilet,
    borderRadius: 20,
    overflow: 'hidden',
  },
  tabText: {
    fontFamily: FontFamily.OutfitMedium,
    color: Colors.graytext,
  },
  activeTabText: {
    color: Colors.white,
    fontFamily: FontFamily.OutfitMedium,
    // fontWeight: FontWeight.FONT_600,
  },
  outfitGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(4),
    justifyContent: 'flex-start',
  },
  outfitCard: {
    width: wp(28),
    height: hp(16),
    borderRadius: wp(4),
    padding: wp(2),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(1),
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  activeOutfitCard: {
    borderColor: Colors.themeColor,
  },
  outfitImage: {
    width: '90%',
    height: '90%',
  },
  checkIconContainer: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: Colors.themeColor,
    borderRadius: wp(1),
    padding: 3,
  },
  checkIcon: {
    width: 10,
    height: 10,
    tintColor: Colors.white,
  },
  additionalItemsContainer: {
    flexDirection: 'row',
    marginTop: hp(1),
  },
  additionalItemCard: {
    width: wp(25),
    height: wp(25),
    marginRight: wp(3),
    borderRadius: wp(3),
    overflow: 'hidden',
  },
  additionalItemImage: {
    width: '100%',
    height: '100%',
  },
  reminderSwitch: {
    width: '100%',
    paddingHorizontal: 0,
    paddingVertical: hp(0.5),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(5),
    // SafeAreaView already applies the top inset, so keep this small
    paddingTop: Platform.OS === 'ios' ? hp(1) : hp(1.5),
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
  backIcon: {
    width: wp(5),
    height: wp(5),
    tintColor: Colors.black,
  },
  headerTitle: {
    flex: 1,
    fontSize: wp(6),
    fontFamily: FontFamily.Bold,
    color: Colors.black,
    marginLeft: wp(4),
    // textAlign: 'center',
  },
  headerRightSpacer: {
    width: wp(10),
    height: wp(10),
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.borderGrey,
    borderRadius: wp(100),
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    fontFamily: FontFamily.OutfitMedium,
    fontSize: FontSize.FONT_14,
    color: Colors.black,
    marginBottom: hp(1),
    backgroundColor: Colors.white,
  },
  textArea: {
    height: hp(10),
    textAlignVertical: 'top',
  },
  label: {
    // fontSize: FontSize.FONT_14,
    // fontWeight: FontWeight.FONT_500,
    // color: Colors.black,
    // marginBottom: hp(1),
    // marginTop: hp(1),
    fontFamily: FontFamily.OutfitMedium,
    color: Colors.blackVar2,
    textAlign: 'left',
    width: '100%',
    marginBottom: hp(0.7),
    marginTop: hp(1),
  },
  selectionLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(2),
    gap: wp(4),
  },
  selectionCard: {
    flex: 1,
    height: hp(12),
    backgroundColor: Colors.white,
    borderRadius: wp(4),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activeSelectionCard: {
    borderColor: Colors.themeColor,
  },
  selectionIconBg: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: Colors.bgGrey,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(0.5),
  },
  selectionIcon: {
    width: wp(6),
    height: wp(6),
    tintColor: Colors.themeColor,
  },
  selectionLabel: {
    fontSize: FontSize.FONT_14,
    fontFamily: FontFamily.OutfitMedium,
    color: Colors.blackVar2,
  },
  checkIconContainerSmall: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.themeColor,
    borderRadius: wp(100),
    padding: 2,
  },
  checkIconSmall: {
    width: 8,
    height: 8,
    tintColor: Colors.white,
  },
  previewContainer: {
    marginTop: hp(2),
    marginBottom: hp(2),
  },
  previewLabel: {
    fontSize: FontSize.FONT_14,
    fontFamily: FontFamily.OutfitMedium,
    color: Colors.blackVar2,
    marginBottom: hp(1),
  },
  previewCard: {
    width: wp(40),
    height: wp(40),
    backgroundColor: Colors.white,
    borderRadius: wp(4),
    padding: wp(2),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderGrey,
    alignSelf: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  removePreview: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: Colors.red || 'red',
    width: wp(6),
    height: wp(6),
    borderRadius: wp(3),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  removeText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: FontWeight.FONT_700,
  },
  selectedItemsScroll: {
    paddingVertical: hp(1),
  },
  selectedItemPreviewCard: {
    width: wp(25),
    height: wp(25),
    backgroundColor: Colors.white,
    borderRadius: wp(3),
    marginRight: wp(3),
    padding: wp(1),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderGrey,
  },
  selectedItemPreviewImage: {
    width: '90%',
    height: '90%',
  },
  removePreviewSmall: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: Colors.red || 'red',
    width: wp(5),
    height: wp(5),
    borderRadius: wp(2.5),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  removeTextSmall: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: FontWeight.FONT_700,
  },
});

export default CreatePlanner;
