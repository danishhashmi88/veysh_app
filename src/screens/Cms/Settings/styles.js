import { StyleSheet, Platform, StatusBar } from 'react-native';
import { Colors } from '../../../constant/colors';
import { hp, wp } from '../../../utils/helper';
import { FontSize, FontWeight, FontFamily } from '../../../constant/fonts';

export const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerView: {
    gap: hp(1),
    alignSelf: 'center',
  },
  title: {
    fontSize: FontSize.FONT_20,
    fontWeight: FontWeight.FONT_700,
    color: Colors.black,
  },
  description: {
    color: Colors.zink500,
    fontSize: FontSize.FONT_14,
    width: wp(90),
  },
  inner: {
    flex: 1,
    paddingHorizontal: wp(6),
  },
  innerItem: {
    gap: hp(2),
    marginTop: hp(2),
  },
  logoutContainer: {
    paddingVertical: hp(3),
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
  },
  logoutIcon: {
    width: wp(6),
    height: wp(6),
  },
  logoutText: {
    color: Colors.red,
    fontSize: FontSize.FONT_14,
    fontFamily: FontFamily.OutfitMedium,
  },
});
