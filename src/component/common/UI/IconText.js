import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Colors } from '../../../constant/colors';
import { wp } from '../../../utils/helper';
import { imagePath } from '../../../constant/imagePath';
import { FontSize, FontWeight } from '../../../constant/fonts';

const ViewsBadge = ({ icon = null, text = 'Live', bgColor=Colors.red600, textColor = Colors.white }) => {
    return (
        <View style={[
            styles.container,{
                backgroundColor:bgColor
            }
        ]}>
            {
                icon &&
                <Image source={icon} resizeMode="contain" style={styles.leftIcon} />
            }
            <Text style={[styles.text,{color: textColor,}]}>{text}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        paddingHorizontal: 8,
        alignSelf: 'flex-start',
        height:wp(8),
        alignItems:'center'
    },
    leftIcon: {
        width: wp(4),
        height: wp(4),
        marginLeft:5
    },
    text: {
        fontSize: FontSize.FONT_14,
        fontWeight: FontWeight.FONT_500,
        paddingHorizontal:10,
    },
});

export default ViewsBadge;
