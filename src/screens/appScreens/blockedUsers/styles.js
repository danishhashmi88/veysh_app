import { StyleSheet } from 'react-native';
import { Colors } from '../../../constant/colors';
import { hp, wp } from '../../../utils/helper';
import { FontFamily, FontSize } from '../../../constant/fonts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backGroundColor1,
  },
  loaderView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
    paddingBottom: hp(5),
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: wp(3),
    borderRadius: wp(3),
    marginBottom: hp(1.5),
    // simple border for flat look since shadows can be finicky
    borderWidth: 1,
    borderColor: Colors.borderGrey || '#E5E7EB',
  },
  profileImage: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    marginRight: wp(3),
    backgroundColor: Colors.grey,
  },
  userInfo: {
    flex: 1,
    marginRight: wp(2),
  },
  userName: {
    fontSize: FontSize.FONT_16,
    fontFamily: FontFamily.Bold,
    color: Colors.black,
  },
  userHandle: {
    fontSize: FontSize.FONT_14,
    fontFamily: FontFamily.OutfitMedium,
    color: Colors.graytext,
    marginTop: hp(0.2),
  },
  unblockBtn: {
    backgroundColor: Colors.voiletLight || '#F3E8FF',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    borderRadius: wp(5),
  },
  unblockText: {
    color: Colors.themeColor,
    fontSize: FontSize.FONT_12,
    fontFamily: FontFamily.OutfitMedium,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: FontSize.FONT_16,
    color: Colors.graytext,
    fontFamily: FontFamily.OutfitMedium,
  },
});

export default styles;
