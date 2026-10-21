import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FontSize, FontWeight, OutfitFamily } from '../../constant/fonts';
import { hp, wp } from '../../utils/helper';
import { getGlobalStyles } from '../../GlobalStyles/GlobalStyles';
import { useTheme } from '../../hooks/useTheme';
import CustomToggle from '../common/UI/CustomToggle';
import PostSwitch from './PostSwitch';

const TextSwitch = ({
  label,
  description,
  value,
  onValueChange,
  useShadow = true,
  style = {},
  disabled
}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const GlobalStyle = getGlobalStyles(Colors);
  return (
    <View style={[styles.card, useShadow && GlobalStyle.cardShadowBox, style]}>
      <View style={styles.textContainer}>
        <View style={{ flex: 1, marginRight: wp(2) }}>
          <Text style={styles.label}>{label}</Text>
          {description ? (
            <Text style={styles.description}>{description}</Text>
          ) : null}
        </View>
        <PostSwitch
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
        />
        {/* <CustomToggle value={value} onValueChange={onValueChange} /> */}
      </View>
    </View>
  );
};

export default TextSwitch;

export const getStyles = Colors =>
  StyleSheet.create({
    label: {
      fontSize: FontSize.FONT_16,
      color: Colors.blackVar2,
      fontFamily: OutfitFamily.Regular,
    },
    description: {
      fontSize: FontSize.FONT_14,
      color: Colors.graytext,
      marginTop: hp(0.5),
      fontFamily: OutfitFamily.Regular,
    },
    card: {
      width: wp(90),
      alignSelf: 'center',
      paddingVertical: hp(2),
      paddingHorizontal: wp(3),
      borderRadius: wp(3),
    },
    textContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  });
