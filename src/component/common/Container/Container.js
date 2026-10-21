// Container.js
import { StatusBar, StyleSheet, View } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
// import { Colors } from "../../../constant/colors";
import { useTheme } from '../../../hooks/useTheme';

const Container = ({ children, useGradient = false }) => {
  const Colors = useTheme();
  // console.log(Colors,'Colors');

  const gradientColors = useGradient
    ? [
        Colors.lightThemeCol1,
        Colors.lightThemeCol2,
        Colors.background,
        Colors.background,
      ]
    : [
        Colors.background,
        Colors.background,
        Colors.background,
        Colors.background,
      ];

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      colors={gradientColors}
      locations={[0, 0.35, 0.6, 1]}
      style={styles.container}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Container;
