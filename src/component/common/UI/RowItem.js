import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Switch,
} from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { hp, wp } from '../../../utils/helper';
import { FontFamily, FontSize } from '../../../constant/fonts';
import { imagePath } from '../../../constant/imagePath';
import PostSwitch from '../../Settings/PostSwitch';

const RowItem = ({
  title,
  subTitle,
  icon,
  onPress,
  isSwitch = false,
  value,
  onValueChange,
  isLast = false,
  iconBgColor,
  iconTintColor,
  rightElement,
  showRightArrow = true,
}) => {
  const themeColors = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={isSwitch}
      style={[
        styles.container,
        !isLast && {
          borderBottomWidth: 1,
          borderBottomColor: themeColors.bgGrey || '#F4F4F5',
        },
      ]}
    >
      {/* Icon Section */}
      {icon && (
        <View
          style={[
            styles.iconWrapper,
            { backgroundColor: iconBgColor || themeColors.backGroundColor1 },
          ]}
        >
          <Image
            source={icon}
            style={[
              styles.icon,
              { tintColor: iconTintColor || themeColors.themeColor },
            ]}
            resizeMode="contain"
          />
        </View>
      )}

      {/* Text Section */}
      <View style={[styles.textWrapper, icon ? { marginLeft: wp(4) } : {}]}>
        <Text style={[styles.title, { color: themeColors.black }]}>
          {title}
        </Text>
        {subTitle && (
          <Text style={[styles.subTitle, { color: themeColors.greyVar1 }]}>
            {subTitle}
          </Text>
        )}
      </View>

      {/* Action Section */}
      <View style={styles.actionWrapper}>
        {isSwitch ? (
          <PostSwitch
            value={value}
            onValueChange={onValueChange}
          />
          // <Switch
          //   value={value}
          //   onValueChange={onValueChange}
          //   trackColor={{
          //     false: themeColors.bgGrey || '#E4E4E7',
          //     true: themeColors.themeColor,
          //   }}
          //   thumbColor={themeColors.white}
          //   ios_backgroundColor={themeColors.bgGrey || '#E4E4E7'}
          // />
        ) : rightElement ? (
          rightElement
        ) : showRightArrow ? (
          <Image
            source={imagePath.mini_arrow}
            style={[
              styles.arrow,
              { tintColor: themeColors.greyDark2 || '#8E8E93' },
            ]}
            resizeMode="contain"
          />
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1.8),
    paddingHorizontal: wp(4),
  },
  iconWrapper: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: wp(5.5),
    height: wp(5.5),
  },
  textWrapper: {
    flex: 1,
  },
  title: {
    fontFamily: FontFamily.OutfitMedium,
    fontSize: FontSize.FONT_16,
  },
  subTitle: {
    fontFamily: FontFamily.OutfitMedium,
    fontSize: FontSize.FONT_12,
    marginTop: hp(0.3),
  },
  actionWrapper: {
    marginLeft: wp(2),
  },
  arrow: {
    width: wp(3.5),
    height: wp(3.5),
    transform: [{ rotate: '90deg' }],
  },
});

export default RowItem;
