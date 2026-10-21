/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Slider } from '@miblanchard/react-native-slider';
import { Colors } from '../../../constant/colors';
import { FontSize, FontWeight } from '../../../constant/fonts';
import { wp } from '../../../utils/helper';

const RangeSlider = ({
  min = 0,
  max = 10000,
  initialMin = 0,
  initialMax = 10000,
  onValueChange,
}) => {
  const handleValueChange = values => {
    const newMin = Math.min(values[0], values[1]);
    const newMax = Math.max(values[0], values[1]);

    // Don't allow them to be exactly the same (optional 100 gap)
    if (newMax - newMin < 100) return;

    onValueChange?.({ min: Math.round(newMin), max: Math.round(newMax) });
  };

  return (
    <View style={styles.container}>
      <Slider
        value={[initialMin, initialMax]}
        onValueChange={handleValueChange}
        minimumValue={min}
        maximumValue={max}
        step={1}
        minimumTrackTintColor={Colors.gradientPurple2}
        maximumTrackTintColor="#F0F0F0"
        trackStyle={{ height: 4, borderRadius: 2 }}
        renderThumbComponent={() => <View style={styles.thumbCustom} />}
        allowTouchTrack={true}
        animateTransitions={true}
      />

      <View style={styles.labelsContainer}>
        <Text style={styles.label}>₹{initialMin}</Text>
        <Text style={styles.label}>₹{initialMax}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 80,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  thumbCustom: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.white,
    borderWidth: 0.5,
    borderColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    width: '100%',
  },
  label: {
    fontSize: FontSize.FONT_14,
    fontWeight: FontWeight.FONT_600,
    color: Colors.graytext,
  },
});

export default RangeSlider;
