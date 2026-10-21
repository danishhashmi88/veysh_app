import { StyleSheet, Platform, StatusBar } from 'react-native';
import { Colors } from '../../../constant/colors';
import { hp, wp } from '../../../utils/helper';
import { FontSize, FontWeight } from '../../../constant/fonts';

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
      fontSize: FontSize.FONT_20,
      fontWeight: FontWeight.FONT_700,
      color: Colors.black,
    },
    description: {
      color: Colors.zink500,
      fontSize: FontSize.FONT_14,
      width: wp(90),
    },
    inner: {
      flex: 1,
      paddingHorizontal: wp(6),
      gap: hp(2.5),
      marginTop: hp(2),
    },
  });
