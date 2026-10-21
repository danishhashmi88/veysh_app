import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { Colors } from '../../../constant/colors';
import { hp, wp } from '../../../utils/helper';
import AppButton from '../Buttons/AppButton';
import { FontFamily, FontSize, FontWeight } from '../../../constant/fonts';
import { GlobalStyle } from '../../../GlobalStyles/GlobalStyles';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { imagePath } from '../../../constant/imagePath';

const SocialMediaCard = ({
  icon,
  title,
  switchValue = false,
  onSwitchChange = () => {},
  onConfigurePress = () => {},
  buttonTitle = 'Configure',
  style = {},
  children,
  showStepButton = false,
}) => {
  const { t } = useTranslation();
  return (
    <View
      style={[styles.card, style, GlobalStyle.cardShadowBox, { elevation: 2 }]}
    >
      <View style={[styles.topRow, { marginBottom: switchValue ? hp(1) : 0 }]}>
        {icon && <Image source={icon} style={styles.icon} />}
        {title && <Text style={styles.title}>{title}</Text>}

        <View style={styles.switchView}>
          <Switch
            value={switchValue}
            onValueChange={onSwitchChange}
            thumbColor={Colors.white}
            trackColor={{ false: Colors.grey300, true: Colors.lightRed }}
          />
          {showStepButton && (
            <AppButton
              textColor={Colors.white}
              backgroundColor={Colors.lightRed}
              width={wp(12)}
              title={t('steps')}
              onPress={onConfigurePress}
              textSize={12}
              paddingVertical={hp(1)}
            />
          )}
        </View>
      </View>

      {switchValue && children}
    </View>
  );
};

export default SocialMediaCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: wp(3),
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4),
    marginVertical: hp(1),
    marginVertical: hp(1),
    width: wp(90),
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    width: wp(6),
    height: wp(6),
    resizeMode: 'contain',
    marginRight: wp(2),
  },
  delete: {
    width: wp(6),
    height: wp(6),
    resizeMode: 'contain',
  },
  title: {
    flex: 1,
    fontSize: FontSize.FONT_14,
    fontWeight: FontWeight.FONT_600,
    color: Colors.black,
  },
  bottomRow: {
    alignSelf: 'flex-start',
  },
  switchView: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
});
