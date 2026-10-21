import React, { useEffect, useRef } from 'react';
import { Image, Text, TouchableOpacity, View, Platform } from 'react-native';
import { getStyles } from './styles';
import Container from '../../../component/common/Container/Container';
import { imagePath } from '../../../constant/imagePath';
import AppButton from '../../../component/common/Buttons/AppButton';
import {
  hp,
  mapBackendUserToFrontend,
  toSafeString,
  getScreenNameFromSlug,
} from '../../../utils/helper';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../hooks/useTheme';
import { useKeyboard } from '../../../hooks/useKeyboard';
import {
  configureGoogleSignIn,
  GOOGLE_WEB_CLIENT_ID,
  onAppleButtonPress,
  signInWithGoogle,
} from '../../../utils/socialAuth';
import { appleLoginApi, googleLoginApi } from '../../../services/auth.service';
import { useDispatch } from 'react-redux';
import {
  updateTokenData,
  updateUserData,
} from '../../../redux/slices/userSlice';
import {
  updateGlobalSliceState,
  updateInitialAppRoute,
} from '../../../redux/slices/globalSlice';
import { showDangerToast, showSuccessToast } from '../../../utils/toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AUTH_TOKEN_KEY,
  setData,
  storeData,
  USER_ID,
  USER_ROLE,
} from '../../../utils/storage';

