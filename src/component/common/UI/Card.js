import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { wp } from '../../../utils/helper';

const Card = ({ children, style, borderRadius = wp(4), elevation = 4 }) => {
  const themeColors = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: themeColors.background,
          borderRadius: borderRadius,
          elevation: elevation,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: wp(4),
    overflow: 'hidden',
    // iOS Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
});

export default Card;
