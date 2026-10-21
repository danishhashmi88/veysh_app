import React, { useState, useEffect, useRef } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import CountryPicker from 'react-native-country-picker-modal';
import messaging, {
  getToken,
  getMessaging,
} from '@react-native-firebase/messaging';
import { getApp } from '@react-native-firebase/app';

import Container from '../../../component/common/Container/Container';
import AppButton from '../../../component/common/Buttons/AppButton';
import Header from '../../../component/common/UI/Header';
import LabelInput from '../../../component/common/Inputs/LabelInput';
import AppCheckbox from '../../../component/common/Inputs/AppCheckbox';
import { imagePath } from '../../../constant/imagePath';

import {
  hp,
  wp,
  mapBackendUserToFrontend,
  toSafeString,
  getScreenNameFromSlug,
} from '../../../utils/helper';
import { useTheme } from '../../../hooks/useTheme';
import { getGlobalStyles } from '../../../GlobalStyles/GlobalStyles';

import { signInStyles } from './styles';
import { FontSize, FontWeight } from '../../../constant/fonts';
import { SignUpApi, resendApi } from '../../../services/auth.service';
// import { showMessage } from 'react-native-flash-message';
import { showDangerToast, showSuccessToast } from '../../../utils/toast';
// import { FontSize, FontWeight } from '../../../constant/fonts';
// import { height } from '../../../constant/screenConfig';
import {
  setData,
  USER_ROLE,
  AUTH_TOKEN_KEY,
  USER_ID,
  storeData,
} from '../../../utils/storage';
import { useDispatch } from 'react-redux';
import {
  updateTokenData,
  updateUserData,
} from '../../../redux/slices/userSlice';
import {
  updateGlobalSliceState,
  updateInitialAppRoute,
} from '../../../redux/slices/globalSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  configureGoogleSignIn,
  GOOGLE_WEB_CLIENT_ID,
  signInWithGoogle,
} from '../../../utils/socialAuth';
import { googleLoginApi } from '../../../services/auth.service';

