import { StyleSheet, Platform } from 'react-native';
import {
  FontFamily,
  FontSize,
  FontWeight,
  OutfitFamily,
} from '../../../../constant/fonts';
import { hp, wp } from '../../../../utils/helper';
import { Colors } from '../../../../constant/colors';

export const getStyles = Colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.backgroundColor1,
      paddingTop: Platform.OS === 'android' ? hp(4) : 0,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyTitle: {
      fontSize: FontSize.FONT_22,
      fontFamily: FontFamily.OutfitMedium,
      color: Colors.blackVar3,
      marginTop: hp(2),
      textAlign: 'center',
    },
    emptySubtitle: {
      fontSize: FontSize.FONT_14,
      fontFamily: OutfitFamily.Regular,
      color: Colors.gray,
      marginTop: hp(1),
      textAlign: 'center',
      paddingHorizontal: wp(10),
    },
    listContent: {
      paddingHorizontal: wp(5),
      paddingTop: hp(2),
      paddingBottom: hp(10),
    },
    row: {
      justifyContent: 'space-between',
      marginBottom: hp(1.5),
    },
    card: {
      width: wp(43.5),
      backgroundColor: Colors.white,
      borderRadius: wp(6),
      overflow: 'hidden',
      height: hp(26),
    },
    imageOverlayContainer: {
      flex: 1,
      position: 'relative',
    },
    gradient: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      height: hp(9),
      zIndex: 1,
    },
    cardContent: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: wp(3.5),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 2,
    },
    deleteIcon: {
      width: wp(5),
      height: wp(5),
      tintColor: Colors.white,
    },
    cardTitle: {
      fontSize: FontSize.FONT_14,
      color: Colors.white,
      marginBottom: hp(0.1),
      fontFamily: FontFamily.OutfitMedium,
    },
    cardSubtitle: {
      fontSize: FontSize.FONT_11,
      color: Colors.white,
      fontFamily: FontFamily.OutfitRegular,
    },
    cardImage: {
      width: '100%',
      height: '100%',
    },
    // removed badge styles since we use cardSubtitle now
    badge: {
      display: 'none',
    },
    bottomButtonContainer: {
      position: 'absolute',
      bottom: hp(3),
      left: 0,
      right: 0,
      alignItems: 'center',
      zIndex: 10,
    },
    createButton: {
      backgroundColor: Colors.black,
      width: wp(14),
      height: wp(14),
      borderRadius: wp(7),
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 5,
      borderWidth: 3,
      borderColor: Colors.white,
    },
    createButtonText: {
      color: Colors.white,
      fontSize: FontSize.FONT_16,

      fontFamily: FontFamily.OutfitMedium,
    },
    plusIcon: {
      width: wp(24),
      height: wp(24)
    },
  });
