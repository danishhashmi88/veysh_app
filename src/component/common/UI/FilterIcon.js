import React from "react";
import { TouchableOpacity, Image, StyleSheet } from "react-native";
import { hp, wp } from "../../../utils/helper";
import { Colors } from "../../../constant/colors";
import { imagePath } from "../../../constant/imagePath";
import { useSelector } from "react-redux";

const FilterIcon = ({
  onPress,
  icon = imagePath.filter_white,
  size = wp(15), // default button size
  iconSize = wp(7), // default icon size
  padding = 0, // default no extra padding
  bottom = hp(3), // default position
  right = wp(5), // default position
}) => {
  const isGuest = useSelector(state=>state.global.isGuestUser);
  return (
    <TouchableOpacity
      disabled={isGuest?true:false}
      style={[
        styles.floatingButton,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          bottom: bottom,
          right: right,
          padding: padding,
        },
      ]}
      onPress={onPress}
    >
      <Image
        source={icon}
        style={[
          styles.filterIcon,
          { width: iconSize, height: iconSize },
        ]}
      />
    </TouchableOpacity>
  );
};

export default FilterIcon;

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    borderWidth: 2,
    borderColor: Colors.white,
    backgroundColor: Colors.themeColor,
    justifyContent: "center",
    alignItems: "center",
  },
  filterIcon: {
    tintColor: Colors.white,
    resizeMode: "contain",
  },
});