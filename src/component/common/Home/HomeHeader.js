import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { imagePath } from '../../../constant/imagePath';
import { FontSize, FontFamily } from '../../../constant/fonts';

const HomeHeader = ({
  styles,
  userDetails,
  data,
  navigation,
  handleNavigation,
  menuDrawerRef,
  imageError,
  setImageError,
}) => {
  const rawName =
    userDetails?.full_name ||
    data?.header?.greeting?.split(', ')?.[1] ||
    'Guest';
  const displayName =
    rawName?.length > 15 ? `${rawName.substring(0, 15)}...` : rawName;

  return (
    <View style={styles.headerRow}>
      <View style={styles.brandContainer}>
        <Text
          style={{
            fontSize: FontSize.FONT_24,
            fontFamily: FontFamily.Bold,
          }}
        >
          Hi {userDetails?.first_name}
        </Text>
      </View>

      <View style={styles.headerIcons}>
        <TouchableOpacity
          style={styles.headerIconCircle}
          onPress={() => handleNavigation('Notifications')}
        >
          <Image
            source={imagePath.bell}
            style={styles.headerIconImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.headerIconCircle}
          onPress={() => menuDrawerRef.current?.open()}
        >
          <Image
            source={imagePath.menu}
            style={styles.headerIconImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.avatarCircle}
          onPress={() => navigation.navigate('MyProfile')}
        >
          <Image
            source={
              userDetails?.profile_image && !imageError
                ? { uri: userDetails?.profile_image }
                : data?.header?.profile
            }
            style={styles.avatarIcon}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeHeader;
