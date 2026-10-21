import { StyleSheet, Dimensions, Platform } from 'react-native';
import { Colors } from '../../../../constant/colors';
import {
  FontFamily,
  FontSize,
  FontWeight,
  OutfitFamily,
} from '../../../../constant/fonts';
import { hp, wp } from '../../../../utils/helper';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backGroundColor1,
  },
  header: {
    paddingHorizontal: wp(5),
    paddingVertical: Platform.OS === 'ios' ? hp(2) : hp(2),
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: wp(2),
    backgroundColor: Colors.lightBorder,
    borderRadius: wp(100),
  },
  backIcon: {
    width: wp(7),
    height: hp(3),
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: FontSize.FONT_24,
    fontFamily: FontFamily.Bold,
    color: Colors.black,
    marginLeft: wp(3),
  },
  list: {
    paddingHorizontal: wp(5),
    paddingBottom: hp(12),
  },
  searchContainer: {
    paddingHorizontal: wp(5),
    paddingTop: hp(1.5),
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
  searchIcon: {
    width: wp(4.5),
    height: wp(4.5),
    tintColor: Colors.greyDark2,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.FONT_15,
    color: Colors.black,
    paddingVertical: 0,
    fontFamily: FontFamily.OutfitMedium,
  },
  clearSearchText: {
    fontSize: FontSize.FONT_14,
    color: Colors.greyDark2,
    paddingHorizontal: wp(1),
  },
  columnWrapper: {
    justifyContent: 'flex-start',
    gap: wp(3),
    marginBottom: wp(3.5),
  },
  gridItem: {
    width: (wp(100) - wp(13)) / 2,
    backgroundColor: Colors.white,
    borderRadius: wp(4),
    // marginBottom: hp(1),
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 1,
    elevation: 1,
  },
  itemImage: {
    width: '100%',
    height: hp(20),
    backgroundColor: Colors.outfitBGColor,
  },
  itemTitleContainer: {
    padding: wp(3),
  },
  itemTitle: {
    fontSize: FontSize.FONT_14,
    fontFamily: FontFamily.OutfitMedium,
    color: Colors.black,
  },
  itemPrice: {
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
  emptyTitle: {
    fontSize: FontSize.FONT_22,
    fontFamily: FontFamily.OutfitMedium,
    color: Colors.black,
    marginBottom: hp(1),
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: FontSize.FONT_12,
    color: Colors.graytext,
    textAlign: 'center',
    marginBottom: hp(4),
    lineHeight: 20,
    fontFamily: FontFamily.OutfitMedium,
    fontWeight: FontWeight.FONT_400,
  },
  addButton: {
    backgroundColor: Colors.black,
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(2.8),
    borderRadius: 30,
    width: wp(35),
    height: 40,
    alignItems: 'center',
  },
  addButtonText: {
    color: Colors.white,
    fontSize: FontSize.FONT_14,
    fontWeight: FontWeight.FONT_500,
  },
  // Renamed from header/headerTitle in prompt to match component usage
  closetHeading: {
    paddingHorizontal: wp(5),
    paddingTop: hp(4),
    paddingBottom: hp(2),
  },
  headerTitleCloset: {
    fontSize: wp(6),
    fontFamily: FontFamily.Bold,
    color: Colors.black,
  },
  deleteIconContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    // backgroundColor: 'rgba(0,0,0,0.5)',
    width: wp(6),
    height: wp(6),
    borderRadius: wp(3),
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    width: wp(4.5),
    height: wp(4.5),
    tintColor: Colors.black,
  },
  fabContainer: {
    position: 'absolute',
    bottom: hp(4),
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  fabImage: {
    width: wp(24),
    height: wp(24),
  },
});

export default styles;
