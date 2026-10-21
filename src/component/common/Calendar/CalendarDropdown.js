import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useTheme } from '../../../hooks/useTheme';
import { imagePath } from '../../../constant/imagePath';
import { wp, hp } from '../../../utils/helper';
import { FontSize, FontFamily, OutfitFamily } from '../../../constant/fonts';

const MONTHS = [
  { label: 'All Months', value: 'ALL' },
  { label: 'January', value: '01' },
  { label: 'February', value: '02' },
  { label: 'March', value: '03' },
  { label: 'April', value: '04' },
  { label: 'May', value: '05' },
  { label: 'June', value: '06' },
  { label: 'July', value: '07' },
  { label: 'August', value: '08' },
  { label: 'September', value: '09' },
  { label: 'October', value: '10' },
  { label: 'November', value: '11' },
  { label: 'December', value: '12' },
];

const CalendarDropdown = ({ onSelect, selectedMonthValue }) => {
  const Colors = useTheme();
  const localStyles = getLocalStyles(Colors);

  const renderItem = item => {
    const isSelected = item.value === selectedMonthValue;
    return (
      <View
        style={[
          localStyles.item,
          isSelected && { backgroundColor: Colors.lightThemeCol1 },
        ]}
      >
        <Text
          style={[
            localStyles.itemTextStyle,
            isSelected && { color: Colors.themeColor },
          ]}
        >
          {item.label}
        </Text>
        {isSelected && (
          <Image
            source={imagePath.white_tick}
            style={localStyles.checkIcon}
            tintColor={Colors.themeColor}
          />
        )}
      </View>
    );
  };

  return (
    <View style={localStyles.container}>
      <Dropdown
        style={localStyles.dropdown}
        placeholderStyle={localStyles.placeholderStyle}
        selectedTextStyle={localStyles.selectedTextStyle}
        iconStyle={localStyles.iconStyle}
        data={MONTHS}
        labelField="label"
        valueField="value"
        placeholder="Select Month"
        value={selectedMonthValue}
        onChange={item => onSelect(item)}
        renderRightIcon={() => (
          <Image
            source={imagePath.chevronDown}
            style={localStyles.chevronIcon}
            resizeMode="contain"
          />
        )}
        containerStyle={localStyles.dropdownContainer}
        renderItem={renderItem}
        activeColor={Colors.lightThemeCol1}
        autoScroll={false}
      />
    </View>
  );
};

const getLocalStyles = Colors =>
  StyleSheet.create({
    container: {
      width: wp(28),
      zIndex: 100,
    },
    dropdown: {
      height: hp(4.5),
      backgroundColor: Colors.backGroundColor1,
      borderRadius: wp(100),
      paddingHorizontal: wp(3),
      flexDirection: 'row',
      alignItems: 'center',
    },
    placeholderStyle: {
      fontSize: FontSize.FONT_13,
      color: Colors.graytext,
      fontFamily: OutfitFamily.Regular,
    },
    selectedTextStyle: {
      fontSize: FontSize.FONT_13,
      color: Colors.black,
      fontFamily: OutfitFamily.Medium,
    },
    chevronIcon: {
      width: wp(3),
      height: wp(3),
    },
    dropdownContainer: {
      backgroundColor: Colors.white,
      borderRadius: wp(4),
      borderColor: Colors.borderGrey,
      borderWidth: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 20,
      zIndex: 9999,
      overflow: 'hidden',
      width: wp(28), // Matches dropdown width to prevent clipping
    },
    itemTextStyle: {
      fontSize: FontSize.FONT_13,
      color: Colors.blackVar3,
      fontFamily: OutfitFamily.Regular,
    },
    item: {
      paddingVertical: hp(1.2),
      paddingHorizontal: wp(4),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#F0F0F0',
    },
    checkIcon: {
      width: wp(3.5),
      height: wp(3.5),
      resizeMode: 'contain',
    },
  });

export default CalendarDropdown;
