import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useTheme } from '../../../hooks/useTheme';
import { imagePath } from '../../../constant/imagePath';
import { wp, hp } from '../../../utils/helper';
import { FontSize, FontFamily, OutfitFamily } from '../../../constant/fonts';

const SizeDropdown = React.forwardRef(({
  data,
  value,
  onChange,
  title,
  placeholder,
  width = '100%',
  style = {},
  titleWeight = '400', // Changed to 500 to match Medium weight
  marginTop, // Added prop support
  marginBottom = 0, // Added prop support
  search = false,
  searchPlaceholder = 'Search...',
}, ref) => {
  const Colors = useTheme();
  const localStyles = getLocalStyles(Colors);

  const renderItem = item => {
    const isSelected = item.value === value;
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
    <View
      style={[
        {
          width: width,
          marginTop: marginTop !== undefined ? marginTop : hp(0.5),
          marginBottom: marginBottom,
          zIndex: 100,
        },
        style,
      ]}
    >
      {/* 🟢 FIX: Yahan inline style mein titleWeight pass kiya */}
      <Text style={[localStyles.fieldLabel, { fontWeight: titleWeight }]}>
        {title}
      </Text>

      <Dropdown
        ref={ref}
        style={localStyles.dropdown}
        placeholderStyle={localStyles.placeholderStyle}
        selectedTextStyle={localStyles.selectedTextStyle}
        inputSearchStyle={localStyles.inputSearchStyle}
        iconStyle={localStyles.iconStyle}
        data={data}
        search={search}
        searchPlaceholder={searchPlaceholder}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        value={value}
        onChange={item => onChange(item.value)}
        renderRightIcon={() => (
          <View style={{ paddingLeft: wp(2) }}>
            <Image
              source={imagePath.chevronDown}
              style={{ width: wp(3), height: wp(3) }}
              resizeMode="contain"
            />
          </View>
        )}
        containerStyle={localStyles.dropdownContainer}
        renderItem={renderItem}
        activeColor={Colors.lightThemeCol1}
        autoScroll={false}
        maxHeight={300}
        dropdownPosition="auto"
      />
    </View>
  );
});

const getLocalStyles = Colors =>
  StyleSheet.create({
    fieldLabel: {
      fontFamily: FontFamily.OutfitMedium,
      color: Colors.black,
      textAlign: 'left',
      width: '100%',
      marginBottom: hp(0.8),
      fontSize: FontSize.FONT_15,
    },
    dropdown: {
      height: hp(6),
      backgroundColor: Colors.background,
      borderRadius: wp(3),
      borderWidth: 1,
      borderColor: Colors.borderGrey,
      paddingHorizontal: wp(5),
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
      fontFamily: OutfitFamily.Regular,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: hp(5),
      fontSize: FontSize.FONT_13,
      color: Colors.black,
      fontFamily: OutfitFamily.Regular,
      borderRadius: wp(2),
    },
    dropdownContainer: {
      backgroundColor: Colors.white,
      borderRadius: wp(4),
      marginTop: 1,
      borderColor: Colors.borderGrey,
      borderWidth: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 20,
      zIndex: 9999,
      overflow: 'hidden',
    },
    itemTextStyle: {
      fontSize: FontSize.FONT_13,
      color: Colors.blackVar3,
      fontFamily: OutfitFamily.Regular,
    },
    item: {
      paddingVertical: hp(1.5),
      paddingHorizontal: wp(4),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#F0F0F0',
    },
    checkIcon: {
      width: wp(4),
      height: wp(4),
      resizeMode: 'contain',
    },
  });

export default SizeDropdown;
