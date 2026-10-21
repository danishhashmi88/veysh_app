/* eslint-disable react-native/no-inline-styles */
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Image,
  View,
} from 'react-native';
import React from 'react';
import { FontFamily, FontSize, FontWeight } from '../../../constant/fonts';
import { wp } from '../../../utils/helper';
import { imagePath } from '../../../constant/imagePath';
import { useTheme } from '../../../hooks/useTheme';
import LinearGradient from 'react-native-linear-gradient';

const AppButton = props => {
  const Colors = useTheme();

  // Agar user ne explicitly koi dusra background color manga hai (e.g. transparent ya white)
  const isSolidColor =
    props.backgroundColor &&
    props.backgroundColor !== Colors.themeColor &&
    props.backgroundColor !== Colors.primary;

  return (
    <TouchableOpacity
      onPress={props.onPress}
      disabled={props.disabled}
      style={[
        styles.container,
        {
          marginTop: props.marginTop,
          width: props.width ?? wp(90),
          minWidth: props.minWidth ?? 0,
          marginBottom: props.marginBottom,
          backgroundColor: isSolidColor ? props.backgroundColor : 'transparent',
          height: props.height,
          paddingVertical: props.height ? 0 : props.paddingVertical ?? 15,
          paddingHorizontal: props.paddingHorizontal ?? 0,
          marginHorizontal: props.marginHorizontal ?? 0,
          marginLeft: props.marginLeft ?? 0,
          marginRight: props.marginRight ?? 0,
          opacity: props.disabled
            ? props.disabledOpacity ?? 0.7
            : props.opacity ?? 1,
          alignSelf: props.alignSelf ?? 'center',
          borderWidth: props.borderWidth ?? 0,
          borderColor: props.borderColor ?? Colors.borderGrey,
          borderRadius: props.borderRadius ?? wp(4),

          // 🟢 IMPORTANT: Ye gradient ko button ke corners (border-radius) se bahar nikalne se rokega
          overflow: 'hidden',
        },
        props.style,
      ]}
    >
      {/* 🟢 THE TRICK: Gradient ko layout se alag karke peeche background mein fix kar diya */}
      {!isSolidColor && (
        <LinearGradient
          colors={['#F116A5', '#7100D7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
      )}

      {props.loading ? (
        <ActivityIndicator
          size={wp(5)}
          color={props.textColor ?? Colors.white}
        />
      ) : (
        <View style={styles.row}>
          {props?.icon && (
            <Image
              style={styles.icon}
              source={props.icon}
              resizeMode="contain"
            />
          )}
          {props.title ? (
            <Text
              style={[
                styles.text,
                {
                  color: props.textColor ?? Colors.white,
                  fontSize: props.textSize ?? FontSize.FONT_17,
                },
              ]}
            >
              {props.title}
            </Text>
          ) : null}
          {props?.children}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    // fontWeight: FontWeight.FONT_500,
    fontFamily: FontFamily.OutfitMedium,
  },
  icon: {
    width: wp(5),
    height: wp(5),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp(2),
    // 🟢 IMPORTANT: Text aur icon hamesha gradient ke upar (front mein) dikhe
    zIndex: 1,
  },
});

export default AppButton;
