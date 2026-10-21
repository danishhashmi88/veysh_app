import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { wp } from '../../../utils/helper'
import { Colors } from '../../../constant/colors'

const RadioButton = ({ isSelected = false }) => {

    return (
        <View style={[
            styles.radioContainer,{
                borderWidth: isSelected ? 1.5 : 0,
                backgroundColor: isSelected ? Colors.white : Colors.grey200,
            }
        ]}>
            {
                isSelected &&
                <View style={styles.checked} />
            }
        </View>
    )
}

export default RadioButton

const styles = StyleSheet.create({
    radioContainer: {
        width: 20,
        height: 20,
        borderRadius: wp(100),
        alignItems: 'center',
        justifyContent: 'center',
        borderColor:Colors.lightRed,
    },
    checked: {
        width: 11,
        height: 11,
        backgroundColor: Colors.lightRed,
        borderRadius: wp(100),
    },
});