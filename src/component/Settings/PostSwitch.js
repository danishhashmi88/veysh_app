import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Easing } from 'react-native';
import { FontSize, FontWeight, OutfitFamily } from '../../constant/fonts';
import { hp, wp } from '../../utils/helper';
import { useTheme } from '../../hooks/useTheme';

const AppSwitch = ({
  value,
  onValueChange,
  trackWidth = wp(12.8),
  trackHeight = hp(3.2),
  thumbSize = hp(2.6),
  thumbRadius = 100,
  trackColorOff = '#E4E4E7',
  trackStyle,
  thumbStyle,
  disabled
}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors, trackWidth, trackHeight, thumbSize, thumbRadius);

  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1.8, trackWidth - thumbSize - 1.8],
  });

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [trackColorOff, Colors.themeColor],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onValueChange(!value)}
      disabled={disabled}
    >
      <Animated.View style={[styles.track, { backgroundColor }, trackStyle]}>
        <Animated.View
          style={[
            styles.thumb,
            { transform: [{ translateX }] },
            thumbStyle
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const PostSwitch = ({
  label,
  value,
  onValueChange,
  ...props // Pass everything else to AppSwitch
}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  // Standalone mode: If no label is provided, just return the Custom Switch
  if (!label) {
    return <AppSwitch value={value} onValueChange={onValueChange} {...props} />;
  }

  // Row mode: Label + Switch
  return (
    <View style={styles.card}>
      <View style={styles.textContainer}>
        <Text style={styles.label}>{label}</Text>
        <AppSwitch value={value} onValueChange={onValueChange} {...props} />
      </View>
    </View>
  );
};

export default PostSwitch;

export const getStyles = (Colors, trackWidth, trackHeight, thumbSize, thumbRadius) =>
  StyleSheet.create({
    label: {
      fontSize: FontSize.FONT_16,
      color: Colors.blackVar2,
      fontFamily: OutfitFamily.Medium,
    },
    card: {
      paddingTop: hp(3),
    },
    textContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    track: {
      width: trackWidth,
      height: trackHeight,
      borderRadius: 100,
      justifyContent: 'center',
    },
    thumb: {
      width: thumbSize,
      height: thumbSize,
      borderRadius: thumbRadius,
      backgroundColor: Colors.white,
      // More subtle shadow for premium feel
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1.5 },
      shadowOpacity: 0.15,
      shadowRadius: 1.5,
      elevation: 2.5,
    },
  });
