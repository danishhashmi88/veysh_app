import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Pressable } from "react-native";
import { hp, wp } from "../../../utils/helper";
import { Colors } from "../../../constant/colors";
import { FontSize, FontWeight } from "../../../constant/fonts";
import { imagePath } from "../../../constant/imagePath";
import AppButton from "../Buttons/AppButton";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const FavouriteCard = ({
  title,
  rightTitle,
  description,
  isLive,
  imageSource = imagePath.big_img,
  showBottomLeftBadge = true,
  showTopRightIcon = true,
  topRightIcon = imagePath.white_heart,
  bottomInnerViewIcon = imagePath.eye_red,
  titleRightIcon = imagePath.eye_red,
  onTopRightIconPress = () => {},
  otherText,
  bottomLeftBadgeText = "",
  width = "100%",
  height = hp(18),
  marginBottom = 0,
  bottomViewInnerText = null,
  underlineText = null,
  bottomViewInnerSubText = null,
  onBottomButtonPress = () => {},
  onWatchButtonPress = () => {},
  onUnderLineTextPress = () => {},
  buttonTitle,
  showBottomView = false,
  showBottomViewLeftComponent = false,
  showBottomViewRightComponent = false,
  showOptions = false,
  showBottomIconView = false,
  bottomIconButtonTitle = "Aceept",
  bottomRightIcons = [],
  bottomRightLeftBoldText = "",
  bottomRightLeftGreyText = "",
  bottomRightRightText = "",
  showBottomRightBadge = false,
  showTitleRightIcon = false,
  onEditPress = () => {},
  onDeletePress = () => {},
  onCardClick = () => {},
  onTitleRightIcon = () => {},
  titleRightIconStyle = {},
  imageResizeMode='cover' ,
  borderWidth= 0,
  showBottomViewButton = true,
  showBottomViewLeftButton = true,
  showBottomViewRightButton = true,
}) => {
  const { t } = useTranslation();
  const [showOptionsbox, setShowOptionBox] = useState(false);
  const isGuest = useSelector(state => state.global.isGuestUser);
  

  return (
    <Pressable
      onPress={onCardClick}
      style={[
        styles.container,
        {
          width: width,
          marginBottom: marginBottom,
        },
      ]}
    >
      <View style={styles.card}>
        {imageSource && (
          <Image resizeMode={imageResizeMode}
          source={imageSource} 
          // source={imageSource} 
          style={[
            styles.backgroundImage, {
              height: height,
              borderWidth:borderWidth,
              overflow:'hidden',
              borderRadius: wp(3),
              borderColor:Colors.grey200
            }
          ]} />
        )}

        {showTopRightIcon && (
          <TouchableOpacity
            onPress={onTopRightIconPress}
            style={styles.heartContainer}
            activeOpacity={0.7}
            disabled={isGuest?true:false}
          >
            <Image
              source={topRightIcon}
              style={[styles.heartIcon, { tintColor: Colors.white }]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}

        {showBottomLeftBadge && (
          <View
            style={[
              styles.liveContainer,
              {
                backgroundColor: isLive ? Colors.red600 : Colors.themeColor,
              },
            ]}
          >
            <Text style={styles.liveText}>{bottomLeftBadgeText}</Text>
          </View>
        )}
      </View>
      {showBottomRightBadge && (
        <View style={styles.bottomRightBadgeRow}>
          <View style={styles.bottomRightLeftContainer}>
            <Text style={styles.bottomRightLeftBoldText}>
              {bottomRightLeftBoldText}
            </Text>
            <Text style={styles.bottomRightLeftGreyText}>
              {bottomRightLeftGreyText}
            </Text>
          </View>

          <Text style={styles.bottomRightRightText}>
            {bottomRightRightText}
          </Text>
        </View>
      )}

      <View style={styles.textBox}>
        <View style={styles.titleView}>
          <Text numberOfLines={1} style={styles.leftTitle}>{title}</Text>
          {rightTitle && <Text style={styles.rightTitle}>{rightTitle}</Text>}
          {showOptions && (
            <TouchableOpacity disabled={isGuest?true:false} onPress={() => setShowOptionBox(!showOptionsbox)}>
              <Image
                source={imagePath.three_icons}
                resizeMode="contain"
                style={styles.threeDots}
              />
            </TouchableOpacity>
          )}
          {
            showTitleRightIcon &&
            <TouchableOpacity disabled={isGuest?true:false} onPress={onTitleRightIcon}>
              <Image
                source={titleRightIcon}
                resizeMode="contain"
                style={[styles.threeDots,titleRightIconStyle]}
              />
            </TouchableOpacity>
          }
          {showOptionsbox && (
            <View style={styles.optionBox}>
              <TouchableOpacity onPress={()=>{
                setShowOptionBox(false)
                onEditPress()
              }}  disabled={isGuest?true:false} style={[styles.editModalInnerView]}>
                <Image
                  source={imagePath.edit_black}
                  resizeMode="cover"
                  style={styles.threeDots}
                />
                <Text style={[styles.modalText]}>{t("edit")}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>{
                setShowOptionBox(false)
                onDeletePress()
              }} disabled={isGuest?true:false} style={[styles.editModalInnerView]}>
                <Image
                  source={imagePath.delete_black}
                  resizeMode="cover"
                  style={styles.threeDots}
                />
                <Text style={[styles.modalText]}>{t("delete")}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        {
          description &&
          <Text numberOfLines={1} style={styles.description}>
            {description}
          </Text>
        }
        {otherText && <Text style={styles.dateText}>{otherText}</Text>}
      </View>

      {
        underlineText &&
        <TouchableOpacity onPress={onUnderLineTextPress} >
          <Text style={[styles.underlinetext,{textDecorationLine:"underline"}]}>{underlineText}</Text>
        </TouchableOpacity>
      }

      {showBottomView && (
        <View
          style={[
            styles.cardBottomView,
          ]}
        >
          {showBottomViewLeftComponent && (
            <View style={styles.bottomCardInnerView}>
              {/* <Image
                source={bottomInnerViewIcon}
                style={[styles.heartIcon, { tintColor: Colors.lightRed }]}
                resizeMode="contain"
              /> */}
              {
                bottomViewInnerText &&
                <Text style={styles.rightTitle}>{bottomViewInnerText}</Text>
              }
              {
                bottomViewInnerSubText &&
                <Text style={styles.rightTitle}>{bottomViewInnerSubText}</Text>
              }
            </View>
          )}
          {showBottomViewRightComponent && (
            <AppButton
              textColor={Colors.white}
              backgroundColor={Colors.lightRed}
              width="100%"
              title={t(buttonTitle ?? "watch_now")}
              onPress={onWatchButtonPress}
              textSize={FontSize.FONT_14}
              paddingVertical={hp(1.5)}
              disabled={isGuest?true:false}
            />
          )}
        </View>
      )}

      {showBottomIconView && (
        <View style={styles.bottomIconView}>
          {
            showBottomViewButton &&
            <AppButton
              title={bottomIconButtonTitle}
              onPress={onBottomButtonPress}
              backgroundColor={Colors.lightRed}
              textColor={Colors.white}
              width={wp(35)}
              textSize={FontSize.FONT_12}
              paddingVertical={hp(1.2)}
            />
          }

          <View style={styles.iconCircleWrapper}>
            {
              showBottomViewLeftButton &&
              <TouchableOpacity
                disabled={isGuest?true:false}
                style={[
                  styles.iconCircle,
                  { borderWidth: 1, borderColor: Colors.themeColor },
                ]}
                onPress={()=>{
                  onEditPress()
                }}
              >
                <Image
                  source={imagePath.edit_Icon}
                  style={styles.iconCircleImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            }
            {
              showBottomViewRightButton &&
              <TouchableOpacity
                disabled={isGuest?true:false}
                style={[
                  styles.iconCircle,
                  { borderWidth: 1, borderColor: Colors.lightRed },
                ]}
                onPress={()=>{
                  onDeletePress()
                }}
              >
                <Image
                  source={imagePath.trash}
                  style={styles.iconCircleImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            }
          </View>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
  },
  card: {
    width: "100%",
    borderRadius: wp(3),
    overflow: "hidden",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
  },
  titleView: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  heartContainer: {
    position: "absolute",
    top: hp(1),
    right: wp(2),
    zIndex: 2,
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4.5),
    backgroundColor: Colors.lightRed,
    justifyContent: "center",
    alignItems: "center",
  },
  heartIcon: {
    width: wp(5),
    height: wp(5),
  },
  liveContainer: {
    position: "absolute",
    bottom: hp(1.2),
    left: wp(2),
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.5),
    borderRadius: wp(100),
  },
  liveText: {
    color: Colors.white,
    fontSize: FontSize.FONT_12,
    fontWeight: FontWeight.FONT_400,
  },
  leftTitle: {
    fontSize: FontSize.FONT_14,
    fontWeight: FontWeight.FONT_800,
    color: Colors.zink950,
    maxWidth:'80%'
  },
  rightTitle: {
    fontSize: FontSize.FONT_14,
    fontWeight: FontWeight.FONT_500,
    color: Colors.zink500,
  },
  description: {
    fontSize: FontSize.FONT_14,
    color: Colors.zink500,
    fontWeight: FontWeight.FONT_400,
  },
  textBox: {
    marginTop: hp(1),
    gap: 3,
  },
  flagIcon: {
    width: wp(4),
    height: wp(4),
    marginRight: wp(1),
  },
  dateText: {
    fontSize: wp(3.5),
    color: Colors.zink500,
    fontSize: FontSize.FONT_14,
    fontWeight: FontWeight.FONT_400,
  },
  modalText: {
    color: Colors.zink950,
    fontSize: FontSize.FONT_14,
    fontWeight: FontWeight.FONT_400,
  },
  cardBottomView: {
    width: "100%",
    justifyContent: "space-between",
    // alignItems: "center",
    marginTop: hp(1),
    gap:hp(1.5)
  },
  bottomCardInnerView: {
    gap: wp(0.5),
  },
  threeDots: {
    width: wp(4),
    height: wp(4),
  },
  editModalInnerView: {
    flexDirection: "row",
    gap: wp(2),
    alignItems: "center",
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: wp(4),
  },
  optionBox: {
    backgroundColor: Colors.white,
    width: "70%",
    height: hp(9),
    alignItems: "center",
    justifyContent: "space-evenly",
    borderRadius: wp(3),
    borderWidth: 1,
    borderColor: Colors.zink100,
    position: "absolute",
    zIndex: 1000,
    right: 0,
    bottom: 20,
  },
  bottomIconView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: wp(1),
    borderRadius: wp(2),
    marginTop: hp(1),
  },
  iconCircleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2),
  },
  iconCircle: {
    width: wp(9.5),
    height: wp(9.5),
    borderRadius: wp(5),
    justifyContent: "center",
    alignItems: "center",
  },
  iconCircleImage: {
    width: wp(5),
    height: wp(5),
  },
  bottomRightBadgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: hp(1),
  },
  bottomRightLeftContainer: {
    flexDirection: "column",
  },
  bottomRightLeftBoldText: {
    fontSize: FontSize.FONT_14,
    fontWeight: FontWeight.FONT_700,
    color: Colors.zink950,
  },
  bottomRightLeftGreyText: {
    fontSize: FontSize.FONT_12,
    fontWeight: "400",
    color: Colors.zink500,
  },
  bottomRightRightText: {
    fontSize: FontSize.FONT_14,
    fontWeight: FontWeight.FONT_700,
    color: Colors.zink950,
  },
  underlinetext: {
    fontSize: FontSize.FONT_14,
    fontWeight: FontWeight.FONT_400,
    color: Colors.lightRed,
    marginTop:hp(0.5)
  },
});

export default FavouriteCard;
