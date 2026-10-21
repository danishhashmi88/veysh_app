import { Text, StyleSheet, TouchableOpacity, Platform, Image } from 'react-native';
import React from 'react';
import { wp } from '../../../utils/helper';
import { FontSize, FontWeight } from '../../../constant/fonts';
import { Colors } from '../../../constant/colors';
import { imagePath } from '../../../constant/imagePath';

const IconButton = props => {
    return (
        <TouchableOpacity
            onPress={props.onPress}
            disabled={props.disabled}
            style={[
                styles.container,
                {
                    marginTop: props.marginTop,
                    width: props.width ?? wp(90),
                    marginBottom: props.marginBottom,
                    backgroundColor: props.backgroundColor ?? Colors.themeColor,
                    paddingVertical: props.paddingVertical ?? 15,
                    paddingHorizontal: props.paddingHorizontal ?? 0,
                    marginHorizontal: props.marginHorizontal ?? 0,
                    marginLeft: props.marginLeft ?? 0,
                    marginRight: props.marginRight ?? 0,
                    opacity: props.opacity ?? 1,
                    alignSelf: props.alignSelf ?? "center"
                },
            ]}>
            <Image style={styles.icon} resizeMode='contain' source={props.icon??imagePath.thankyou_tick} />
            <Text numberOfLines={1} style={[styles.text, { color: props.textColor ?? Colors.white }]}>{props.title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        flexDirection: 'row',
        gap:wp(2)
    },
    text: {
        color: Colors.white,
        fontSize: FontSize.FONT_15,
        fontWeight: FontWeight.FONT_500
    },
    icon: {
        width: wp(5),
        height: wp(5),
        // alignSelf:"baseline"
        // padding:10
    },
});

export default IconButton;