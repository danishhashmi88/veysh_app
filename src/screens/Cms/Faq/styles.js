import { StyleSheet, Platform, StatusBar } from 'react-native';
import { Colors } from '../../../constant/colors';
import { hp, wp } from '../../../utils/helper';
import { FontSize, FontWeight } from '../../../constant/fonts';

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
});
