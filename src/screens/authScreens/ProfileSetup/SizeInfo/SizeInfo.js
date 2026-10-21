/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { FontSize, FontWeight } from '../../../../constant/fonts';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserData } from '../../../../redux/slices/userSlice';
import {
  saveSizeInfoApi,
  GetUserDetails,
} from '../../../../services/auth.service';
import { showSuccessToast, showDangerToast } from '../../../../utils/toast';

import Container from '../../../../component/common/Container/Container';
import { getStyles } from './styles';
import Back from '../../../../component/common/Buttons/Back';
import { getGlobalStyles } from '../../../../GlobalStyles/GlobalStyles';
import { hp, wp, mapBackendUserToFrontend } from '../../../../utils/helper';
import ProgressBar from '../../../../component/common/UI/ProgressBar';
import AppButton from '../../../../component/common/Buttons/AppButton';
import BottomSeperator from '../../../../component/common/Seperator/BottomSeperator';
import { useTheme } from '../../../../hooks/useTheme';
import { imagePath } from '../../../../constant/imagePath';
import Skip from '../../../../component/common/Buttons/Skip';
import Header from '../../../../component/common/UI/Header';
import SizeDropdown from '../../../../component/common/Inputs/SizeDropdown';
import {
  shirtSizeOptions,
  trouserSizeOptions,
  shoeSizeOptions,
  wristSizeOptions,
  bustOptions,
  waistOptions,
  heightOptions,
  shoulderOptions,
} from '../../../../constant/index';

