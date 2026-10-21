import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  StyleSheet,
  StatusBar,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../../component/common/UI/Header';
import LabelInput from '../../../component/common/Inputs/LabelInput';
import AppButton from '../../../component/common/Buttons/AppButton';
import { Colors } from '../../../constant/colors';
import { hp, wp } from '../../../utils/helper';
import { showDangerToast, showSuccessToast } from '../../../utils/toast';
import { FontSize, FontFamily } from '../../../constant/fonts';

const ChangePassword = () => {
  const navigation = useNavigation();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setNewPasswordError('');
    setConfirmPasswordError('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      showDangerToast('Please fill all fields');
      return;
    }

    if (oldPassword.trim() === newPassword.trim()) {
      const message = 'New password must be different from your old password';
      setNewPasswordError(message);
      showDangerToast(message);
      return;
    }

    if (newPassword !== confirmPassword) {
      const message = 'New password and confirm password do not match';
      setConfirmPasswordError(message);
      showDangerToast(message);
      return;
    }

    try {
      setLoading(true);
      // Mocking API call for now as the change password endpoint is unknown or handled elsewhere
      setTimeout(() => {
        showSuccessToast('Password changed successfully');
        setLoading(false);
        navigation.goBack();
      }, 1000);
    } catch (error) {
      setLoading(false);
      showDangerToast('Failed to change password');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.backGroundColor1 }}>
      <Header
        showLeftButton={true}
        leftButtonBgColor={Colors.backGroundColor1}
        title="Change Password"
        headerTextStyle={{
          fontSize: FontSize.FONT_26,
        }}
        backgroundColor={Colors.white}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={styles.keyboardView}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.inputContainer}>
            <LabelInput
              title="Old Password"
              placeholder="Enter old password"
              value={oldPassword}
              onChangeText={setOldPassword}
              secureTextEntry={true}
            //fontSize={FontSize.FONT_20}
            />
          </View>

          <View style={styles.inputContainer}>
            <LabelInput
              title="New Password"
              placeholder="Enter new password"
              value={newPassword}
              onChangeText={text => {
                setNewPassword(text);
                if (newPasswordError) {
                  setNewPasswordError('');
                }
              }}
              secureTextEntry={true}
              errorText={newPasswordError}
            />
          </View>

          <View style={styles.inputContainer}>
            <LabelInput
              title="Confirm New Password"
              placeholder="Enter confirm new password"
              value={confirmPassword}
              onChangeText={text => {
                setConfirmPassword(text);
                if (confirmPasswordError) {
                  setConfirmPasswordError('');
                }
              }}
              secureTextEntry={true}
              errorText={confirmPasswordError}
            />
          </View>
        </ScrollView>

        <View style={styles.bottomButtonContainer}>
          <AppButton title="Save" loading={loading} onPress={handleSubmit} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  keyboardView: {
    flex: 1,
    backgroundColor: Colors.backGroundColor1,
  },
  scrollContent: {
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
    paddingBottom: hp(5),
  },
  inputContainer: {
    marginBottom: hp(0.5),
  },
  bottomButtonContainer: {
    paddingHorizontal: wp(4),
    paddingBottom: Platform.OS === 'ios' ? hp(2) : hp(4),
    backgroundColor: Colors.backGroundColor1,
  },
});
