import { StyleSheet, Platform } from 'react-native';
import { hp, wp } from '../../../utils/helper';
import { FontSize, FontWeight, FontFamily } from '../../../constant/fonts';

export const getEditMyStyleStyles = Colors =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: Colors.white,
    },
    scrollContent: {
      paddingHorizontal: wp(5),
      paddingBottom: hp(5),
      paddingTop: hp(1),
    },

    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: wp(4),
      marginTop: Platform.OS === 'ios' ? hp(1) : hp(2),
      paddingBottom: hp(1.5),
      backgroundColor: Colors.white,
    },
    backBtn: {
      width: wp(10),
      height: wp(10),
      borderRadius: wp(5),
      backgroundColor: Colors.bgGrey,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: wp(-2),
    },
    backIcon: { width: wp(6), height: wp(6), tintColor: Colors.pureBlack },
    headerTitle: {
      flex: 1,
      marginLeft: wp(2),
      fontSize: wp(6),
      fontFamily: FontFamily.Bold,
      color: Colors.black,
    },

    sectionContainer: {
      marginBottom: 0,
    },
    sectionTitle: {
      fontSize: FontSize.FONT_16,
      fontWeight: FontWeight.FONT_600,
      color: Colors.greyVar2,
      textAlign: 'left',
      width: '100%',
      marginBottom: hp(0.8),
      marginTop: hp(1.5),
    },

    chipsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    chip: {
      paddingHorizontal: wp(3),
      paddingVertical: hp(1),
      borderRadius: wp(100),
      borderWidth: 1,
      borderColor: Colors.greyBorder,
      marginRight: wp(2),
      marginBottom: hp(0.8),
      backgroundColor: Colors.white,
    },

    chipActive: {
      backgroundColor: Colors.themeColor,
      borderColor: Colors.themeColor,
    },
    chipText: {
      fontSize: FontSize.FONT_13,
      color: Colors.iconGrey,
      fontFamily: FontFamily?.OutfitRegular
      // fontWeight: FontWeight.FONT_400,
    },
    chipTextActive: {
      fontSize: FontSize.FONT_13,
      color: Colors.white,
      fontFamily: FontFamily?.OutfitRegular
      // fontWeight: FontWeight.FONT_400,
    },

    saveBtn: {
      backgroundColor: Colors.primaryBlue,
      height: hp(6.5),
      borderRadius: wp(100),
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: hp(2.5),
      marginBottom: hp(2),
      shadowColor: Colors.primaryBlue,
      // shadowOffset: { width: 0, height: 4 },
      // shadowOpacity: 0.3,
      // shadowRadius: 4.65,
      // elevation: 8,
    },
    saveBtnText: {
      fontSize: FontSize.FONT_16,
      fontWeight: FontWeight.FONT_700,
      color: Colors.white,
    },
    noData: {
      fontSize: FontSize.FONT_14,
      color: Colors.blackVar2,
      fontFamily: FontFamily.OutfitMedium,
      marginVertical: hp(1),
    },
  });
