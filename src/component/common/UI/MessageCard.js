import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "../../../constant/colors";
import { FontWeight, FontSize, FontFamily } from "../../../constant/fonts";
import { wp, hp } from "../../../utils/helper";

const MessageCard = ({
  imageSource,
  messageText = "Hello, this is a sample message!",
  onReplyPress = () => {},
  showReply = true,
  themeColor = Colors.primary,
  containerStyle = {},
  imageStyle = {},
  messageStyle = {},
  replyText = "Reply",
}) => {
  return (
    <View style={[styles.parentContainer, containerStyle]}>
      {/* Left side image */}
      {/* <Image
        source={require("../../../assets/icons/staticUserImage.png")}
        style={[styles.image, imageStyle]}
        resizeMode="cover"
      /> */}
      <Image
        source={imageSource}
        style={[styles.image, imageStyle]}
        resizeMode="cover"
      />

      {/* Right side message box */}
      <View style={styles.messageContainer}>
        <Text style={[styles.messageText, messageStyle]}>{messageText}</Text>

        {showReply && (
          <TouchableOpacity onPress={onReplyPress} style={styles.replyButton}>
            <Text style={[styles.replyText, { color: Colors.lightRed }]}>
              {replyText}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default MessageCard;

const styles = StyleSheet.create({
  parentContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    // backgroundColor: Colors.white,
    padding: wp(3),
    // borderRadius: wp(2),
    // borderWidth: 1,
    // borderColor: Colors.grey200,
    marginVertical: hp(1),
  },
  image: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    marginRight: wp(3),
  },
  messageContainer: {
    flex: 1,
    backgroundColor: Colors.zink100,
    borderRadius: wp(2),
    paddingVertical: hp(1),
    paddingHorizontal: wp(3),
  },
  messageText: {
    color: Colors.black,
    fontSize: FontSize.FONT_14,
    fontWeight: FontWeight.FONT_400,
    marginBottom: hp(0.5),
  },
  replyButton: {
    alignSelf: "flex-start",
  },
  replyText: {
    fontSize: FontSize.FONT_13,
    fontWeight: FontWeight.FONT_500,
  },
});
