/* eslint-disable react-hooks/exhaustive-deps */
import { Image, StatusBar, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from './styles';
import { imagePath } from '../../constant/imagePath';
import { useEffect } from 'react';

const SPLASH_GRADIENT = ['#E6007E', '#8E00B1'];

function SplashScreen({ manageLogin }) {
  useEffect(() => {
    manageLogin();
  }, []);

  return (
    <LinearGradient
      colors={SPLASH_GRADIENT}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <View style={styles.brandContent}>
        <Image
          source={imagePath.app_logo_new}
          resizeMode="contain"
          style={styles.brandLogo}
        />
      </View>
    </LinearGradient>
  );
}

export default SplashScreen;
