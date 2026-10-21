import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Image,
  StyleSheet,
  Animated,
} from 'react-native';

import { hp, wp } from '../../../utils/helper';
import { FontFamily, FontSize, FontWeight } from '../../../constant/fonts';
import { imagePath } from '../../../constant/imagePath';
import { Colors } from '../../../constant/colors';
import { useTheme } from '../../../hooks/useTheme';

const CLOSE_DURATION_MS = 250;

const FloatingActionMenu = ({ isOpen, onClose, onNavigate, onAnimatingChange }) => {
  const colors = useTheme();
  const animation = useRef(new Animated.Value(isOpen ? 1 : 0)).current;
  const isOpenRef = useRef(isOpen);
  const onAnimatingChangeRef = useRef(onAnimatingChange);

  const [visible, setVisible] = useState(isOpen);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    onAnimatingChangeRef.current = onAnimatingChange;
  }, [onAnimatingChange]);

  useEffect(() => {
    animation.stopAnimation();

    if (isOpen) {
      setVisible(true);
      onAnimatingChangeRef.current?.(true);

      Animated.spring(animation, {
        toValue: 1,
        useNativeDriver: true,
        friction: 6,
        tension: 60,
      }).start(({ finished }) => {
        if (finished && isOpenRef.current) {
          onAnimatingChangeRef.current?.(false);
        }
      });
    } else {
      onAnimatingChangeRef.current?.(true);

      Animated.timing(animation, {
        toValue: 0,
        duration: CLOSE_DURATION_MS,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished && !isOpenRef.current) {
          setVisible(false);
        }
        if (finished) {
          onAnimatingChangeRef.current?.(false);
        }
      });
    }
  }, [isOpen, animation]);

  if (!visible) return null;

  const getTransform = (x, y) => [
    { translateX: Animated.multiply(animation, x) },
    { translateY: Animated.multiply(animation, y) },
    { scale: animation },
  ];

  return (
    <View
      style={styles.overlay}
      pointerEvents={isOpen ? 'box-none' : 'none'}
    >
      {isOpen && (
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      )}
      <View style={styles.container} pointerEvents="box-none">
        {/* Background Dome */}
        <Animated.View
          style={[
            styles.background,
            {
              transform: [
                {
                  translateY: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [hp(20), 0],
                  }),
                },
              ],
            },
          ]}
        />

        {/* Add Item */}
        <Animated.View
          style={[
            styles.menuItem,
            { transform: getTransform(-wp(30), -hp(5)) },
          ]}
        >
          <TouchableOpacity
            style={[styles.circle, { backgroundColor: colors.themeColor }]}
            onPress={() => {
              onNavigate('AddItem');
              onClose();
            }}
          >
            <Image source={imagePath.additem} style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.label}>Add Item</Text>
        </Animated.View>

        {/* Create Outfit */}
        <Animated.View
          style={[
            styles.menuItem,
            { transform: getTransform(-wp(12), -hp(12)) },
          ]}
        >
          <TouchableOpacity
            style={[styles.circle, { backgroundColor: colors.pinkVar1 }]}
            onPress={() => {
              onNavigate('CreateOutfit');
              onClose();
            }}
          >
            <Image source={imagePath.outfitHome} style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.label}>Create Outfit</Text>
        </Animated.View>

        {/* New Post */}
        <Animated.View
          style={[
            styles.menuItem,
            { transform: getTransform(wp(12), -hp(12)) },
          ]}
        >
          <TouchableOpacity
            style={[styles.circle, { backgroundColor: colors.orange }]}
            onPress={() => {
              onNavigate('CreatePosts');
              onClose();
            }}
          >
            <Image source={imagePath.newpost} style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.label}>New Post</Text>
        </Animated.View>

        {/* Plan Event */}
        <Animated.View
          style={[styles.menuItem, { transform: getTransform(wp(30), -hp(5)) }]}
        >
          <TouchableOpacity
            style={[styles.circle, { backgroundColor: colors.greenVar1 }]}
            onPress={() => {
              onNavigate('CreatePlanner');
              onClose();
            }}
          >
            <Image source={imagePath.EventHome} style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.label}>Plan Event</Text>
        </Animated.View>
      </View>
    </View>
  );
};

export default FloatingActionMenu;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    zIndex: 900,
    elevation: 8,
  },

  container: {
    height: hp(32),
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  background: {
    position: 'absolute',
    bottom: -wp(35),
    width: wp(78),
    height: wp(90),
    borderRadius: wp(50),
    backgroundColor: Colors.white,

    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },

  menuItem: {
    position: 'absolute',
    bottom: hp(8),
    alignItems: 'center',
  },

  circle: {
    width: wp(14),
    height: wp(14),
    borderRadius: wp(7),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },

  icon: {
    width: wp(6),
    height: wp(6),
    tintColor: Colors.white,
    resizeMode: 'contain',
  },

  label: {
    fontSize: FontSize.FONT_11,
    fontFamily: FontFamily.OutfitMedium,
    fontWeight: '400',
    color: Colors.black,
  },
});
