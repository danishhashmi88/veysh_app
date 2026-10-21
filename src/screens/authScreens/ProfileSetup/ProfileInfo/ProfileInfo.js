/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useRef } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
  BackHandler,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useNavigation,
  useFocusEffect,
  CommonActions,
  useIsFocused,
} from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserData, resetAuthState } from '../../../../redux/slices/userSlice';
import {
  updateGlobalSliceState,
  updateInitialAppRoute,
  updateAuthInitialRoute,
} from '../../../../redux/slices/globalSlice';
import {
  saveProfileApi,
  editMyProfileApi,
  GetUserDetails,
} from '../../../../services/auth.service';
import { showSuccessToast, showDangerToast } from '../../../../utils/toast';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AUTH_TOKEN_KEY,
  USER_DATA,
  USER_ID,
  USER_ROLE,
} from '../../../../utils/storage';

import Container from '../../../../component/common/Container/Container';
import { getStyles } from './styles';
import Back from '../../../../component/common/Buttons/Back';
import Skip from '../../../../component/common/Buttons/Skip';
import { getGlobalStyles } from '../../../../GlobalStyles/GlobalStyles';
import {
  hp,
  wp,
  mapBackendUserToFrontend,
  getScreenNameFromSlug,
  toSafeString,
} from '../../../../utils/helper';
import ProgressBar from '../../../../component/common/UI/ProgressBar';
import { imagePath } from '../../../../constant/imagePath';

import { features, gender } from '../../../../constant';
import AppButton from '../../../../component/common/Buttons/AppButton';
import BottomSeperator from '../../../../component/common/Seperator/BottomSeperator';
import { useTheme } from '../../../../hooks/useTheme';
import LabelInput from '../../../../component/common/Inputs/LabelInput';
import Header from '../../../../component/common/UI/Header';

