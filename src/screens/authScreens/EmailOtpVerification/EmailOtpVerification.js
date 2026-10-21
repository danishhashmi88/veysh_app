import React, { useRef, useState, useEffect } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import OTPTextInput from 'react-native-otp-textinput';
import { styles } from '../OtpVerification/styles';
import Container from '../../../component/common/Container/Container';
import { SafeAreaView } from 'react-native-safe-area-context';
import { imagePath } from '../../../constant/imagePath';
import AppButton from '../../../component/common/Buttons/AppButton';
import { hp, wp } from '../../../utils/helper';
import { getGlobalStyles } from '../../../GlobalStyles/GlobalStyles';
import Header from '../../../component/common/UI/Header';
import IconView from '../../../component/Auth/IconView';
import { useTheme } from '../../../hooks/useTheme';
import { useNavigation, useRoute } from '@react-navigation/native';
// import { showMessage } from 'react-native-flash-message';
import { showDangerToast, showSuccessToast } from '../../../utils/toast';
import Axios from '../../../utils/axios'; // Direct Axios Import
import { buyerRouteName } from '../../../constant';

import { useDispatch } from 'react-redux';
import {
  updateTokenData,
  updateUserData,
} from '../../../redux/slices/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AUTH_TOKEN_KEY,
  storeData,
  USER_ID,
  USER_ROLE,
} from '../../../utils/storage';
import { updateGlobalSliceState } from '../../../redux/slices/globalSlice';
import { mapBackendUserToFrontend } from '../../../utils/helper';
function EmailOtpVerification() {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch(); // Add dispatch
  const { email, isLogin, role, type } = route.params || {};
  console.log('role is', role);
  const otpRef = useRef(null);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const Colors = useTheme();
  const GlobalStyle = getGlobalStyles(Colors);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Backend verifyOTPWithEmail only accepts: "register" | "password_reset"
  // Unverified-login OTP is still a register/email-verify OTP (not "login")
  const resolveVerifyType = () => {
    if (route.params?.isReset || type === 'password_reset' || type === 'forget-password') {
      return 'password_reset';
    }
    return 'register';
  };

  const resolveResendType = () => {
    if (route.params?.isReset || type === 'password_reset' || type === 'forget-password') {
      return 'password_reset';
    }
    return 'register';
  };

  const verifyOtpDirectly = async (overrideRole) => {
    const url = `/${buyerRouteName}/auth/verifyOTPWithEmail`;
    const payload = {
      otp: otp,
      type: resolveVerifyType(),
      email: email,
      role: overrideRole || role || 'user',
    };
    console.log('--- EMAIL OTP API PAYLOAD ---', { ...payload });
    return await Axios().post(url, payload);
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 4) {
      showDangerToast('Please enter a valid OTP');
      return;
    }

    setIsLoading(true);
    try {
      let response = await verifyOtpDirectly();
      console.log('response----12----', response);

      // If role wasn't passed (common after login), retry as stylist
      const notFound =
        !response?.success &&
        String(response?.message || response?.data?.message || '')
          .toLowerCase()
          .includes('user not found');
      if (notFound && (!role || role === 'user')) {
        response = await verifyOtpDirectly('stylist');
        console.log('response----stylist retry----', response);
      }

      if (
        response?.success ||
        response?.status === 200 ||
        response?.data?.token
      ) {
        const token = response?.data?.token || response?.token;
        const user = response?.data?.user || response?.user || response?.data;
        console.log('hellow user is', user);
        showSuccessToast('Verification Successful!');

        if (route.params?.isReset) {
          // Password Reset Flow
          navigation.navigate('ResetPass', {
            email,
            token: token || 'mock_token',
          });
        } else {
          // Auto Login Logic (Signup/Login)
          if (token) {
            // REPLACE: await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
            // WITH:
            await storeData(AUTH_TOKEN_KEY, token);
            const userId = user?._id || user?.id;

            if (userId) {
              await storeData(USER_ID, userId);
            }
            await storeData(USER_ROLE, user?.role);
            dispatch(
              updateTokenData({ token, userId: userId, userRole: user?.role }),
            );

            if (user) {
              const mappedUser = mapBackendUserToFrontend(user);
              dispatch(updateUserData(mappedUser));
            }

            // Check profile completion
            const isProfileComplete =
              user?.first_name && user?.stylePreferences?.visibility;
            // Note: logic simplified, adjust based on actual flags if needed

            const userRole = user?.role || role;
            console.log('--- OTP VERIFIED: DETERMINING ROUTE ---', {
              passedRole: role,
              apiResponseUserRole: user?.role,
              finalRoleDecided: userRole,
            });

            if (isProfileComplete) {
              dispatch(updateGlobalSliceState(true)); // Navigate to MainStack
            } else {
              userRole === 'stylist'
                ? navigation.replace('StylistProfileSet')
                : navigation.replace('CompleteProfile');
            }
          } else {
            // Fallback if no token (shouldn't happen on success with token)
            navigation.navigate('Login');
          }
        }
      } else {
        showDangerToast(
          response?.message || response?.data?.message || 'Invalid OTP',
        );
      }
    } catch (error) {
      console.log('OTP Verification Error', error);
      showDangerToast(error?.response?.data?.message || 'Verification Failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      showDangerToast('Email not found');
      return;
    }

    try {
      const url = `/${buyerRouteName}/auth/resend-otp`;
      const cleanEmail = email.trim().toLowerCase();

      const payload = {
        email: cleanEmail,
        type: resolveResendType(),
        role: role || 'user',
      };

      console.log('Resend OTP Payload:', payload);

      const response = await Axios().post(url, payload);

      if (response?.success || response?.status === 200) {
        showSuccessToast('OTP Resent Successfully');
        setTimer(30);
        setCanResend(false);
      } else {
        showDangerToast(response?.message || 'Failed to resend OTP');
      }
    } catch (error) {
      console.log('Resend API Error:', error?.response?.data);
      showDangerToast(error?.response?.data?.message || 'Resend Failed');
    }
  };

  return (
    <Container useGradient={true} style={styles.container}>
      <Header
        showLeftButton={true}
        onLeftButtonPress={() => navigation.goBack()}
        title=""
        backgroundColor={Colors.white}
      />
      <View
        style={[styles.container, { paddingTop: 0 }]}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: hp(3), alignItems: 'center' }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <IconView style={{ marginTop: hp(4) }} image={imagePath.otp_verify} />
          <View style={styles.textView}>
            <Text style={GlobalStyle.authScreenTitle}>Email Verification</Text>
            <Text style={GlobalStyle.authScreenSubtitle}>
              We’ve sent a verification code to your email
            </Text>
            <Text
              style={[
                GlobalStyle.authScreenSubtitle,
                { marginTop: 5 },
              ]}
            >
              {email}
            </Text>
          </View>
          <View style={styles.otpContainer}>
            <OTPTextInput
              ref={otpRef}
              inputCount={4}
              handleTextChange={code => setOtp(code)}
              tintColor={Colors.themeColor}
              offTintColor={Colors.borderGrey}
              textInputStyle={[styles.otpInput, { borderRadius: wp(5) }]}
              containerStyle={styles.otpInputContainer}
              autoFocus
              inputCellLength={1}
              numericKeyboard
            />
          </View>

          <AppButton
            loading={isLoading}
            marginTop={hp(2)}
            title={'Continue'}
            onPress={handleVerifyOtp}
          />
          <TouchableOpacity
            disabled={!canResend}
            onPress={handleResendOtp}
            style={styles.bottomTextView}
          >
            <Text
              numberOfLines={1}
              style={[styles.bottomText, { color: Colors.graytext }]}
            >
              Didn’t receive code?
            </Text>
            <Text
              numberOfLines={1}
              style={[
                styles.bottomText,
                { color: canResend ? Colors.themeColor : Colors.themeColor },
              ]}
            >
              {canResend ? 'Resend' : `Resend in ${timer}s`}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Container>
  );
}

export default EmailOtpVerification;
