import { StyleSheet } from 'react-native';
import { Colors } from '../../../constant/colors';
import { hp, wp } from '../../../utils/helper';
import { FontFamily, FontSize, FontWeight } from '../../../constant/fonts';

export const styles = StyleSheet.create({
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
    shadowColor: '#000000',
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
    fontWeight: FontWeight.FONT_700,
    fontSize: FontSize.FONT_24,
  },
  subTitle: {
    color: Colors.graytext,
    // fontWeight: FontWeight.FONT_400,
    fontSize: FontSize.FONT_12,
    marginTop: hp(0.8),
  },
  bottomTextView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
    justifyContent: 'center',
    marginTop: hp(2),
  },
  bottomText: {
    fontSize: FontSize.FONT_14,
    color: Colors.themeColor,
    // fontWeight: FontWeight.FONT_600,
    fontFamily: FontFamily.OutfitMedium,
  },
  bigImage: {
    alignSelf: 'center',
    width: wp(100),
    height: hp(100),
    position: 'absolute',
    zIndex: -1000,
  },
  textView: {
    alignItems: 'center',
    marginVertical: hp(2),
  },
  forgotPassText: {
    fontSize: FontSize.FONT_16,
    color: Colors.themeColor,
    // fontWeight: FontWeight.FONT_600,
    marginVertical: hp(1),
    fontFamily: FontFamily.OutfitMedium,
  },
  otpContainer: {
    alignItems: 'center',
    marginTop: hp(1),
  },
  otpInputContainer: {
    width: wp(90),
  },
  otpInput: {
    width: wp(19),
    height: hp(6),
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    color: Colors.black,
    fontSize: FontSize.FONT_20,
    fontWeight: FontWeight.FONT_600,
    textAlign: 'center',
    padding: 0,
    borderRadius: wp(100),
    borderBottomWidth: 1,
  },
});
