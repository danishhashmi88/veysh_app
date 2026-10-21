import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { FontFamily, FontSize, GaramondFamily } from '../../constant/fonts'
import { Colors } from '../../constant/colors'
import { hp, wp } from '../../utils/helper'

const TitleIcon = ({onPress, icon, title}) => {
    return (
        <View style={[styles.row, styles.textEditStyles]}>
            <Text style={styles.textEditTitle}>{title}</Text>
            <TouchableOpacity onPress={onPress}>
                <Image source={icon} resizeMode='contain' style={styles.editIcon} />
            </TouchableOpacity>
        </View>
    )
}

export default TitleIcon

const styles = StyleSheet.create({
    textEditStyles: {
        width: wp(90),
        justifyContent: "space-between",
        marginTop: hp(1)
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: wp(4)
    },
    textEditTitle: {
        fontSize: FontSize.FONT_16,
        // fontWeight: FontWeight.FONT_700,
        fontFamily: GaramondFamily.Regular,
        color: Colors.black,
    },
    editIcon: {
        width: wp(6),
        height: wp(6)
    },
})