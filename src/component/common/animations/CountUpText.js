import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import {
  useSharedValue,
  useAnimatedReaction,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated';

/**
 * Renders a number that animates (counts up) from 0 to `value`
 * whenever `value` changes. Purely visual — the final text always
 * settles on the real value.
 */
const CountUpText = ({
  value = 0,
  duration = 900,
  prefix = '',
  suffix = '',
  style,
  numberOfLines,
}) => {
  const target = Number(value) || 0;
  const progress = useSharedValue(0);
  const [display, setDisplay] = useState(target);

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(target, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  }, [target, duration, progress]);

  useAnimatedReaction(
    () => Math.round(progress.value),
    (current, previous) => {
      if (current !== previous) {
        runOnJS(setDisplay)(current);
      }
    },
  );

  return (
    <Text style={style} numberOfLines={numberOfLines}>
      {`${prefix}${display}${suffix}`}
    </Text>
  );
};

export default CountUpText;
