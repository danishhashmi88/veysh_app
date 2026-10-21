import { StyleSheet } from 'react-native';
import { hp, wp } from '../../../utils/helper';
import { FontFamily, FontSize, OutfitFamily } from '../../../constant/fonts';

export const getStyles = Colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.backgroundColor1, // Slightly more vibrant/solid background
    },

    chatListContainer: {
      paddingHorizontal: wp(4),
      paddingBottom: hp(2),
    },

    dateSeparatorText: {
      textAlign: 'center',
      color: Colors.graytext,
      fontFamily: OutfitFamily.Regular,
      marginVertical: hp(1.5),
    },

    messageRow: {
      flexDirection: 'row',
      marginBottom: hp(1.5),
    },

    aiMessageRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
    },

    userMessageRow: {
      justifyContent: 'flex-end',
    },

    aiAvatarSmallContainer: {
      width: wp(10),
      height: wp(10),
      borderRadius: wp(100),
      marginRight: wp(2),
      overflow: 'hidden',
      backgroundColor: Colors.white,
    },

    aiAvatarSmall: {
      width: '100%',
      height: '100%',
    },

    messageBubble: {
      maxWidth: '75%',
      paddingHorizontal: wp(4),
      paddingVertical: hp(1.3),
      borderRadius: wp(4),
    },

    aiBubble: {
      backgroundColor: Colors.white,
      borderBottomLeftRadius: wp(0.2),
      shadowColor: Colors.black,
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 1 },
      shadowRadius: 3,
      elevation: 1,
    },

    userBubble: {
      backgroundColor: Colors.themeColor,
      borderBottomRightRadius: wp(0.2),
    },

    messageText: {
      fontFamily: OutfitFamily.Regular,
      color: Colors.black, // Default AI text color
      lineHeight: 20,
    },

    userText: {
      fontFamily: OutfitFamily.Regular,
      color: Colors.white, // User text color override
    },

    timestampContainer: {
      marginTop: hp(0.4),
      alignItems: 'flex-end',
    },

    timestampLeft: {
      alignItems: 'flex-start',
    },

    timestampText: {
      fontFamily: OutfitFamily.Regular,
      color: Colors.graytext,
      marginTop: hp(0.5),
      marginBottom: hp(0.5),

      letterSpacing: 0.6,
    },

    userTimestampText: {
      color: Colors.white,
    },

    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: wp(4),
      paddingVertical: hp(1.5),
      backgroundColor: Colors.white,
      borderTopWidth: 1,
      borderTopColor: Colors.bgGrey,
    },

    inputWrapper: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: hp(5.5),
      maxHeight: hp(15),
      backgroundColor: Colors.bgGrey,
      borderRadius: wp(4),
      paddingHorizontal: wp(4),
      marginRight: wp(3),
      borderWidth: 1,
      borderColor: Colors.borderNoButton,
    },

    textInput: {
      flex: 1,
      fontSize: FontSize.FONT_16,
      color: Colors.black,
      paddingVertical: hp(1.2),
      fontFamily: OutfitFamily.Regular,
    },

    inputIconButton: {
      padding: wp(2),
      marginLeft: wp(1),
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2,
    },

    inputIcon: {
      width: wp(6),
      height: wp(6),
      tintColor: Colors.greyVar1,
    },

    micIconActive: {
      tintColor: Colors.themeColor,
    },

    sendIconContainer: {
      width: wp(11.5),
      height: wp(11.5),
      borderRadius: wp(100),
      backgroundColor: Colors.themeColor,
      justifyContent: 'center',
      alignItems: 'center',
    },

    sendIcon: {
      width: wp(6),
      height: wp(6),
      tintColor: Colors.white,
    },
    suggestionContainer: {
      marginTop: hp(1.5),
      gap: hp(1.5),
    },
    outfitCard: {
      backgroundColor: Colors.bgGrey,
      borderRadius: wp(3),
      padding: wp(3),
      borderWidth: 1,
      borderColor: Colors.borderGrey,
    },
    outfitName: {
      fontFamily: FontFamily.OutfitMedium,
      fontSize: FontSize.FONT_14,
      color: Colors.black,
      marginBottom: hp(0.5),
    },
    outfitDesc: {
      fontFamily: FontFamily.OutfitRegular,
      fontSize: FontSize.FONT_12,
      color: Colors.graytext,
      lineHeight: 16,
      marginBottom: hp(1),
    },
    itemsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: wp(2),
      marginBottom: hp(1),
    },
    itemThumbContainer: {
      width: wp(18),
      alignItems: 'center',
    },
    itemThumb: {
      width: wp(15),
      height: wp(15),
      borderRadius: wp(2),
      backgroundColor: Colors.white,
      borderWidth: 1,
      borderColor: Colors.borderGrey,
    },
    itemName: {
      fontSize: 10,
      fontFamily: FontFamily.OutfitRegular,
      color: Colors.blackVar2,
      marginTop: 2,
      textAlign: 'center',
    },
    missingContainer: {
      marginTop: hp(1.5),
      paddingTop: hp(1),
      borderTopWidth: 1,
      borderTopColor: Colors.bgGrey,
    },
    missingTitle: {
      fontFamily: FontFamily.OutfitMedium,
      fontSize: FontSize.FONT_14,
      color: '#7C10D8', // Highlight in theme color
      marginBottom: hp(0.5),
    },
    missingItemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: hp(0.3),
    },
    missingDot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: Colors.graytext,
      marginRight: wp(2),
    },
    missingText: {
      fontFamily: FontFamily.OutfitRegular,
      fontSize: FontSize.FONT_12,
      color: Colors.blackVar2,
      lineHeight: 18,
    },
    suggestionsWrapper: {
      backgroundColor: Colors.white,
      paddingTop: hp(1),
    },
    suggestionsList: {
      paddingHorizontal: wp(4),
      gap: wp(3),
      paddingBottom: hp(1),
    },
    suggestionChip: {
      paddingHorizontal: wp(4.5),
      paddingVertical: hp(1),
      borderRadius: wp(100),
      backgroundColor: Colors.baeColorAi,
      borderWidth: 1,
      borderColor: Colors.borderLightPurple,
      shadowColor: Colors.themeColor,
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 2,
    },
    suggestionChipText: {
      fontFamily: FontFamily.OutfitMedium,
      fontSize: FontSize.FONT_13,
      color: Colors.themeColor,
    },
  });
