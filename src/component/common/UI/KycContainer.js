import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { getGlobalStyles } from '../../../GlobalStyles/GlobalStyles';
import { hp, wp } from '../../../utils/helper';
import { FontSize, FontWeight } from '../../../constant/fonts';
import { useTheme } from '../../../hooks/useTheme';

const KycContainer = ({
  title,
  subtitle1,
  subtitle2,
  bottomLeftImage,
  bottomLeftText,
  bottomRightImage,
  bottomRightText,
  topRightText,
  style = {},
}) => {
  const Colors = useTheme();
  const GlobalStyle = getGlobalStyles(Colors);
  const styles = getStyles(Colors);

  return (
    <View
      style={[styles.card, style, GlobalStyle.cardShadowBox, { elevation: 2 }]}
    >
      {(title || topRightText) && (
        <View style={styles.titleRow}>
          {title ? <Text style={styles.title}>{title}</Text> : <View />}
          {topRightText ? (
            <Text style={styles.topRightText}>{topRightText}</Text>
          ) : null}
        </View>
      )}

      {(subtitle1 || subtitle2) && (
        <View style={styles.subtitleContainer}>
          {subtitle1 ? <Text style={styles.subtitle}>{subtitle1}</Text> : null}
          {subtitle2 ? <Text style={styles.subtitle}>{subtitle2}</Text> : null}
        </View>
      )}

      {(bottomLeftText ||
        bottomLeftImage ||
        bottomRightText ||
        bottomRightImage) && (
        <View style={styles.bottomContainer}>
          {(bottomLeftImage || bottomLeftText) && (
            <View style={styles.bottomRow}>
              {bottomLeftImage && (
                <Image source={bottomLeftImage} style={styles.icon} />
              )}
              {bottomLeftText ? (
                <Text style={styles.bottomText}>{bottomLeftText}</Text>
              ) : null}
            </View>
          )}

          {(bottomRightImage || bottomRightText) && (
            <View style={styles.bottomRow}>
              {bottomRightImage && (
                <Image source={bottomRightImage} style={styles.icon} />
              )}
              {bottomRightText ? (
                <Text style={styles.bottomText}>{bottomRightText}</Text>
              ) : null}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default KycContainer;

const getStyles = Colors =>
  StyleSheet.create({
    card: {
      backgroundColor: Colors.white,
      borderRadius: wp(3),
      paddingVertical: hp(1.5),
      paddingHorizontal: wp(4),
      marginTop: hp(0.5),
      // marginBottom: hp(1),
    },
    titleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      fontSize: FontSize.FONT_14,
      color: Colors.black,
      fontWeight: FontWeight.FONT_700,
    },
    subtitleContainer: {
      // marginBottom: hp(1),
    },
    subtitle: {
      color: Colors.zink500,
      fontSize: FontSize.FONT_14,
      marginVertical: hp(0.3),
    },
    bottomContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: hp(0.5),
    },
    bottomRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      width: wp(5),
      height: wp(5),
      resizeMode: 'contain',
      marginRight: wp(1.5),
    },
    bottomText: {
      color: Colors.zink500,
      fontSize: FontSize.FONT_16,
    },
    topRightText: {
      fontSize: FontSize.FONT_14,
      color: Colors.black,
      fontWeight: FontWeight.FONT_700,
    },
  });
