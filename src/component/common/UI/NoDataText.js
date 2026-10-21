import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { FontFamily, FontSize, FontWeight } from '../../../constant/fonts';
import { Colors } from '../../../constant/colors';
import { hp, wp } from '../../../utils/helper';
// import LottieAnimation from './LottieAnimation';
import { lottiePath } from '../../../constant/lottiePath';
import { imagePath } from '../../../constant/imagePath';

const NoDataText = ({ title, subTitle, source, containerStyle, iconStyle }) => {
    return (
        <View style={[styles.container, containerStyle]}>
            <View style={[styles.ootdEmptyIconContainer, iconStyle]}>
                <Image source={source} style={styles.emptuyIcon} />
            </View>
            <Text style={styles.cardAccNumber}>{title}</Text>
            {subTitle && <Text style={styles.smallText}>{subTitle}</Text>}
        </View>
    )
}

export default NoDataText;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: hp(60),
        paddingHorizontal: wp(10),
    },
    cardAccNumber: {
        fontSize: FontSize.FONT_21,
        fontFamily: FontFamily?.Bold,
        color: Colors.black,
        marginBottom: hp(0.5),
    },
    smallText: {
        fontSize: FontSize.FONT_14,
        fontFamily: FontFamily.OutfitMedium,
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
        backgroundColor: Colors?.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: hp(2),
    },
})