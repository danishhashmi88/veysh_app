import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { imagePath } from '../../constant/imagePath';
import { wp } from '../../utils/helper';
import { Colors } from '../../constant/colors';
import LinearGradient from 'react-native-linear-gradient';

const IconView = ({
  image = imagePath.email,
  style = {},
  colorCodes = ['#F116A5', '#7100D7'],
}) => {
  return (
    <LinearGradient
      colors={colorCodes}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.iconBox, style]}
    >
      <Image source={image} style={styles.icon} resizeMode="contain" />
    </LinearGradient>
  );
};

export default IconView;

const styles = StyleSheet.create({
  iconBox: {
    width: wp(20),
    aspectRatio: 1,
    backgroundColor: Colors.themeColor,
    borderRadius: wp(7),
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: '55%',
    height: '55%',
  },
});
