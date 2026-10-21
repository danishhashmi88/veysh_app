import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { imagePath } from '../../constant/imagePath';
import { hp, wp } from '../../utils/helper';
import { FontSize, FontWeight } from '../../constant/fonts';
import { Colors } from '../../constant/colors';

const ProfileTab = ({
  rightImage = imagePath.mini_arrow,
  title = '',
  icon = imagePath.profileIcons.notification,
  onPress = () => {},
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.row, styles.parentView]}
    >
      <View style={[styles.row]}>
        <View style={styles.iconView}>
          <Image source={icon} resizeMode="contain" style={styles.leftIcon} />
        </View>
        <Text style={styles.listTitle}>{title}</Text>
      </View>
      <Image source={rightImage} resizeMode="contain" style={styles.arrow} />
    </TouchableOpacity>
  );
};

export default ProfileTab;

const styles = StyleSheet.create({
  leftIcon: {
    width: wp(6),
    height: wp(6),
  },
  arrow: {
    width: wp(4),
    height: wp(4),
    transform: [{ rotateZ: '90deg' }],
  },
  iconView: {
    width: wp(11),
    height: wp(11),
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(100),
  },
  listTitle: {
    fontSize: FontSize.FONT_14,
    fontWeight: FontWeight.FONT_600,
    color: Colors.blackVar2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(4),
  },
  parentView: {
    justifyContent: 'space-between',
    paddingHorizontal: wp(4),
    marginBottom: 25,
    backgroundColor: Colors.profileTabBg,
    height: hp(8),
    borderRadius: wp(4),
  },
});
