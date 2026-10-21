import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Switch,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import Container from '../../../../component/common/Container/Container';
import Back from '../../../../component/common/Buttons/Back';
import AppButton from '../../../../component/common/Buttons/AppButton';
import CountryPicker from 'react-native-country-picker-modal';
import ProgressBar from '../../../../component/common/UI/ProgressBar';
import LabelInput from '../../../../component/common/Inputs/LabelInput';
import DropdownInput from '../../../../component/common/Modal/DropdownInput';
import MediaPickerModal from '../../../../component/common/Modal/MediaPicker';
import Header from '../../../../component/common/UI/Header';

import { getGlobalStyles } from '../../../../GlobalStyles/GlobalStyles';
import { useTheme } from '../../../../hooks/useTheme';
import { getStyles } from './Styles';
import { imagePath } from '../../../../constant/imagePath';
import { hp, wp } from '../../../../utils/helper';
import BottomSeperator from '../../../../component/common/Seperator/BottomSeperator';
import { FontSize, FontWeight } from '../../../../constant/fonts';
import { Color } from 'react-native/types_generated/Libraries/Animated/AnimatedExports';

const StylistProfileSet = () => {
  const Colors = useTheme();
  const navigation = useNavigation();
  const GlobalStyle = getGlobalStyles(Colors);
  const styles = getStyles(Colors);

  const mediaPickerRef = useRef(null);

  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countryCode, setCountryCode] = useState('GB');
  const [callingCode, setCallingCode] = useState('44');
  const [addressLine2, setAddressLine2] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [formData, setFormData] = useState({
    profileImage: null,
    businessName: '',
    category: '',
    tagline: '',
    shortBio: '',
    longBio: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    experience: '',
    skills: [],
    skillInput: '',
    certificateImage: null,
    instagram: '',
    pinterest: '',
    youtube: '',
    website: '',
    publicProfile: true,
    showPhone: true,
    showCredentials: true,
    showSocialLinks: true,
  });

  const categoryOptions = [
    { label: 'Fashion Stylist', value: 'fashion_stylist' },
    { label: 'Wardrobe Consultant', value: 'wardrobe_consultant' },
    { label: 'Personal Shopper', value: 'personal_shopper' },
    { label: 'Editorial Stylist', value: 'editorial_stylist' },
  ];

  const handleInputChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSelectedMedia = (field, media) => {
    if (field === 'profileImage') {
      setFormData(prev => ({ ...prev, profileImage: media?.uri }));
    } else if (field === 'certificateImage') {
      setFormData(prev => ({ ...prev, certificateImage: media?.uri }));
    } else if (media && !field) {
      // Fallback
      setFormData(prev => ({ ...prev, profileImage: media?.uri }));
    }
  };

  const openMediaPicker = field => {
    if (mediaPickerRef.current) {
      mediaPickerRef.current.open(field);
    }
  };

  const addSkill = () => {
    if (formData.skillInput.trim() !== '') {
      if (!formData.skills.includes(formData.skillInput.trim())) {
        setFormData(prev => ({
          ...prev,
          skills: [...prev.skills, prev.skillInput.trim()],
          skillInput: '',
        }));
      } else {
        setFormData(prev => ({ ...prev, skillInput: '' }));
      }
    }
  };

  const removeSkill = skillToRemove => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove),
    }));
  };

  const onSave = () => {
    console.log('Saved Profile Data:', formData);
    // navigation.navigate('NextScreen');
  };

  return (
    <Container useGradient={false} style={styles.container}>
      <View style={{ flex: 1, backgroundColor: Colors.white }}>
        <Header
          showLeftButton={true}
          onLeftButtonPress={() => navigation.goBack()}
          title="Profile Setup"
          backgroundColor={Colors.white}
        />

        <View style={{ paddingHorizontal: wp(5) }}>
          <ProgressBar style={{ marginVertical: hp(2) }} progress={12.5} />
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : hp(2)}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: hp(10) }}
          >
            <View style={[styles.topText, { marginTop: hp(0) }]}>
              <Text
                style={[GlobalStyle.authScreenSubtitle, { textAlign: 'left' }]}
              >
                Tell us a little about yourself to personalize your experience.
              </Text>
            </View>
            {/* Section 1: Business Identity */}
            <Text style={styles.sectionTitle}>
              Business / Professional Identity
            </Text>
            <View style={styles.userImage}>
              <Image
                style={styles.bigImagePic}
                source={
                  formData.profileImage
                    ? { uri: formData.profileImage }
                    : imagePath.avtara
                }
              />
              <TouchableOpacity
                onPress={() => openMediaPicker('profileImage')}
                style={styles.editIcon}
              >
                <Image style={styles.icon} source={imagePath.upload_icon} />
              </TouchableOpacity>
            </View>
            <LabelInput
              title="Business Name"
              placeholder="Enter your Full Name"
              maxLength={70}
              value={formData.businessName}
              onChangeText={val => handleInputChange('businessName', val)}
            />
            <DropdownInput
              title="Professional Category"
              placeholder="Select Category"
              options={categoryOptions}
              value={formData.category}
              // onSelect={val => handleInputChange('category', val)}
              useId={false}
              dropdownPosition="bottom"
              rightIcon={imagePath.mini_arrow}
              rightIconStyle={{
                width: wp(3.8),
                height: wp(3.8),
                marginRight: wp(5),
                // paddingLeft: wp(2),
                transform: [{ rotate: '-180deg' }], // Rotate down arrow if necessary to face down (default mini_arrow might be right)
              }}
              // tintColor={Colors.red100}
              borderColor={Colors.borderGrey}
              borderRadius={wp(100)}
              selectedTextStyle={{ color: Colors.blackVar2 }}
              placeholderStyle={{ color: Colors.graytext }}
              titleStyle={{
                // color: Colors.graytext,
                fontSize: FontSize.FONT_14,
                fontWeight: FontWeight.FONT_400,
              }}
            />
            <LabelInput
              title="Tagline"
              placeholder="Enter"
              maxLength={70}
              value={formData.tagline}
              onChangeText={val => handleInputChange('tagline', val)}
            />
            <LabelInput
              title="Business Description"
              placeholder="Short Bio"
              maxLength={70}
              value={formData.shortBio}
              onChangeText={val => handleInputChange('shortBio', val)}
            />
            <LabelInput
              title=""
              showTitle={false}
              placeholder="Long Bio"
              maxLength={70}
              value={formData.longBio}
              onChangeText={val => handleInputChange('longBio', val)}
              multiline={true}
              inputHeight={hp(12)}
              centerAlign={false}
              borderRadius={wp(3)}
            />
            {/* Section 2: Contact Details */}
            <Text style={[styles.sectionTitle]}>Contact Details</Text>
            <LabelInput
              title="Email Address"
              placeholder="Enter email address"
              keyboardType="email-address"
              value={formData.email}
              onChangeText={val => handleInputChange('email', val)}
            />
            <Text style={styles.phoneTitle}>Phone Number</Text>
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
                <TextInput
                  placeholder="Enter your phone"
                  placeholderTextColor={Colors.graytext}
                  style={[
                    { flex: 1, color: Colors.text, fontSize: FontSize.FONT_14 },
                  ]}
                  onChangeText={txt =>
                    handleInputChange('phone', txt.replace(/[^0-9]/g, ''))
                  }
                  value={formData.phone}
                  maxLength={10}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <Text
              style={[
                styles.sectionTitle,
                {
                  fontSize: FontSize.FONT_15,
                  fontWeight: FontWeight.FONT_600,
                  marginTop: hp(2),
                },
              ]}
            >
              Location
            </Text>
            <View style={styles.rowInputs}>
              <LabelInput
                title=""
                showTitle={false}
                placeholder="City"
                width={wp(44)}
                inputContainerWidth={wp(42)}
                value={formData.city}
                onChangeText={val => handleInputChange('city', val)}
              />
              <LabelInput
                title=""
                showTitle={false}
                placeholder="Country"
                width={wp(44)}
                inputContainerWidth={wp(42)}
                value={formData.country}
                onChangeText={val => handleInputChange('country', val)}
              />
            </View>
            {/* Section 3: Professional Information */}
            <Text style={[styles.sectionTitle, { marginTop: hp(4) }]}>
              Professional Information
            </Text>
            <LabelInput
              title="Years of Experience"
              placeholder="Enter"
              keyboardType="numeric"
              value={formData.experience}
              onChangeText={val => handleInputChange('experience', val)}
            />
            <LabelInput
              title="Skills / Expertise"
              placeholder="Enter Tags"
              value={formData.skillInput}
              onChangeText={val => handleInputChange('skillInput', val)}
              onSubmitEditing={addSkill}
              onBlur={addSkill}
            />
            {formData.skills.length > 0 && (
              <View style={styles.tagContainer}>
                {formData.skills.map((skill, index) => (
                  <View key={index} style={styles.chip}>
                    <Text style={styles.chipText}>{skill}</Text>
                    <TouchableOpacity onPress={() => removeSkill(skill)}>
                      <Text style={styles.chipCross}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
            {/* Section 4: Certificates */}
            <Text style={[styles.sectionTitle, { marginTop: hp(4) }]}>
              Certificates / Licenses
            </Text>
            <LabelInput
              title=""
              showTitle={false}
              placeholder={formData.certificateImage ? 'Uploaded' : 'Upload'}
              editable={false}
              showRightIcon={true}
              rightIcon={imagePath.upload_icon}
              onRightIconPress={() => openMediaPicker('certificateImage')}
              type="pressable"
            />
            {/* Section 5: Social & Web Links */}
            <Text style={[styles.sectionTitle, { marginTop: hp(4) }]}>
              Social & Web Links
            </Text>
            <LabelInput
              title="Instagram Link"
              placeholder="Enter URL"
              value={formData.instagram}
              onChangeText={val => handleInputChange('instagram', val)}
            />
            <LabelInput
              title="Pinterest Link"
              placeholder="Enter URL"
              value={formData.pinterest}
              onChangeText={val => handleInputChange('pinterest', val)}
            />
            <LabelInput
              title="YouTube Link"
              placeholder="Enter URL"
              value={formData.youtube}
              onChangeText={val => handleInputChange('youtube', val)}
            />
            <LabelInput
              title="Official Website Link"
              placeholder="Enter URL"
              value={formData.website}
              onChangeText={val => handleInputChange('website', val)}
            />
            {/* Section 6: Display Preferences */}
            <Text style={[styles.sectionTitle, { marginTop: hp(4) }]}>
              Display Preferences
            </Text>
            <View style={styles.switchContainer}>
              <View style={styles.switchRowNormal}>
                <Text style={styles.switchLabel}>Public Profile</Text>
                <Switch
                  value={formData.publicProfile}
                  onValueChange={val => handleInputChange('publicProfile', val)}
                  trackColor={{
                    false: Colors.grey300,
                    true: Colors.themeColor,
                  }}
                  thumbColor={Colors.white}
                />
              </View>

              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>
                  Show Phone Number Publicly
                </Text>
                <Switch
                  value={formData.showPhone}
                  onValueChange={val => handleInputChange('showPhone', val)}
                  trackColor={{
                    false: Colors.grey300,
                    true: Colors.themeColor,
                  }}
                  thumbColor={Colors.white}
                />
              </View>

              <View style={styles.switchRowNormal}>
                <Text style={styles.switchLabel}>
                  Display Credentials & Certificates
                </Text>
                <Switch
                  value={formData.showCredentials}
                  onValueChange={val =>
                    handleInputChange('showCredentials', val)
                  }
                  trackColor={{
                    false: Colors.grey300,
                    true: Colors.themeColor,
                  }}
                  thumbColor={Colors.white}
                />
              </View>

              <View style={styles.switchRowNormal}>
                <Text style={styles.switchLabel}>Show Social Links</Text>
                <Switch
                  value={formData.showSocialLinks}
                  onValueChange={val =>
                    handleInputChange('showSocialLinks', val)
                  }
                  trackColor={{
                    false: Colors.grey300,
                    true: Colors.themeColor,
                  }}
                  thumbColor={Colors.white}
                />
              </View>
            </View>
            <BottomSeperator />
            <AppButton marginTop={hp(2)} title="Save" onPress={onSave} />
          </ScrollView>
        </KeyboardAvoidingView>

        <MediaPickerModal
          ref={mediaPickerRef}
          handleSelectedMedia={handleSelectedMedia}
        />
      </View>
    </Container>
  );
};

export default StylistProfileSet;
