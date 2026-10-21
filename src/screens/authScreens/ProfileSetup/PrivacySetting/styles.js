import { StyleSheet } from 'react-native';
// import { Colors } from '../../../../constant/colors';
import { hp, wp } from '../../../../utils/helper';
import { FontFamily, FontSize, FontWeight } from '../../../../constant/fonts';

export const getStyles = Colors =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    mainContainer: {
      flex: 1,
      width: wp(90),
      alignSelf: 'center',
    },
    assignMainBox: {
      width: wp(90),
      height: hp(32),
      backgroundColor: Colors.profileTabBg,
      borderRadius: wp(3),
      marginTop: hp(2),
      overflow: 'hidden',
      alignItems: 'center',
    },
    purpleBox: {
      width: '100%',
      height: '35%',
      backgroundColor: Colors.themeColor,
    },
    imageView: {
      width: wp(20),
      height: wp(20),
      borderWidth: 3,
      borderRadius: wp(100),
      borderColor: Colors.lightPurple,
      marginTop: -40,
    },
    boxTitle: {
      fontSize: FontSize.FONT_22,
      fontWeight: FontWeight.FONT_600,
      color: Colors.blackVar2,
    },
    boxSubTitle: {
      fontSize: FontSize.FONT_14,
      fontWeight: FontWeight.FONT_400,
      color: Colors.graytext,
      marginTop: hp(1),
      fontFamily: FontFamily.OutfitMedium,
    },
    switchView: {
      gap: hp(1.5),
      marginTop: hp(1.5),
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      marginBottom: hp(1),
      color: Colors.themeColor,
    },
  });
