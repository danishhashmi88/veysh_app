import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../../../constant/colors';
import { imagePath } from '../../../../constant/imagePath';
import { wp, hp } from '../../../../utils/helper';
import { FontFamily, FontSize, FontWeight } from '../../../../constant/fonts';
import AppButton from '../../../../component/common/Buttons/AppButton';

const Thanku = () => {
  const navigation = useNavigation();

  const handleGoHome = () => {
    navigation.reset({
      index: 1,
      routes: [{ name: 'HomeScreen' }, { name: 'OutfitHome' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Success Icon/Image */}
        <View style={styles.imageContainer}>
          <Image
            source={imagePath.success} // Assuming this exists, or fallback/placeholder
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}> Outfit Created !</Text>
        <Text style={styles.subtitle}>
          Your outfit has been created successfully.
        </Text>
      </View>
      <View style={{ paddingHorizontal: wp(8), paddingBottom: hp(2) }}>
        <AppButton
          title="View my Outfit"
          onPress={handleGoHome}
        // justifyContent=""
        />
        {/* <AppButton
          title=" Outfit Detail"
          onPress={navigation.navigate('')}
          justifyContent="center"
        /> */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(8),
  },
  imageContainer: {
    width: wp(20),
    height: wp(20),
    marginBottom: hp(3),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.greyDark,

    borderRadius: wp(5),
    // width: 80,
    // height: 80
  },
  image: {
    width: wp(12),
    height: wp(12),
    tintColor: Colors?.themeColor
  },
  title: {
    fontSize: FontSize.FONT_26,
    fontFamily: FontFamily.Bold,
    color: Colors.black,
    marginBottom: hp(1),
    textAlign: 'center',
  },
  subtitle: {
    // fontSize: FontSize.FONT_13,
    color: Colors.graytext,
    textAlign: 'center',
    marginBottom: hp(6),
    lineHeight: hp(2.5),
    fontFamily: FontFamily.OutfitMedium,
  },
});

export default Thanku;
