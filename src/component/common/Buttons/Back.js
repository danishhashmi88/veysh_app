import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { imagePath } from '../../../constant/imagePath';
// import { Colors } from '../../../constant/colors'
import { hp, wp } from '../../../utils/helper';
import { useTheme } from '../../../hooks/useTheme';
import { FontSize, FontWeight, FontFamily } from '../../../constant/fonts';
import { Colors } from '../../../constant/colors';

const Back = ({ onPress, style, isOnBackPress, headerTitle }) => {
  const navigation = useNavigation();
  const Colors = useTheme();

  if (headerTitle) {
    return (
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => {
            if (isOnBackPress) {
              onPress();
            } else if (navigation.canGoBack()) {
              navigation.goBack();
            }
          }}
          style={[
            styles.backButton,
            { backgroundColor: Colors.backbuttonBg },
            style,
          ]}
        >
          <Image
            source={imagePath.arrow_left}
            resizeMode="contain"
            style={styles.arrow_image}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: Colors.black }]}>
          {headerTitle}
        </Text>
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={() => {
        if (isOnBackPress) {
          onPress();
        } else if (navigation.canGoBack()) {
          navigation.goBack();
        }
      }}
      style={[
        styles.backButton,
        { backgroundColor: Colors.backbuttonBg },
        style,
      ]}
    >
      <Image
        source={imagePath.arrow_left}
        resizeMode="contain"
        style={styles.arrow_image}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    width: wp(11),
    height: wp(11),
    padding: wp(3),
    borderRadius: wp(100),
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow_image: {
    width: '100%',
    height: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(5),
    paddingVertical: hp(1.8),
  },
  headerTitle: {
    fontFamily: FontFamily.Bold,
    fontSize: wp(6),
    color: '#000', // Still used if not overridden in render
    marginLeft: wp(5),
  },
});
export default Back;
