import { StyleSheet, Dimensions } from 'react-native';
import { hp, wp } from '../../../utils/helper';
import { Colors } from '../../../constant/colors';
import { FontFamily, FontSize, FontWeight, OutfitFamily } from '../../../constant/fonts';

const { width, height } = Dimensions.get('screen');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.pureBlack,
  },

  slide: {
    width,
    height,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  brandLogo: {
    width: wp(30),
    height: wp(30),
    alignSelf: 'center',
    marginTop: hp(6),
    zIndex: 2,
  },
  topShadow: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: hp(25),
    zIndex: 1,
  },
  bottomShadow: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: hp(40),
    zIndex: 1,
  },

  content: {
    marginTop: 'auto',
  },

  title: {
    color: Colors.white,
    fontSize: FontSize.FONT_24,
    // 🟢 Screenshot ke mutabiq font family update ki gayi hai
    fontFamily: FontFamily.Bold,
    textAlign: 'center',
    lineHeight: hp(4),
    // fontWeight: '700', // Bold ke liye
  },
  highlightWord: {
    backgroundColor: 'rgba(74, 114, 150, 0.8)',
    paddingHorizontal: wp(1),
    overflow: 'hidden',
  },

  description: {
    color: Colors.white,
    fontSize: FontSize.FONT_12,
    fontFamily: OutfitFamily.Regular,
    // fontWeight: FontWeight.FONT_400,
    textAlign: 'center',
    marginTop: hp(2),
    lineHeight: hp(2.2),
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: hp(1),
  },

  sideBlock: {
    flex: 1,
    alignItems: 'flex-start',
  },

  sideBlockRight: {
    flex: 1,
    alignItems: 'flex-end',
  },

  skip: {
    color: Colors.white,
    fontSize: FontSize.FONT_14,
    fontWeight: FontWeight.FONT_400,
  },

  dots: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: wp(1.5),
  },

  dot: {
    width: wp(2),
    height: wp(2),
    borderRadius: wp(1),
    backgroundColor: 'rgba(255,255,255,0.4)',
  },

  activeDot: {
    backgroundColor: Colors.white,
    width: wp(4),
  },

  button: {
    backgroundColor: Colors.themeColor,
    paddingHorizontal: wp(5),
    paddingVertical: hp(1.2),
    borderRadius: wp(5),
  },

  buttonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: FontWeight.FONT_600,
  },
  textBox: {
    width: '100%',
    paddingTop: hp(3),
    paddingBottom: hp(1.5),
    paddingHorizontal: hp(2),
    alignItems: 'center',
    gap: hp(1.5),
  },
  textBoxWrapper: {
    width: wp(97),
    marginBottom: hp(1),
    borderRadius: wp(4),
    overflow: 'hidden',
  },
  fixedBottom: {
    position: 'absolute',
    bottom: hp(5.3),
    width: '100%',
    alignItems: 'center',
    zIndex: 2,
  },
  radioContainer: {
    width: wp(5),
    height: wp(5),
    position: 'relative',
    backgroundColor: Colors.transparent,
    borderRadius: wp(100),
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.white,
  },
  checked: {
    width: wp(2.5),
    height: wp(2.5),
    backgroundColor: Colors.white,
    borderRadius: wp(50),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    display: 'flex',
  },
  innerRadio2: {
    width: wp(0.4),
    height: wp(0.4),
    backgroundColor: Colors.white,
    borderRadius: wp(50),
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerRadio: {
    width: wp(1.2),
    height: wp(1.2),
    backgroundColor: '#D4ADF5',
    borderRadius: wp(50),
    alignItems: 'center',
    justifyContent: 'center',
  },
  notChecked: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 1,
    backgroundColor: Colors.white,
    left: 0,
    top: 0,
    borderRadius: wp(50),
  },
});
