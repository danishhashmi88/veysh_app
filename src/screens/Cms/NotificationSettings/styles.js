import { StyleSheet, Platform, StatusBar } from 'react-native';
import { Colors } from '../../../constant/colors';
import { hp, wp } from '../../../utils/helper';
import { FontFamily, FontSize, FontWeight } from '../../../constant/fonts';

export const getStyles = Colors =>
  StyleSheet.create({
    safearea: {
      flex: 1,
      backgroundColor: Colors.white,
    },
    headerView: {
      gap: hp(1),
      alignSelf: 'center',
    },
    title: {
      fontSize: FontSize.FONT_28,
      fontFamily: FontFamily.OutfitMedium,
      color: Colors.black,
    },
    description: {
      color: Colors.zink500,
      fontFamily: FontFamily.OutfitMedium,
      width: wp(90),
    },
    inner: {
      flex: 1,
      paddingHorizontal: wp(6),
      backgroundColor: Colors.backGroundColor1,
    },
    innerItem: {
      gap: hp(2),
      marginTop: hp(2),
      backgroundColor: Colors.white, // Card ka background white karne ke liye
      padding: wp(4), // Card ke andar ki spacing
      borderRadius: wp(3), // Card ke corners gol karne ke liye
    },
  });
