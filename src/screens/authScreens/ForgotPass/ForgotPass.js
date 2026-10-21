import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { styles } from './styles';
import Container from '../../../component/common/Container/Container';
import { SafeAreaView } from 'react-native-safe-area-context';
import { imagePath } from '../../../constant/imagePath';
import AppButton from '../../../component/common/Buttons/AppButton';
import { hp } from '../../../utils/helper';
import Back from '../../../component/common/Buttons/Back';
import { getGlobalStyles } from '../../../GlobalStyles/GlobalStyles';
import LabelInput from '../../../component/common/Inputs/LabelInput';
import { useNavigation, useRoute } from '@react-navigation/native';
import { forgotPasswordApi } from '../../../services/auth.service';
// import { showMessage } from 'react-native-flash-message';
import { showDangerToast, showSuccessToast } from '../../../utils/toast';
import IconView from '../../../component/Auth/IconView';
import { useTheme } from '../../../hooks/useTheme';
import { FontWeight } from '../../../constant/fonts';
import Header from '../../../component/common/UI/Header';
function ForgotPass() {
  const navigation = useNavigation();
  const Colors = useTheme();
  const route = useRoute();
  const { role } = route.params || {};
  console.log('roleee ', role);
  const GlobalStyle = getGlobalStyles(Colors);
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState('');

  const handleForgotPass = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      showDangerToast('Please enter your email');
      return;
    }
    if (!emailRegex.test(email)) {
      showDangerToast('Please enter a valid email');
      return;
    }

    setIsLoading(true);
    try {
      const response = await forgotPasswordApi({
        email: email.toLowerCase(),
        role: role,
      });
      console.log('Forgot Password Response:', JSON.stringify(response));

      // Strict check for success
      if (
        response?.status === 200 ||
        response?.success === true ||
        response?.data?.success === true
      ) {
        showSuccessToast(
          response?.message ||
          response?.data?.message ||
          'OTP Sent Successfully!',
        );
        navigation.navigate('ForgotPassOtp', {
          email: email.toLowerCase(),
          role: role,
        });
      } else {
        // Explicitly show backend error if available
        const errorMsg =
          response?.message || response?.data?.message || 'Failed to send OTP';
        showDangerToast(errorMsg);
      }
    } catch (error) {
      console.log('Forgot Password OTP Error', error);
      const errorData = error?.response?.data || error;
      const errorMsg =
        errorData?.message ||
        errorData?.error ||
        errorData?.msg ||
        error?.message ||
        'Something went wrong';
      showDangerToast(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container useGradient={true} style={styles.container}>
      <Header showLeftButton={true} title="" backgroundColor={Colors.white} />
      <View
        style={[styles.container, { paddingTop: 0 }]}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: hp(3), alignItems: 'center' }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <IconView
            style={{ marginTop: hp(4) }}
            image={imagePath.forgot_pass}
          />
          <View style={styles.textView}>
            <Text style={GlobalStyle.authScreenTitle}>Forgot Password</Text>
            <Text style={GlobalStyle.authScreenSubtitle}>
              Enter your email to reset your password
            </Text>
          </View>

          <LabelInput
            title="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={text => setEmail(text.toLowerCase())}
            keyboardType="email-address"
            autoCapitalize="none"
            titleStyle={{
              // fontWeight: FontWeight.FONT_600,
              color: Colors.black,
            }}
          // inputHeight={hp(6)}
          // phoneInputMarginTop={-2.5}
          />

          <AppButton
            isLoading={isLoading}
            marginTop={hp(3)}
            title={'Continue'}
            onPress={handleForgotPass}
          />
        </ScrollView>
      </View>
    </Container>
  );
}

export default ForgotPass;
