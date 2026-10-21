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
    midBox: { marginTop: hp(1.5) },
    inputTitle: {
      fontSize: FontSize.FONT_16,
      // fontWeight: FontWeight.FONT_600,
      color: Colors.blackVar2,
      textAlign: 'left',
      width: '100%',
      marginBottom: hp(0.7),
      fontFamily: FontFamily.OutfitMedium,
    },
    inputs: {
      flexDirection: 'row',
      width: wp(90),
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    },
    colorPallet: {
      marginTop: hp(2),
      flexDirection: 'row',
      gap: wp(3),
      flexWrap: 'wrap',
    },
    colorView: {
      width: wp(7),
      height: wp(7),
      borderRadius: wp(100),
    },
    smallTick: {
      width: wp(2),
      height: wp(2),
    },
    tickView: {
      backgroundColor: Colors.themeColor,
      // padding:wp(2),
      borderRadius: wp(100),
      width: wp(3.5),
      height: wp(3.5),
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      right: -3,
      top: -3,
    },
    feartureBox: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: hp(0.7),
      flexWrap: 'wrap',
    },
    feartureView: {
      paddingHorizontal: wp(3),
      paddingVertical: hp(1.2),
      borderRadius: wp(100),
      borderWidth: 1,
      borderColor: Colors.greyBorder,
      backgroundColor: Colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: wp(2),
      marginBottom: hp(0.8),
    },
    feartureViewSelected: {
      backgroundColor: Colors.themeColor,
      borderColor: Colors.themeColor,
    },
    genderTitle: {
      fontSize: FontSize.FONT_12,
      color: Colors.iconGrey,
      fontWeight: FontWeight.FONT_400,
    },
    genderTitleSelected: {
      color: Colors.white,
    },
    uploadImageBox: {
      width: wp(90),
      height: hp(12),
      backgroundColor: Colors.profileTabBg,
      borderRadius: wp(3),
      alignItems: 'center',
      justifyContent: 'center',
      gap: hp(1),
      marginTop: hp(1),
    },
    uploadTitle: {
      color: Colors.blackVar2,
      // fontWeight: FontWeight.FONT_400,
      fontSize: FontSize.FONT_14,
      fontFamily: FontFamily.OutfitMedium,
    },
    editIcon: {
      width: wp(9),
      height: wp(9),
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: wp(100),
      backgroundColor: Colors.white,
    },
    icon: {
      width: '50%',
      height: '50%',
    },
    image: {
      width: wp(27),
      height: wp(27),
      padding: wp(1.5),
    },
    crossIconView: {
      width: wp(6),
      height: wp(6),
      backgroundColor: Colors.blackTransparent,
      borderRadius: wp(100),
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'flex-end',
    },
    crossIcon: {
      width: '40%',
      height: '40%',
    },
    imageViews: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: wp(3),
      marginTop: hp(1),
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
