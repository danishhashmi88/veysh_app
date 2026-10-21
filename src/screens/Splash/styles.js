import { StyleSheet } from 'react-native';
import { FontFamily } from '../../constant/fonts';
import { hp, wp } from '../../utils/helper';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandLogo: {
    width: wp(40),
    height: wp(40),
  },
  brandName: {
    marginTop: hp(2),
    fontFamily: FontFamily.Regular,
    fontSize: wp(9),
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
