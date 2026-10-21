import { StyleSheet, Platform } from 'react-native';
import { FontFamily, FontSize, FontWeight } from '../../../constant/fonts';
import { hp, wp } from '../../../utils/helper';
import { Colors } from '../../../constant/colors';

export const getStyles = Colors =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.white },
    scrollContent: {
      paddingHorizontal: wp(5),
      paddingBottom: hp(5),
      paddingTop: hp(2),
    },
    emptyContainer: {
      paddingVertical: hp(6),
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: wp(5),
      paddingVertical: Platform.OS === 'ios' ? hp(2) : hp(2),
    },
    headerTitle: {
      fontFamily: FontFamily.Bold,
      fontSize: wp(6),
      color: Colors.black,
      marginLeft: wp(5),
    },
    widget: {
      // width: '100%',
      // height: '100%',
      // backgroundColor: Colors.black,
      // borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
    fab: {
      position: 'absolute',
      bottom: hp(7),
      // right: wp(5),
      zIndex: 100,
      width: 60,
      height: 60,
      borderRadius: wp(100),
      borderWidth: 3,
      borderColor: Colors.white,
      elevation: 10,
      shadowColor: Colors.black,
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 2,
      shadowRadius: 5,
    },
    fabIcon: {
      color: 'white',
      fontSize: 30,
      marginTop: -5,
    },
    emptyText: {
      fontSize: 14,
      color: '#888',
      textAlign: 'center',
    },

    sectionContainer: { marginBottom: hp(2) },
    sectionHeader: {
      fontSize: FontSize.FONT_17,
      fontFamily: FontFamily.OutfitMedium,
      color: Colors.blackVar3,
      marginBottom: hp(2),
      letterSpacing: 0.3,
    },
    rowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: hp(0.5),
    },

    viewAllText: {
      fontSize: FontSize.FONT_13,
      color: Colors.textGreyMedium,
    },

    postCard: {
      marginBottom: hp(1),
    },
    postHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: hp(1),
      marginTop: hp(1),
      // marginLeft: hp(1),
    },
    postAvatar: {
      width: wp(11),
      height: wp(11),
      borderRadius: wp(100),
      marginBottom: '-2%',
    },
    postUser: {
      fontSize: FontSize.FONT_14,
      color: Colors.blackVar3,
    },
    postTime: {
      fontSize: FontSize.FONT_12,
      color: Colors.greyVar1,
      marginRight: wp(2),
    },
    moreIcon: { width: wp(5), height: wp(5), tintColor: Colors.iconGrey },
    postMainImage: {
      width: '95%',
      height: hp(30),
      borderRadius: wp(4),
      marginBottom: hp(1),
      marginLeft: 9,
    },
    postActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: hp(0.7),
      // paddingHorizontal: hp(1),
      marginTop: hp(1),
    },
    row: { flexDirection: 'row', alignItems: 'center' },
    actionIcon: { width: wp(6), height: wp(6), tintColor: Colors.blackVar3 },
    actionText: {
      fontSize: FontSize.FONT_14,
      color: Colors.blackVar3,
      marginLeft: wp(0.5),
      fontWeight: FontWeight.FONT_600,
    },
    likeButton: {
      marginTop: hp(-0.5),
    },
    postTitle: {
      fontSize: FontSize.FONT_14,
      color: Colors.blackVar3,
      fontWeight: FontWeight.FONT_400,
      marginBottom: hp(0.2),
    },
    postTags: {
      fontSize: FontSize.FONT_13,
      color: Colors.blueVar,
      fontWeight: FontWeight.FONT_500,
    },
    postWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 3,
    },
    textTitle: { paddingBottom: hp(1) },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
    },

    commentModal: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      height: '60%',
      backgroundColor: '#fff',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingHorizontal: 15,
      paddingTop: 10,
    },

    modalHandle: {
      width: 40,
      height: 5,
      backgroundColor: '#ccc',
      borderRadius: 3,
      alignSelf: 'center',
      marginBottom: 10,
    },

    modalTitle: {
      fontSize: 18,
      fontStyle: 'semi-bold',
      marginBottom: 20,
    },
    commentRow: {
      flexDirection: 'row',
      marginBottom: 15,
      alignItems: 'center',
    },

    commentAvatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      marginRight: 10,
    },

    commentName: {
      fontWeight: FontWeight.FONT_400,
      fontSize: 13,
      fontStyle: 'medium',
      marginBottom: 4,
    },

    commentText: {
      // fontSize: 13,
      color: '#71717A',
      fontStyle: 'regular',
    },

    commentTime: {
      fontSize: 11,
      color: '#71717A',
      marginLeft: 6,
    },

    commentInputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 10,
      // borderTopWidth: 1,
      // borderTopColor: '#eee',
      backgroundColor: '#fff',
      marginBottom: 10,
    },

    inputAvatar: {
      width: 34,
      height: 34,
      borderRadius: 17,
      marginRight: 10,
    },

    commentInput: {
      flex: 1,
      height: 40,
      backgroundColor: '#ffff',
      borderRadius: 20,
      paddingHorizontal: 15,
      fontSize: 13,
      color: '#71717A',
      borderWidth: 1,
      borderColor: '#E4E4E7',
      fontStyle: 'regular',
    },
    sendButton: {
      marginLeft: 10,
    },
    fabContainer: {
      position: 'absolute',
      bottom: hp(1),
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: wp(5),
    },
    fabImage: {
      width: wp(24),
      height: wp(24),
    },
  });
