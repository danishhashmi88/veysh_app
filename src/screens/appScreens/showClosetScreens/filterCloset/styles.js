import { StyleSheet } from 'react-native';
import { Colors } from '../../../../constant/colors';
import { FontSize, FontWeight, FontFamily } from '../../../../constant/fonts';
import { hp, wp } from '../../../../utils/helper';

export const getStyles = (colors = Colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backGroundColor,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      // justifyContent: 'space-between',
      paddingHorizontal: wp(4),
      paddingVertical: hp(1),
      // borderBottomWidth: 1,
      // borderBottomColor: colors.bgGrey,
      // backgroundColor: colors.white,
    },
    headerTitle: {
      fontSize: FontSize.FONT_28,
      // fontWeight: FontWeight.FONT_600,
      flex: 1,
      marginLeft: wp(2),
      fontFamily: FontFamily.Bold,
      // textAlign: 'center',
    },
    clearAll: {
      fontSize: FontSize.FONT_14,
      fontFamily: FontFamily.OutfitMedium,
      color: colors.themeColor,
    },
    scrollContent: {
      paddingHorizontal: wp(4),
      paddingBottom: hp(10),
    },
    sectionContainer: {
      marginTop: hp(1.5),
    },
    sectionTitle: {
      fontSize: FontSize.FONT_14,
      fontFamily: FontFamily.OutfitMedium,
      color: colors.black,
      marginBottom: hp(0.8),
    },
    dropdown: {
      height: hp(6),
      borderColor: colors.genderBg,
      borderWidth: 1,
      borderRadius: wp(10), // Rounded corners like screenshots
      paddingHorizontal: wp(4),
      backgroundColor: colors.white,
    },
    placeholderStyle: {
      fontSize: FontSize.FONT_14,
      color: colors.placeholder,
      fontFamily: FontFamily.OutfitMedium,
    },
    selectedTextStyle: {
      fontSize: FontSize.FONT_14,
      color: colors.black,
      fontFamily: FontFamily.OutfitMedium,
    },
    chipContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: wp(2.5),
    },
    chip: {
      paddingHorizontal: wp(3),
      paddingVertical: hp(1.2),
      borderRadius: wp(100),
      borderWidth: 1,
      borderColor: colors.greyBorder,
      backgroundColor: colors.white,
      marginBottom: hp(0.8),
      alignItems: 'center',
      justifyContent: 'center',
    },
    chipSelected: {
      backgroundColor: colors.themeColor,
      borderWidth: 0,
      borderColor: 'transparent',
    },
    chipText: {
      fontSize: FontSize.FONT_13,
      color: colors.iconGrey,
      // fontWeight: FontWeight.FONT_400,
      fontFamily: FontFamily?.OutfitRegular
    },
    chipTextSelected: {
      fontSize: FontSize.FONT_13,
      color: colors.white,
      fontFamily: FontFamily?.OutfitRegular
      // fontWeight: FontWeight.FONT_400,
    },
    colorCircleContainer: {
      width: wp(8.2),
      height: wp(8.2),
      borderRadius: wp(100),
      marginRight: wp(1.5),
      marginBottom: hp(1),
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 1.5,
      backgroundColor: colors.white,
    },
    colorCircleInner: {
      width: '100%',
      height: '100%',
      borderRadius: wp(100),
    },
    checkmarkContainer: {
      position: 'absolute',
      top: -hp(0.6),
      right: -wp(1.5),
      width: wp(3.5),
      height: wp(3.5),
      borderRadius: wp(100),
      backgroundColor: colors.themeColor,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: colors.white,
      zIndex: 1,
    },
    checkIcon: {
      width: wp(2),
      height: wp(2),
      resizeMode: 'contain',
      tintColor: colors.white,
    },
    footer: {
      marginTop: hp(4),
      marginBottom: hp(2),
      paddingHorizontal: wp(4),
    },

    applyButtonText: {
      color: colors.white,
      fontSize: FontSize.FONT_16,
      fontWeight: FontWeight.FONT_600,
    },
    dropdownContainer: {
      borderRadius: wp(3),
      backgroundColor: Colors.white,
      shadowColor: Colors.black,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5,
      marginTop: hp(1),
      overflow: 'hidden',
    },
    dropdownItemContainer: {
      borderBottomWidth: 1,
      borderBottomColor: Colors.borderGrey,
    },
    dropdownItemText: {
      // fontSize: FontSize.FONT_14,
      color: Colors.black,
      fontFamily: FontFamily.OutfitMedium,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      // fontSize: FontSize.FONT_14,
      fontFamily: FontFamily.OutfitMedium,
    },
    backButton: {
      width: wp(10),
      height: wp(10),
      backgroundColor: '#F2F2F2',
      borderRadius: wp(5),
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
