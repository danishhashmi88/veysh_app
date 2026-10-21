
import { StyleSheet } from 'react-native';
import { FontSize, FontWeight } from '../constant/fonts';
import { Colors } from '../constant/colors';
import { hp, wp } from '../utils/helper';

export const styles = StyleSheet.create({
    tabText: {
        fontSize: FontSize.FONT_10,
        fontWeight: FontWeight.FONT_400,
        color: Colors.black,
    },
    iconView: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        width: wp(22),
        flexDirection:'row',
        height:hp(4.5),
        borderRadius:20,
        paddingHorizontal:hp(2.7)
    },
    icon: {
        width: wp(5.5),
        height: wp(5.5),
        padding:2,
    },
    tabStyle: {
        paddingTop: 20, 
        height: hp(10),
        borderTopWidth: 0,
        paddingHorizontal:20
    },
});
