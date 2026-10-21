import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors } from '../../../constant/colors';
import { hp, wp } from '../../../utils/helper';
import { FontSize, FontWeight, FontFamily } from '../../../constant/fonts';

const TextCheckbox = ({ onToggle, checked = false, title, textStyle = styles.checkBoxText, containerStyle = [styles.row, styles.boxBody], bgColorBox = Colors.themeColor }) => {
    const [isChecked, setIsChecked] = useState(checked);

    useEffect(() => {
        setIsChecked(checked);
    }, [checked]);

    const handlePress = () => {
        const newValue = !isChecked;
        setIsChecked(newValue);
        if (onToggle) {
            onToggle(newValue);
        }
    };

    return (
        <TouchableOpacity onPress={handlePress} style={containerStyle}>
            <View style={[
                styles.checkbox, 
                { 
                    borderColor: isChecked ? bgColorBox : Colors.greyBorder,
                    backgroundColor: Colors.white
                }
            ]} >
                {
                    isChecked &&
                    <View style={[styles.checkboxInner, { backgroundColor: bgColorBox }]} />
                }
            </View>
            <Text style={textStyle}>{title}</Text>
        </TouchableOpacity>
    );
};

export default TextCheckbox;

const styles = StyleSheet.create({
    checkbox: {
        height: 20,
        width: 20,
        borderWidth: 1,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxInner: {
        width: 12,
        height: 12,
        borderRadius: 2,
    },
    checkBoxText: {
        fontSize: FontSize.FONT_14,
        color: Colors.black,
        fontFamily: FontFamily.OutfitMedium,
    },
    boxBody: {
    },
    row: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
    },
});
