import { StyleSheet, Platform } from 'react-native';
import { hp, wp } from '../../../utils/helper';
import { FontSize, FontWeight, OutfitFamily, FontFamily } from '../../../constant/fonts';
export const signInStyles = Colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.white,
    },
    mainContainer: {
      flex: 1,
      width: wp(90),
      alignSelf: 'center',
      marginTop: hp(3),
    },
    textView: {
      alignItems: 'center',
      // marginTop: hp(1),
      marginBottom: hp(2),
    },
    title: {
      fontSize: FontSize.FONT_28,
      // fontWeight: FontWeight.FONT_600,
      color: Colors.blackVar2,
      marginBottom: hp(1),
      marginTop: hp(1),
      fontFamily: FontFamily.Bold,
    },

    authSelector: {
      flexDirection: 'row',
      backgroundColor: Colors.lightPurple,
      borderRadius: wp(100),
      padding: wp(1.2),
      height: hp(6),
      // height:30,
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    tabButtonWrapper: {
      flex: 1,
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: wp(100),
    },
    activeTab: {
      width: '100%',
      height: '100%',
      borderRadius: wp(100),
      justifyContent: 'center',
      alignItems: 'center',
    },
    tabText: {
      fontSize: FontSize.FONT_14,
      fontWeight: FontWeight.FONT_500,
      textAlign: 'center',
    },

    inputTitle: {
      fontSize: FontSize.FONT_15,
      fontWeight: FontWeight.FONT_600,
      color: Colors.blackVar2,
      marginBottom: hp(1),
      marginTop: hp(1),
    },
    mobileRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: hp(2),
    },
    countryPickerBox: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: wp(22),
      height: hp(6),
      borderWidth: 1,
      borderColor: Colors.borderGrey,
      borderRadius: wp(100),
      backgroundColor: Colors.white,
    },
    phoneInputView: {
      width: wp(65),
      height: hp(6),
      borderWidth: 1,
      borderColor: Colors.borderGrey,
      borderRadius: wp(100),
      justifyContent: 'center',
      paddingHorizontal: wp(4),
      backgroundColor: Colors.white,
    },
    input: {
      flex: 1,
      // marginBottom:5,
      fontSize: FontSize.FONT_15,
      color: Colors.black,
      paddingVertical: 0, // Android fix text center
      textAlignVertical: 'center',
    },
    arrowIcon: {
      width: wp(3.7),
      height: wp(3.7),
      marginLeft: wp(1),
      transform: [{ rotate: '180deg' }],
      tintColor: Colors.graytext,
    },

    checkboxText: {
      fontSize: FontSize.FONT_14,
      color: Colors.blackVar2,
      flex: 1,
      // fontWeight: FontWeight.FONT_500,
      fontFamily: OutfitFamily.Medium,
    },
    linkText: {
      color: Colors.themeColor,
      // fontWeight: FontWeight.FONT_600,
      fontFamily: OutfitFamily.Medium,
    },

    orText: {
      alignSelf: 'center',
      marginVertical: hp(1.5),
      color: Colors.graytext,
      fontSize: FontSize.FONT_14,
      fontWeight: FontWeight.FONT_400,
      fontFamily: OutfitFamily.Regular,
    },

    footerView: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: Platform.OS === 'android' ? wp(5.5) : wp(2), // sync with Login
      alignItems: Platform.OS === 'android' ? 'center' : undefined,
      width: '100%',
    },
    footerText: {
      color: Colors.graytext,
      fontSize: FontSize.FONT_14,
      // fontWeight: FontWeight.FONT_400,
      includeFontPadding: false,
      textAlignVertical: 'center',
      fontFamily: OutfitFamily.Regular,
    },
    loginText: {
      color: Colors.themeColor,
      // fontWeight: FontWeight.FONT_500,
      fontSize: FontSize.FONT_14,
      includeFontPadding: false,
      textAlignVertical: 'center',
      fontFamily: OutfitFamily.Medium,
    },
  });
