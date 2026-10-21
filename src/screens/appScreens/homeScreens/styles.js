import { StyleSheet, Platform } from 'react-native';
import {
  FontFamily,
  FontSize,
  FontWeight,
  OutfitFamily,
} from '../../../constant/fonts';
import { hp, wp } from '../../../utils/helper';
import { Colors } from '../../../constant/colors';

export const getStyles = Colors =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: Colors.backGroundColor1, // Match screenshot light background
    },
    contentContainer: {
      flex: 1,
      backgroundColor: 'transparent',
      zIndex: 1,
    },
    scrollContainer: {
      paddingHorizontal: wp(4),
      paddingBottom: hp(18),
      paddingTop: hp(1.5)
    },

    // --- Header Styles ---
    headerRow: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: hp(0),
      marginBottom: hp(0.7),
    },
    brandContainer: {
      flex: 1,
    },
    brandText: {
      fontSize: FontSize.FONT_22,
      color: Colors.black,
      fontFamily: FontFamily.Bold,
    },
    headerSubtitle: {
      fontSize: FontSize.FONT_10,
      color: Colors.greyVar1,
      marginTop: hp(0.2),
      fontWeight: FontWeight.FONT_400,
      fontFamily: FontFamily.OutfitMedium, // Serif from screenshot
    },
    headerIcons: {
      flexDirection: 'row',
      alignItems: 'center',
      overflow: 'visible',
      zIndex: 10,
    },
    headerIconCircle: {
      width: wp(9.5),
      height: wp(9.5),
      borderRadius: wp(4.75),
      backgroundColor: Colors.bgGrey,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: wp(3),
      position: 'relative',
    },
    headerIconImage: {
      width: wp(5),
      height: wp(5),
      tintColor: Colors.black,
    },
    notificationBadge: {
      position: 'absolute',
      top: -wp(1),
      right: -wp(1),
      minWidth: wp(5),
      height: wp(5),
      borderRadius: wp(2.5),
      backgroundColor: Colors.themeColor,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: wp(0.6),
      borderWidth: 1.5,
      borderColor: Colors.white,
      zIndex: 20,
      elevation: 6,
    },
    notificationBadgeText: {
      color: Colors.white,
      fontSize: FontSize.FONT_10,
      fontFamily: FontFamily.OutfitMedium,
      includeFontPadding: false,
      textAlignVertical: 'center',
    },
    searchIconImage: {
      width: wp(4.5),
      height: wp(4.5),
      tintColor: Colors.black,
    },
    avatarCircle: {
      width: wp(10),
      height: wp(10),
      borderRadius: wp(5),
      marginLeft: wp(3),
      overflow: 'hidden', // Added to contain image
    },
    avatarIcon: {
      width: '100%',
      height: '100%',
    },

    // --- AI BAE Banner ---
    baeBanner: {
      width: '100%',
      height: hp(6),
      borderRadius: wp(10),
      overflow: 'hidden',
      marginBottom: hp(2.5),
      marginTop: hp(1.2),
      backgroundColor: Colors.baeInternalColor, // Light purple bg
      borderWidth: 1,
      borderColor: Colors.borderLightPurple,
    },
    baeGradient: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: wp(2),
      paddingRight: wp(1),
    },
    baeBadge: {
      paddingVertical: hp(0.6),
      borderRadius: wp(10),
      flexDirection: 'row',
      alignItems: 'center',
      // marginLeft: wp(1),
    },
    baeBadgeText: {
      color: Colors.white,
      fontSize: FontSize.FONT_11,
      fontWeight: FontWeight.FONT_700,
      letterSpacing: 0.5,
    },
    baeTextContainer: {
      flex: 1,
      paddingLeft: wp(1.5),
    },
    baeMainText: {
      fontSize: FontSize.FONT_12,
      color: Colors.baeTextColor,
      // fontWeight: FontWeight.FONT_300,
      fontFamily: FontFamily.OutfitMedium,
    },
    baeActionButton: {
      width: wp(7),
      height: wp(7),
      // borderRadius: wp(5),
      // backgroundColor: Colors.themeColor, // Matching purple arrow circle
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: wp(0.7),
    },
    baeActionIcon: {
      width: wp(6),
      height: wp(6),
      tintColor: Colors.white,
    },

    // --- Navigation Pills ---
    navPillsContainer: {
      marginBottom: hp(3),
      // Removed flexDirection: 'row' and justifyContent as they are now handled by ScrollView
    },
    navPillsScrollContent: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: hp(0.5),
    },
    navPill: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: wp(3), // Increased padding
      paddingVertical: hp(1),
      borderRadius: wp(10),
      backgroundColor: Colors.white,
      borderWidth: 1,
      borderColor: Colors.borderLightGray1,
      // Removed flex: 1 to allow items to size based on content
      marginRight: wp(3), // Added margin right for spacing between scrollable items
    },
    activeNavPill: {
      elevation: 2,
      borderColor: Colors.borderLightGray1,
    },
    navPillIcon: {
      width: wp(4.8),
      height: wp(4.5),
      marginRight: wp(0.8),
      // tintColor: 'red',
    },
    navPillText: {
      fontSize: FontSize.FONT_13,
      fontWeight: FontWeight.FONT_400,
      color: Colors.black,
      fontFamily: FontFamily.OutfitMedium,
    },
    activeNavPillText: {
      color: Colors.black,
    },

    // --- Section Headers ---
    sectionContainer: {
      marginBottom: hp(2),
    },
    sectionTitleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: hp(1.0),
    },
    // sectionTitle: {
    //   fontSize: FontSize.FONT_24,
    //   color: Colors.black,
    //   fontFamily: FontFamily.Bold, // Serif mapping
    // },
    changeText: {
      fontSize: FontSize.FONT_15,
      color: Colors.themeColor,
      fontWeight: FontWeight.FONT_400,
      fontFamily: FontFamily.OutfitMedium,
    },
    headerChevron: {
      width: wp(2.5),
      height: wp(2.5),
      tintColor: Colors.themeColor,
      marginLeft: wp(1),
    },
    seeAllText: {
      fontSize: FontSize.FONT_13,
      color: Colors.themeColor,
      // fontWeight: '700',
      fontFamily: FontFamily.OutfitMedium,
    },
    //outfit day style
    ootdShadowWrapper: {
      width: wp(88),
      marginHorizontal: wp(2),
      marginTop: hp(0.5),
      // marginBottom: hp(2),
      justifyContent: 'center',
      backgroundColor: Colors.white, // Required for Android elevation
      borderRadius: wp(5), // Match inner card
      shadowColor: Colors.greyVar1,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 8,
      elevation: 6,
      alignSelf: 'center',
    },

    ootdMainCard: {
      backgroundColor: Colors.white,
      borderRadius: wp(5),
      overflow: 'hidden',
      // No overflow: hidden here to prevent middle clipping
    },

    ootdImageContainer: {
      width: '100%',
      height: wp(88), // Match width for perfect 1:1 square
      backgroundColor: Colors.backGroundColor1,
      justifyContent: 'center',
      alignItems: 'center',
      borderTopLeftRadius: wp(5),
      borderTopRightRadius: wp(5),
      // borderBottomLeftRadius: wp(5),
      // borderBottomRightRadius: wp(5),
      overflow: 'hidden', // Specifically clip image content only
    },

    ootdMainImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    ootdMultiImageContainer: {
      width: '100%',
      height: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap',
      padding: wp(2),
      gap: wp(2),
      justifyContent: 'center',
      alignItems: 'center',
    },
    ootdSmallImage: {
      width: (wp(88) - wp(10)) / 3, // Square for 3-in-a-row
      height: (wp(88) - wp(10)) / 3,
      borderRadius: wp(2),
    },

    ootdInfoSection: {
      backgroundColor: Colors.white,
      paddingHorizontal: wp(4),
      paddingVertical: hp(2),
    },

    eventBadge: {
      backgroundColor: Colors.orange,
      paddingHorizontal: wp(2),
      paddingVertical: hp(0.6),
      borderRadius: wp(5),
      alignSelf: 'flex-start',
      marginBottom: hp(0.5),
    },

    eventBadgeText: {
      color: Colors.white,
      fontSize: wp(2.5),
      // fontWeight: '600',
      fontFamily: FontFamily.OutfitMedium,
    },

    ootdTitle: {
      fontSize: FontSize.FONT_22,
      fontFamily: FontFamily.Bold,
      color: Colors.black,
      fontWeight: FontWeight.FONT_600,
    },

    ootdDetails: {
      fontSize: wp(3),
      color: Colors.graytext,
      marginTop: hp(0.5),
      fontFamily: FontFamily.OutfitMedium,
      fontWeight: FontWeight.FONT_400,
    },
    // --- OOTD Empty State ---
    ootdEmptyCard: {
      backgroundColor: Colors.white,
      borderRadius: wp(5),
      paddingVertical: hp(3),
      paddingHorizontal: wp(5),
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: hp(1),
      marginBottom: hp(2),
      shadowColor: Colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 3,
    },
    ootdEmptyIconContainer: {
      width: wp(14),
      height: wp(14),
      backgroundColor: Colors.bgGrey,
      borderRadius: wp(3),
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: hp(2),
    },
    ootdEmptyIcon: {
      width: wp(7),
      height: wp(7),
      tintColor: Colors.greyVar1,
    },
    ootdEmptyTitle: {
      fontSize: FontSize.FONT_20,
      fontFamily: FontFamily.Bold,
      color: Colors.black,
      marginBottom: hp(0.5),
    },
    ootdEmptySubtitle: {
      fontSize: FontSize.FONT_13,
      fontFamily: FontFamily.OutfitRegular,
      color: Colors.graytext,
      textAlign: 'center',
      marginBottom: hp(2.5),
    },
    ootdEmptyButton: {
      backgroundColor: Colors.themeColor,
      paddingHorizontal: wp(7),
      paddingVertical: hp(1),
      borderRadius: wp(3),
      justifyContent: 'center',
      alignItems: 'center',
    },
    ootdEmptyButtonText: {
      color: Colors.white,
      fontSize: FontSize.FONT_14,
      fontFamily: FontFamily.OutfitMedium,
    },
    // --- Wardrobe Insights ---
    insightsScroll: {
      marginBottom: hp(0.5),
    },
    insightCard: {
      width: wp(36),
      padding: wp(3),
      borderRadius: wp(4),
      backgroundColor: Colors.white,
      marginRight: wp(3),
      shadowColor: Colors.black,
      marginTop: hp(1),
      // height:hp(8)
    },
    insightIconCircle: {
      width: wp(12),
      height: wp(12),
      borderRadius: wp(3), // Exact screenshot jaisa rounded square effect
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: hp(2),
    },
    insightIcon: {
      width: wp(6),
      height: wp(6),
    },
    insightValue: {
      fontSize: FontSize.FONT_18,
      fontFamily: FontFamily.Bold,
      color: Colors.black,
      marginBottom: hp(0.2),
    },
    insightLabel: {
      fontSize: FontSize.FONT_13,
      color: Colors.graytext,
      fontFamily: OutfitFamily.Regular,
    },

    // --- My Wardrobe Grid ---
    sectionTitle: {
      fontSize: FontSize.FONT_22,
      color: Colors.black,
      fontFamily: FontFamily.Bold,
      fontWeight: Platform.OS === 'ios' ? FontWeight.FONT_500 : FontWeight.FONT_600,
    },
    wardrobeHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: hp(1.8),
    },
    filterContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: hp(2),
    },
    filterPill: {
      flex: 1,
      paddingHorizontal: wp(1),
      paddingVertical: hp(1),
      borderRadius: wp(5),
      backgroundColor: Colors.white,
      marginHorizontal: wp(1),
      borderWidth: 1,
      borderColor: Colors.filterPill,
      alignItems: 'center',
      justifyContent: 'center',
    },
    activeFilterPill: {
      backgroundColor: Colors.themeColor, // Vivid purple matching design
      borderColor: Colors.themeColor,
    },
    filterText: {
      fontSize: FontSize.FONT_14,
      // fontWeight: FontWeight.FONT_600,
      color: Colors.graytext,
      fontFamily: FontFamily.OutfitMedium,
    },
    activeFilterText: {
      color: Colors.white,
      fontFamily: FontFamily.OutfitMedium,
    },
    wardrobeListContainer: {
      flexDirection: 'row',
      marginBottom: hp(1),
    },
    wardrobeGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
    },
    wardrobeItem: {
      width: wp(28.5), // Perfect 3 column width
      marginRight: wp(3.5),
      marginBottom: hp(1),
      backgroundColor: Colors.white,
      borderRadius: wp(3),
      shadowColor: Colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 5,
      elevation: 2,
      overflow: 'hidden',
      paddingBottom: hp(1.5),
    },
    itemImageContainer: {
      width: '100%',
      aspectRatio: 1,
      backgroundColor: Colors.progressBg,
      marginBottom: hp(1),
    },
    itemImage: {
      width: '100%',
      height: '100%',
    },
    itemName: {
      fontSize: FontSize.FONT_14,
      fontFamily: FontFamily?.Bold,
      color: Colors.black,
      paddingHorizontal: wp(2.5),
    },
    noItemContainer: {
      width: '100%',
      backgroundColor: Colors.white,
      borderRadius: wp(4),
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: hp(3),
      shadowColor: Colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 5,
      elevation: 2,
    },
    noItemText: {
      fontSize: FontSize.FONT_18,
      fontFamily: FontFamily?.Bold,
      color: Colors.black,
      marginBottom: hp(0.5),
    },
    emptuyIcon: {
      width: wp(5),
      height: wp(5),
      tintColor: Colors.greyVar1,
    },
    ootdEmptyIconContainer: {
      width: wp(8),
      height: wp(8),
      borderRadius: wp(3),
      backgroundColor: Colors?.bgGrey,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: hp(1),
    },
    // --- Wardrobe Empty State ---
    wardrobeEmptyCard: {
      width: '100%',
      backgroundColor: Colors.white,
      borderRadius: wp(5),
      paddingVertical: hp(2.5),
      paddingHorizontal: wp(5),
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: Colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 4,
    },
    wardrobeEmptyIconContainer: {
      width: wp(12),
      height: wp(12),
      backgroundColor: Colors.bgGrey,
      borderRadius: wp(3),
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: hp(1.5),
    },
    wardrobeEmptyIcon: {
      width: wp(6),
      height: wp(6),
      tintColor: Colors.greyVar1,
    },
    wardrobeEmptyTitle: {
      fontSize: FontSize.FONT_18,
      fontFamily: FontFamily.Bold,
      color: Colors.black,
      marginBottom: hp(0.2),
    },
    wardrobeEmptySubtitle: {
      fontSize: FontSize.FONT_12,
      fontFamily: FontFamily.OutfitMedium,
      color: Colors.greyVar1,
      textAlign: 'center',
      lineHeight: hp(1.8),
      marginBottom: hp(2),
    },
    wardrobeEmptyButton: {
      backgroundColor: Colors.themeColor,
      paddingHorizontal: wp(7),
      paddingVertical: hp(1),
      borderRadius: wp(3),
      justifyContent: 'center',
      alignItems: 'center',
    },
    wardrobeEmptyButtonText: {
      color: Colors.white,
      fontSize: FontSize.FONT_14,
      fontFamily: FontFamily.OutfitMedium,
    },

    // --- Buy Outfits (Pre-Loved) ---
    buyOutfitCard: {
      width: wp(42),
      backgroundColor: Colors.white,
      borderRadius: wp(4),
      marginRight: wp(4),
      paddingBottom: hp(1.5),
      shadowColor: Colors.black,
      // shadowOffset: { width: 0, height: 2 },
      // shadowOpacity: 0.05,
      // shadowRadius: 5,
      // elevation: 2,
      overflow: 'hidden',
    },
    buyOutfitImage: {
      width: '100%',
      height: hp(22),
    },
    buyOutfitContent: {
      paddingHorizontal: wp(3),
      paddingTop: hp(1.5),
    },
    buyOutfitTitle: {
      fontSize: FontSize.FONT_13,
      fontWeight: FontWeight.FONT_700, // Bold black name
      color: Colors.black,
      marginBottom: hp(0.5),
    },
    buyOutfitPrice: {
      fontSize: FontSize.FONT_14,
      // fontWeight: FontWeight.FONT_700,
      fontFamily: FontFamily?.OutfitMedium,
      color: Colors.themeColor, // Vivid purple price
    },

    // --- Bottom Tab Central Button (UNTOUCHED) ---
    bottomTabPlusWrapper: {
      width: wp(14),
      height: wp(14),
      borderRadius: wp(7),
      backgroundColor: Colors.mediumPurple,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      bottom: hp(3.5),
      left: wp(50) - wp(7),
      borderWidth: 4,
      borderColor: Colors.white,
      shadowColor: Colors.mediumPurple,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 10,
      elevation: 8,
      zIndex: 1000,
    },
    plusIcon: {
      width: wp(6.5),
      height: wp(6.5),
      tintColor: Colors.white,
    },
  });
