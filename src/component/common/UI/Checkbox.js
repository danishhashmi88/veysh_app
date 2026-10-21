import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors } from '../../../constant/colors';
import { wp } from '../../../utils/helper';

const Checkbox = ({ onToggle, checked = false }) => {
  const [isChecked, setIsChecked] = useState(checked);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const handlePress = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    if (onToggle) {
      onToggle(newValue);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.checkbox,
        {
          borderColor: isChecked ? Colors.themeColor : Colors.greyBorder,
          backgroundColor: Colors.white,
        },
      ]}
      onPress={handlePress}
    >
      {isChecked && (
        <View style={[styles.checkboxInner, { backgroundColor: Colors.themeColor }]} />
      )}
    </TouchableOpacity>
  );
};

export default Checkbox;

const styles = StyleSheet.create({
  checkbox: {
    height: 20,
    width: 20,
    borderWidth: 1,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
});