function Signup() {
  const navigation = useNavigation();
  const Colors = useTheme();
  const GlobalStyle = getGlobalStyles(Colors);

  const styles = signInStyles(Colors);
  const dispatch = useDispatch();

  const isGoogleLoginInProgress = useRef(false);

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  const handleGoogleLogin = async () => {
    if (isGoogleLoginInProgress.current) {
      return;
    }

    isGoogleLoginInProgress.current = true;
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

      let fcm_token = '';
      try {
        if (Platform.OS === 'ios') {
          await messaging().requestPermission();
          await messaging().registerDeviceForRemoteMessages();
        }
        fcm_token = await getToken(getMessaging(getApp()));
        console.log('🔥 FCM Token (Signup Google):', fcm_token);
      } catch (fcmError) {
        console.log('Failed to fetch FCM token (Google):', fcmError);
      }

      const payload = {
        id_token: idToken,
        client_id: GOOGLE_WEB_CLIENT_ID,
        fcm_token,
      };

      const response = await googleLoginApi(payload);
      const userData =
        response?.data?.user_data ||
        response?.data?.user ||
        response?.data ||
        null;
      const token =
        userData?.token || response?.data?.token || response?.token;

      if (response?.success === false || !token || !userData) {
        showDangerToast(
          toSafeString(response?.message) || 'Google Login Failed',
        );
        return;
      }

      const { _id, role } = userData;
      const userRole = role || 'user';

      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
      await setData(USER_ROLE, userRole);
      await storeData(AUTH_TOKEN_KEY, token);
      if (_id) await storeData(USER_ID, _id);
      await storeData(USER_ROLE, userRole);

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

      const mappedUserData = mapBackendUserToFrontend(userData) || {};

      dispatch(updateTokenData({ token, userId: _id, userRole }));
      dispatch(updateUserData({ ...mappedUserData, ...googleUser }));

      const screenName = getScreenNameFromSlug(userData?.profile_slugs);
      const isProfileComplete =
        screenName === 'MainTab' || screenName === 'HomeScreen';

      if (isProfileComplete) {
        dispatch(updateInitialAppRoute('MainTab'));
        dispatch(updateGlobalSliceState(true));
        showSuccessToast('Login Successful');
      } else {
        if (
          !toSafeString(userData?.username) ||
          !toSafeString(userData?.first_name || userData?.firstName)
        ) {
          dispatch(updateInitialAppRoute('EditProfile'));
        } else {
          dispatch(updateInitialAppRoute(screenName));
        }
        showSuccessToast('Login Successful');
        navigation.navigate(screenName || 'CompleteProfile');
      }
    } catch (error) {
      console.log('Google Login Error', error);
      showDangerToast(
        toSafeString(error?.response?.data?.message) ||
          toSafeString(error?.message) ||
          'Google Sign-In Failed',
      );
    } finally {
      isGoogleLoginInProgress.current = false;
    }
  };

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [roleType, setRoletype] = useState('user');
  const [isLoading, setIsLoading] = useState(false);
  console.log('roletyope', roleType);
  const validatePassword = pass => {
    const errors = [];
    if (pass.length < 8) errors.push('8 characters');
    if (!/[A-Z]/.test(pass)) errors.push('1 uppercase letter');
    if (!/[a-z]/.test(pass)) errors.push('1 lowercase letter');
    if (!/[0-9]/.test(pass)) errors.push('1 number');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass))
      errors.push('1 special character');

    return errors.length > 0 ? `Missing: ${errors.join(', ')}` : '';
  };

  const handleSignup = async () => {
    // Reset Errors
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    // 1. Basic Validations
    if (!email) {
      setEmailError('Email is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    if (!password) {
      setPasswordError('Password is required');
      return;
    } else {
      const passwordValidationMsg = validatePassword(password);
      if (passwordValidationMsg) {
        setPasswordError(passwordValidationMsg);
        return;
      }
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Confirm password is required');
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return;
    }

    if (!agreeTerms) {
      showDangerToast('Please agree to Terms and Privacy Policy');
      return;
    }

    setIsLoading(true);

    try {
      // 2. Fetch FCM Token (Using Modular Firebase API to avoid warnings)
      let fcm_token = '';
      try {
        const messagingInstance = getMessaging(getApp());

        // Note: For newer Firebase versions, getToken handles permission requests automatically
        // but we can still explicitly request it if needed.
        if (Platform.OS === 'ios') {
          // We keep this minimal. The warning said registerDeviceForRemoteMessages is often unnecessary now.
          const authStatus = await messaging().requestPermission();
          console.log('iOS Notification Permission:', authStatus);
        }

        fcm_token = await getToken(messagingInstance);
        console.log('🔥 FCM Token (Signup):', fcm_token);
      } catch (fcmError) {
        console.log('Failed to fetch FCM token:', fcmError);
      }

      // 3. Prepare Payload (Removed the buggy 'mode' logic)
      const payload = {
        email: email.toLowerCase().trim(),
        password: password,
        role: roleType,
        privacy_accepted: true,
        terms_accepted: true,
        fcm_token: fcm_token,
        device_type: Platform.OS,
      };

      console.log('--- SIGNUP API PAYLOAD ---', {
        ...payload,
        password: '***',
      });

      // 4. Call API
      const response = await SignUpApi(payload);
      console.log('--- SIGNUP JSON RESPONSE (Email) ---', response);

      const isSuccess =
        response &&
        (response.success === true ||
          response.status === true ||
          response.status === 200 ||
          response.status === 201);

      // 5. Handle Success
      if (isSuccess) {
        console.log(
          `--- SIGNUP SUCCESS as ${roleType.toUpperCase()} --- Triggering OTP now...`,
        );

        try {
          await resendApi({
            email: email.toLowerCase().trim(),
            role: roleType,
          });
          showSuccessToast(`Signup successful! OTP sent to your email.`);

          navigation.navigate('EmailOtpVerification', {
            email: email.toLowerCase().trim(),
            isLogin: false,
            signupData: payload,
            role: roleType,
          });
        } catch (otpError) {
          console.log('OTP Send Error:', otpError);
          const errorMsg =
            otpError?.response?.data?.message ||
            otpError?.message ||
            'Unknown Error';
          showDangerToast(
            `Signup successful but failed to send OTP. Error: ${errorMsg}`,
          );
        }
      } else {
        // Handle API level Failure (e.g. Email already exists)
        showDangerToast(
          response?.message || 'Signup Failed. Please try again.',
        );
      }
    } catch (error) {
      // 6. Handle Critical Errors
      console.log('Signup Critical Error:', error);

      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        'An unexpected error occurred during signup.';

      showDangerToast(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container useGradient={true} style={styles.container}>
      <Header showLeftButton={true} title="" backgroundColor={Colors.white} />
      <View
        style={[
          styles.mainContainer,
          { paddingTop: 0 },
        ]}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingBottom: hp(5) }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.textView}>
              <Text style={GlobalStyle.authScreenTitle}>Sign Up</Text>
              <Text style={GlobalStyle.authScreenSubtitle}>
                Create a new account to continue
              </Text>
            </View>
            {/* <View style={styles.authSelector}>
              <TouchableOpacity
                onPress={() => setRoletype('user')}
                style={styles.tabButtonWrapper}
                activeOpacity={1}
              >
                {roleType === 'user' ? (
                  <LinearGradient
                    colors={[Colors.gradientPurple2, Colors.gradientPurple1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.activeTab}
                  >
                    <Text style={[styles.tabText, { color: Colors.white }]}>
                      User
                    </Text>
                  </LinearGradient>
                ) : (
                  <Text style={[styles.tabText, { color: Colors.graytext }]}>
                    User
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setRoletype('stylist')}
                style={styles.tabButtonWrapper}
                activeOpacity={1}
              >
                {roleType === 'stylist' ? (
                  <LinearGradient
                    colors={[Colors.gradientPurple2, Colors.gradientPurple1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.activeTab}
                  >
                    <Text style={[styles.tabText, { color: Colors.white }]}>
                      Stylist
                    </Text>
                  </LinearGradient>
                ) : (
                  <Text style={[styles.tabText, { color: Colors.graytext }]}>
                    Stylist
                  </Text>
                )}
              </TouchableOpacity>
            </View> */}
            <View>
              <LabelInput
                title="Email"
                required
                placeholder="Enter your email"
                value={email}
                onChangeText={text => {
                  setEmail(text.toLowerCase());
                  if (emailError) setEmailError('');
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                errorText={emailError}
              />
              <LabelInput
                title="Password"
                required
                placeholder="Enter your password"
                value={password}
                onChangeText={text => {
                  setPassword(text);
                  if (passwordError) {
                    setPasswordError(validatePassword(text));
                  }
                }}
                secureTextEntry
                errorText={passwordError}
              />
              <LabelInput
                title="Confirm Password"
                required
                placeholder="Enter your confirm password"
                value={confirmPassword}
                onChangeText={text => {
                  setConfirmPassword(text);
                  if (confirmPasswordError) setConfirmPasswordError('');
                }}
                secureTextEntry
                errorText={confirmPasswordError}
              />

              <AppCheckbox
                checked={agreeTerms}
                onPress={() => setAgreeTerms(!agreeTerms)}
                label={
                  <Text style={styles.checkboxText}>
                    I agree to{' '}
                    <Text
                      style={styles.linkText}
                      onPress={() => {
                        navigation.navigate('CmsScreen', {
                          screenType: 'privacy',
                        });
                      }}
                    >
                      Privacy Policy
                    </Text>{' '}
                    and{' '}
                    <Text
                      style={styles.linkText}
                      onPress={() => {
                        navigation.navigate('CmsScreen', { screenType: 'terms' });
                      }}
                    >
                      Terms of Service
                    </Text>
                  </Text>
                }
                containerStyle={{ marginTop: hp(2) }}
              />

              <AppButton
                loading={isLoading}
                marginTop={hp(3)}
                title={'Sign Up'}
                onPress={handleSignup}
                height={hp(6)}
                width="100%"
              />
            </View>
            {/* <Text style={styles.orText}>OR</Text> */}
            {/* <AppButton
              backgroundColor={Colors.white}
              borderWidth={1}
              borderColor={Colors.borderGrey}
              title={'Continue with Google'}
              textColor={Colors.black}
              icon={imagePath.google}
              onPress={handleGoogleLogin}
              fontWeight={FontWeight.FONT_500}
              fontSize={FontSize.FONT_14}
              height={hp(6)}
              width="100%"
            />
            {Platform.OS === 'ios' && (
              <AppButton
                marginTop={hp(1.7)}
                backgroundColor={Colors.white}
                borderWidth={1}
                borderColor={Colors.borderGrey}
                title={'Continue with Apple'}
                textColor={Colors.black}
                icon={imagePath.apple}
                onPress={() => console.log('apple')}
                fontSize={FontSize.FONT_14}
                fontWeight={FontWeight.FONT_500}
                height={hp(6)}
                marginBottom={hp(3)}
                width="100%"
              />
            )} */}
          </ScrollView>
        </KeyboardAvoidingView>
        <TouchableOpacity
          onPress={() => navigation.replace('Login')}
          style={styles.footerView}
        >
            <Text style={styles.footerText}>Already have an account? </Text>
            <Text style={styles.loginText}>Log In</Text>
          </TouchableOpacity>
      </View>
    </Container>
  );
}

export default Signup;
