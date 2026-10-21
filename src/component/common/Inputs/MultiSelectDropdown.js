import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MultiSelect } from 'react-native-element-dropdown';
import { useTheme } from '../../../hooks/useTheme';
import { imagePath } from '../../../constant/imagePath';
import { wp, hp } from '../../../utils/helper';
import { FontSize, FontFamily, OutfitFamily, FontWeight } from '../../../constant/fonts';

const MultiSelectDropdown = React.forwardRef(({
  data,
  value,
  onChange,
  title,
  placeholder,
  width = '100%',
  style = {},
  titleWeight = FontWeight.FONT_400,
  search = false,
  searchPlaceholder = 'Search...',
}, ref) => {
  const Colors = useTheme();
  const localStyles = getLocalStyles(Colors);

  const renderItem = item => {
    const selectedValues = Array.isArray(value) ? value : [];
    const isSelected = selectedValues.includes(item.value);
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
            isSelected && { color: Colors.themeColor, fontWeight: FontWeight.FONT_600 },
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
    <View style={[{ width: width, marginTop: hp(0.5) }, style]}>
      <Text style={[localStyles.fieldLabel, { fontWeight: titleWeight }]}>
        {title}
      </Text>

      <MultiSelect
        ref={ref}
        style={localStyles.dropdown}
        placeholderStyle={localStyles.placeholderStyle}
        selectedTextStyle={localStyles.selectedTextStyle}
        inputSearchStyle={localStyles.inputSearchStyle}
        iconStyle={localStyles.iconStyle}
        data={data}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        search={search}
        searchPlaceholder={searchPlaceholder}
        value={Array.isArray(value) ? value : []}
        onChange={onChange}
        renderRightIcon={() => (
          <View style={{ marginRight: -10 }}>
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
        showsVerticalScrollIndicator={true}
        renderSelectedItem={(item, unSelect) => (
          <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
            <View style={localStyles.selectedStyle}>
              <Text style={localStyles.textSelectedStyle}>{item.label}</Text>
              <Image
                source={imagePath.grey_cross}
                resizeMode="contain"
                style={localStyles.cross}
              />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
},
);

const getLocalStyles = Colors =>
  StyleSheet.create({
    fieldLabel: {
      fontFamily: FontFamily.OutfitMedium,
      color: Colors.black,
      textAlign: 'left',
      width: '100%',
      marginBottom: hp(0.7),
      fontSize: FontSize.FONT_15,
    },
    dropdown: {
      minHeight: hp(5),
      backgroundColor: Colors.white,
      borderRadius: wp(4),
      borderWidth: 1,
      borderColor: Colors.borderGrey,
      paddingHorizontal: wp(5),
      paddingVertical: hp(0.5),
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
      marginTop: 5,
      borderColor: Colors.borderGrey,
      borderWidth: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
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
    selectedStyle: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: wp(100),
      backgroundColor: Colors.cardBg,
      marginTop: 8,
      marginRight: 10,
      paddingHorizontal: 15,
      paddingVertical: 8,
      gap: wp(2),
      borderWidth: 1,
      borderColor: Colors.borderGrey,
    },
    textSelectedStyle: {
      fontSize: FontSize.FONT_12,
      color: Colors.blackVar2,
      fontFamily: OutfitFamily.Regular,
    },
    cross: {
      width: wp(2.5),
      height: wp(2.5),
    },
  });

export default MultiSelectDropdown;
