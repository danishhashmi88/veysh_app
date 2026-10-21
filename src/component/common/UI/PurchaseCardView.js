import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { hp, wp } from '../../../utils/helper';
import AppButton from '../Buttons/AppButton';
import { FontSize, FontFamily, FontWeight } from '../../../constant/fonts';
import { imagePath } from '../../../constant/imagePath';
import { getGlobalStyles } from '../../../GlobalStyles/GlobalStyles';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../hooks/useTheme';

const PurchaseCardView = ({
  showTop = true,
  profileImage,
  title,
  subtitle,
  extraText1,
  extraText2,
  rightButtonText,
  onRightPress = () => {},
  showBottom = true,
  bottomButtonTitle = 'Purchase',
  onBottomButtonPress = () => {},
  onFirstOptionPress = () => {},
  onSecondOptionPress = () => {},
  showImageButtonOnly = false,
  style = {},
}) => {
  const { t } = useTranslation();
  const [showOptionsbox, setShowOptionBox] = useState(false);
  const Colors = useTheme();
  const GlobalStyle = getGlobalStyles(Colors);
  const styles = getStyles(Colors);

  return (
    <View
      style={[styles.card, style, GlobalStyle.cardShadowBox, { elevation: 2 }]}
    >
      {showOptionsbox && (
        <View style={styles.optionBox}>
          <TouchableOpacity
            onPress={() => {
              onFirstOptionPress();
              setShowOptionBox(false);
            }}
            style={[styles.editModalInnerView]}
          >
            <Image
              source={imagePath.edit_black}
              resizeMode="contain"
              style={styles.optionIcons}
            />
            <Text style={[styles.modalText]}>{t('edit')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onSecondOptionPress();
              setShowOptionBox(false);
            }}
            style={[styles.editModalInnerView]}
          >
            <Image
              source={imagePath.delete_black}
              resizeMode="contain"
              style={styles.optionIcons}
            />
            <Text style={[styles.modalText]}>{t('delete')}</Text>
          </TouchableOpacity>
        </View>
      )}
      {showTop && (
        <View style={styles.topView}>
          <View style={styles.leftSection}>
            {profileImage && (
              <Image source={profileImage} style={styles.profileImage} />
            )}

            {(title || subtitle || extraText1 || extraText2) && (
              <View style={styles.textContainer}>
                {title && (
                  <Text numberOfLines={1} style={styles.title}>
                    {title}
                  </Text>
                )}
                {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                {extraText1 && (
                  <Text style={styles.subtitle}>{extraText1}</Text>
                )}
                {extraText2 && (
                  <Text style={[styles.subtitle, { marginTop: hp(1) }]}>
                    {extraText2}
                  </Text>
                )}
              </View>
            )}
          </View>

          {(rightButtonText || showImageButtonOnly) && (
            <TouchableOpacity
              style={[
                styles.rightButton,
                showImageButtonOnly && styles.imageOnlyButton,
              ]}
              // onPress={onRightPress}
              onPress={() => setShowOptionBox(!showOptionsbox)}
              activeOpacity={0.7}
            >
              {!showImageButtonOnly ? (
                <>
                  <Text style={styles.rightButtonText}>{rightButtonText}</Text>
                  <Image
                    source={imagePath.arrow_down}
                    style={styles.arrowIcon}
                    resizeMode="contain"
                    tintColor={Colors.black}
                  />
                </>
              ) : (
                <Image
                  source={
                    showOptionsbox
                      ? imagePath.cross_circle
                      : imagePath.three_icons
                  }
                  style={styles.onlyImageIcon}
                  resizeMode="contain"
                  tintColor={Colors.black}
                />
              )}
            </TouchableOpacity>
          )}
        </View>
      )}

      {showTop && showBottom && <View style={styles.separator} />}

      {showBottom && (
        <View style={styles.bottomRow}>
          <AppButton
            textColor={Colors.white}
            backgroundColor={Colors.lightRed}
            width={wp(30)}
            title={t(bottomButtonTitle)}
            onPress={onBottomButtonPress}
            textSize={12}
            paddingVertical={hp(1)}
          />
        </View>
      )}
    </View>
  );
};

export default PurchaseCardView;

const getStyles = Colors =>
  StyleSheet.create({
    card: {
      backgroundColor: Colors.white,
      borderRadius: wp(3),
      paddingVertical: hp(1.5),
      paddingHorizontal: wp(4),
      marginVertical: hp(1),
      width: wp(90),
    },
    topView: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    },
    leftSection: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    profileImage: {
      width: wp(18),
      height: wp(18),
      borderRadius: wp(100),
      marginRight: wp(3),
    },
    textContainer: {
      flexDirection: 'column',
      maxWidth: '65%',
    },
    title: {
      fontSize: FontSize.FONT_16,
      fontWeight: FontWeight.FONT_600,
      color: Colors.zink950,
    },
    subtitle: {
      fontSize: FontSize.FONT_14,
      color: Colors.zink500,
      marginTop: hp(0.2),
    },
    rightButton: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: wp(1),
      paddingVertical: hp(0.6),
      paddingHorizontal: wp(3.5),
      borderColor: Colors.gray600,
      gap: wp(1),
    },
    rightButtonText: {
      color: Colors.black,
      fontSize: FontSize.FONT_12,
      marginRight: wp(1),
    },
    arrowIcon: {
      width: wp(3),
      height: wp(3),
    },
    separator: {
      borderBottomWidth: 1,
      borderBottomColor: Colors.zink100,
      marginVertical: hp(1),
    },
    bottomRow: {
      alignSelf: 'flex-start',
    },
    imageOnlyButton: {
      paddingHorizontal: wp(2),
      paddingVertical: hp(0.8),
      justifyContent: 'center',
    },
    onlyImageIcon: {
      width: wp(5),
      height: wp(5),
    },
    optionBox: {
      backgroundColor: Colors.white,
      width: '40%',
      height: hp(9),
      alignItems: 'center',
      justifyContent: 'space-evenly',
      borderRadius: wp(3),
      borderWidth: 1,
      borderColor: Colors.zink100,
      position: 'absolute',
      zIndex: 1000,
      right: 60,
      top: 10,
    },
    editModalInnerView: {
      flexDirection: 'row',
      gap: wp(2),
      alignItems: 'center',
      width: '100%',
      alignSelf: 'center',
      paddingHorizontal: wp(4),
    },
    optionIcons: {
      width: wp(4),
      height: wp(4),
    },
  });
