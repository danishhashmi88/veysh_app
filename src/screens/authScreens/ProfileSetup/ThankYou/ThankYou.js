/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Image, Text, View, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Container from '../../../../component/common/Container/Container';
import { getStyles } from './styles';
import { getGlobalStyles } from '../../../../GlobalStyles/GlobalStyles';
import { hp, wp } from '../../../../utils/helper';
import AppButton from '../../../../component/common/Buttons/AppButton';
import { useTheme } from '../../../../hooks/useTheme';
import { FontSize, FontWeight } from '../../../../constant/fonts';
import { imagePath } from '../../../../constant/imagePath';
import Header from '../../../../component/common/UI/Header';
import {
  updateGlobalSliceState,
  updateInitialAppRoute,
} from '../../../../redux/slices/globalSlice';

function ThankYou() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { isLoggedIn } = useSelector(state => state.global);
  const Colors = useTheme();
  const GlobalStyle = getGlobalStyles(Colors);
  const styles = getStyles(Colors);

  const handleContinue = () => {
    dispatch(updateInitialAppRoute('HomeScreen'));

    if (isLoggedIn) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTab' }],
      });
    } else {
      dispatch(updateGlobalSliceState(true));
    }
  };

  return (
    <Container>
      <View style={{ flex: 1, width: '100%', backgroundColor: '#FFFFFF' }}>
        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

          <Header
            showLeftButton={false}
            title=""
            backgroundColor={Colors.white}
          />

          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#FFFFFF',
            }}
          >
            <View style={styles.imageView}>
              <Image
                source={imagePath.green_big_tick}
                style={styles.icon}
                resizeMode="contain"
              />
            </View>
            <Text
              style={[
                GlobalStyle.authScreenTitle,
                { fontSize: FontSize.FONT_24, fontWeight: FontWeight.FONT_600 },
              ]}
            >
              You're All Set
            </Text>
            <Text
              style={[
                GlobalStyle.authScreenSubtitle,
                { fontSize: FontSize.FONT_14, marginTop: hp(1), textAlign: 'center', paddingHorizontal: wp(10) },
              ]}
            >
              Everything’s set—enjoy your styling experience.
            </Text>
          </View>

          <View style={{ paddingBottom: hp(2) }}>
            <AppButton
              marginTop={hp(2)}
              marginBottom={Platform.OS === 'android' ? hp(4) : hp(2)}
              title={'Continue to Home'}
              onPress={handleContinue}
            />
          </View>
        </View>
      </View>
    </Container>
  );
}

export default ThankYou;
