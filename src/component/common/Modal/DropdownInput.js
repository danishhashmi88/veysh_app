import React, { useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import { Colors } from '../../../constant/colors';
import { FontSize, FontFamily, FontWeight } from '../../../constant/fonts';
import { hp, wp } from '../../../utils/helper';
import { imagePath } from '../../../constant/imagePath';
import { getGlobalStyles } from '../../../GlobalStyles/GlobalStyles';

const DropdownInput = ({
  title,
  placeholder,
  options,
  value,
  onSelect,
  showTitle = true,
  errorText = '',
  showRightIcon = true,
  rightIcon = imagePath.arrow_left,
  onRightIconPress = () => {},
  tintColor = '',
  width = wp(90),
  dropdownPosition = 'auto',
  useId = false,
  isMulti = false,
  borderColor,
  borderRadius,
  selectedTextStyle,
  placeholderStyle,
  rightIconStyle,
  titleStyle,
}) => {
  const dropdownRef = useRef(null);
  const GlobalStyle = getGlobalStyles(Colors);

  const dropdownData = useId
    ? options
    : options.map(item => ({ label: item, value: item }));

  return (
    <View style={{ width: width, marginTop: hp(0.5), alignSelf: 'center' }}>
      {showTitle && (
        <Text style={[styles.inputTitle, titleStyle]}>{title}</Text>
      )}
      {isMulti ? (
        <View style={styles.container}>
          <MultiSelect
            style={[
              styles.searchDropdown,
              borderColor ? { borderColor } : {},
              borderRadius ? { borderRadius } : {},
            ]}
            placeholderStyle={[styles.placeholderStyle, placeholderStyle]}
            selectedTextStyle={[styles.selectedTextStyle, selectedTextStyle]}
            inputSearchStyle={styles.inputSearchStyle}
            itemTextStyle={styles.itemTextStyle}
            // iconStyle={styles.iconStyle}
            data={dropdownData}
            iconStyle={{ display: 'none' }}
            labelField="label"
            valueField="value"
            placeholder={placeholder}
            value={value}
            onChange={items => onSelect(items)}
            renderRightIcon={() => (
              <TouchableOpacity
                style={{
                  width: wp(10),
                  height: hp(5.5),
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: -10,
                  // paddingRight: wp(3),
                }}
                onPress={() => {
                  dropdownRef.current?.open();
                  onRightIconPress();
                }}
              >
                <Image
                  source={rightIcon}
                  style={[styles.passIcon, rightIconStyle]}
                  tintColor={tintColor}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
            selectedStyle={styles.selectedStyle}
            dropdownPosition={dropdownPosition}
          />
        </View>
      ) : (
        <View
          style={[
            styles.phoneInputView,
            borderColor ? { borderColor } : {},
            borderRadius ? { borderRadius } : {},
          ]}
        >
          <Dropdown
            ref={dropdownRef}
            style={styles.dropdown}
            placeholderStyle={[styles.placeholderStyle, placeholderStyle]}
            selectedTextStyle={[
              styles.selectedTextStyle,
              { paddingRight: wp(3) },
              selectedTextStyle,
            ]}
            itemTextStyle={styles.itemTextStyle}
            containerStyle={[
              styles.dropdownContainer,
              { width },
              borderColor ? { borderColor } : {},
              borderRadius ? { borderRadius } : {},
            ]}
            iconStyle={{ display: 'none' }}
            data={dropdownData}
            labelField="label"
            valueField="value"
            placeholder={placeholder}
            value={value}
            onChange={item => onSelect(useId ? item : item.value)}
            dropdownPosition={dropdownPosition}
          />
          {showRightIcon && (
            <TouchableOpacity
              style={{
                width: wp(10),
                height: hp(5.5),
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                dropdownRef.current?.open();
                onRightIconPress();
              }}
            >
              <Image
                source={rightIcon}
                style={[styles.passIcon, rightIconStyle]}
                tintColor={tintColor}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </View>
      )}
      <Text style={GlobalStyle.errorText}>{errorText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  inputTitle: {
    fontSize: FontSize.FONT_15,
    fontWeight: FontWeight.FONT_600,
    color: Colors.grey950,
    textAlign: 'left',
    width: '100%',
  },
  searchDropdown: {
    backgroundColor: Colors.grey50,
    width: '100%',
    height: hp(6),
    borderWidth: 1,
    borderColor: Colors.grey200,
    borderRadius: wp(1.5),
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(1),
    paddingHorizontal: wp(3),
  },
  phoneInputView: {
    backgroundColor: Colors.grey50,
    width: '100%',
    height: hp(6),
    borderWidth: 1,
    borderColor: Colors.grey200,
    borderRadius: wp(1.5),
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(1),
  },
  dropdown: {
    flex: 1,
    paddingHorizontal: wp(3),
    height: '100%',
  },
  placeholderStyle: {
    fontSize: FontSize.FONT_15,
    color: Colors.grey400,
  },
  selectedTextStyle: {
    fontSize: FontSize.FONT_15,
    color: Colors.black,
  },
  itemTextStyle: {
    fontSize: FontSize.FONT_15,
    color: Colors.black,
  },
  dropdownContainer: {
    width: wp(90),
    borderRadius: wp(1.5),
    borderColor: Colors.grey200,
  },
  passIcon: {
    width: wp(3),
    height: hp(3),
    marginLeft: 8,
    tintColor: Colors.grey700,
  },
  selectedStyle: {
    borderRadius: 6,
  },
});

export default DropdownInput;
