import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { getStyles } from './styles';
import Container from '../../../component/common/Container/Container';
import { SafeAreaView } from 'react-native-safe-area-context';
import { imagePath } from '../../../constant/imagePath';
import AppButton from '../../../component/common/Buttons/AppButton';
import { hp, getScreenNameFromSlug, wp } from '../../../utils/helper';
import Header from '../../../component/common/UI/Header';
import { getGlobalStyles } from '../../../GlobalStyles/GlobalStyles';
import LabelInput from '../../../component/common/Inputs/LabelInput';
import AppCheckbox from '../../../component/common/Inputs/AppCheckbox';
import { useNavigation, useRoute } from '@react-navigation/native';
import CountryPicker from 'react-native-country-picker-modal';
import messaging, {
  getToken,
  getMessaging,
} from '@react-native-firebase/messaging';
import { getApp } from '@react-native-firebase/app';
import { useTheme } from '../../../hooks/useTheme';
import { LoginApi, resendApi } from '../../../services/auth.service';
import { useDispatch } from 'react-redux';
import {
  updateTokenData,
  updateUserData,
} from '../../../redux/slices/userSlice';
import { updateGlobalSliceState } from '../../../redux/slices/globalSlice';
import { showDangerToast, showSuccessToast } from '../../../utils/toast';
// --- FIX 1: Import USER_ID and storeData ---
import {
  AUTH_TOKEN_KEY,
  USER_ROLE,
  USER_ID,
  setData,
  storeData,
  getData,
  removeData,
  SAVED_EMAIL,
  SAVED_PHONE,
  SAVED_PASSWORD,
} from '../../../utils/storage';

const shouldNavigateToEmailOtp = response => {
  const message = (response?.message || response?.data?.message || '').toLowerCase();
  const code = String(response?.code || response?.data?.code || '').toLowerCase();
  const data = response?.data || {};

  const needsVerification =
    data.needs_verification === true ||
    data.needsVerification === true ||
    data.verify_email === true ||
    data.is_email_verified === false ||
    data.isEmailVerified === false;

  if (needsVerification) return true;

  const otpHints = [
    'verify',
    'verification',
    'not verified',
    'unverified',
    'otp',
    'confirm your email',
    'email not verified',
  ];

  if (otpHints.some(hint => message.includes(hint) || code.includes(hint))) {
    return true;
  }

  const loginErrorHints = [
    'not found',
    'not registered',
    'does not exist',
    'doesnt exist',
    "doesn't exist",
    'no user',
    'user not',
    'invalid email',
    'invalid credentials',
    'incorrect password',
    'wrong password',
    'invalid password',
    'password is incorrect',
    'email or password',
  ];

  if (loginErrorHints.some(hint => message.includes(hint))) {
    return false;
  }

  return false;
};

