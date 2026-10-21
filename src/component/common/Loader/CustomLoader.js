import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import { Colors } from '../../../constant/colors'
import { wp } from '../../../utils/helper'

const CustomLoader = ({size = 'small', styles={}}) => {
  return (
    <ActivityIndicator
        style={{flex:1,alignItems:"center",justifyContent:'center',...styles}}
        size={size}
        color={Colors.themeColor}
    />
  )
}

export default CustomLoader