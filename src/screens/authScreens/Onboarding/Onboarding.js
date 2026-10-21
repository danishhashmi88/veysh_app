import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { imagePath } from '../../../constant/imagePath';
import { styles } from './styles';
import AppButton from '../../../component/common/Buttons/AppButton';
import { hp, wp } from '../../../utils/helper';
// import { Colors } from '../../../constant/colors';
import { BlurView } from '@danielsaraldi/react-native-blur-view';
import { getGlobalStyles } from '../../../GlobalStyles/GlobalStyles';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../hooks/useTheme';
import { storeData, ONBOARD_SHOWN_KEY } from '../../../utils/storage';
import { useDispatch } from 'react-redux';
import { updateShowOnboard } from '../../../redux/slices/globalSlice';

const { width, height } = Dimensions.get('window');

const onboardingData = [
  {
    id: '1',
    image: imagePath.onboarding.onboard1,
    title: 'Your Closet Digitized And Styled\nAt Your Fingertips',
    description:
      'Access your entire wardrobe in one place, with AI and stylist integration to help you look your best every day.',
    buttonText: 'Next',
  },
  {
    id: '2',
    image: imagePath.onboarding.onboard2,
    title: 'Discover Curated Outfits,\nAI Picks and Lookbooks',
    description:
      'Get personalized outfit recommendations, occasion-based planning, and premium styling support tailored to your unique style.',
    buttonText: 'Next',
  },
  {
    id: '3',
    image: imagePath.onboarding.onboard3,
    title: 'Exclusive Access, Secure\nStorage, Privacy First',
    description:
      'Your wardrobe data is protected with high-level privacy, secure data handling, and exclusive access for premium clients.',
    buttonText: 'Continue',
  },
];

function Onboarding() {
  const Colors = useTheme();
  const GlobalStyle = getGlobalStyles(Colors);
  const scrollRef = useRef(null);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);

  const onScrollEnd = e => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const onNextPress = async () => {
    if (currentIndex < onboardingData.length - 1) {
      scrollRef.current.scrollTo({
        x: width * (currentIndex + 1),
        animated: true,
      });
    } else {
      await storeData(ONBOARD_SHOWN_KEY, true);
      navigation.replace('AuthSelection');
      setTimeout(() => {
        dispatch(updateShowOnboard(false));
      }, 500);
      console.log('Onboarding finished');
    }
  };

  const onSkip = async () => {
    await storeData(ONBOARD_SHOWN_KEY, true);
    navigation.replace('AuthSelection');
    setTimeout(() => {
      dispatch(updateShowOnboard(false));
    }, 500);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        scrollEventThrottle={16}
      >
        {onboardingData.map((item, index) => (
          <ImageBackground
            key={item.id}
            source={item.image}
            style={styles.slide}
            resizeMode="cover"
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.topShadow}
            />

            <LinearGradient
              colors={['rgba(28, 27, 27, 0)', 'rgba(15,14,14,0.9)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.bottomShadow}
            />

            <Image
              source={imagePath.app_logo_new}
              style={styles.brandLogo}
              resizeMode="contain"
            />

            <View style={styles.fixedBottom}>
              <View style={styles.textBoxWrapper}>
                <BlurView
                  radius={8}
                  type="dark"
                  style={[GlobalStyle.blurView, { zIndex: 1 }]}
                />
                <View
                  style={[
                    StyleSheet.absoluteFill,
                    { backgroundColor: 'rgba(15, 14, 14, 0.3)', zIndex: 1 },
                  ]}
                />

                <LinearGradient
                  colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0)']}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 0.2 }}
                  style={[StyleSheet.absoluteFill, { zIndex: 2 }]}
                />

                <View
                  style={[
                    styles.textBox,
                    { backgroundColor: 'transparent', zIndex: 3 },
                  ]}
                >
                  <View style={styles.content}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                  </View>

                  <View style={styles.dots}>
                    {onboardingData.map((_, dotIndex) => (
                      <View
                        key={dotIndex}
                        style={[
                          styles.radioContainer,
                          { borderWidth: index === dotIndex ? 1.5 : 0 },
                        ]}
                      >
                        <View style={styles.checked} />
                      </View>
                    ))}
                  </View>

                  <LinearGradient
                    colors={[
                      'rgba(255,255,255,0)',
                      'rgba(255,255,255,0.2)',
                      'rgba(255,255,255,0)',
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      height: 1,
                      width: '100%',
                      marginVertical: hp(0),
                    }}
                  />

                  <View style={styles.footer}>
                    {index !== onboardingData.length - 1 ? (
                      <TouchableOpacity
                        onPress={onSkip}
                        style={styles.sideBlock}
                      >
                        <Text style={styles.skip}>Skip</Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.sideBlock} />
                    )}

                    <View style={styles.sideBlockRight}>
                      <AppButton
                        width={wp(30)}
                        title={item.buttonText}
                        onPress={onNextPress}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </ImageBackground>
        ))}
      </ScrollView>
    </View>
  );
}

export default Onboarding;
