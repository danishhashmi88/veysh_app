import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../../../../constant/colors';
import { wp } from '../../../../utils/helper';
import { FontFamily, FontSize, FontWeight } from '../../../../constant/fonts';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backGroundColor1,
  },
  scrollContent: {
    paddingBottom: wp(10),
    backgroundColor: Colors.backGroundColor1,
  },

  // --- HEADER ACTIONS ---
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  actionButton: {
    width: wp(10),
    height: wp(10),
    backgroundColor: Colors.bgGrey, // White circle effect
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
    height: wp(100), // Slightly reduced to avoid stretching low-res images
    overflow: 'hidden',
    backgroundColor: Colors.white,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },

  // --- NEW UI STYLES (Below Image) - COMPLETELY UNTOUCHED ---
  contentPadding: {
    paddingHorizontal: wp(6),
    paddingTop: wp(6),
    backgroundColor: Colors.backGroundColor1,
  },
  categoryPill: {
    backgroundColor: Colors.voiletLight,
    alignSelf: 'flex-start',
    paddingHorizontal: wp(3),
    paddingVertical: wp(1.5),
    borderRadius: wp(4),
    marginBottom: wp(3),
  },
  categoryPillText: {
    color: Colors.themeColor,
    fontSize: FontSize.FONT_12,
    fontFamily: FontFamily.OutfitMedium,
  },
  itemTitle: {
    fontSize: FontSize.FONT_24,
    fontFamily: FontFamily.Bold,
    color: Colors.black,
    marginBottom: wp(3),
  },
  brandSubtitle: {
    fontFamily: FontFamily.OutfitMedium,
    color: Colors.greyDark2,
    marginBottom: wp(6),
  },

  // --- STATS BOX ---
  statsBox: {
    flexDirection: 'row',
    backgroundColor: Colors.greyVar2,
    borderRadius: wp(3),
    paddingVertical: wp(4),
    marginBottom: wp(4),
    fontFamily: FontFamily.Bold,
  },
  statColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statBorder: {
    borderLeftWidth: 1,
    borderLeftColor: Colors.greyBorder,
  },
  statValueText: {
    fontSize: FontSize.FONT_14,
    fontFamily: FontFamily.Bold,
    color: Colors.black,
    marginBottom: wp(1),
  },
  statLabelText: {
    fontFamily: FontFamily.OutfitMedium,
    color: Colors.greyDark2,
    fontSize: FontSize.FONT_12,
  },

  // --- ACTION BUTTONS ---
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: "space-between",
    marginBottom: wp(6),
  },
  addToOutfitBtnPrimary: {
    backgroundColor: Colors.themeColor,
    paddingVertical: wp(3),
    paddingHorizontal: wp(2),
    borderRadius: wp(2.5),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.themeColor,
  },
  addToOutfitTextPrimary: {
    color: Colors.white,
    fontFamily: FontFamily.OutfitMedium,
    fontSize: FontSize?.FONT_13
  },
  addToOutfitBtnSecondary: {
    backgroundColor: Colors.themeColor,
    borderWidth: 1,
    borderColor: Colors.themeColor,
    paddingVertical: wp(3),
    paddingHorizontal: wp(2),
    borderRadius: wp(2.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToOutfitTextSecondary: {
    color: Colors.white,
    fontFamily: FontFamily.OutfitMedium,
    fontSize: FontSize?.FONT_13
  },

  // --- DETAILS LIST ---
  sectionHeading: {
    fontFamily: FontFamily.OutfitMedium,
    fontSize: FontSize.FONT_18,
    color: Colors.black,
    marginBottom: wp(5),
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: wp(4.5),
  },
  detailRowMultiline: {
    alignItems: 'flex-start',
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

  // Custom Color styling — matches detailValue column (right, max 65%)
  colorValuesWrap: {
    width: '65%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    alignItems: 'center',
    rowGap: wp(1.5),
  },
  colorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: wp(2),
  },
  colorValueText: {
    fontFamily: FontFamily.OutfitMedium,
    color: Colors.black,
  },
  colorCircle: {
    width: wp(3.5),
    height: wp(3.5),
    borderRadius: wp(1.75),
    marginRight: wp(1.5),
  },
  colorCircleBordered: {
    borderWidth: 1,
    borderColor: Colors.borderGrey,
  },

  // Notes styling
  detailRowVertical: {
    marginBottom: wp(4.5),
  },
  notesTextValue: {
    fontFamily: FontFamily.OutfitMedium,
    color: Colors.black,
    marginTop: wp(2),
  },

  // Tags styling
  tagsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: wp(2),
  },
  tagPill: {
    backgroundColor: Colors.voiletLight,
    paddingHorizontal: wp(3),
    paddingVertical: wp(1),
    borderRadius: wp(4),
    marginRight: wp(2),
    marginBottom: wp(2),
  },
  tagPillText: {
    color: Colors.themeColor,
    fontFamily: FontFamily.OutfitMedium,
    fontSize: FontSize.FONT_12,
  },

  // --- MEASUREMENTS ---
  measurementsHeaderView: {
    alignSelf: 'flex-start',
    paddingBottom: wp(0.5),
    marginTop: wp(4),
    marginBottom: wp(4),
  },
  measurementsTitle: {
    fontFamily: FontFamily.OutfitMedium,
    fontSize: FontSize.FONT_18,
    color: Colors.black,
  },
});
