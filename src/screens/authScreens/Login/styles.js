import { StyleSheet, Platform } from 'react-native';
// import { Colors } from '../../../constant/colors';
import { hp, wp } from '../../../utils/helper';
import { FontSize, FontWeight } from '../../../constant/fonts';

export const getStyles = Colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: Colors.transparent,
      width: wp(90),
      alignSelf: 'center',
    },
    brandLogo: {
      width: wp(20),
      height: hp(15),
    },
    bottomView: {
      width: wp(100),
      height: hp(50),
      alignItems: 'center',
      paddingTop: hp(3),
      borderTopLeftRadius: wp(6),
      borderTopRightRadius: wp(6),
      backgroundColor: Colors.white,
      shadowColor: '#0000000DD',
      shadowOffset: {
        width: 0,
        height: -5,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 5,
    },
    title: {
      color: Colors.blackVar2,
      // fontWeight: FontWeight.FONT_700,
      fontSize: FontSize.FONT_24,
    },
    subTitle: {
      color: Colors.graytext,
      fontWeight: FontWeight.FONT_400,
      fontSize: FontSize.FONT_12,
      marginTop: hp(0.8),
    },
    bottomTextView: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: wp(1),
      justifyContent: 'center',
      marginBottom: hp(2),
      position: 'absolute',
      bottom: Platform.OS === 'android' ? wp(5.5) : wp(4), // Updated as requested
      width: Platform.OS === 'android' ? wp(100) : undefined, // Fix width as requested (Android only)
    },
    bottomText: {
      fontSize: FontSize.FONT_14,
      color: Colors.themeColor,
      fontWeight: FontWeight.FONT_600,
      includeFontPadding: false, // Fix Android vertical alignment
      textAlignVertical: 'center',
    },
    bigImage: {
      alignSelf: 'center',
      width: wp(100),
      height: hp(100),
      position: 'absolute',
      zIndex: -1000,
    },
    brandLogo: {
      width: wp(30),
      height: wp(30),
      alignSelf: 'center',
    },
    textView: {
      alignItems: 'center',
      marginVertical: hp(2),
    },
    forgotPassText: {
      fontSize: FontSize.FONT_16,
      color: Colors.themeColor,
      fontWeight: FontWeight.FONT_600,
      marginVertical: hp(1),
      alignSelf: 'baseline',
    },
    phoneRow: {
      backgroundColor: Colors.background,
      width: wp(24),
      height: hp(6),
      borderRadius: wp(100),
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: wp(2),
      borderWidth: 1,
      borderColor: Colors.borderGrey,
    },
    arrow: {
      width: wp(4),
      height: wp(4),
      transform: [{ rotateZ: '180deg' }],
    },
    inputTitle: {
      fontSize: FontSize.FONT_15,
      fontWeight: FontWeight.FONT_600,
      color: Colors.blackVar2,
      textAlign: 'left',
      width: '100%',
      marginBottom: hp(0.7),
      marginTop: hp(4),
    },
    phoneInputView: {
      backgroundColor: Colors.background,
      alignSelf: 'center',
      height: hp(6),
      borderWidth: 1,
      borderColor: Colors.borderGrey,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: wp(5),
      overflow: 'visible',
      borderRadius: wp(100),
      width: wp(65),
    },
    input: {
      flex: 1,
      color: Colors.text,
      fontSize: FontSize.FONT_15,
      textAlignVertical: 'top',
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      width: wp(90),
      alignSelf: 'center',
      justifyContent: 'space-between',
    },
  });
