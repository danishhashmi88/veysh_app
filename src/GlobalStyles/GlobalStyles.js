import { Platform, StyleSheet } from 'react-native';
import { FontFamily, FontSize, FontWeight, OutfitFamily } from '../constant/fonts';
import { hp, wp } from '../utils/helper';
import { width } from '../constant/screenConfig';

export const getGlobalStyles = Colors =>
  StyleSheet.create({
    errorText: {
      color: Colors.red,
      fontSize: FontSize.FONT_13,
      fontWeight: FontWeight.FONT_400,
      alignSelf: 'flex-start',
      marginTop: hp(0.5),
      fontFamily: FontFamily.OutfitMedium,
    },
    shadowBox: {
      backgroundColor: Colors.white,
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 5,
    },
    topShadowBox: {
      backgroundColor: Colors.white,
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: -3,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 5,
    },
    cardShadowBox: {
      backgroundColor: Colors.white,
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 5,
    },
    inputAndLabel: {
      gap: wp(1),
      width: wp(90),
    },
    inputTitle: {
      fontSize: FontSize.FONT_16,
      fontWeight: FontWeight.FONT_700,
      color: Colors.grey950,
      textAlign: 'left',
      width: '100%',
      fontFamily: FontFamily.OutfitMedium,
    },
    dropdown: {
      height: hp(6),
      borderWidth: 1,
      borderColor: Colors.borderGrey,
      borderRadius: wp(3.5),
      width: wp(90),
      paddingHorizontal: wp(4),
      // marginBottom:hp(2)
    },
    blurView: {
      position: 'absolute',
      top: 0,

      width: '100%',
      height: '100%',

      justifyContent: 'center',
      alignItems: 'center',
    },
    authScreenTitle: {
      fontSize: 30,
      // fontWeight: FontWeight.FONT_600,
      color: Colors.blackVar2,
      fontFamily: FontFamily.Bold,
    },
    authScreenSubtitle: {
      fontSize: FontSize.FONT_13,

      color: '#71717A',
      marginTop: hp(1),
      fontFamily: OutfitFamily.Regular,
    },
    textTitle: {
      fontSize: FontSize.FONT_18,
      // fontWeight: FontWeight.FONT_600,
      color: Colors.blackVar2,
      fontFamily: FontFamily.OutfitMedium,
    },
  });
