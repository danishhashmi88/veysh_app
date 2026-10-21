import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { imagePath } from '../../../constant/imagePath';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '../../../constant/colors';
import { FontFamily, FontSize } from '../../../constant/fonts';
import AppButton from '../../../component/common/Buttons/AppButton';
const { width } = Dimensions.get('window');
const PaymentSuccess = ({ navigation, route }) => {
  const { itemId } = route.params || {};
  const handleViewCloset = () => {
    // Navigate to the Closet tab or Home.
    // Assuming 'MyCloset' or similar exists, or simply popToTop to return to root
    navigation.popToTop();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.backGroundColor1 }}>
      <View style={styles.container}>
        <View style={styles.iconWrapper}>
          <Image
            source={imagePath.green_big_tick}
            style={styles.icon}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>Payment Successful!</Text>

        <Text style={styles.subtitle}>
          Your Premium Plan has been activated successfully.{'\n'}
          Enjoy all premium features and benefits.
        </Text>

        <AppButton
          style={styles.button}
          onPress={() =>
            navigation.navigate('MainTab', { screen: 'HomeScreen' })
          }
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Go to Home</Text>
        </AppButton>
      </View>
    </SafeAreaView>
  );
};

export default PaymentSuccess;

const styles = StyleSheet.create({
  iconWrapper: {
    backgroundColor: Colors?.lightBorder,
    padding: 15,
    borderRadius: 30, // makes it circular
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  icon: {
    width: 60,
    height: 60,
    tintColor: Colors?.themeColor
  },
  title: {
    fontFamily: FontFamily.Bold,
    fontSize: FontSize.FONT_26,
    color: Colors.black,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FontFamily.Bold,
    fontSize: FontSize.FONT_14,
    color: Colors.greyDark2,
    textAlign: 'center',
    // marginBottom: 40,
    // lineHeight: 20,
  },
  button: {
    position: 'absolute',
    bottom: 40,
    width: width - 40,
    height: 50,

    // borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontSize: FontSize.FONT_16,
    // fontWeight: '600',
  },
});