function CompleteProfile() {
  const Colors = useTheme();
  const navigation = useNavigation();
  const GlobalStyle = getGlobalStyles(Colors);
  const styles = getStyles(Colors);
  const dispatch = useDispatch();
  const { userDetails, tokenAndId } = useSelector(state => state.user);
  const [isLoading, setIsLoading] = useState(false);

  const mountedRef = useRef(false);

  useEffect(() => {
    const checkNavigation = () => {
      if (mountedRef.current) return;
      mountedRef.current = true;

      if (userDetails?.profile_slugs) {
        const nextScreen = getScreenNameFromSlug(userDetails.profile_slugs);
        console.log(
          'ProfileInfo: Checking Navigation on mount. Current: CompleteProfile, Next:',
          nextScreen,
        );

        if (nextScreen === 'HomeScreen') {
          console.log('ProfileInfo: Redirecting to HomeScreen');
          dispatch(updateInitialAppRoute('HomeScreen'));
          dispatch(updateGlobalSliceState(true));
        } else if (nextScreen && nextScreen !== 'CompleteProfile') {
          console.log('ProfileInfo: Navigating to:', nextScreen);
          navigation.navigate(nextScreen);
        }
      }
    };

    if (userDetails) {
      checkNavigation();
    }
  }, [userDetails]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    location: '',
    dob: '',
    dobISO: '',
    stylistCode: '',
  });

  const populateForm = user => {
    if (!user) return;

    console.log('ProfileInfo: Populating Form with:', user);

    setFormData(prev => ({
      ...prev,
      firstName:
        toSafeString(user.firstName || user.first_name) ||
        prev.firstName ||
        '',
      lastName:
        toSafeString(user.lastName || user.last_name) || prev.lastName || '',
      username: toSafeString(user.username) || prev.username || '',
      location:
        toSafeString(user.location || user.address) || prev.location || '',
      stylistCode:
        toSafeString(
          user.stylistCode || user.referral_code || user.stylist_referral_link,
        ) ||
        prev.stylistCode ||
        '',
      dob: user.dob
        ? moment(user.dob).format('DD/MM/YYYY')
        : user.DOB
          ? moment(user.DOB).format('DD/MM/YYYY')
          : prev.dob || '',
      dobISO: user.dobISO || user.DOB || prev.dobISO || '',
    }));

    if (user.profileImage || user.profile_image) {
      setProfileImage(user.profileImage || user.profile_image);
    }

    setProfileDetails(prev => ({
      ...prev,
      gender: user.gender || '',
      features:
        user.goals && Array.isArray(user.goals)
          ? user.goals
          : user.app_goals && Array.isArray(user.app_goals)
            ? user.app_goals
            : [],
    }));
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (tokenAndId?.token) {
        try {
          setIsLoading(true);
          const idToUse =
            tokenAndId.userId || userDetails?._id || userDetails?.id;
          console.log('ProfileInfo: Fetching user data for ID:', idToUse);

          const response = await GetUserDetails(tokenAndId.token, idToUse);

          if (response?.data) {
            const rawUser =
              response.data.user || response.data.data || response.data;
            console.log(
              'ProfileInfo: Fetched User Data Response:',
              JSON.stringify(rawUser),
            );

            if (rawUser) {
              const mappedUser = mapBackendUserToFrontend(rawUser) || {};
              // Keep Sign in with Apple / social identity fields if API omits them
              const mergedUser = {
                ...mappedUser,
                firstName:
                  toSafeString(mappedUser.firstName || mappedUser.first_name) ||
                  toSafeString(userDetails?.firstName || userDetails?.first_name) ||
                  '',
                lastName:
                  toSafeString(mappedUser.lastName || mappedUser.last_name) ||
                  toSafeString(userDetails?.lastName || userDetails?.last_name) ||
                  '',
                email:
                  toSafeString(mappedUser.email) ||
                  toSafeString(userDetails?.email) ||
                  '',
                loginProvider:
                  userDetails?.loginProvider || mappedUser.loginProvider,
                appleProvidedName:
                  userDetails?.appleProvidedName ||
                  mappedUser.appleProvidedName,
                appleProvidedEmail:
                  userDetails?.appleProvidedEmail ||
                  mappedUser.appleProvidedEmail,
              };
              dispatch(updateUserData(mergedUser));
              populateForm(mergedUser);

              console.log(
                'ProfileInfo: User data dispatched and form populated',
              );
            }
          }
        } catch (error) {
          console.log('ProfileInfo: Fetch User Data Error', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserData();
  }, [tokenAndId, dispatch]);

  useEffect(() => {
    if (userDetails && (userDetails._id || userDetails.id)) {
      console.log('ProfileInfo: Syncing Redux to Form...', userDetails);
      populateForm(userDetails);
    }
  }, [userDetails]);
  const [profileDetails, setProfileDetails] = useState({
    gender: '',
    features: [],
  });

  const [profileImage, setProfileImage] = useState(null);
  const [errors, setErrors] = useState({});

  const maxDob = moment().subtract(18, 'years').toDate();
  const [date, setDate] = useState(maxDob);
  const [openDatePicker, setOpenDatePicker] = useState(false);

  const handleInputChange = (key, value) => {
    if (key === 'username') {
      value = value.replace(/\s/g, '');
    }
    setFormData({ ...formData, [key]: value });
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const handleGenderSelect = value => {
    setProfileDetails({
      ...profileDetails,
      gender: profileDetails.gender === value ? '' : value,
    });
  };

  const handleFeatureSelect = value => {
    let newFeatures = [...profileDetails.features];
    if (newFeatures.includes(value)) {
      newFeatures = newFeatures.filter(item => item !== value);
    } else {
      newFeatures.push(value);
    }
    setProfileDetails({ ...profileDetails, features: newFeatures });
  };

  const onSelectImage = () => {
    Alert.alert('Select Profile Image', 'Choose an option', [
      {
        text: 'Camera',
        onPress: openCamera,
      },
      {
        text: 'Gallery',
        onPress: openGallery,
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const openCamera = () => {
    ImagePicker.openCamera({
      width: 400,
      height: 400,
      cropping: true,
      mediaType: 'photo',
      includeBase64: false,
    })
      .then(image => {
        console.log('Camera Image:', image);
        setProfileImage(image.path);
      })
      .catch(err => {
        console.log('Camera Error:', err);
        if (err.code !== 'E_PICKER_CANCELLED') {
          Alert.alert('Error', 'Failed to open camera');
        }
      });
  };

  const openGallery = () => {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
      mediaType: 'photo',
      includeBase64: false,
    })
      .then(image => {
        console.log('Selected Image:', image);
        setProfileImage(image.path);
      })
      .catch(err => {
        console.log('Image Picker Error:', err);
        if (err.code !== 'E_PICKER_CANCELLED') {
          Alert.alert('Error', 'Failed to pick image');
        }
      });
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};
    const nameRegex = /^[a-zA-Z\s]*$/;
    const isAppleLogin = userDetails?.loginProvider === 'apple';
    const appleAlreadyProvidedName =
      isAppleLogin &&
      !!(
        userDetails?.appleProvidedName ||
        formData.firstName?.trim() ||
        userDetails?.firstName ||
        userDetails?.first_name
      );

    // Sign in with Apple already supplies name — do not require re-entry.
    if (!appleAlreadyProvidedName) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'Please enter your First Name.';
        isValid = false;
      } else if (!nameRegex.test(formData.firstName)) {
        newErrors.firstName =
          'First Name should not contain special characters or numbers.';
        isValid = false;
      }
    } else if (
      formData.firstName &&
      !nameRegex.test(formData.firstName)
    ) {
      newErrors.firstName =
        'First Name should not contain special characters or numbers.';
      isValid = false;
    }

    if (formData.lastName && !nameRegex.test(formData.lastName)) {
      newErrors.lastName =
        'Last Name should not contain special characters or numbers.';
      isValid = false;
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Please enter a Username.';
      isValid = false;
    } else if (!/^[a-zA-Z0-9_.]*$/.test(formData.username)) {
      newErrors.username =
        'Username can only contain letters, numbers, underscore';
      isValid = false;
    } else if (formData.username.length < 4) {
      newErrors.username = 'Username must be at least 4 characters long.';
      isValid = false;
    }

    if (formData.dob || formData.dobISO) {
      const dobDate = new Date(formData.dobISO || formData.dob);
      const eighteenYearsAgo = moment().subtract(18, 'years').toDate();
      if (Number.isNaN(dobDate.getTime()) || dobDate > eighteenYearsAgo) {
        newErrors.dob = 'You must be at least 18 years old.';
        isValid = false;
      }
    }

    if (formData.location.length > 0) {
      if (!formData.location.trim()) {
        newErrors.location = 'Location cannot be empty spaces.';
        isValid = false;
      } else if (!/^[a-zA-Z0-9\s]*$/.test(formData.location)) {
        newErrors.location = 'Location should not contain special characters.';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const submitProfile = async () => {
    const data = new FormData();
    const resolvedFirstName =
      formData.firstName.trim() ||
      toSafeString(userDetails?.firstName || userDetails?.first_name);
    const resolvedLastName =
      formData.lastName.trim() ||
      toSafeString(userDetails?.lastName || userDetails?.last_name);

    data.append('first_name', resolvedFirstName);
    data.append('last_name', resolvedLastName);
    data.append('username', formData.username.trim());
    const locationValue = formData.location.trim();
    if (locationValue) {
      data.append('location', locationValue);
      data.append('address', locationValue);
    }

    const appleEmail = toSafeString(userDetails?.email);
    if (userDetails?.loginProvider === 'apple' && appleEmail) {
      data.append('email', appleEmail);
    }

    const finalDob = (formData.dobISO || formData.dob || '').trim();
    if (finalDob) {
      data.append('DOB', finalDob);
    }

    if (profileDetails.gender) {
      data.append('gender', profileDetails.gender);
    }

    const goalsList = profileDetails.features;
    if (goalsList.length > 0) {
      data.append('goals', JSON.stringify(goalsList));
      data.append('app_goals', JSON.stringify(goalsList));
    } else {
      data.append('goals', JSON.stringify([]));
    }

    data.append('referral_code', formData.stylistCode.trim());
    data.append('stylist_referral_link', formData.stylistCode.trim());

    if (profileImage && !profileImage.startsWith('http')) {
      const filename = profileImage.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      let uri = profileImage;
      if (!uri.startsWith('file://')) {
        uri = `file://${uri}`;
      }
      data.append('profile_image', {
        uri: uri,
        name: filename,
        type: type,
      });
    }

    console.log('ProfileInfo: Sending Data...', JSON.stringify(data));

    const token = tokenAndId?.token;
    if (!token) {
      console.log('ProfileInfo Error: No token found in redux');
      showDangerToast('Authentication error. Please login again.');
      return;
    }
    console.log('ProfileInfo: Using Token:', token);

    setIsLoading(true);
    try {
      let res;
      console.log('ProfileInfo: Creating/Updating profile...');
      res = await saveProfileApi(data, token);

      console.log('ProfileInfo: API Response:', res);
      setIsLoading(false);

      if (res && (res.status === true || res.success === true)) {
        const user = res.data.user;
        const mappedUser = mapBackendUserToFrontend(user);
        if (mappedUser) {
          dispatch(updateUserData(mappedUser));
        }
        navigation.navigate('BrandPreference');
      } else {
        showDangerToast(res?.message || 'Failed to save profile');
      }
    } catch (err) {
      setIsLoading(false);
      console.log('Profile Save Error', err);

      if (err.response && err.response.status === 401) {
        showDangerToast('Session expired. Please login again.');
      } else {
        const errorMsg =
          err?.response?.data?.message ||
          err?.message ||
          'Failed to save profile';
        showDangerToast('Data is already exist');
      }
    }
  };

  const onNextPress = () => {
    if (validateForm()) {
      submitProfile();
    }
  };

  const onSkipPress = () => {
    navigation.navigate('BrandPreference');
  };

  const handleBackToLogin = async () => {
    // Prefer normal back when Login is still in the auth stack
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    // App stack (or reset stack) has no Login route — clear session and open Login
    try {
      await AsyncStorage.multiRemove([
        AUTH_TOKEN_KEY,
        USER_DATA,
        USER_ID,
        USER_ROLE,
      ]);
    } catch (e) {
      console.log('ProfileInfo back clear storage error', e);
    }

    dispatch(updateInitialAppRoute('MainTab'));
    dispatch(updateAuthInitialRoute('Login'));
    dispatch(resetAuthState());
    dispatch(updateGlobalSliceState(false));
  };

  return (
    <Container>
      <View style={{ flex: 1, width: '100%', backgroundColor: Colors.white }}>
        <View style={{ flex: 1, backgroundColor: Colors.white }}>
          <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

          <Header
            showLeftButton={true}
            onLeftButtonPress={handleBackToLogin}
            title=""
            backgroundColor={Colors.white}
          />

          {/* Content Area */}
          <View style={{ flex: 1, backgroundColor: Colors.backGroundColor1 }}>
            <View style={{ width: wp(90), alignSelf: 'center' }}>
              <ProgressBar style={{ marginVertical: hp(2) }} progress={12.5} />
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
                    Profile Information
                  </Text>
                  <Text
                    style={[
                      GlobalStyle.authScreenSubtitle,
                      { textAlign: 'left' },
                    ]}
                  >
                    {userDetails?.loginProvider === 'apple'
                      ? 'Choose a username and finish your profile. Your Apple name and email are already linked.'
                      : 'Add your personal information to continue.'}
                  </Text>
                </View>

                <View style={styles.userImage}>
                  <Image
                    style={styles.bigImagePic}
                    source={
                      profileImage ? { uri: profileImage } : imagePath.avtara
                    }
                  />
                  <TouchableOpacity
                    onPress={onSelectImage}
                    style={styles.editIcon}
                  >
                    <Image style={styles.icon} source={imagePath.upload_icon} />
                  </TouchableOpacity>
                </View>

                {!(
                  userDetails?.loginProvider === 'apple' &&
                  (formData.firstName?.trim() ||
                    userDetails?.appleProvidedName ||
                    userDetails?.firstName ||
                    userDetails?.first_name)
                ) && (
                  <>
                    <LabelInput
                      title="First Name"
                      placeholder="Enter your First Name"
                      value={formData.firstName}
                      onChangeText={val => handleInputChange('firstName', val)}
                      errorText={errors.firstName}
                      maxLength={20}
                    />

                    <LabelInput
                      title="Last Name"
                      placeholder="Enter your last name"
                      maxLength={20}
                      value={formData.lastName}
                      onChangeText={val => handleInputChange('lastName', val)}
                      errorText={errors.lastName}
                    />
                  </>
                )}
                <LabelInput
                  title="Username"
                  placeholder="Enter Username (e.g. style_guru)"
                  value={formData.username}
                  onChangeText={val => handleInputChange('username', val)}
                  autoCapitalize="none"
                  errorText={errors.username}
                  maxLength={20}
                />
                <LabelInput
                  title="Location (optional)"
                  placeholder="Enter Location"
                  value={formData.location}
                  onChangeText={val => handleInputChange('location', val)}
                  errorText={errors.location}
                  maxLength={40}
                  required={false}
                />

                <LabelInput
                  title="Date of Birth (optional)"
                  placeholder="Select date of birth"
                  value={formData.dob}
                  type="calender"
                  rightIcon={imagePath.calender}
                  onRightIconPress={() => setOpenDatePicker(true)}
                  showRightIcon={true}
                  errorText={errors.dob}
                  required={false}
                />

                <View style={{ marginTop: hp(1.5) }}>
                  <Text style={styles.inputTitle}>Gender (optional)</Text>
                  <View style={styles.genderBox}>
                    {gender.map((g, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => handleGenderSelect(g.value)}
                        style={[
                          styles.genderView,
                          profileDetails.gender === g.value &&
                            styles.feartureViewActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.genderTitle,
                            profileDetails.gender === g.value &&
                              styles.genderTitleActive,
                          ]}
                        >
                          {g.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={{ marginTop: hp(1.5) }}>
                  <Text style={styles.inputTitle}>Goals on the app</Text>
                  <View style={[styles.feartureBox]}>
                    {features.map((g, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => handleFeatureSelect(g)}
                        style={[
                          styles.feartureView,
                          profileDetails.features.includes(g) &&
                            styles.feartureViewActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.genderTitle,
                            profileDetails.features.includes(g) &&
                              styles.genderTitleActive,
                          ]}
                        >
                          {g}
                        </Text>
                      </TouchableOpacity>
                    ))}
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

            <DatePicker
              maximumDate={maxDob}
              minimumDate={new Date('1900-01-01')}
              modal
              open={openDatePicker}
              date={date}
              mode="date"
              theme={Colors.theme === 'dark' ? 'dark' : 'light'}
              onConfirm={selectedDate => {
                setOpenDatePicker(false);
                setDate(selectedDate);
                const readableDate = moment(selectedDate).format('DD/MM/YYYY');
                const isoDate = selectedDate.toISOString();
                setFormData({
                  ...formData,
                  dob: readableDate,
                  dobISO: isoDate,
                });
                if (errors.dob) {
                  setErrors(prev => ({ ...prev, dob: '' }));
                }
              }}
              onCancel={() => {
                setOpenDatePicker(false);
              }}
            />
          </View>
        </View>
      </View>
    </Container>
  );
}

export default CompleteProfile;