function Login() {
  const route = useRoute();
  const { type } = route.params || {};
  const navigation = useNavigation();
  const [mode, setMode] = useState(type || 'email');
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const GlobalStyle = getGlobalStyles(Colors);

  const [countryCode, setCountryCode] = useState('IN');
  const [callingCode, setCallingCode] = useState('91');
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRememberMe, setIsRememberMe] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadSavedCredentials = async () => {
      const savedEmail = await getData(SAVED_EMAIL);
      const savedPhone = await getData(SAVED_PHONE);
      const savedPassword = await getData(SAVED_PASSWORD);

      if ((savedEmail || savedPhone) && savedPassword) {
        setIsRememberMe(true);
        if (savedEmail) {
          setEmail(savedEmail);
          setMode('email');
        } else if (savedPhone) {
          setPhone(savedPhone);
          setMode('phone');
        }
        setPassword(savedPassword);
      }
    };
    loadSavedCredentials();
  }, []);

  const validateEmail = email => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };


  const handleRememberMeStorage = async (
    isRememberMeValue,
    userEmail,
    userPassword,
  ) => {
    try {
      if (isRememberMeValue) {
        await storeData(SAVED_EMAIL, userEmail.toLowerCase().trim());
        await storeData(SAVED_PASSWORD, userPassword);
        await removeData(SAVED_PHONE); // Clear phone if saving email
      } else {
        await removeData(SAVED_EMAIL);
        await removeData(SAVED_PASSWORD);
      }
    } catch (error) {
      console.log('Error in Remember Me storage:', error);
    }
  };

  // HELPER 2: Role-Based Navigation Logic

  const handleRoleBasedNavigation = (
    userData,
    roleValue,
    nav,
    dispatchAction,
  ) => {
    const { profile_slugs } = userData;

    if (roleValue === 'stylist') {
      const isProfileComplete =
        userData?.first_name && userData?.stylePreferences?.visibility;

      if (isProfileComplete) {
        dispatchAction(updateGlobalSliceState(true));
      } else {
        nav.reset({
          index: 0,
          routes: [{ name: 'StylistProfileSet' }],
        });
      }
    } else {
      // Buyer Flow
      const slugs = profile_slugs || {};
      const screenName = getScreenNameFromSlug(slugs) || 'MainTab'; // Fallback added

      if (screenName === 'MainTab') {
        dispatchAction(updateGlobalSliceState(true));
      } else {
        // Build stack history so goBack() works correctly
        const flow = [
          'CompleteProfile',
          'BrandPreference',
          'SizeInfo',
          'PersonalApperence',
          'DefineYourStyle',
          'PrivacySetting',
          'ThankYou',
        ];
        const targetIndex = flow.indexOf(screenName);

        if (targetIndex > 0) {
          const routes = flow.slice(0, targetIndex + 1).map(name => ({ name }));
          nav.reset({
            index: routes.length - 1,
            routes: routes,
          });
        } else {
          // Keep Login under Profile so back button works
          nav.reset({
            index: 1,
            routes: [{ name: 'Login' }, { name: screenName }],
          });
        }
      }
    }
  };

  // MAIN FUNCTION: Email Login

  const handleEmailLogin = async () => {
    if (!email.trim() || !password.trim()) {
      showDangerToast('Please enter both email and password');
      return;
    }

    if (!validateEmail(email)) {
      showDangerToast('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      let fcm_token = '';
      try {
        if (Platform.OS === 'ios') {
          await messaging().requestPermission();
          await messaging().registerDeviceForRemoteMessages();
        }
        fcm_token = await getToken(getMessaging(getApp()));
        console.log('🔥 FCM Token (Login):', fcm_token);
      } catch (fcmError) {
        console.log('Failed to fetch FCM token (Login):', fcmError);
      }

      console.log('--- LOGIN API CALLED -bsadhfasdfsf--', {
        email: email.toLowerCase().trim(),
        password: '***',
        fcm_token,
        device_token: fcm_token,
      });

      const response = await LoginApi({
        email: email.toLowerCase().trim(),
        password: password,
        fcm_token,
        device_token: fcm_token,
      });
      console.log(response,"Login Response Comming ")
      if (response?.data?.user_data?.token) {
        const userData = response.data?.user_data;
        const { token, _id, role } = userData;
        const userRole = role || 'buyer';

        console.log('--- LOGIN SUCCESS API RESPONSE ---', {
          message: 'User successfully logged in',
          returnedRoleFromBackend: userRole,
          userId: _id,
        });

        // 1. Save Data to Storage
        await storeData(AUTH_TOKEN_KEY, token);
        if (_id) await storeData(USER_ID, _id);
        await storeData(USER_ROLE, userRole);

        // 2. Handle Remember Me Storage
        await handleRememberMeStorage(isRememberMe, email, password);

        // 3. Update Redux State
        dispatch(updateTokenData({ token, userId: _id, userRole }));
        dispatch(updateUserData(userData));

        // 4. Handle Navigation Based on Role
        handleRoleBasedNavigation(userData, userRole, navigation, dispatch);

        // 5. Common Success Actions (Run once at the end)
        showSuccessToast('Login Successful');
        setEmail('');
        setPassword('');
      } else if (shouldNavigateToEmailOtp(response)) {
        const cleanEmail = email.toLowerCase().trim();
        // Backend verifyOTPWithEmail only accepts type "register" (not "login").
        // Login may send a 6-digit OTP; resend normalizes to 4-digit for the UI.
        try {
          await resendApi({
            email: cleanEmail,
            type: 'register',
            role: 'user',
          });
        } catch (resendError) {
          console.log('Resend after unverified login:', resendError);
        }
        navigation.navigate('EmailOtpVerification', {
          email: cleanEmail,
          isLogin: true,
          type: 'register',
          role: 'user',
        });
      } else {
        showDangerToast(
          response?.message ||
            response?.data?.message ||
            'Login failed. Please check your email and password.',
        );
      }
    } catch (error) {
      console.log('Login Error', error);

      const data = error?.response?.data || error;
      if (shouldNavigateToEmailOtp(data) || shouldNavigateToEmailOtp(error?.response)) {
        const cleanEmail = email.toLowerCase().trim();
        try {
          await resendApi({
            email: cleanEmail,
            type: 'register',
            role: 'user',
          });
        } catch (resendError) {
          console.log('Resend after unverified login (catch):', resendError);
        }
        navigation.navigate('EmailOtpVerification', {
          email: cleanEmail,
          isLogin: true,
          type: 'register',
          role: 'user',
        });
        return;
      }

      let errorMessage = data?.message || error?.message || 'Login Failed';

      if (data?.error && Array.isArray(data.error)) {
        errorMessage = data.error.map(e => e.msg).join(', ');
      }

      showDangerToast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneLogin = () => {
    if (phone.length < 10) {
      showDangerToast('Mobile number must be at least 10 digits');
      return;
    }
    const fullPhone = `+${callingCode}${phone}`;
    setData(USER_ROLE, 'buyer');

    if (isRememberMe) {
      // NOTE: For phone login we just save the phone, but there's no password currently.
      // But we'll follow our design: store phone number. For passwordless OTP login, we don't need a password saved.
      // If we implement password later for phone, we'll store that too.
      storeData(SAVED_PHONE, phone);
      removeData(SAVED_EMAIL);
      removeData(SAVED_PASSWORD);
    } else {
      removeData(SAVED_PHONE);
    }

    navigation.navigate('OtpVerification', {
      phone: fullPhone,
      isLogin: true,
    });
  };

  const renderRememberMe = () => (
    <AppCheckbox
      label="Remember Me"
      checked={isRememberMe}
      onPress={() => setIsRememberMe(!isRememberMe)}
      containerStyle={{ marginVertical: hp(1) }}
    />
  );

  const renderEmailSection = () => (
    <View style={{ width: '100%' }}>
      <LabelInput
        onChangeText={text => setEmail(text)}
        value={email}
        title="Email"
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <LabelInput
        onChangeText={setPassword}
        value={password}
        title="Password"
        placeholder="Enter your password"
        secureTextEntry
      />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop:4
        }}
      >
        {renderRememberMe()}
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPass')}>
          <Text style={styles.forgotPassText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      <AppButton
        loading={isLoading}
        marginTop={hp(3)}
        title={'Login'}
        onPress={handleEmailLogin}
        width="100%"
      />
      {/* <AppButton
        borderColor={Colors.borderGrey}
        icon={imagePath.black_phone}
        textColor={Colors.text}
        marginTop={hp(1.5)}
        borderWidth={2}
        backgroundColor={Colors.transparent}
        title={'Continue with Mobile'}
        onPress={() => setMode('phone')}
        width="100%"
      /> */}
    </View>
  );

  const renderPhoneSection = () => (
    <View style={{ width: '100%' }}>
      <Text style={styles.inputTitle}>Mobile</Text>
      <View style={styles.inputRow}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setShowCountryPicker(true)}
          style={styles.phoneRow}
        >
          <CountryPicker
            countryCode={countryCode}
            withFilter
            withFlag={true}
            withCallingCode={true}
            withEmoji
            visible={showCountryPicker}
            onClose={() => setShowCountryPicker(false)}
            onSelect={country => {
              setCountryCode(country.cca2);
              setCallingCode(country.callingCode[0]);
              setShowCountryPicker(false);
            }}
          />
          <Image
            source={imagePath.mini_arrow}
            resizeMode="contain"
            style={styles.arrow}
          />
        </TouchableOpacity>
        <View style={styles.phoneInputView}>
          {/* <TextInput
            placeholder={'Enter your mobile number'}
            placeholderTextColor={Colors.graytext}
            style={[styles.input]}
            onChangeText={txt => setPhone(txt.replace(/[^0-9]/g, ''))}
            value={phone}
            maxLength={10}
            keyboardType="numeric"
          /> */}
        </View>
      </View>

      {renderRememberMe()}

      <AppButton
        marginTop={hp(5)}
        backgroundColor={Colors.primary}
        title={'Login'}
        onPress={handlePhoneLogin}
        width="100%"
      />

      {/* <AppButton
        borderColor={Colors.borderGrey}
        icon={imagePath.email_black}
        textColor={Colors.text}
        marginTop={hp(1.5)}
        borderWidth={2}
        backgroundColor={Colors.transparent}
        title={'Continue with Email'}
        onPress={() => setMode('email')}
        width="100%"
      /> */}
    </View>
  );

  return (
    <Container useGradient={true} style={styles.container}>
      <Header showLeftButton={true} title="" backgroundColor={Colors.white} />
      <View
        style={[
          styles.container,
          { paddingTop: 0,  },
        ]}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.textView}>
              <Text style={GlobalStyle.authScreenTitle}>Login</Text>
              <Text style={GlobalStyle.authScreenSubtitle}>
                {mode === 'email'
                  ? 'Login with your registered email'
                  : 'Login with your registered mobile'}
              </Text>
            </View>

            {mode === 'email' ? renderEmailSection() : renderPhoneSection()}
          </ScrollView>
        </KeyboardAvoidingView>
        <TouchableOpacity
          onPress={() => navigation.replace('Signup')}
          style={styles.bottomTextView}
        >
            <Text
              numberOfLines={1}
              style={[styles.bottomText, { color: Colors.blackVar2 }]}
            >
              Don’t have an account?
            </Text>
            <Text numberOfLines={1} style={styles.bottomText}>
              Sign Up
            </Text>
          </TouchableOpacity>
      </View>
    </Container>
  );
}

export default Login;
