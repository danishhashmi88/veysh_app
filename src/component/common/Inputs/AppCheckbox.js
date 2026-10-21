import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { FontFamily, FontSize } from '../../../constant/fonts';
import { wp, hp } from '../../../utils/helper';

const AppCheckbox = ({ label, checked, onPress, containerStyle, labelStyle, checkboxStyle }) => {
  const Colors = useTheme();

  return (
    <TouchableOpacity
      style={[styles.checkboxContainer, containerStyle]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.checkbox,
          { borderColor: Colors.greyBorder, backgroundColor: Colors.white },
          checked && { borderColor: Colors.themeColor },
          checkboxStyle
        ]}
      >
        {checked && (
          <View style={[styles.checkboxInner, { backgroundColor: Colors.themeColor }]} />
        )}
      </View>

      {label ? (
        <Text style={[styles.checkboxLabel, { color: Colors.black }, labelStyle]}>
          {label}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(0.5),
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(2),
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  checkboxLabel: {
    fontSize: FontSize.FONT_14,
    fontFamily: FontFamily.OutfitMedium,
  },
});

export default AppCheckbox;
