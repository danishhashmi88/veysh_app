import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { styles } from './styles';
import Container from '../../../component/common/Container/Container';
import { SafeAreaView } from 'react-native-safe-area-context';
import { imagePath } from '../../../constant/imagePath';
import AppButton from '../../../component/common/Buttons/AppButton';
import { hp } from '../../../utils/helper';
import Header from '../../../component/common/UI/Header';
import { getGlobalStyles } from '../../../GlobalStyles/GlobalStyles';
import LabelInput from '../../../component/common/Inputs/LabelInput';
import { useNavigation, useRoute } from '@react-navigation/native';
import IconView from '../../../component/Auth/IconView';
import { useTheme } from '../../../hooks/useTheme';
import { resetPasswordApi } from '../../../services/auth.service';
// import { showMessage } from 'react-native-flash-message';
import { showDangerToast, showSuccessToast } from '../../../utils/toast';
import { FontWeight } from '../../../constant/fonts';

function ResetPass() {
  const navigation = useNavigation();
  const route = useRoute();
  const { email, token } = route.params || {};
  const Colors = useTheme();
  const GlobalStyle = getGlobalStyles(Colors);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const handleResetPass = async () => {
    if (!password || !confirmPassword) {
      showDangerToast('Please enter all fields');
      return;
    }
    if (password !== confirmPassword) {
      showDangerToast('Passwords do not match');
      return;
    }

    // Password Validation
    if (password.length < 8) {
      showDangerToast('Password must be at least 8 characters long');
      return;
    }
    if (!/[A-Z]/.test(password)) {
      showDangerToast('Password must contain at least one uppercase letter');
      return;
    }
    if (!/[a-z]/.test(password)) {
      showDangerToast('Password must contain at least one lowercase letter');
      return;
    }
    if (!/\d/.test(password)) {
      showDangerToast('Password must contain at least one number');
      return;
    }
    if (!/[@$!%*?&]/.test(password)) {
      showDangerToast(
        'Password must contain at least one special character (@$!%*?&)',
      );
      return;
    }

    /////////////////////////////////////////resetPassword //Payload data
    setIsLoading(true);
    try {
      const payload = {
        validate_string: token,
        new_password: password,
        c_password: confirmPassword,
      };

      const response = await resetPasswordApi(payload);

      if (
        response?.success === true ||
        response?.status === 200 ||
        response?.message === 'Password reset successfully'
      ) {
        showSuccessToast(response?.message || 'Password Reset Successfully');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      } else {
        let errorMsg = response?.message || 'Reset Failed';

        // Handle express-validator array of errors inside response.error
        if (Array.isArray(response?.error) && response.error.length > 0) {
          const messages = response.error
            .map(err => err?.msg || err)
            .filter(Boolean);
          if (messages.length > 0) {
            errorMsg = messages.join('\n');
          }
        } else if (response?.error && typeof response.error === 'string') {
          errorMsg = response.error;
        }

        showDangerToast(errorMsg);
      }
    } catch (error) {
      console.log('Reset Pass Error', error?.response?.data || error);

      const errorData = error?.response?.data || error;
      let errorMsg =
        errorData?.message ||
        errorData?.error ||
        errorData?.msg ||
        error?.message ||
        'Something went wrong';

      // Re-handle array in catch block
      if (Array.isArray(errorData?.error) && errorData.error.length > 0) {
        const messages = errorData.error
          .map(err => err?.msg || err)
          .filter(Boolean);
        if (messages.length > 0) {
          errorMsg = messages.join('\n');
        }
      } else if (typeof errorMsg === 'object') {
        if (Array.isArray(errorMsg)) {
          errorMsg =
            errorMsg
              .map(err => err?.msg || err)
              .filter(Boolean)
              .join('\n') || JSON.stringify(errorMsg);
        } else {
          errorMsg = JSON.stringify(errorMsg);
        }
      }

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
          <IconView style={{ marginTop: hp(4) }} image={imagePath.resetPass} />
          <View style={styles.textView}>
            <Text style={GlobalStyle.authScreenTitle}>Reset Password</Text>
            <Text style={GlobalStyle.authScreenSubtitle}>
              Enter a new password to continue.
            </Text>
          </View>
          <LabelInput
            onChangeText={txt => setPassword(txt)}
            value={password}
            title="New Password"
            placeholder="Enter your password"
            titleStyle={{
              color: Colors.black,
            }}
            secureTextEntry
          />
          <LabelInput
            onChangeText={txt => setConfirmPassword(txt)}
            value={confirmPassword}
            title="Confirm New Password"
            placeholder="Enter your password"
            titleStyle={{
              color: Colors.black,
            }}
            secureTextEntry
          />
          <AppButton
            isLoading={isLoading}
            marginTop={hp(3)}
            title={'Reset'}
            onPress={handleResetPass}
          />
        </ScrollView>
      </View>
    </Container>
  );
}

export default ResetPass;
