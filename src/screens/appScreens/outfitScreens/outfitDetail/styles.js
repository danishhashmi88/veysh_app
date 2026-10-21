import { StyleSheet, Dimensions, Platform } from 'react-native';
import { Colors } from '../../../../constant/colors';
import { wp } from '../../../../utils/helper';
import { FontFamily, FontSize, FontWeight } from '../../../../constant/fonts';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backGroundColor1,
  },
  scrollContent: {
    paddingBottom: wp(30), // Increased to make room for floating footer
    backgroundColor: Colors.backGroundColor1,
  },

  // --- HEADER MODIFIED FOR FLOATING OVERLAY ---
  header: {
    position: 'absolute',
    top: Platform.OS === 'android' ? wp(18) : wp(15),
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(5),
    zIndex: 10,
  },
  backButton: {
    width: wp(10),
    height: wp(10),
    backgroundColor: Colors.bgGrey,
    borderRadius: wp(5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    width: wp(5),
    height: wp(5),
    tintColor: Colors.black,
  },
  headerTitle: {
    flex: 1,
    // fontSize: wp(6),
    color: 'transparent',
    fontFamily: FontFamily.Bold,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  actionButton: {
    width: wp(10),
    height: wp(10),
    backgroundColor: Colors.bgGrey,
    borderRadius: wp(5),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: wp(2.5),
  },
  actionIcon: {
    width: wp(5),
    height: wp(5),
    tintColor: Colors.black,
  },

  // --- IMAGE STYLES ---
  imageContainer: {
    width: width,
    height: wp(115), // Increased height for safety
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },

  // --- CONTENT ---
  contentPadding: {
    paddingHorizontal: wp(4),
    paddingTop: wp(5),
    backgroundColor: Colors.backGroundColor1,
  },
  categoryPill: {
    backgroundColor: '#F3E8FF',
    alignSelf: 'flex-start',
    paddingHorizontal: wp(3),
    paddingVertical: wp(1),
    borderRadius: wp(4),
    marginBottom: wp(2),
  },
  categoryPillText: {
    color: Colors.themeColor,
    fontSize: FontSize.FONT_11,
    fontFamily: FontFamily.OutfitMedium,
  },
  itemTitle: {
    fontSize: FontSize.FONT_22,
    fontFamily: FontFamily.Bold,
    color: '#111827',
    marginBottom: wp(1),
  },
  brandSubtitle: {
    fontFamily: FontFamily.OutfitMedium,
    color: '#6B7280',
    fontSize: FontSize.FONT_13,
    marginBottom: wp(4),
  },

  addToOutfitBtnPrimary: {
    backgroundColor: Colors.themeColor, // Match purple in screenshot
    paddingVertical: wp(2),
    paddingHorizontal: wp(3),
    borderRadius: wp(3),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: wp(4),
  },
  addToOutfitTextPrimary: {
    color: Colors.white,
    fontFamily: FontFamily.OutfitMedium,
    fontSize: FontSize.FONT_14,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    paddingHorizontal: wp(5),
    paddingTop: wp(4),
    paddingBottom: wp(8),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopLeftRadius: wp(10),
    borderTopRightRadius: wp(10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  footerButtonLeft: {
    flex: 1,
    height: wp(13),
    backgroundColor: Colors.backGroundColor1,
    borderRadius: wp(3),
    borderWidth: 1,
    borderColor: Colors.greyBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(3),
  },
  footerButtonRight: {
    flex: 1,
    height: wp(13),
    borderRadius: wp(3),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  footerButtonTextLeft: {
    color: '#111827',
    fontFamily: FontFamily.OutfitMedium,
    fontSize: FontSize.FONT_16,
  },
  footerButtonTextRight: {
    color: Colors.white,
    fontFamily: FontFamily.OutfitMedium,
    fontSize: FontSize.FONT_16,
  },
  addToOutfitBtnSecondary: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.themeColor,
    paddingVertical: wp(3),
    paddingHorizontal: wp(6),
    borderRadius: wp(3),
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  addToOutfitTextSecondary: {
    color: Colors.themeColor,
    fontFamily: FontFamily.OutfitMedium,
  },

  // --- DETAILS LIST ---
  sectionHeading: {
    fontFamily: FontFamily.OutfitMedium,
    fontSize: FontSize.FONT_18,
    color: Colors.black,
    marginBottom: wp(1),
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: wp(3),
  },
  detailLabel: {
    fontFamily: FontFamily.OutfitMedium,
    color: Colors.graytext,
  },
  detailValue: {
    fontFamily: FontFamily.OutfitMedium,
    color: Colors.black,
    textAlign: 'right',
    maxWidth: '65%',
  },

  // Notes styling
  detailRowVertical: {
    marginBottom: wp(3),
  },
  notesTextValue: {
    fontFamily: FontFamily.OutfitMedium,
    color: Colors.black,
    marginTop: wp(1),
  },

  // Tags styling
  tagsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: wp(1),
  },
  tagPill: {
    backgroundColor: Colors.voiletLight,
    paddingHorizontal: wp(3),
    paddingVertical: wp(1),
    borderRadius: wp(4),
    marginRight: wp(2),
    marginBottom: wp(1),
  },
  tagPillText: {
    color: Colors.themeColor,
    fontFamily: FontFamily.OutfitMedium,
    fontSize: FontSize.FONT_12,
  },

  // Footer styling matching existing OutfitDetail but with ClosetDetail looks
  footerView: {
    paddingHorizontal: wp(4),
    paddingBottom: wp(2),
    paddingTop: wp(2),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // gap: wp(3),
    backgroundColor: Colors.backGroundColor1,
  },
});

export default styles;
