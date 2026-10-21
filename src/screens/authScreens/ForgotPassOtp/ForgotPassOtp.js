import React, { useRef, useState, useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import OTPTextInput from 'react-native-otp-textinput';
import { styles } from '../OtpVerification/styles';
import Container from '../../../component/common/Container/Container';
import { SafeAreaView } from 'react-native-safe-area-context';
import { imagePath } from '../../../constant/imagePath';
import AppButton from '../../../component/common/Buttons/AppButton';
import { hp, wp } from '../../../utils/helper';
import Back from '../../../component/common/Buttons/Back';
import { getGlobalStyles } from '../../../GlobalStyles/GlobalStyles';
import IconView from '../../../component/Auth/IconView';
import { useTheme } from '../../../hooks/useTheme';
import Header from '../../../component/common/UI/Header';
import { FontWeight } from '../../../constant/fonts';
import { useNavigation, useRoute } from '@react-navigation/native';
// import { showMessage } from 'react-native-flash-message';
import { showDangerToast, showSuccessToast } from '../../../utils/toast';
import Axios from '../../../utils/axios';
import { buyerRouteName } from '../../../constant';
import {
  forgotPasswordApi,
  verifyOtpApi,
} from '../../../services/auth.service';

function ForgotPassOtp() {
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params || {};

  const otpRef = useRef(null);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const Colors = useTheme();
  const GlobalStyle = getGlobalStyles(Colors);

  // Debugging Type
  const API_TYPE = 'password_reset';

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

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 4) {
      showDangerToast('Please enter a valid OTP');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        otp: otp,
        type: API_TYPE,
        email: email,
      };
      console.log('--- OTP VERIFICATION DEBUG ---');
      console.log('Payload:', JSON.stringify(payload));

      let response = await verifyOtpApi(payload);
      console.log('Response:', JSON.stringify(response));

      // --- SILENT FALLBACK FOR STYLISTS ---
      // Since we removed the role from the UI, the default is 'user'.
      // If the backend says "User not found", it might be a stylist. Let's retry silently.
      if (
        !response?.success &&
        (response?.message === 'User not found' ||
          response?.data?.message === 'User not found')
      ) {
        console.log('User not found. Retrying silently as stylist...');
        const stylistPayload = { ...payload, role: 'stylist' };
        response = await verifyOtpApi(stylistPayload);
        console.log('Stylist Retry Response:', JSON.stringify(response));
      }

      if (
        response?.success ||
        response?.status === 200 ||
        response?.data?.validate_string ||
        response?.data?.token ||
        response?.token
      ) {
        showSuccessToast('Verification Successful!');

        console.log(
          'Header Verify OTP Response:',
          JSON.stringify(response, null, 2),
        );
        const tokenToPass =
          response?.data?.validate_string ||
          response?.data?.token ||
          response?.token ||
          'mock_token';

        console.log('Extracted Token:', tokenToPass);

        navigation.navigate('ResetPass', {
          email,
          token: tokenToPass,
        });
      } else {
        const errorMsg =
          response?.message || response?.data?.message || 'Invalid OTP';
        console.log('Verification Failed Message:', errorMsg);
        showDangerToast(errorMsg);
      }
    } catch (error) {
      console.log('OTP Verification Catch Error', error);
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
      console.log('--- RESEND OTP DEBUG ---');
      console.log('Calling forgotPasswordApi for resend');

      const response = await forgotPasswordApi({ email: email.toLowerCase() });
      console.log('Resend Response:', JSON.stringify(response));

      if (
        response?.success ||
        response?.status === 200 ||
        response?.status === true
      ) {
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
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: hp(3), alignItems: 'center' }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <IconView style={{ marginTop: hp(4) }} image={imagePath.otp_verify} />
          <View style={styles.textView}>
            <Text style={GlobalStyle.authScreenTitle}>Verification</Text>
            <Text style={GlobalStyle.authScreenSubtitle}>
              Enter the code sent to your email to reset your password.
            </Text>
            <Text
              style={[
                GlobalStyle.authScreenSubtitle,
                { fontWeight: FontWeight.FONT_700, marginTop: 5 },
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
              textInputStyle={styles.otpInput}
              containerStyle={styles.otpInputContainer}
              autoFocus
              inputCellLength={1}
              borderRadius={wp(4)}
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
                { color: canResend ? Colors.themeColor : Colors.graytext },
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

export default ForgotPassOtp;
