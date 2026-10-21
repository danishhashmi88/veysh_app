import { StyleSheet } from 'react-native';
import { Colors } from '../../constant/colors';
import { hp, wp } from '../../utils/helper';
import { FontFamily, FontSize, FontWeight, GaramondFamily } from '../../constant/fonts';

export const styles = StyleSheet.create({
  innerModal: {
    width: wp(100),
    height: hp(35),
    backgroundColor: Colors.white,
    gap: hp(1),
    paddingVertical: hp(2),
    borderTopLeftRadius: wp(8),
    borderTopRightRadius: wp(8),
  },
  outerModal: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'flex-end',
  },
  cross: {
    width: wp(5),
    height: wp(5),
    alignSelf: 'flex-end',
    marginHorizontal: wp(4),
  },
  logout: {},
  midIcon: {
    width: wp(16),
    height: wp(16),
    backgroundColor: Colors.bgGrey, // Light purple
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(6), // Slight rounding for square or circle
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    width: wp(90),
    justifyContent: 'space-between',
    paddingVertical: hp(2),
    // backgroundColor: 'red'
  },
  title: {
    fontSize: FontSize.FONT_21,
    fontFamily: FontFamily?.Bold,
    color: Colors.black,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  subText: {
    fontSize: FontSize.FONT_14,
    fontFamily: FontFamily?.OutfitMedium,
    color: Colors.graytext,
    textAlign: 'center',
    width: wp(90),
  },
  midContent: {
    alignItems: 'center',
    // marginBottom:hp(3),
    gap: wp(3),
  },
  phoneInputView: {
    backgroundColor: Colors.white,
    width: '90%',
    alignSelf: 'center',
    height: hp(6),
    borderWidth: 1,
    borderColor: Colors.lightGreyBorder,
    borderRadius: wp(2),
    // marginBottom:hp(2.7),
    flexDirection: 'row',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(2),
    marginTop: hp(1),
  },
  input: {
    flex: 1,
    color: Colors.black,
    // fontWeight: FontWeight.FONT_500,
    fontFamily: GaramondFamily.Regular,
    fontSize: FontSize.FONT_14,
  },
});
