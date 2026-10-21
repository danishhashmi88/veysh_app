import { StyleSheet } from 'react-native';
import { Colors } from '../../../../constant/colors';
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
    midBox: {
      marginTop: hp(1.5),
    },
    inputTitle: {
      fontSize: FontSize.FONT_16,
      fontWeight: FontWeight.FONT_500,
      color: Colors.greyVar2,
      textAlign: 'left',
      width: '100%',
      marginBottom: hp(0.7),
      fontFamily: FontFamily.OutfitMedium,
    },
    fieldLabel: {
      fontSize: FontSize.FONT_14,
      fontWeight: FontWeight.FONT_400,
      color: Colors.greyVar2,
      textAlign: 'left',
      width: '100%',
      marginBottom: hp(0.5),
      fontFamily: FontFamily.OutfitMedium,
    },
    inputs: {
      flexDirection: 'row',
      width: wp(90),
      alignItems: 'flex-start',
      justifyContent: 'space-between',
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
