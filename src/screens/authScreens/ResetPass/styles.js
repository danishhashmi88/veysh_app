import { StyleSheet } from 'react-native';
import { Colors } from '../../../constant/colors';
import { hp, wp } from '../../../utils/helper';
import { FontSize, FontWeight } from '../../../constant/fonts';

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
    fontWeight: FontWeight.FONT_700,
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
    bottom: 10,
  },
  bottomText: {
    fontSize: FontSize.FONT_14,
    color: Colors.themeColor,
    fontWeight: FontWeight.FONT_600,
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
    fontWeight: FontWeight.FONT_600,
    marginVertical: hp(1),
  },
});
