import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import DatePicker from 'react-native-date-picker';
import ImagePicker from 'react-native-image-crop-picker';
import moment from 'moment';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// import { useTheme } from '../../../../hooks/useTheme';
// import { imagePath } from '../../../../constant/imagePath';

// import { updateUserData } from '../../../../redux/slices/userSlice';

// import { updateInitialAppRoute } from '../../../../redux/slices/globalSlice';
import {
  saveProfileApi,
  editMyProfileApi,
  editBasicProfileApi,
} from '../../../services/auth.service';
import { showSuccessToast, showDangerToast } from '../../../utils/toast';
// import { features, gender as genderList } from '../../../../constant';

// import LabelInput from '../../../component/common/Inputs/LabelInput';

import { getEditStyles } from './styles';
// import Back from '../../../component/common/Buttons/Back'

// import { wp, hp, mapBackendUserToFrontend } from '../../../utils/helper';
import LabelInput from '../../../component/common/Inputs/LabelInput';
import Header from '../../../component/common/UI/Header';
import { useTheme } from '../../../hooks/useTheme';
import { features, gender as genderList } from '../../../constant';
import { wp, hp, mapBackendUserToFrontend } from '../../../utils/helper';
import { updateUserData } from '../../../redux/slices/userSlice';
import { updateInitialAppRoute } from '../../../redux/slices/globalSlice';
import { imagePath } from '../../../constant/imagePath';
import AppButton from '../../../component/common/Buttons/AppButton';
import { FontSize } from '../../../constant/fonts';

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const Colors = useTheme();
  const styles = getEditStyles(Colors);
  const headerOffset = insets.top + hp(8);

  const dispatch = useDispatch();
  const { userDetails, tokenAndId } = useSelector(state => state.user);
  console.log(
    'EditProfile: Redux userDetails:',
    JSON.stringify(userDetails, null, 2),
  );

  const [profileImage, setProfileImage] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [location, setLocation] = useState('');
  const [referral, setReferral] = useState('');
  const [bio, setBio] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [dob, setDob] = useState('');
  const [dobISO, setDobISO] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [locationError, setLocationError] = useState('');

  // ... (useEffect remains same)

  const maxDateLimit = moment().subtract(7, 'years').toDate();
  const [date, setDate] = useState(maxDateLimit);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (userDetails) {
      setProfileImage(userDetails.profile_image || '');
      setFirstName(userDetails.first_name || '');
      setLastName(userDetails.last_name || '');
      setUsername(userDetails.username || '');

      setLocation(userDetails.location || '');
      setReferral(userDetails.stylist_referral_link || '');
      setBio(userDetails.bio || '');
      setSelectedGender(userDetails.gender || '');
      const rawDob = userDetails.dob || userDetails.DOB || '';
      if (rawDob) {
        setDob(moment(rawDob).format('DD/MM/YYYY'));
        setDobISO(new Date(rawDob).toISOString());
      } else {
        setDob('');
        setDobISO('');
      }
      setPhone(userDetails.phone || userDetails.phonenumber || '');
      setCountryCode(userDetails.countryCode || '');

      if (userDetails.goals && Array.isArray(userDetails.goals)) {
        setSelectedGoals(userDetails.goals);
      } else {
        setSelectedGoals([features[0]]);
      }
    }
  }, [userDetails]);

  const onSelectImage = () => {
    Alert.alert('Profile Photo', 'Choose an option', [
      {
        text: 'Camera',
        onPress: () => openCamera(),
      },
      {
        text: 'Gallery',
        onPress: () => openGallery(),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const openCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 300,
      cropping: true,
      cropperCircleOverlay: true,
    })
      .then(image => {
        console.log(image);
        setProfileImage(image.path);
      })
      .catch(err => console.log('Camera Error:', err));
  };

  const openGallery = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      cropperCircleOverlay: true,
    })
      .then(image => {
        console.log(image);
        setProfileImage(image.path);
      })
      .catch(err => console.log('Gallery Error:', err));
  };

  const toggleGoal = goal => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter(item => item !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const handleSave = async () => {
    const nameRegex = /^[a-zA-Z\s]*$/;
    let isValid = true;
    let firstError = '';
    let lastError = '';

    if (!nameRegex.test(firstName)) {
      firstError =
        'First Name should not contain special characters or numbers';
      isValid = false;
    }

    if (!nameRegex.test(lastName)) {
      lastError = 'Last Name should not contain special characters or numbers';
      isValid = false;
    }

    const usernameRegex = /^[a-zA-Z0-9_.]*$/;
    let usernameErr = '';
    if (!username.trim()) {
      usernameErr = 'Please enter a Username';
      isValid = false;
    } else if (!usernameRegex.test(username)) {
      usernameErr =
        'Username can only contain letters, numbers, underscores, and dots';
      isValid = false;
    } else if (username.length < 4) {
      usernameErr = 'Username must be at least 4 characters long';
      isValid = false;
    }

    let locationErr = '';
    if (location.length > 0) {
      if (!location.trim()) {
        locationErr = 'Location cannot be empty spaces';
        isValid = false;
      } else if (!/^[a-zA-Z0-9\s]*$/.test(location)) {
        locationErr = 'Location should not contain special characters';
        isValid = false;
      }
    }

    if (dobISO) {
      const dobDate = new Date(dobISO);
      const eighteenYearsAgo = moment().subtract(18, 'years').toDate();
      if (Number.isNaN(dobDate.getTime()) || dobDate > eighteenYearsAgo) {
        showDangerToast('You must be at least 18 years old.');
        isValid = false;
      }
    }

    setFirstNameError(firstError);
    setLastNameError(lastError);
    setUsernameError(usernameErr);
    setLocationError(locationErr);

    if (!isValid) return;

    try {
      const formData = new FormData();

      formData.append('first_name', firstName);
      formData.append('last_name', lastName);
      formData.append('username', username);
      formData.append('phone_number', phone);
      formData.append('countryCode', countryCode);
      if (location.trim()) {
        formData.append('address', location.trim());
      }
      formData.append('stylist_referral_link', referral); // Mapped from referral
      formData.append('bio', bio);
      if (selectedGender) {
        formData.append('gender', selectedGender);
      }
      if (dobISO) {
        formData.append('DOB', dobISO);
      }

      // Handle array for goals - Stringified as per screenshot
      if (selectedGoals && selectedGoals.length > 0) {
        formData.append('goals', JSON.stringify(selectedGoals));
      }

      if (profileImage && !profileImage.startsWith('http')) {
        const filename = profileImage.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        let uri = profileImage;
        if (Platform.OS === 'ios' && !uri.startsWith('file://')) {
          uri = `file://${uri}`;
        }

        formData.append('profile_image', {
          uri: uri,
          name: filename,
          type: type,
        });
      }

      console.log('EditProfile: Sending Data...', JSON.stringify(formData));

      const response = await editBasicProfileApi(formData, tokenAndId?.token);
      console.log('EditProfile: API Response:', response);

      if (response?.success) {
        const user = response.data.user;
        console.log('EditProfile: Raw User Keys:', Object.keys(user));
        console.log('EditProfile: Image Values:', {
          profile_img: user.profile_img,
          profileImage: user.profileImage,
          profile_image: user.profile_image,
        });
        const mappedUser = mapBackendUserToFrontend(user);
        console.log(
          'EditProfile: Mapped User for Redux:',
          JSON.stringify(mappedUser, null, 2),
        );

        dispatch(updateUserData(mappedUser));
        dispatch(updateInitialAppRoute('HomeScreen'));

        showSuccessToast(response.message || 'Profile updated successfully');

        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'HomeScreen' }],
          });
        }
      } else {
        showDangerToast(response?.message || 'Failed to update profile');
      }
    } catch (error) {
      console.log('Profile Save Error', error);
      showDangerToast(error?.response?.data?.message || 'Error saving profile');
    }
  };

  const renderHeader = () => (
    <View style={styles.headerRow}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backBtn}
      >
        <Image
          source={imagePath.arrow_left || imagePath.backArrow}
          style={styles.backIcon}
        />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Edit Personal Information</Text>
      <View style={{ width: wp(6) }} />
    </View>
  );

  const renderProfileImage = () => (
    <View style={styles.profileContainer}>
      <View style={styles.imageWrapper}>
        <Image
          source={
            profileImage ? { uri: profileImage } : null // User requested to remove default image
          }
          style={styles.profileImg}
        />

        <TouchableOpacity style={styles.uploadBtn} onPress={onSelectImage}>
          <Image
            source={imagePath.uploadIcon}
            style={styles.uploadIcon}
            tintColor={Colors.white}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <Header
        showLeftButton={true}
        onLeftButtonPress={() => navigation.goBack()}
        title="Edit Personal Information"
        backgroundColor={Colors.white}
      />
      <KeyboardAwareScrollView
        style={{ flex: 1, backgroundColor: '#F7F6FA' }}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: hp(3) + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
        enableOnAndroid
        enableAutomaticScroll
        enableResetScrollToCoords={false}
        extraScrollHeight={hp(2)}
        extraHeight={hp(2)}
        keyboardOpeningTime={0}
        keyboardVerticalOffset={Platform.OS === 'ios' ? headerOffset : 0}
        keyboardShouldPersistTaps="handled"
      >
          {renderProfileImage()}
          <LabelInput
            title="First Name"
            placeholder="Enter your First Name"
            value={firstName}
            onChangeText={text => {
              setFirstName(text);
              if (firstNameError) setFirstNameError('');
            }}
            errorText={firstNameError}
            maxLength={20}
          />
          <LabelInput
            title="Last Name"
            placeholder="Enter your Last Name"
            value={lastName}
            onChangeText={text => {
              setLastName(text);
              if (lastNameError) setLastNameError('');
            }}
            errorText={lastNameError}
            maxLength={20}
          />

          <LabelInput
            title="Username"
            placeholder="Enter your Username"
            value={username}
            onChangeText={text => {
              setUsername(text);
              if (usernameError) setUsernameError('');
            }}
            errorText={usernameError}
            maxLength={20}
          />

          <LabelInput
            type="select"
            title="Date of Birth (optional)"
            placeholder="Select date of birth"
            value={dob}
            onRightIconPress={() => setOpen(true)}
            rightIcon={imagePath.calender}
            tintColor={Colors.iconGrey}
            required={false}
          />
          <DatePicker
            modal
            open={open}
            date={date}
            mode="date"
            minimumDate={new Date('1900-01-01')}
            maximumDate={maxDateLimit}
            onConfirm={date => {
              setOpen(false);
              setDate(date);
              setDob(moment(date).format('DD/MM/YYYY'));
              setDobISO(date.toISOString());
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />
          <LabelInput
            title="Location (optional)"
            placeholder="Enter Location"
            value={location}
            onChangeText={text => {
              setLocation(text);
              if (locationError) setLocationError('');
            }}
            errorText={locationError}
            maxLength={50}
            required={false}
          />
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gender (optional)</Text>
            <View style={styles.genderRow}>
              {genderList.length > 0 ? (
                genderList.map((item, index) => {
                  const isActive = selectedGender === item.value;
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.genderBtn,
                        isActive && styles.genderBtnActive,
                      ]}
                      onPress={() =>
                        setSelectedGender(prev =>
                          prev === item.value ? '' : item.value,
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.genderText,
                          isActive && styles.genderTextActive,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })
              ) : (
                <Text style={styles.noData}>No data found</Text>
              )}
            </View>
          </View>
          {/* <LabelInput
            title="Stylist Referral Link (optional)"
            placeholder="Enter Stylist Referral Link"
            value={referral}
            onChangeText={setReferral}
            inputHeight={hp(6)}
            inputContainerWidth="100%"
            width="100%"
            maxLength={100}
          /> */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Goals on the app</Text>
            <View style={styles.goalsContainer}>
              {features.length > 0 ? (
                features.map((goal, index) => {
                  const isSelected = selectedGoals.includes(goal);
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.goalChip,
                        isSelected && styles.goalChipActive,
                      ]}
                      onPress={() => toggleGoal(goal)}
                    >
                      <Text
                        style={[
                          styles.goalText,
                          isSelected && styles.goalTextActive,
                        ]}
                      >
                        {goal}
                      </Text>
                    </TouchableOpacity>
                  );
                })
              ) : (
                <Text style={styles.noData}>No data found</Text>
              )}
            </View>
          </View>
          <LabelInput
            title="Bio"
            placeholder="Enter your Bio"
            value={bio}
            onChangeText={setBio}
            inputHeight={hp(12)}
            multiline={true}
            maxLength={200}
            style={{
              textAlignVertical: 'top',
            }}
          />
          <AppButton title="Save" onPress={handleSave} marginTop={hp(3)} />
      </KeyboardAwareScrollView>
    </View>
  );
};

export default EditProfileScreen;