function SizeInfo() {
  const Colors = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { userDetails, tokenAndId } = useSelector(state => state.user);
  const [isLoading, setIsLoading] = useState(false);

  const GlobalStyle = getGlobalStyles(Colors);
  const styles = getStyles(Colors);

  const [inputData, setInputData] = useState({
    shirtSize: '',
    trouserSize: '',
    shoeSize: '',
    wristSize: '',
    bust: '',
    waist: '',
    height: '',
    shoulder: '',
  });

  useEffect(() => {
    if (userDetails) {
      console.log(
        'SizeInfo: Prefilling with userDetails:',
        JSON.stringify(userDetails),
      );
      const savedSizes =
        userDetails.sizes || userDetails.stylePreferences?.sizes || {};

      const savedMeasurements =
        userDetails.measurement ||
        userDetails.measurements ||
        userDetails.stylePreferences?.measurements ||
        {};

      console.log('SizeInfo: Found Saved Measurements:', savedMeasurements);

      setInputData(prev => ({
        ...prev,
        shirtSize: savedSizes.shirt_size || '',
        trouserSize: savedSizes.trouser_size || '',
        shoeSize: savedSizes.shoe_size || '',
        wristSize: savedSizes.wrist_size || '',
        bust: savedMeasurements.bust || '',
        waist: savedMeasurements.waist || '',
        height: savedMeasurements.height || '',
        shoulder: savedMeasurements.shoulder || '',
      }));
    }
  }, [userDetails]);

  const handleInputChange = (key, value) => {
    setInputData(prev => ({ ...prev, [key]: value }));
  };

  const constructPayload = () => {
    return {
      sizes: {
        shirt_size: inputData.shirtSize,
        trouser_size: inputData.trouserSize,
        shoe_size: inputData.shoeSize,
        wrist_size: inputData.wristSize,
      },
      measurement: {
        bust: inputData.bust,
        height: inputData.height,
        shoulder: inputData.shoulder,
        waist: inputData.waist,
      },
    };
  };

  const handleSaveSizeInfo = async payload => {
    setIsLoading(true);
    console.log('SizeInfo: Sending Payload:', JSON.stringify(payload));

    try {
      const res = await saveSizeInfoApi(payload, tokenAndId?.token);
      setIsLoading(false);
      console.log('SizeInfo Response:', res);

      if (res?.success || res?.status) {
        const updatedUserPart = {
          sizes: payload.sizes,
          measurement: payload.measurement,
        };
        dispatch(updateUserData(updatedUserPart));
        navigation.navigate('PersonalApperence');
      } else {
        showDangerToast(res?.message || 'Failed to save size info');
      }
    } catch (err) {
      setIsLoading(false);
      console.log('SizeInfo Save Error', err);
      showDangerToast('Failed to save size info');
    }
  };

  const onNextPress = () => {
    const payload = constructPayload();
    handleSaveSizeInfo(payload);
  };

  const onSkipPress = () => {
    console.log(' Skipped Size Info');
    navigation.navigate('PersonalApperence');
  };

  return (
    <Container>
      <View style={{ flex: 1, width: '100%', backgroundColor: '#FFFFFF' }}>
        <View
          style={{ flex: 1, backgroundColor: '#FFFFFF' }}
        >
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

          <Header
            showLeftButton={true}
            onLeftButtonPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              } else {
                navigation.reset({
                  index: 1,
                  routes: [
                    { name: 'CompleteProfile' },
                    { name: 'BrandPreference' },
                  ],
                });
              }
            }}
            title=""
            backgroundColor={Colors.white}
            rightComponent={<Skip onPress={onSkipPress} />}
          />

          {/* Content Area */}
          <View style={{ flex: 1, backgroundColor: '#F7F6FA' }}>
            <View style={{ width: wp(90), alignSelf: 'center' }}>
              <ProgressBar
                style={{ marginVertical: hp(2) }}
                progress={12.5 * 3}
              />
            </View>
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : hp(2)}
            >
              <ScrollView
                contentContainerStyle={{
                  paddingBottom: hp(3),
                  width: wp(90),
                  alignSelf: 'center',
                }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <View style={[styles.topText, { alignSelf: 'flex-start' }]}>
                  <Text style={GlobalStyle.authScreenTitle}>
                    Size Information
                  </Text>
                  <Text
                    style={[
                      GlobalStyle.authScreenSubtitle,
                      { textAlign: 'left' },
                    ]}
                  >
                    Enter your sizes and measurements for accurate styling.
                  </Text>
                </View>

                <View style={styles.midBox}>
                  <Text style={styles.inputTitle}>Sizes</Text>
                  <View style={styles.inputs}>
                    <SizeDropdown
                      data={shirtSizeOptions}
                      onChange={val => handleInputChange('shirtSize', val)}
                      value={inputData.shirtSize}
                      title="Shirt Size"
                      placeholder="Select"
                      width={wp(44)}
                      style={{ alignSelf: 'center' }}
                    />
                    <SizeDropdown
                      data={trouserSizeOptions}
                      onChange={val => handleInputChange('trouserSize', val)}
                      value={inputData.trouserSize}
                      title="Trouser Size"
                      placeholder="Select"
                      width={wp(44)}
                      style={{ alignSelf: 'center' }}
                    />
                  </View>
                  <View style={styles.inputs}>
                    <SizeDropdown
                      data={shoeSizeOptions}
                      onChange={val => handleInputChange('shoeSize', val)}
                      value={inputData.shoeSize}
                      title="Shoe Size (UK)"
                      placeholder="Select"
                      width={wp(44)}
                      style={{ alignSelf: 'center' }}
                    />
                    <SizeDropdown
                      data={wristSizeOptions}
                      onChange={val => handleInputChange('wristSize', val)}
                      value={inputData.wristSize}
                      title="Wrist Size"
                      placeholder="Select"
                      width={wp(44)}
                      style={{ alignSelf: 'center' }}
                    />
                  </View>
                </View>

                <View style={styles.midBox}>
                  <Text style={styles.inputTitle}>Measurements / in</Text>
                  <View style={styles.inputs}>
                    <SizeDropdown
                      data={bustOptions}
                      onChange={val => handleInputChange('bust', val)}
                      value={inputData.bust}
                      title="Bust"
                      placeholder="Select"
                      width={wp(44)}
                      style={{ alignSelf: 'center' }}
                    />
                    <SizeDropdown
                      data={waistOptions}
                      onChange={val => handleInputChange('waist', val)}
                      value={inputData.waist}
                      title="Waist"
                      placeholder="Select"
                      width={wp(44)}
                      style={{ alignSelf: 'center' }}
                    />
                  </View>
                  <View style={styles.inputs}>
                    <SizeDropdown
                      data={heightOptions}
                      onChange={val => handleInputChange('height', val)}
                      value={inputData.height}
                      title="Height"
                      placeholder="Select"
                      width={wp(44)}
                      style={{ alignSelf: 'center' }}
                    />
                    <SizeDropdown
                      data={shoulderOptions}
                      onChange={val => handleInputChange('shoulder', val)}
                      value={inputData.shoulder}
                      title="Shoulder"
                      placeholder="Select"
                      width={wp(44)}
                    />
                  </View>
                </View>
                <BottomSeperator />
                <AppButton
                  loading={isLoading}
                  marginTop={hp(3)}
                  marginBottom={Platform.OS === 'android' ? hp(4) : hp(2)}
                  title={'Next'}
                  onPress={onNextPress}
                />
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </View>
      </View>
    </Container>
  );
}

export default SizeInfo;
