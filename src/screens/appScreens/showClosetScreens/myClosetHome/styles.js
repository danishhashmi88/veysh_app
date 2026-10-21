import { StyleSheet, Dimensions, Platform } from 'react-native';
import { Colors } from '../../../../constant/colors';
import { FontFamily, FontSize, FontWeight, OutfitFamily } from '../../../../constant/fonts';
import { hp, wp } from '../../../../utils/helper';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  // 🟢 1. Lower Section (Grid) Background
  container: {
    flex: 1,
    backgroundColor: Colors.backGroundColor1, // Light tinted background for lower container
  },

  // 🟢 2. Top Section (Header + Tabs) Background
  topSection: {
    backgroundColor: Colors.backGroundColor1, // Pure white for top section
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingTop: Platform.OS === 'ios' ? hp(8) : hp(7),
    paddingBottom: hp(2),
  },
  headerTitle: {
    fontSize: FontSize.FONT_26,
    fontFamily: FontFamily.Bold,
    color: Colors.black,
  },
  headerIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(3),
  },
  actionBtn: {
    width: wp(9.5),
    height: wp(9.5),
    backgroundColor: Colors.bgGrey,
    borderRadius: wp(4.75),
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    width: wp(5),
    height: wp(5),
    tintColor: Colors.black,
  },

  searchContainer: {
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
    paddingBottom: hp(1),
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: wp(3),
    borderWidth: 1,
    borderColor: Colors.lightBorder,
    paddingHorizontal: wp(3),
    height: hp(5.5),
    gap: wp(2),
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.FONT_15,
    color: Colors.black,
    paddingVertical: 0,
    fontFamily: FontFamily.OutfitMedium,
  },

  // 🟢 3. Separator Lines for Category Container
  categoryListContainer: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    // borderTopWidth: 1,
    // borderBottomWidth: 1,
    // borderColor: Colors.borderGreyLight, // Lines above and below the tabs
    backgroundColor: Colors.backGroundColor1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: wp(2),
  },

  // 🟢 4. Pill Shape Category Buttons
  categoryIconBg: {
    paddingHorizontal: wp(4), // Makes it wider (Pill shape)
    paddingVertical: hp(1.2), // Height
    borderRadius: wp(10), // Fully rounded edges
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgActive: {
    backgroundColor: Colors.themeColor, // Purple Background
    borderWidth: 0, // No border for active
  },
  categoryIcon: {
    width: wp(5),
    height: wp(5),
    resizeMode: 'contain',
  },
  categoryText: {
    fontSize: FontSize.FONT_13,
    fontFamily: FontFamily.OutfitMedium,
    textAlign: 'center',
  },

  cardContainer: {
    width: wp(44),
    backgroundColor: Colors.white,
    borderRadius: wp(4),
    marginBottom: hp(2),
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 1,
    elevation: 1,
  },
  cardImage: {
    width: '100%',
    height: hp(22),
    backgroundColor: Colors.genderBg,
  },
  cardDetails: {
    padding: wp(3),
  },
  cardTitle: {
    fontSize: FontSize.FONT_14,
    fontFamily: FontFamily.OutfitMedium,
    color: Colors.black,
  },
  cardSubtitle: {
    fontSize: FontSize.FONT_12,
    fontFamily: FontFamily.OutfitMedium,
    color: Colors.greyVar1,
    marginTop: hp(0.5),
  },
  cardPrice: {
    fontSize: FontSize.FONT_14,
    fontFamily: FontFamily.OutfitMedium,
    color: Colors.themeColor,
    marginTop: hp(0.5),
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(10),
  },
  iconContainer: {
    width: wp(14),
    height: wp(14),
    borderRadius: wp(3),
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  icon: {
    width: wp(10),
    height: wp(10),
    tintColor: Colors.greyDark2,
  },
  emptyTitle: {
    fontSize: FontSize.FONT_21,
    fontFamily: FontFamily?.Bold,
    color: Colors.black,
    marginBottom: hp(1),
  },
  emptySubtitle: {
    fontSize: FontSize.FONT_14,
    fontFamily: FontFamily.OutfitRegular,
    color: Colors.greyVar1,
    textAlign: 'center',
  },

  chatWidget: {
    position: 'absolute',
    bottom: hp(13),
    right: wp(5),
    zIndex: 100,
    width: wp(15),
    height: wp(15),
    backgroundColor: Colors.white,
    borderRadius: wp(100),
    justifyContent: 'center',
    alignItems: 'center',
  },
  messIcon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  fabBtn: {
    position: 'absolute',
    bottom: hp(2),
    alignSelf: 'center',
    backgroundColor: Colors.themeColor,
    width: wp(14),
    height: wp(14),
    borderRadius: wp(7),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 101,
    shadowColor: Colors.gradientPurple2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 6,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  fabIcon: {
    fontSize: 32,
    color: Colors.white,
    fontWeight: FontWeight.FONT_300,
    marginTop: Platform.OS === 'ios' ? -2 : -4,
  },
});

export default styles;
