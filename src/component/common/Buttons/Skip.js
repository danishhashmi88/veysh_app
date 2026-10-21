import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useTheme } from '../../../hooks/useTheme'
import { FontSize, FontWeight } from '../../../constant/fonts'
import { wp } from '../../../utils/helper'

const Skip = ({ 
    onPress, 
    style, 
    textStyle 
}) => {
    const Colors = useTheme();

    return (
        <TouchableOpacity 
            onPress={onPress} 
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} 
            style={[styles.container, style]} 
        >
  
            <Text style={[
                styles.text, 
                { color: Colors.themeColor }, 
                textStyle
            ]}>
                Skip
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: wp(2),
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: FontSize.FONT_16,
        fontWeight: FontWeight.FONT_500,
    }
})

export default Skip