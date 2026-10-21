import { StyleSheet, Platform } from 'react-native';
import { hp, wp } from '../../../utils/helper';
import { FontSize, FontWeight, FontFamily } from '../../../constant/fonts';
import { Colors } from '../../../constant/colors';

export const getEditStyles = Colors =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: Colors.white,
    },
    scrollContent: {
      paddingHorizontal: wp(5),
      paddingBottom: hp(5),
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
      marginLeft: wp(-2), // Align left properly within padding
    },
    backIcon: { width: wp(6), height: wp(6), tintColor: Colors.pureBlack },
    headerTitle: {
      flex: 1,
      marginLeft: wp(2),
      fontSize: wp(6), // matching other screen headers
      fontFamily: FontFamily.Bold, // Standardized font for headers
      color: Colors.black,
    },

    profileContainer: {
      alignItems: 'center',
      marginVertical: hp(2.5),
    },
    imageWrapper: {
      position: 'relative',
    },
    profileImg: {
      width: wp(28),
      height: wp(28),
      borderRadius: wp(100),
    },
    uploadBtn: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: Colors.mediumPurple,
      width: wp(9),
      height: wp(9),
      borderRadius: wp(100),
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: Colors.white,
    },
    uploadIcon: {
      width: wp(5.5),
      height: wp(5.5),
      tintColor: Colors.white,
    },

    inputGroup: {
      marginTop: hp(1.5),
    },
    label: {
      fontSize: FontSize.FONT_14,
      color: Colors.blackVar2,
      fontWeight: FontWeight.FONT_500,
      marginBottom: hp(0.8),
    },

    mobileContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    flagBox: {
      width: wp(20),
      height: hp(5.4),
      borderRadius: wp(100),
      borderWidth: 1,
      borderColor: Colors.greyBorder,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.white,
    },
    flagIcon: {
      width: wp(6),
      height: wp(4),
      resizeMode: 'contain',
      marginRight: wp(1),
    },
    arrowIcon: {
      width: wp(5),
      height: wp(5),
      resizeMode: 'contain',
      tintColor: Colors.blackVar3,
      transform: [{ rotate: '90deg' }],
    },

    phoneBox: {
      flex: 1,
      height: hp(5.4),
      borderRadius: wp(100),
      borderWidth: 1,
      borderColor: Colors.greyBorder,
      marginLeft: wp(2),
      paddingHorizontal: wp(5),
      justifyContent: 'center',
      backgroundColor: Colors.white,
    },
    phoneInput: {
      fontSize: FontSize.FONT_15,
      color: Colors.graytext,
      height: '100%',
      padding: 0,
    },

    genderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    genderBtn: {
      width: '31%',
      height: hp(4),
      borderRadius: wp(100),
      borderWidth: 1,
      borderColor: Colors.greyBorder,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.white,
    },
    genderBtnActive: {
      backgroundColor: Colors.themeColor,
      borderColor: Colors.themeColor,
    },
    genderText: {
      fontSize: FontSize.FONT_13,
      color: Colors.iconGrey,
      fontFamily: FontFamily?.OutfitRegular
    },
    genderTextActive: {
      fontSize: FontSize.FONT_13,
      color: Colors.white,
      fontFamily: FontFamily?.OutfitRegular
    },

    goalsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: hp(0.5),
    },
    goalChip: {
      paddingHorizontal: wp(3),
      paddingVertical: hp(1.2),
      borderRadius: wp(100),
      borderWidth: 1,
      borderColor: Colors.greyBorder,
      marginRight: wp(2),
      marginBottom: hp(0.8),
      backgroundColor: Colors.white,
    },
    goalChipActive: {
      backgroundColor: Colors.themeColor,
      borderColor: Colors.themeColor,
    },
    goalText: {
      fontSize: FontSize.FONT_13,
      color: Colors.iconGrey,
      fontFamily: FontFamily?.OutfitRegular
    },
    goalTextActive: {
      fontSize: FontSize.FONT_13,
      color: Colors.white,
      fontFamily: FontFamily?.OutfitRegular
    },

    saveBtn: {
      backgroundColor: Colors.primaryBlue,
      height: hp(5.6),
      borderRadius: wp(100),
      justifyContent: 'center',
      alignItems: 'center',
      // marginTop: hp(2),
      marginBottom: hp(2),
      // shadowColor: "#6200EE",
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

    bioBox: {
      height: hp(15),
      borderWidth: 1,
      borderColor: Colors.greyBorder,
      borderRadius: wp(3),
      backgroundColor: Colors.white,
      paddingHorizontal: wp(4),
      paddingVertical: hp(1.5),
      justifyContent: 'flex-start',
    },

    bioInput: {
      flex: 1,
      fontSize: FontSize.FONT_15,
      color: Colors.blackVar3,
      textAlignVertical: 'top',
      padding: 0,
    },
    noData: {
      fontSize: FontSize.FONT_14,
      color: Colors.blackVar2,
      fontFamily: FontFamily.OutfitMedium,
      marginVertical: hp(1),
    },
  });
