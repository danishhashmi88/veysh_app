import { StyleSheet } from 'react-native';
import { Colors } from '../../../constant/colors';
import { FontFamily, FontSize, FontWeight, GaramondFamily } from '../../../constant/fonts';
import { hp, wp } from '../../../utils/helper';

export const getStyles = Colors =>
  StyleSheet.create({
    arrow: (rotate = '0deg') => {
      return {
        width: wp(4),
        height: wp(4),
        transform: [
          {
            rotateZ: rotate,
          },
        ],
      };
    },
    row: {
      flexDirection: 'row',
      // alignItems: 'center',
      gap: wp(4),
      justifyContent: 'space-between',
      paddingHorizontal: wp(5),
      paddingVertical: hp(2),
    },
    listTitle: {
      fontSize: FontSize.FONT_14,
      // fontWeight: FontWeight.FONT_700,
      color: Colors.black,
      fontFamily: GaramondFamily.Regular,
      fontWeight: FontWeight.FONT_600,
      width: '90%',
    },
    faqItem: {
      // paddingHorizontal: wp(5),
      marginTop: hp(2),
      width: wp(90),
      alignSelf: 'center',
      // gap: hp(3),
      // paddingVertical:hp(2),
      borderRadius: wp(2.5),
      backgroundColor: Colors.white,
      shadowColor: '#0000000DD',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 5,
    },
    faqText: {
      fontSize: FontSize.FONT_14,
      // fontWeight: FontWeight.FONT_400,
      color: Colors.zink500,
      fontFamily: GaramondFamily.Regular,
      flexWrap: 'wrap',
    },
    answereBox: {
      width: '90%',
      flexShrink: 1,
      flexGrow: 1,
      paddingHorizontal: wp(5),
      paddingBottom: hp(1.2),
    },
  });
