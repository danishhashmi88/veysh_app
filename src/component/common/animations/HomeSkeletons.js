import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import { hp, wp } from '../../../utils/helper';
import { useTheme } from '../../../hooks/useTheme';
import { useSelector } from 'react-redux';

/**
 * Soft theme-matched skeleton colors.
 * Avoids react-native-skeleton-placeholder / MaskedView which renders
 * black blocks on many Android devices.
 */
const useSkeletonPalette = () => {
  const theme = useSelector(state => state.theme.theme);
  const isDark = theme === 'dark';

  return {
    bone: isDark ? '#3A3A3A' : '#E8E4F0',
    highlight: isDark ? '#555555' : '#F5F2FA',
  };
};

const Bone = ({ width, height, borderRadius = wp(3), style, delay = 0 }) => {
  const { bone, highlight } = useSkeletonPalette();
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
    return () => cancelAnimation(pulse);
  }, [pulse]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 0.55 + pulse.value * 0.45,
  }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: bone,
        },
        animatedStyle,
        style,
      ]}
    >
      {/* subtle highlight overlay for a softer shimmer feel */}
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: highlight,
            opacity: 0.35,
            borderRadius,
          },
        ]}
      />
    </Animated.View>
  );
};

/** Outfit of the Day */
export const OotdSkeleton = () => (
  <View style={styles.ootdWrap}>
    <Bone width={wp(88)} height={wp(88)} borderRadius={wp(5)} />
    <Bone
      width={wp(22)}
      height={hp(2)}
      borderRadius={wp(5)}
      style={{ marginTop: hp(1.5), alignSelf: 'flex-start' }}
    />
    <Bone
      width={wp(50)}
      height={hp(2.4)}
      style={{ marginTop: hp(1), alignSelf: 'flex-start' }}
    />
    <Bone
      width={wp(70)}
      height={hp(1.6)}
      style={{ marginTop: hp(0.8), alignSelf: 'flex-start' }}
    />
  </View>
);

/** Closet Insights cards */
export const InsightsSkeleton = () => {
  const Colors = useTheme();
  return (
    <View style={styles.row}>
      {[0, 1, 2].map(i => (
        <View
          key={i}
          style={[
            styles.insightCard,
            { backgroundColor: Colors.white || '#FFFFFF' },
          ]}
        >
          <Bone width={wp(12)} height={wp(12)} borderRadius={wp(3)} />
          <Bone
            width={wp(16)}
            height={hp(2.2)}
            style={{ marginTop: hp(2) }}
          />
          <Bone
            width={wp(24)}
            height={hp(1.5)}
            style={{ marginTop: hp(0.8) }}
          />
        </View>
      ))}
    </View>
  );
};

/** My Closet — filter pills + item cards */
export const WardrobeItemsSkeleton = () => (
  <View>
    <View style={[styles.row, { justifyContent: 'space-between', marginBottom: hp(2) }]}>
      {[0, 1, 2].map(i => (
        <Bone
          key={i}
          width={wp(28)}
          height={hp(4)}
          borderRadius={wp(5)}
        />
      ))}
    </View>
    <View style={styles.row}>
      {[0, 1, 2].map(i => (
        <View key={i} style={{ marginRight: wp(3.5) }}>
          <Bone width={wp(28.5)} height={wp(28.5)} borderRadius={wp(3)} />
          <Bone
            width={wp(20)}
            height={hp(1.6)}
            style={{ marginTop: hp(1) }}
          />
        </View>
      ))}
    </View>
  </View>
);

/** Latest Posts */
export const PostsSkeleton = ({ count = 2 }) => (
  <View>
    {Array.from({ length: count }).map((_, i) => (
      <View key={i} style={styles.postCard}>
        <View style={styles.rowCenter}>
          <Bone width={wp(10)} height={wp(10)} borderRadius={wp(5)} />
          <View style={{ marginLeft: wp(3) }}>
            <Bone width={wp(35)} height={hp(1.8)} />
            <Bone
              width={wp(20)}
              height={hp(1.4)}
              style={{ marginTop: hp(0.6) }}
            />
          </View>
        </View>
        <Bone
          width={wp(92)}
          height={hp(32)}
          borderRadius={wp(3)}
          style={{ marginTop: hp(1.5) }}
        />
        <View style={[styles.rowCenter, { marginTop: hp(1.5) }]}>
          <Bone width={wp(12)} height={hp(1.8)} style={{ marginRight: wp(4) }} />
          <Bone width={wp(12)} height={hp(1.8)} style={{ marginRight: wp(4) }} />
          <Bone width={wp(8)} height={hp(1.8)} />
        </View>
      </View>
    ))}
  </View>
);

/** Bae chat history */
export const ChatSkeleton = ({ count = 4 }) => (
  <View style={{ paddingHorizontal: wp(4), paddingTop: hp(2) }}>
    {Array.from({ length: count }).map((_, i) => {
      const isAi = i % 2 === 0;
      return (
        <View
          key={i}
          style={[
            styles.rowCenter,
            {
              justifyContent: isAi ? 'flex-start' : 'flex-end',
              marginBottom: hp(2),
              alignItems: 'flex-end',
            },
          ]}
        >
          {isAi && (
            <Bone
              width={wp(10)}
              height={wp(10)}
              borderRadius={wp(5)}
              style={{ marginRight: wp(2) }}
            />
          )}
          <Bone
            width={isAi ? wp(60) : wp(45)}
            height={hp(6)}
            borderRadius={wp(4)}
          />
        </View>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  ootdWrap: {
    alignItems: 'center',
    marginTop: hp(0.5),
  },
  row: {
    flexDirection: 'row',
    marginTop: hp(1),
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightCard: {
    width: wp(36),
    padding: wp(3),
    borderRadius: wp(4),
    marginRight: wp(3),
  },
  postCard: {
    marginBottom: hp(2.5),
  },
});
