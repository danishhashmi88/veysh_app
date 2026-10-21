import React from 'react';
import { Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Drop-in replacement for TouchableOpacity that adds a subtle
 * scale-down bounce on press. Keeps the same onPress/onLongPress API
 * so existing behaviour is untouched.
 */
const ScaleButton = ({
  children,
  onPress,
  onLongPress,
  delayLongPress,
  onPressIn,
  onPressOut,
  style,
  disabled = false,
  hitSlop,
  scaleTo = 0.95,
  ...rest
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = e => {
    scale.value = withTiming(scaleTo, { duration: 90 });
    onPressIn && onPressIn(e);
  };

  const handlePressOut = e => {
    scale.value = withSpring(1, { damping: 12, stiffness: 220, mass: 0.5 });
    onPressOut && onPressOut(e);
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={delayLongPress}
      disabled={disabled}
      hitSlop={hitSlop}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[style, animatedStyle]}
      {...rest}
    >
      {children}
    </AnimatedPressable>
  );
};

export default ScaleButton;