function AuthSelection() {
  const navigation = useNavigation();
  const Colors = useTheme();
  const dispatch = useDispatch();
  const styles = getStyles(Colors);
  const isKeyboardVisible = useKeyboard();
  const isSocialLoginInProgress = useRef(false);

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  const extractAuthUserData = response => {
    const userData =
      response?.data?.user_data ||
      response?.data?.user ||
      response?.data ||
      null;
    const token = userData?.token || response?.data?.token || response?.token;
    return { userData, token };
  };

  const completeSocialLogin = async (userData, token, extraUser = {}) => {
    const { _id, role } = userData;
    const userRole = role || 'user';

    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    await setData(USER_ROLE, userRole);
    await storeData(AUTH_TOKEN_KEY, token);
    if (_id) await storeData(USER_ID, _id);
    await storeData(USER_ROLE, userRole);

    const mappedUserData = mapBackendUserToFrontend(userData) || {};
    const mergedUser = { ...mappedUserData, ...extraUser };

    dispatch(updateTokenData({ token, userId: _id, userRole }));
    dispatch(updateUserData(mergedUser));

    const screenName = getScreenNameFromSlug(userData?.profile_slugs);
    const isProfileComplete =
      screenName === 'MainTab' || screenName === 'HomeScreen';

    if (isProfileComplete) {
      dispatch(updateInitialAppRoute('MainTab'));
      dispatch(updateGlobalSliceState(true));
      showSuccessToast('Login Successful');
      return;
    }

    const resolvedFirstName = toSafeString(
      mergedUser?.firstName ||
        mergedUser?.first_name ||
        userData?.first_name ||
        userData?.firstName,
    );
    const resolvedUsername = toSafeString(
      mergedUser?.username || userData?.username,
    );

    // Incomplete profile: stay on auth stack and continue onboarding
    if (!resolvedUsername || !resolvedFirstName) {
      dispatch(updateInitialAppRoute('EditProfile'));
    } else {
      dispatch(updateInitialAppRoute(screenName));
    }

    showSuccessToast('Login Successful');
    navigation.navigate(screenName || 'CompleteProfile');
  };

  const handleGoogleLogin = async () => {
    if (isSocialLoginInProgress.current) {
      return;
    }

    isSocialLoginInProgress.current = true;
    try {
      const userInfo = await signInWithGoogle();
      if (!userInfo) {
        return;
      }

      const idToken = userInfo.idToken || userInfo?.data?.idToken;
      if (!idToken) {
        showDangerToast('Google Sign-In Failed');
        return;
      }

      const payload = {
        id_token: idToken,
        client_id: GOOGLE_WEB_CLIENT_ID,
      };

      const response = await googleLoginApi(payload);
      const { userData, token } = extractAuthUserData(response);

      if (response?.success === false || !token || !userData) {
        showDangerToast(
          toSafeString(response?.message) || 'Google Login Failed',
        );
        return;
      }

      const googleInfo = userInfo.data?.user || userInfo.user;
      const googleUser = {
        firstName:
          googleInfo?.givenName ||
          userData?.first_name ||
          userData?.firstName ||
          '',
        lastName:
          googleInfo?.familyName ||
          userData?.last_name ||
          userData?.lastName ||
          '',
        profileImage:
          googleInfo?.photo ||
          userData?.profile_image ||
          userData?.profileImage ||
          '',
      };

      await completeSocialLogin(userData, token, googleUser);
    } catch (error) {
      console.log('Google Login Error', error);
      showDangerToast(
        toSafeString(error?.response?.data?.message) ||
          toSafeString(error?.message) ||
          'Google Sign-In Failed',
      );
    } finally {
      isSocialLoginInProgress.current = false;
    }
  };

  const onhandleApple = async () => {
    if (isSocialLoginInProgress.current) {
      return;
    }

    isSocialLoginInProgress.current = true;
    try {
      const userInfo = await onAppleButtonPress();
      if (!userInfo?.identityToken) {
        return;
      }

      const appleProfile = userInfo.profile || {};
      const payload = {
        id_token: userInfo.identityToken,
        apple_user_id: appleProfile.appleUserId || userInfo.user || '',
        email: appleProfile.email || userInfo.email || '',
        first_name: appleProfile.firstName || '',
        last_name: appleProfile.lastName || '',
        full_name: [appleProfile.firstName, appleProfile.lastName]
          .filter(Boolean)
          .join(' ')
          .trim(),
      };

      const response = await appleLoginApi(payload);
      const { userData, token } = extractAuthUserData(response);

      if (response?.success === false || !token || !userData) {
        showDangerToast(
          toSafeString(response?.message) || 'Apple Login Failed',
        );
        return;
      }

      const appleUser = {
        loginProvider: 'apple',
        firstName:
          appleProfile.firstName ||
          userData?.first_name ||
          userData?.firstName ||
          '',
        lastName:
          appleProfile.lastName ||
          userData?.last_name ||
          userData?.lastName ||
          '',
        email: appleProfile.email || userData?.email || '',
        appleProvidedName: !!(
          appleProfile.firstName ||
          userData?.first_name ||
          userData?.firstName
        ),
        appleProvidedEmail: !!(appleProfile.email || userData?.email),
      };

      await completeSocialLogin(userData, token, appleUser);
    } catch (error) {
      console.log('error', error);
      showDangerToast(
        toSafeString(error?.response?.data?.message) ||
          toSafeString(error?.message) ||
          'Apple Sign-In Failed',
      );
    } finally {
      isSocialLoginInProgress.current = false;
    }
  };

  return (
    <Container useGradient={false} style={styles.container}>
      <View style={styles.container}>
        <Image
          source={imagePath.auth_image}
          resizeMode="contain"
          style={styles.bigImage}
        />
        <View>
          <View style={[styles.bottomView]}>
            <Text style={styles.title}>Welcome to Veysh</Text>
            <Text style={styles.subTitle}>
              Powered by AI. Designed for your style.
            </Text>
            <AppButton
              marginTop={hp(2)}
              backgroundColor={Colors.black}
              icon={imagePath.email}
              title={'Log In with Email'}
              onPress={() => navigation.navigate('Login', { type: 'email' })}
            />
            <AppButton
              textColor={Colors.text}
              marginTop={hp(1.5)}
              borderWidth={2}
              backgroundColor={Colors.transparent}
              icon={imagePath.google}
              title={'Continue with Google'}
              onPress={handleGoogleLogin}
            />
            {Platform.OS === 'ios' && (
              <AppButton
                textColor={Colors.text}
                marginTop={hp(1.5)}
                borderWidth={2}
                backgroundColor={Colors.transparent}
                icon={imagePath.apple}
                title={'Continue with Apple'}
                onPress={onhandleApple}
              />
            )}
            {!isKeyboardVisible && (
              <TouchableOpacity
                onPress={() => navigation.navigate('Signup')}
                style={styles.bottomTextView}
              >
                <Text
                  numberOfLines={1}
                  style={[styles.bottomText, { color: Colors.graytext }]}
                >
                  Don’t have an account?
                </Text>
                <Text numberOfLines={1} style={styles.bottomText}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Container>
  );
}

export default AuthSelection;
