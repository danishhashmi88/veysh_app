import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../../../constant/colors';
import { wp, hp } from '../../../utils/helper';
import { FontFamily, FontSize, FontWeight } from '../../../constant/fonts';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backGroundColor1,
  },
  nextText: {
    fontSize: FontSize.FONT_16,
    color: Colors.themeColor, // Purple
    fontFamily: FontFamily.OutfitMedium,
  },
  canvasContainer: {
    width: wp(90),
    height: wp(90),
    marginHorizontal: wp(5),
    marginTop: hp(2),
    position: 'relative',
    borderRadius: wp(6),
    backgroundColor: Colors.white,
    padding: wp(3), // Provide a safe buffer for items
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    // overflow: 'hidden', // Specifically clip image content only
  },

  canvas: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    borderRadius: wp(6),
    overflow: 'hidden',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: Colors.graytext,
    marginTop: wp(4.5),
    fontFamily: FontFamily.OutfitRegular,
  },
  botIconContainer: {
    position: 'absolute',
    bottom: wp(5),
    right: wp(5),
  },
  botIconCircle: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  deleteIconContainer: {
    position: 'absolute',
    bottom: wp(15), // Above the bot icon
    right: wp(5),
  },
  deleteIconCircle: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5), // Make it a circle
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 1,
    // borderColor: Colors.black, // Blue border as per screenshot
  },

  instructionText: {
    fontSize: FontSize.FONT_12,
    color: Colors.graytext,
    marginLeft: wp(5),
    fontFamily: FontFamily.OutfitRegular,
    marginTop: 15,
  },
  paddingStyle: {
    backgroundColor: Colors?.white,
    marginTop: hp(2),
    borderTopLeftRadius: wp(5),
    // borderTopRightRadius: wp(5),
    // paddingBottom: hp(2),
    // flexGrow: 1, // Allow it to expand but not necessarily fill to infinity if not needed
  },
  categoryContainer: {
    marginBottom: hp(2),
    paddingHorizontal: hp(2),
  },
  categoryTab: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.2),
    borderRadius: wp(100),
    marginRight: wp(2),
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.greyBorder,
    marginTop: hp(2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryTabSelected: {
    backgroundColor: Colors.themeColor,
    borderColor: Colors.themeColor,
  },
  categoryText: {
    fontSize: FontSize.FONT_12,
    color: Colors.iconGrey,
    fontWeight: FontWeight.FONT_400,
    fontFamily: FontFamily.OutfitMedium,
  },
  categoryTextSelected: {
    fontSize: FontSize.FONT_12,
    color: Colors.white,
    fontWeight: FontWeight.FONT_400,
  },
  itemsListContainer: {
    height: hp(15), // Increased height for better content presence
    paddingLeft: wp(5),
    marginBottom: hp(-2),
  },
  actionRow: {
    flexDirection: 'row',
  },
  listItem: {
    width: wp(22),
    height: wp(22),
    borderRadius: wp(3),
    marginRight: wp(2),
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.bgGrey,
  },
  listImage: {
    width: '100%',
    height: '100%',
    borderRadius: wp(3),
  },
  // Draggable
  draggableItem: {
    position: 'absolute',
    width: wp(30),
    height: wp(30),
  },
  itemImage: {
    width: '100%',
    height: '100%',
    color: 'black',
  },
  deleteButton: {
    position: 'absolute',
    top: wp(-5),
    right: wp(-5),
    width: wp(5),
    height: wp(5),
    backgroundColor: 'black',
    borderRadius: wp(100),
  },
});
