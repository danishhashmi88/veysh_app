/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserData } from '../../../../redux/slices/userSlice';
import { updateGlobalSliceState } from '../../../../redux/slices/globalSlice';
import {
  savePrivacySettingsApi,
  GetUserDetails,
} from '../../../../services/auth.service';
import { showSuccessToast, showDangerToast } from '../../../../utils/toast';
import Container from '../../../../component/common/Container/Container';
import { getStyles } from './styles';
import Back from '../../../../component/common/Buttons/Back';
import Skip from '../../../../component/common/Buttons/Skip';
import Header from '../../../../component/common/UI/Header';
import { getGlobalStyles } from '../../../../GlobalStyles/GlobalStyles';
import { hp, mapBackendUserToFrontend, wp } from '../../../../utils/helper';
import ProgressBar from '../../../../component/common/UI/ProgressBar';
import AppButton from '../../../../component/common/Buttons/AppButton';
import BottomSeperator from '../../../../component/common/Seperator/BottomSeperator';
import { useTheme } from '../../../../hooks/useTheme';
import TextSwitch from '../../../../component/Settings/TextSwitch';

function PrivacySetting() {
  const navigation = useNavigation();
  const Colors = useTheme();
  const GlobalStyle = getGlobalStyles(Colors);
  const styles = getStyles(Colors);

  const dispatch = useDispatch();
  const { userDetails, tokenAndId } = useSelector(state => state.user);
  const [isLoading, setIsLoading] = useState(false);

  const [privacySettings, setPrivacySettings] = useState({
    onlyMe: true,
    followersOnly: false,
    allowSuggestions: true,
    isPublic: false,
  });

  // Fetch Fresh Data
  useEffect(() => {
    const fetchUserData = async () => {
      if (tokenAndId?.token && !userDetails?._id) {
        try {
          const response = await GetUserDetails(tokenAndId.token);
          if (response?.data?.user) {
            const mappedUser = mapBackendUserToFrontend(response.data.user);
            dispatch(updateUserData(mappedUser));
          }
        } catch (error) {
          console.log('PrivacySetting: Fetch Error', error);
        }
      }
    };
    fetchUserData();
  }, [tokenAndId]);

  // Populate State
  useEffect(() => {
    if (userDetails) {
      const visibility =
        userDetails.visibility ||
        (userDetails.stylePreferences &&
          userDetails.stylePreferences.visibility);
      const allowSuggestions =
        userDetails.allow_suggestions ||
        (userDetails.stylePreferences &&
          userDetails.stylePreferences.allow_suggestions);

      if (visibility) {
        setPrivacySettings(prev => ({
          ...prev,
          onlyMe: visibility === 'private',
          followersOnly: visibility === 'stylist',
        }));
      }
      if (allowSuggestions !== undefined) {
        setPrivacySettings(prev => ({
          ...prev,
          allowSuggestions: !!allowSuggestions,
        }));
      }
      if (userDetails.isPublic !== undefined) {
        setPrivacySettings(prev => ({
          ...prev,
          isPublic: !!userDetails.isPublic,
        }));
      }
    }
  }, [userDetails]);

  const handleOnlyMe = val => {
    setPrivacySettings({
      ...privacySettings,
      onlyMe: val,
      followersOnly: val ? false : privacySettings.followersOnly,
    });
  };

  const handleFollowersOnly = val => {
    setPrivacySettings({
      ...privacySettings,
      followersOnly: val,
      onlyMe: val ? false : privacySettings.onlyMe,
    });
  };

  const handleSuggestions = val => {
    setPrivacySettings({ ...privacySettings, allowSuggestions: val });
  };

  const handleIsPublic = val => {
    setPrivacySettings({
      ...privacySettings,
      isPublic: val,
      onlyMe: val ? false : privacySettings.onlyMe,
      followersOnly: val ? false : privacySettings.followersOnly,
    });
  };

  const onNextPress = async () => {
    const currentPrefs = userDetails?.stylePreferences || {};
    const privacyData = {
      visibility: privacySettings.onlyMe ? 'private' : 'stylist',
      allow_suggestions: privacySettings.allowSuggestions,
    };

    const updatedPrefs = {
      ...currentPrefs,
      ...privacyData,
    };

    const firstName = userDetails?.firstName || userDetails?.first_name || '';

    const mappedPrefs = {
      ...updatedPrefs,

      shirtSize: updatedPrefs.shirt_size,
      trouserSize: updatedPrefs.trouser_size,
      shoeSize: updatedPrefs.shoe_size,
      wristSize: updatedPrefs.wrist_size,
      bust: updatedPrefs.bust,
      waist: updatedPrefs.waist,
      hip: updatedPrefs.hip,
      circumference: updatedPrefs.circumference,
      height: updatedPrefs.height,
      inseam: updatedPrefs.inseam,
      shoulder: updatedPrefs.shoulder,

      bodyType: updatedPrefs.body_type,
      hairColor: updatedPrefs.hair_color,
      hairType: updatedPrefs.hair_type,
      eyeColor: updatedPrefs.eye_color,
      faceShape: updatedPrefs.face_shape,
      complexion: updatedPrefs.complexion,
      bodyPhotos: updatedPrefs.body_photos,

      selectedBrands:
        updatedPrefs.preferred_brands || updatedPrefs.brands || [],

      colors: updatedPrefs.colors || updatedPrefs.preferred_colors || [],

      visibility: privacyData.visibility,
      allow_suggestions: privacyData.allow_suggestions,
    };

    const payload = {
      closetPrivacy: privacySettings.onlyMe ? 'ONLY_ME' : (privacySettings.followersOnly ? 'STYLIST_ONLY' : 'PUBLIC'),
      isPublic: privacySettings.isPublic,
      privacy_settings: {
        only_me: privacySettings.onlyMe,
        followers_only: privacySettings.followersOnly,
        closet: true,
        post: true
      },
      notification_settings: userDetails?.notification_settings || {
        push: {
          outfit_reminders: true,
          new_messages: true,
          posts_with_mention: true,
          posts_from_follow: true,
          bae_notifications: true,
          likes: true,
          comments: true,
        },
        email: {
          outfit_reminders: true,
          likes_comments: true,
          new_messages: true,
          posts_with_mention: true,
          posts_from_follow: true,
          bae_notifications: true,
          likes: true,
          comments: true,
        },
      },
      first_name: firstName,
      ...mappedPrefs,
    };

    try {
      setIsLoading(true);
      console.log('PrivacySetting: Current State:', privacySettings);
      console.log('PrivacySetting: Payload prepared:', payload);
      console.log('PrivacySetting: Token:', tokenAndId?.token);

      const response = await savePrivacySettingsApi(payload, tokenAndId?.token);
      console.log('PrivacySetting: API Response:', response);

      if (response?.success || response?.status) {
        dispatch(updateUserData({ stylePreferences: updatedPrefs }));
        navigation.navigate('ThankYou');
      } else {
        showDangerToast(response?.message || 'Failed to save settings');
      }
    } catch (error) {
      console.log('Privacy/Style Save Error', error);
      showDangerToast('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
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
                navigation.navigate('DefineYourStyle');
              }
            }}
            title=""
            backgroundColor={Colors.white}
            rightComponent={
              <Skip onPress={() => navigation.navigate('ThankYou')} />
            }
          />

          {/* Content Area */}
          <View style={{ flex: 1, backgroundColor: '#F7F6FA' }}>
            <View style={{ width: wp(90), alignSelf: 'center' }}>
              <ProgressBar style={{ marginVertical: hp(2) }} progress={100} />
            </View>
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : hp(2)}
            >
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                  paddingBottom: hp(5),
                  width: wp(90),
                  alignSelf: 'center',
                }}
                showsVerticalScrollIndicator={false}
              >
                <View style={[styles.topText, { alignSelf: 'flex-start' }]}>
                  <Text style={GlobalStyle.authScreenTitle}>
                    Privacy Settings
                  </Text>
                  <Text
                    style={[
                      GlobalStyle.authScreenSubtitle,
                      { textAlign: 'left' },
                    ]}
                  >
                    Control your privacy and account visibility.
                  </Text>
                </View>

                <View style={styles.switchView}>
                  <TextSwitch
                    label="Private"
                    description="Outfit remains fully private"
                    value={privacySettings.onlyMe}
                    onValueChange={handleOnlyMe}
                    useShadow={false}
                    style={{
                      backgroundColor: Colors.white,
                      borderWidth: 1,
                      borderColor: Colors.borderGrey,
                    }}
                  />

                  <TextSwitch
                    label="Followers only"
                    description="Followers can view outfit items"
                    value={privacySettings.followersOnly}
                    onValueChange={handleFollowersOnly}
                    useShadow={false}
                    style={{
                      backgroundColor: Colors.white,
                      borderWidth: 1,
                      borderColor: Colors.borderGrey,
                    }}
                  />

                  <TextSwitch
                    label="Public"
                    description="Anyone can view your profile and outfits"
                    value={privacySettings.isPublic}
                    onValueChange={handleIsPublic}
                    useShadow={false}
                    style={{
                      backgroundColor: Colors.white,
                      borderWidth: 1,
                      borderColor: Colors.borderGrey,
                    }}
                  />

                  {/* <TextSwitch
                  label="Stylist Only"
                  description="Stylist can view closet and plan outfits"
                  value={privacySettings.followersOnly}
                  onValueChange={handleFollowersOnly}
                  useShadow={false}
                  style={{
                    backgroundColor: Colors.cardBg,
                    borderWidth: 2,
                    borderColor: privacySettings.followersOnly
                      ? Colors.themeColor
                      : Colors.lightBorder,
                  }}
                /> */}
                </View>
                <BottomSeperator />
              </ScrollView>

              <View
                style={{
                  paddingTop: hp(2),
                  paddingBottom: hp(3.5),
                  backgroundColor: 'transparent',
                  width: wp(90),
                  alignSelf: 'center',
                }}
              >
                <AppButton
                  loading={isLoading}
                  title={'Continue'}
                  onPress={onNextPress}
                />
              </View>
            </KeyboardAvoidingView>
          </View>
        </View>
      </View>
    </Container>
  );
}

export default PrivacySetting;
