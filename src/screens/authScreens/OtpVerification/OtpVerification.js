import React, { useRef, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import OTPTextInput from 'react-native-otp-textinput';
import { styles } from './styles';
import Container from '../../../component/common/Container/Container';
import { SafeAreaView } from 'react-native-safe-area-context';
import { imagePath } from '../../../constant/imagePath';
import AppButton from '../../../component/common/Buttons/AppButton';
// import { Colors } from '../../../constant/colors';
import { hp, mapBackendUserToFrontend } from '../../../utils/helper';
import Back from '../../../component/common/Buttons/Back';
import Header from '../../../component/common/UI/Header';
import { useNavigation } from '@react-navigation/native';
import IconView from '../../../component/Auth/IconView';
import { useTheme } from '../../../hooks/useTheme';
import { useRoute } from '@react-navigation/native';
import { otpVerificationApi, resendApi } from '../../../services/auth.service';
// import { showMessage } from 'react-native-flash-message';
import { showDangerToast, showSuccessToast } from '../../../utils/toast';
import { useDispatch } from 'react-redux';
import {
  updateTokenData,
  updateUserData,
} from '../../../redux/slices/userSlice';
import { updateGlobalSliceState } from '../../../redux/slices/globalSlice';
import {
  AUTH_TOKEN_KEY,
  USER_ROLE,
  USER_ID,
  storeData,
} from '../../../utils/storage';

function OtpVerification() {
  const navigation = useNavigation();
  const route = useRoute();
  const { phone, email, isLogin, role } = route.params || {};
  const otpRef = useRef(null);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const dispatch = useDispatch();
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

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 4) {
      showDangerToast('Please enter a valid OTP');
      return;
    }

    setIsLoading(true);
    try {
      const apiData = {
        otp: otp,
        type: isLogin ? 'login' : 'register',
        role: role,
      };

      if (email) {
        apiData.email = email;
      } else if (phone) {
        apiData.phone = phone;
      }

      let response;
      // Bypass enabled for testing
      if (otp === '1234') {
        console.log('Using Local OTP Bypass');
        response = {
          data: {
            token: 'mock-token-12345',
            user: {
              _id: 'mock-user-id',
              role: 'buyer',
            },
            message: 'Local verification successful',
          },
        };
      } else {
        response = await otpVerificationApi(apiData);
      }

      const token = response?.data?.token || response?.token;
      const user = response?.data?.user || response?.user;

      if (token) {
        await storeData(AUTH_TOKEN_KEY, token);
        const userId = user?._id || user?.id;

        if (userId) {
          await storeData(USER_ID, userId);
        }
        await storeData(USER_ROLE, user?.role || 'buyer');
        dispatch(
          updateTokenData({ token, userId: userId, userRole: user?.role }),
        );

        const mappedUser = mapBackendUserToFrontend(user);
        dispatch(updateUserData(mappedUser));

        const isProfileComplete =
          user?.first_name && user?.stylePreferences?.visibility;

        const finalRole = user?.role || role;
        console.log('--- MOBILE OTP VERIFIED: DETERMINING ROUTE ---', {
          passedRole: role,
          apiResponseUserRole: user?.role,
          finalRoleDecided: finalRole,
        });

        if (isProfileComplete) {
          dispatch(updateGlobalSliceState(true));
          showSuccessToast('Verification Successful');
        } else {
          finalRole === 'stylist'
            ? navigation.replace('StylistProfileSet')
            : navigation.replace('CompleteProfile');
        }
      } else {
        console.log('OTP Response (No Token):', response);

        showDangerToast(
          response?.data?.message || response?.message || 'Invalid OTP',
        );
      }
    } catch (error) {
      console.log('OTP Error', error);
      showDangerToast(error?.response?.data?.message || 'Verification Failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const payload = email ? { email, role } : { phone, role };
      await resendApi(payload);
      showSuccessToast('OTP Resent Successfully');
      setTimer(30);
      setCanResend(false);
    } catch (error) {
      console.log('Resend Error', error);
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
            <Text style={GlobalStyle.authScreenTitle}>OTP Verification</Text>
            <Text style={GlobalStyle.authScreenSubtitle}>
              We’ve sent a verification code to your {email ? 'email' : 'mobile'}.
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
              Didn’t receive OTP?
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

export default OtpVerification;
