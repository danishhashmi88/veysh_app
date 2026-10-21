import { StyleSheet, Platform } from 'react-native';
import { FontFamily, FontSize, FontWeight, OutfitFamily } from '../../../constant/fonts';
import { hp, wp } from '../../../utils/helper';

export const getStyles = Colors =>
  StyleSheet.create({
    // ── Root container ──────────────────────────
    container: { flex: 1, backgroundColor: Colors.red },

    // ── Fixed header (back button only) ─────────
    header: {
      paddingHorizontal: wp(4),
      paddingVertical: -hp(1),
      backgroundColor: Colors.white,
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      width: wp(10),
      height: wp(10),
      borderRadius: wp(5),
      backgroundColor: Colors.white,
      justifyContent: 'center',
      alignItems: 'center',

      // borderBottomWidth: 1,
      // borderBottomColor: Colors.red,
    },
    backIcon: {
      width: wp(5),
      height: wp(5),
      tintColor: Colors.black,
    },

    // ── FlatList layout ──────────────────────────
    listContent: {
      paddingHorizontal: wp(4),
      paddingBottom: hp(6),
      paddingTop: hp(1.5),
    },
    contentList: {
      flex: 1,
    },
    gridRow: {
      justifyContent: 'space-between',
      marginBottom: wp(2),
    },

    // ── Profile header area ──────────────────────
    profileHeader: {
      backgroundColor: Colors.white,
      // marginBottom: hp(2),
    },
    container2: {
      alignItems: 'center',
      // paddingTop: hp(1),
      // paddingBottom: hp(1),
    },

    // ── Avatar ───────────────────────────────────
    avatarWrapper: {
      shadowColor: Colors.black,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.14,
      shadowRadius: 12,
      elevation: 8,
      borderRadius: wp(15),
      marginBottom: hp(1.5),
      backgroundColor: Colors.white,
    },
    avatar: {
      width: wp(20),
      height: wp(20),
      borderRadius: wp(14),
      // borderWidth: 3,
      // borderColor: Colors.white,
    },

    // ── Name & Bio ───────────────────────────────
    name: {
      fontSize: FontSize.FONT_26,
      fontFamily: FontFamily.Bold,
      color: Colors.black,
      marginBottom: hp(0.6),
      textAlign: 'center',
    },
    description: {
      fontSize: FontSize.FONT_15,
      fontFamily: FontFamily.OutfitRegular,
      color: Colors.graytext,
      textAlign: 'center',
      paddingHorizontal: wp(6),
      marginBottom: hp(2),
      lineHeight: wp(5.5),
    },

    // ── Stats row ────────────────────────────────
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      marginBottom: hp(2.5),
      paddingHorizontal: wp(2),
    },
    statBox: {
      flex: 1,
      alignItems: 'center',
    },
    verticalDivider: {
      width: 1,
      height: hp(3.5),
      backgroundColor: Colors.borderNoButton,
      marginHorizontal: wp(1),
    },
    statValue: {
      fontSize: wp(5.5),
      fontFamily: FontFamily.Bold,
      color: Colors.black,
      marginBottom: hp(0.3),
    },
    statLabel: {
      fontSize: wp(3),
      fontFamily: FontFamily.OutfitRegular,
      color: Colors.graytext,
    },

    // ── Action buttons ───────────────────────────
    buttonRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: wp(4),
      marginBottom: hp(2.5),
    },
    followButton: {
      flex: 1,
      backgroundColor: Colors.themeColor,
      paddingVertical: hp(1.5),
      borderRadius: wp(3.5),
      alignItems: 'center',
      marginRight: wp(2),
    },
    followText: {
      color: Colors.white,
      fontFamily: OutfitFamily.Medium,
      fontSize: wp(4),
      letterSpacing: 0.3,
    },
    messageButton: {
      flex: 1,
      backgroundColor: Colors.white,
      paddingVertical: hp(1.5),
      borderRadius: wp(3.5),
      alignItems: 'center',
      marginLeft: wp(2),
      borderWidth: 1.5,
      borderColor: Colors.borderNoButton,
    },
    messageText: {
      color: Colors.black,
      fontFamily: OutfitFamily.Medium,
      fontSize: wp(4),
      letterSpacing: 0.3,
    },

    // ── Tabs ─────────────────────────────────────
    tabContainer: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: Colors.borderNoButton,
      marginBottom: hp(2),
    },
    tabBtn: {
      flex: 1,
      paddingVertical: hp(1.5),
      alignItems: 'center',
      borderBottomWidth: 3,
      borderBottomColor: 'transparent',
    },
    activeTabBtn: {
      borderBottomWidth: 3,
      borderBottomColor: Colors.themeColor,
    },
    tabText: {
      fontSize: wp(4),
      fontFamily: FontFamily.OutfitMedium,
      color: Colors.graytext,
    },
    activeTabText: {
      fontSize: wp(4),
      fontFamily: FontFamily.OutfitMedium,
      color: Colors.themeColor,
    },

    // ── Posts grid cards (green) ─────────────────
    postGridCard: {
      width: '49%',
      backgroundColor: Colors.white,
      borderRadius: wp(4),
      overflow: 'hidden',
      shadowColor: Colors.black,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 1,
      elevation: 1,
    },
    postGridImage: {
      width: '100%',
      height: hp(22),
      backgroundColor: Colors.genderBg,
    },

    // ── Outfit / Item cards (green) ──────────────
    row: {
      justifyContent: 'space-between',
    },
    card: {
      width: '49%',
      backgroundColor: Colors.backGroundColor1,
      borderRadius: wp(4),
      // overflow: 'hidden',
      shadowColor: Colors.black,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 1,
      elevation: 1,
    },
    cardDetails: {
      padding: wp(3),
    },
    cardTitle: {
      fontSize: FontSize.FONT_14,
      fontFamily: FontFamily.OutfitMedium,
      color: Colors.black,
    },
    cardPrice: {
      fontSize: FontSize.FONT_14,
      fontFamily: FontFamily.OutfitMedium,
      color: Colors.themeColor,
      marginTop: hp(0.5),
    },
    cardImage: {
      width: '100%',
      height: hp(22),
      // backgroundColor: Colors.genderBg,
    },

    // ── Empty state ──────────────────────────────
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: hp(8),
    },
    emptyTitle: {
      fontSize: FontSize.FONT_21,
      fontFamily: FontFamily?.Bold,
      color: Colors.black,
      marginBottom: hp(0.5),
    },
    emptySubtitle: {
      fontSize: FontSize.FONT_14,
      fontFamily: FontFamily.OutfitRegular,
      color: Colors.greyVar1,
      textAlign: 'center',
      marginBottom: hp(2.5),
    },
    emptuyIcon: {
      width: wp(8),
      height: wp(8),
      tintColor: Colors.greyVar1,
    },
    ootdEmptyIconContainer: {
      width: wp(14),
      height: wp(14),
      borderRadius: wp(3),
      backgroundColor: Colors?.bgGrey,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: hp(2),
    },
  });
