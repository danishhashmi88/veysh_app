/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import LinearGradient from 'react-native-linear-gradient';

const ProgressBar = ({
  progress = 0,
  height = 8,
  borderRadius = 20,
  duration = 300,
  style,
}) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const Colors = useTheme();

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const widthInterpolated = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <View
      style={[
        styles.container,
        {
          height,
          // 🟢 Empty track ka color (Screenshot jaisa light grayish-purple)
          backgroundColor: '#EAE5EE',
          borderRadius,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.progress,
          {
            width: widthInterpolated,
            borderRadius,
          },
        ]}
      >
        {/* 🟢 Fill hone wala hissa (Pink to Purple Gradient) */}
        <LinearGradient
          colors={['#E61EAD', '#8314F0']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>
    </View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    // 🟢 Ye zaroori hai taaki gradient border-radius ke bahar na nikle
    overflow: 'hidden',
  },
});
