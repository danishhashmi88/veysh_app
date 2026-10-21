// import { StyleSheet } from 'react-native';
// import { Colors } from '../../../constant/colors';
// import { hp, wp } from '../../../utils/helper';
// import { FontSize, FontWeight } from '../../../constant/fonts';

// export const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         alignItems: 'center',
//         backgroundColor:Colors.transparent,
//         justifyContent:'flex-end'
//     },
//     brandLogo: {
//         width: wp(20),
//         height: hp(15),
//     },
//     bottomView:{
//         width:wp(100),
//         height:hp(50),
//         alignItems:'center',
//         paddingTop:hp(3),
//         borderTopLeftRadius:wp(6),
//         borderTopRightRadius:wp(6),
//         backgroundColor: Colors.white,
//         shadowColor: "#0000000DD",
//         shadowOffset: {
//             width: 0,
//             height: -5,
//         },
//         shadowOpacity: 0.1,
//         shadowRadius: 3,
//         elevation: 5,
//     },
//     title:{
//         color:Colors.blackVar2,
//         fontWeight:FontWeight.FONT_700,
//         fontSize: FontSize.FONT_24
//     },
//     subTitle:{
//         color:Colors.graytext,
//         fontWeight:FontWeight.FONT_400,
//         fontSize: FontSize.FONT_12,
//         marginTop:hp(0.8)
//     },
//     bottomTextView: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: wp(1),
//         justifyContent:'center',
//         marginBottom:hp(1),
//         position:'absolute',
//         bottom:10
//     },
//     bottomText: {
//         fontSize: FontSize.FONT_14,
//         color: Colors.themeColor,
//         fontWeight:FontWeight.FONT_600
//     },
//     bigImage:{
//         alignSelf:'center',
//         width:wp(100),
//         height:hp(100),
//         position:'absolute',
//         zIndex:-1000
//     }
// });

import { StyleSheet, Platform } from 'react-native';
import { hp, wp } from '../../../utils/helper';
import { FontSize, FontWeight, FontFamily, OutfitFamily } from '../../../constant/fonts';
import { Colors } from '../../../constant/colors';
import firebase from '@react-native-firebase/app';
export const getStyles = colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    brandLogo: {
      width: wp(20),
      height: hp(15),
    },
    bottomView: {
      width: wp(100),
      height: hp(50),
      alignItems: 'center',
      paddingTop: hp(3),
      borderTopLeftRadius: wp(6),
      borderTopRightRadius: wp(6),
      backgroundColor: colors.background,
      shadowColor: '#0000000D',
      shadowOffset: {
        width: 0,
        height: -5,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 5,
    },
    title: {
      color: Colors.black,
      fontFamily: FontFamily.Bold,
      fontSize: FontSize.FONT_28,
    },
    subTitle: {
      color: Colors.graytext,
      fontWeight: FontWeight.FONT_400,
      fontFamily: OutfitFamily.Regular,
      fontSize: FontSize.FONT_12,
      marginTop: hp(0.8),
    },
    bottomTextView: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: wp(1),
      justifyContent: 'center',
      marginBottom: hp(1),
      position: 'absolute',
      bottom: Platform.OS === 'android' ? wp(7.5) : wp(5), // sync with Login/Signup
      width: Platform.OS === 'android' ? wp(100) : undefined,
    },
    bottomText: {
      fontSize: FontSize.FONT_14,
      color: colors.themeColor,

      includeFontPadding: false,
      textAlignVertical: 'center',
      fontFamily: OutfitFamily.Medium,
    },
    bigImage: {
      alignSelf: 'center',
      width: wp(100),
      height: hp(100),
      position: 'absolute',
      zIndex: Platform.OS === 'ios' ? -1000 : undefined,
    },
  });
