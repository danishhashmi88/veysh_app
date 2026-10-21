import { StyleSheet, Platform } from 'react-native';
import { hp, wp } from '../../../utils/helper';
import {
  FontSize,
  FontWeight,
  FontFamily,
  OutfitFamily,
} from '../../../constant/fonts';
import { Colors } from '../../../constant/colors';

export const getStyles = Colors =>
  StyleSheet.create({
    mainContainer: { flex: 1 },
    scrollContent: { paddingHorizontal: wp(4), paddingBottom: hp(5) },

    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: wp(4),
      marginTop: Platform.OS === 'ios' ? hp(1) : hp(2),
      paddingBottom: hp(1.5),
    },
    backBtn: {
      width: wp(10),
      height: wp(10),
      borderRadius: wp(5),
      backgroundColor: Colors.bgGrey,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: wp(-2), // Align left properly within padding
    },
    backIcon: { width: wp(6), height: wp(6), tintColor: Colors.pureBlack },
    headerTitle: {
      marginLeft: hp(1.9),
      fontSize: 24,
      fontFamily: FontFamily.Bold,
      color: Colors.black,
    },

    completenessCard: {
      borderRadius: wp(3),
      padding: wp(4),
      paddingVertical: hp(1.5),
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: hp(2),
      minHeight: hp(6),
      flexDirection: 'row',
    },
    completenessTitleBox: {
      flex: 1,
      justifyContent: 'center',
    },
    completenessTitle: {
      fontSize: FontSize.FONT_14,
      fontFamily: FontFamily?.Bold,
      color: Colors.white,
      marginBottom: hp(0.5),
    },
    completenessSubtitle: {
      fontFamily: OutfitFamily.Medium,
      color: Colors.white,
      opacity: 0.9,
    },
    progressCircleWrapper: {
      width: wp(14),
      height: wp(14),
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'visible',
    },
    progressTextContainer: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
    },
    progressText: {
      color: Colors.white,
      fontSize: FontSize.FONT_12,
      fontFamily: FontFamily.OutfitMedium,
    },
    statsCard: {
      backgroundColor: Colors.white,
      borderRadius: wp(4),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      shadowColor: Colors.pureBlack,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: Platform.OS === 'ios' ? 0.05 : 0.3,
      elevation: 1.5,
      marginBottom: hp(2),
      paddingVertical: hp(2.5),
    },
    statsColumn: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    statsDivider: {
      width: 1,
      height: hp(4),
      backgroundColor: 'rgba(0,0,0,0.05)',
    },
    statValue: {
      fontSize: FontSize.FONT_18,
      fontFamily: FontFamily.SemiBold,
      color: '#000',
      marginBottom: hp(0.5),
    },
    statLabel: {
      fontSize: FontSize.FONT_13,
      color: Colors.graytext,
      fontFamily: FontFamily.OutfitMedium,
    },
    avatarWrapper: {
      position: 'absolute',
      top: hp(6.5), // Position dynamically based on banner height so it overlaps the bottom edge
      alignSelf: 'center',
      zIndex: 10,
    },
    mainAvatar: {
      width: wp(18),
      height: wp(18),
      borderRadius: wp(9),
      borderWidth: 3,
      borderColor: Colors.white,
    },

    sectionContainer: {
      marginBottom: hp(2),
      // width:('80%'),
      // height:hp(20)
    },

    stylistCard: {
      backgroundColor: Colors.lightPurple,
      borderRadius: wp(3),
      padding: wp(3),

      width: '100%',
      height: hp(10.5),
      justifyContent: 'space-between',

      borderBottomWidth: Platform.OS === 'ios' ? 1 : 1.4,
      //borderBottomColor: Colors.themeColor,
      borderBottomColor:
        Platform.OS === 'ios' ? Colors.mediumPurple : Colors.mediumPurple,
      shadowColor: Colors.pureBlack,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      elevation: 2,
    },

    stylistTitle: {
      fontSize: FontSize.FONT_12,
      color: Colors.blackVar2,
      fontFamily: FontFamily.OutfitMedium,
      marginBottom: hp(1.5),
    },

    stylistRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    stylistInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    stylistAvatar: {
      width: wp(9),
      height: wp(9),

      borderRadius: wp(100),
      marginRight: wp(3),
    },
    stylistName: {
      fontSize: FontSize.FONT_14,
      fontFamily: FontFamily.OutfitMedium,
      color: Colors.blackVar2,
    },

    chatBtn: {
      backgroundColor: Colors.mediumPurple,
      borderRadius: wp(100),
      width: wp(10),
      height: wp(10),
      justifyContent: 'center',
      alignItems: 'center',
    },
    chatIcon: {
      width: wp(5),
      height: wp(5),
    },
    cardContainer: {
      backgroundColor: Colors.white,
      borderRadius: wp(4),
      padding: wp(4),
      marginBottom: hp(2),
      shadowColor: Colors.pureBlack,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: Platform.OS === 'ios' ? 0.05 : 0.3,
      // shadowOpacity: 0.05,
      elevation: 1.5,
    },
    rowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: hp(1),
    },
    cardTitle: {
      fontSize: FontSize.FONT_18,
      fontFamily: FontFamily.OutfitMedium,
      color: Colors.blackVar2,
    },
    editIcon: { width: wp(4.5), height: wp(4.5), tintColor: Colors.iconDark },

    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginVertical: hp(0.2),
    },
    infoLabel: {
      fontSize: FontSize.FONT_12,
      color: Colors.graytext,
      fontFamily: FontFamily.OutfitMedium,
    },
    infoValue: {
      fontSize: FontSize.FONT_12,
      color: Colors.blackVar2,
      fontFamily: FontFamily.OutfitMedium,
      textAlign: 'right',
      // marginLeft: wp(2),
    },
    infoValueDark: {
      fontSize: FontSize.FONT_12,
      color: Colors.blackVar2,
      fontFamily: FontFamily.OutfitMedium,
      marginTop: hp(0.5),
    },
    divider: {
      height: 1,
      backgroundColor: Colors.dividerBg,
      marginVertical: hp(1),
    },
    bioText: {
      fontSize: FontSize.FONT_12,
      color: Colors.blackVar2,
      lineHeight: 20,
      marginTop: hp(0.5),
      fontFamily: FontFamily.OutfitMedium,
    },

    subLabel: {
      fontSize: FontSize.FONT_12,
      color: Colors.graytext,
      fontFamily: FontFamily.OutfitMedium,
      marginBottom: hp(1),
      // marginTop: hp(1.5),
    },
    colorCircle: {
      width: wp(4.8),
      height: wp(4.8),
      borderRadius: wp(100),
      marginRight: wp(2.5),
    },
    colorCircleBordered: {
      borderWidth: 1,
      borderColor: Colors.borderGrey,
    },

    brandChip: {
      backgroundColor: 'transparent',
      borderRadius: wp(100),
      paddingHorizontal: wp(4),
      paddingVertical: hp(0.8),
      marginRight: wp(2.5),
      marginBottom: hp(1),
      borderWidth: 1,
      borderColor: Colors.borderGrey,
    },
    brandText: {
      fontSize: FontSize.FONT_12,
      color: Colors.blackVar2,
      fontFamily: FontFamily.OutfitMedium,
    },

    // gridContainer: {
    //   flexDirection: 'row',
    //   flexWrap: 'wrap',
    //   justifyContent: 'space-between',
    // },
    photosRow: {
      flexDirection: 'row',
      marginTop: hp(1),
    },
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },

    sizesContainer: {
      flexDirection: 'row',
      backgroundColor: '#F7F6FA',
      borderRadius: wp(3),
      paddingVertical: hp(1.5),
      justifyContent: 'space-around',
      marginBottom: hp(2),
      marginTop: hp(1),
    },
    sizeColumn: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
    sizeValue: {
      fontSize: FontSize.FONT_16,
      fontFamily: FontFamily.SemiBold,
      color: '#000',
      marginBottom: 2,
    },
    sizeLabel: {
      fontSize: FontSize.FONT_12,
      color: Colors.graytext,
      fontFamily: FontFamily.OutfitMedium,
    },
    measureBox: {
      width: '48%',
      minHeight: hp(3.8),
      backgroundColor: '#F7F6FA',
      borderRadius: wp(2),
      paddingHorizontal: wp(3),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: hp(1),
    },

    measureLabel: {
      fontSize: FontSize.FONT_12,
      color: Colors.graytext,
      fontFamily: FontFamily.OutfitMedium,
    },

    measureValue: {
      fontSize: FontSize.FONT_12,
      fontFamily: FontFamily.OutfitMedium,
      color: Colors.black,
    },

    dot: { width: 10, height: 10, borderRadius: 10, marginRight: 8 },
    bodyPhoto: {
      width: wp(30),
      height: hp(15),
      borderRadius: wp(2),
      marginRight: wp(3),
    },
    noDataText: {
      fontSize: FontSize.FONT_14,
      color: Colors.blackVar2,
      fontFamily: FontFamily.OutfitMedium,
      textAlign: 'center',
      marginTop: hp(2),
      marginBottom: hp(1),
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      marginBottom: hp(1),
    },
  });
