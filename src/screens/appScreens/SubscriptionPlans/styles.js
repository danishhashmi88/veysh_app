import { StyleSheet } from 'react-native';
// import { Colors } from '../../../../constant/colors';

import { hp, wp } from '../../../utils/helper';
import {
  FontFamily,
  FontSize,
  FontWeight,
  OutfitFamily,
} from '../../../constant/fonts';

export const getStyles = Colors =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: Colors.backgroundColor1,
    },
    screenTitle: {
      fontFamily: FontFamily.OutfitMedium,
      //   fontSize: FontSize.FONT_26,
      marginVertical: 20,
    },

    listContainer: {
      paddingBottom: 40,
      paddingHorizontal: 16,
      marginTop: hp(2),
    },

    card: {
      borderRadius: 20,
      marginBottom: 20,
      backgroundColor: Colors.white,
      shadowColor: Colors.black,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5,
      padding: wp(4),
    },

    selectedCard: {
      borderColor: Colors.green,
    },
    selectedCardColor: {
      backgroundColor: Colors?.statBgFollower,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: hp(1),
    },

    planTitle: {
      fontFamily: OutfitFamily.Medium,
      fontSize: FontSize.FONT_13,
      color: Colors.greyText,
    },

    price: {
      fontFamily: FontFamily.Bold,
      fontSize: FontSize.FONT_24,
      //   fontWeight: FontWeight.FONT_600,
      marginTop: 4,
    },
    durationType: {
      fontFamily: FontFamily.Bold,
      fontSize: FontSize.FONT_24,
      marginTop: 4,
      marginBottom: hp(1),
    },

    buyButton: {
      backgroundColor: Colors.themeColor,
      height: hp(5),
      width: wp(30),
      borderRadius: wp(3.5),
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: wp(2),
      paddingVertical: hp(1),
    },

    buyText: {
      fontSize: FontSize.FONT_22,
      fontFamily: FontFamily.Bold,
      fontWeight: FontWeight.FONT_600,
      color: Colors.white,
    },

    featureContainer: {
      marginTop: 2,
      padding: 10,
    },

    featureText: {
      fontFamily: FontFamily.OutfitRegular,
      fontSize: FontSize.FONT_14,
      marginBottom: 8,
      color: Colors.greyVar1,
    },
    tickText: {
      fontFamily: FontFamily.OutfitRegular,
      marginBottom: 8,
      color: Colors.green,
    },
    expiryDate: {
      fontSize: FontSize.FONT_12,
      marginTop: wp(1.5),
      marginBottom: wp(2.5),
    },
    planTypeStyle: {
      fontSize: FontSize.FONT_22,
      fontFamily: FontFamily.Bold,
      color: Colors.blackVar2,
    },
    divider: {
      height: 1,
      backgroundColor: Colors.borderGreyLight,
      marginVertical: hp(1.5),
      width: '100%',
    },
    featureRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: hp(1),
    },
    tickIcon: {
      width: wp(3.5),
      height: wp(3.5),
      marginRight: wp(2.5),
      tintColor: Colors.green,
      marginBottom: wp(1.7),
      marginLeft: -wp(2),
    },
    expText: {
      backgroundColor: '#FFF5F5',
      borderRadius: 20,
      paddingHorizontal: wp(2),
      paddingVertical: -wp(2),
      alignSelf: 'flex-start',
      marginTop: hp(1),
      //   marginBottom: hp(1),
    },
    legalFooter: {
      marginTop: hp(1),
      marginBottom: hp(3),
      paddingHorizontal: wp(1),
    },
    legalMeta: {
      fontFamily: OutfitFamily.Regular,
      fontSize: FontSize.FONT_12,
      color: Colors.greyText,
      lineHeight: 18,
      marginBottom: hp(1),
    },
    legalLinkRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      marginBottom: hp(1.2),
    },
    legalLink: {
      fontFamily: OutfitFamily.Medium,
      fontSize: FontSize.FONT_13,
      color: Colors.themeColor,
      textDecorationLine: 'underline',
    },
    legalDot: {
      fontFamily: OutfitFamily.Regular,
      fontSize: FontSize.FONT_13,
      color: Colors.greyText,
      marginHorizontal: wp(1.5),
    },
    legalFinePrint: {
      fontFamily: OutfitFamily.Regular,
      fontSize: FontSize.FONT_11,
      color: Colors.greyText,
      lineHeight: 16,
    },
    periodLabel: {
      fontFamily: OutfitFamily.Regular,
      fontSize: FontSize.FONT_12,
      color: Colors.greyText,
      marginTop: 4,
    },
  });
