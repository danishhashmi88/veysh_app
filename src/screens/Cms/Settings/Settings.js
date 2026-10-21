import React, { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { resetAuthState } from '../../../redux/slices/userSlice';
import { updateGlobalSliceState } from '../../../redux/slices/globalSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AUTH_TOKEN_KEY,
  USER_DATA,
  USER_ID,
  USER_ROLE,
} from '../../../utils/storage';
import { clearAiDataConsent, clearAllAiDataConsent } from '../../../utils/aiConsent';

import Container from '../../../component/common/Container/Container';
import { Colors } from '../../../constant/colors';
import { styles } from './styles';
import Header from '../../../component/common/UI/Header';
import { hp, mapBackendUserToFrontend, wp } from '../../../utils/helper';
import LabelInput from '../../../component/common/Inputs/LabelInput';
import AppButton from '../../../component/common/Buttons/AppButton';
import { FontSize, FontWeight, FontFamily } from '../../../constant/fonts';
import ProfileTab from '../../../component/Profile/ProfileTab';
import { profileTab } from '../../../constant';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { imagePath } from '../../../constant/imagePath';
import LogoutModal from '../../../component/Profile/Logout';
import {
  deleteAccountApi,
  GetUserDetails,
  editPrivacySettingsApi,
} from '../../../services/auth.service';
import { showDangerToast, showSuccessToast } from '../../../utils/toast';
import Card from '../../../component/common/UI/Card';
import RowItem from '../../../component/common/UI/RowItem';
import { useSelector } from 'react-redux';
import { updateUserData } from '../../../redux/slices/userSlice';

const Settings = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { userDetails, tokenAndId } = useSelector(state => state.user);
  const actionModalRef = useRef(null);
  const [postPrivacy, setPostPrivacy] = useState(false);
  const [closetPrivacy, setClosetPrivacy] = useState(false);
  const [isPublic, setIsPublic] = useState(false);

  // Fetch Fresh Data
  React.useEffect(() => {
    const fetchUserData = async () => {
      if (tokenAndId?.token) {
        try {
          const response = await GetUserDetails(
            tokenAndId.token,
            tokenAndId?._id,
          );
          if (response?.data?.user) {
            const mappedUser = mapBackendUserToFrontend(response.data.user);
            dispatch(updateUserData(mappedUser));
          }
        } catch (error) {
          console.log('Settings: Fetch Error', error);
        }
      }
    };
    fetchUserData();
  }, [tokenAndId]);

  // Sync state with userDetails
  React.useEffect(() => {
    if (userDetails?.privacy_settings) {
      setPostPrivacy(!!userDetails.privacy_settings.only_me);
      setClosetPrivacy(!!userDetails.privacy_settings.followers_only);
    } else if (userDetails?.closetPrivacy) {
      setPostPrivacy(userDetails.closetPrivacy === 'ONLY_ME');
      setClosetPrivacy(userDetails.closetPrivacy === 'STYLIST_ONLY');
    }
    if (userDetails?.isPublic !== undefined) {
      setIsPublic(!!userDetails.isPublic);
    }
  }, [userDetails]);

  const handleTogglePrivacy = async (type, val) => {
    let newOnlyMe = type === 'onlyMe' ? val : postPrivacy;
    let newFollowersOnly = type === 'followersOnly' ? val : closetPrivacy;
    let newIsPublic = type === 'isPublic' ? val : isPublic;

    // Mutual Exclusivity Check
    if (type === 'onlyMe' && val) {
      newFollowersOnly = false;
      newIsPublic = false;
    } else if (type === 'followersOnly' && val) {
      newOnlyMe = false;
      newIsPublic = false;
    } else if (type === 'isPublic' && val) {
      newOnlyMe = false;
      newFollowersOnly = false;
    }

    const closetPrivacyValue = newOnlyMe
      ? 'ONLY_ME'
      : newFollowersOnly
        ? 'STYLIST_ONLY'
        : 'PUBLIC';

    const payload = {
      closetPrivacy: closetPrivacyValue,
      isPublic: newIsPublic,
      privacy_settings: {
        only_me: newOnlyMe,
        followers_only: newFollowersOnly,
        closet: userDetails?.privacy_settings?.closet ?? true,
        post: userDetails?.privacy_settings?.post ?? true,
      },
      notification_settings: userDetails?.notification_settings
        ? {
          push: {
            ...userDetails.notification_settings.push,
            likes_comments:
              userDetails.notification_settings.push?.likes_comments ||
              userDetails.notification_settings.push?.likes ||
              userDetails.notification_settings.push?.comments,
          },
          email: {
            ...userDetails.notification_settings.email,
            likes_comments:
              userDetails.notification_settings.email?.likes_comments ||
              userDetails.notification_settings.email?.likes ||
              userDetails.notification_settings.email?.comments,
          },
        }
        : {
          push: {
            outfit_reminders: true,
            new_messages: true,
            posts_with_mention: true,
            posts_from_follow: true,
            bae_notifications: true,
            likes: true,
            comments: true,
            likes_comments: true,
          },
          email: {
            outfit_reminders: true,
            new_messages: true,
            posts_with_mention: true,
            posts_from_follow: true,
            bae_notifications: true,
            likes: true,
            comments: true,
            likes_comments: true,
          },
        },
    };

    // Optimistic Update
    setPostPrivacy(newOnlyMe);
    setClosetPrivacy(newFollowersOnly);
    setIsPublic(newIsPublic);

    try {
      const response = await editPrivacySettingsApi(payload, tokenAndId?.token);
      if (
        response?.data?.success ||
        response?.success ||
        response?.status === 200
      ) {
        dispatch(
          updateUserData({
            ...userDetails,
            closetPrivacy: closetPrivacyValue,
            isPublic: newIsPublic,
            privacy_settings: payload.privacy_settings,
          }),
        );
      } else {
        throw new Error(response?.data?.message || 'Failed to update');
      }
    } catch (error) {
      console.log('Update Privacy Error', error);
      showDangerToast('Failed to update privacy settings');
      // Revert state
      setPostPrivacy(!!userDetails.privacy_settings?.only_me);
      setClosetPrivacy(!!userDetails.privacy_settings?.followers_only);
      setIsPublic(!!userDetails.isPublic);
    }
  };

  const manageLogin = tab => {
    navigation.navigate(tab.route, tab.params);
  };



  const handleDeleteAccountPress = () => {
    actionModalRef.current?.open();
  };


  const handleDeleteAccountConfirm = async () => {
    try {
      actionModalRef.current?.close();
      const response = await deleteAccountApi();

      if (
        response?.data?.success ||
        response?.success ||
        response?.status === 200
      ) {
        showSuccessToast(
          response?.data?.message ||
          response?.message ||
          'Account deleted successfully',
        );

        await clearAiDataConsent();
        await clearAllAiDataConsent();
        await AsyncStorage.multiRemove([
          AUTH_TOKEN_KEY,
          USER_DATA,
          USER_ID,
          USER_ROLE,
        ]);

        dispatch(resetAuthState());
        dispatch(updateGlobalSliceState(false));
      } else {
        showDangerToast(
          response?.data?.message ||
          response?.message ||
          'Failed to delete account',
        );
      }
    } catch (error) {
      console.log('Delete Account Error', error);
      const data = error?.response?.data || error;
      let errorMessage =
        data?.message || error?.message || 'Failed to delete account';
      if (data?.error && Array.isArray(data.error)) {
        errorMessage = data.error.map(e => e.msg).join(', ');
      }
      showDangerToast(errorMessage);
    }
  };


  return (
    <View style={{ flex: 1, backgroundColor: Colors.backGroundColor1 }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <Header
        showLeftButton={true}
        leftButtonBgColor={Colors.backGroundColor1}
        title="Settings"
        headerTextStyle={{
          fontSize: FontSize.FONT_26,
        }}
        backgroundColor={Colors.white}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: hp(10) }}
      >
        <Text
          style={{
            fontSize: FontSize.FONT_14,
            fontFamily: FontFamily.OutfitMedium,
            color: Colors.graytext,
            marginLeft: wp(5),
            marginTop: hp(3),
            marginBottom: hp(1.5),
            letterSpacing: 1.2,
          }}
        >
          ACCOUNT
        </Text>
        <Card>
          <RowItem
            title="Change Password"
            subTitle="Create a new secure password."
            icon={imagePath.lock}
            onPress={() => navigation.navigate('ChangePassword')}
          />
          <RowItem
            isLast={true}
            title="Notifications Settings"
            subTitle="Manage your notification preferences."
            icon={imagePath.profileIcons?.notification || imagePath.bell}
            onPress={() => navigation.navigate('NotificationSettings')}
          />
          <RowItem
            isLast={true}
            title="Blocked Users"
            subTitle="Manage your blocked users."
            icon={imagePath.block_user}
            onPress={() => navigation.navigate('BlockedUsers')}
          />
        </Card>

        <Text
          style={{
            fontSize: FontSize.FONT_14,
            fontFamily: FontFamily.OutfitMedium,
            color: Colors.graytext,
            marginLeft: wp(5),
            marginTop: hp(3),
            marginBottom: hp(1.5),
            letterSpacing: 1.2,
          }}
        >
          FOLLOWERS PRIVACY
        </Text>
        <Card>
          <RowItem
            title="Private"
            subTitle="Outfits remains fully private"
            icon={imagePath.list_detail}
            isSwitch={true}
            value={postPrivacy}
            onValueChange={val => handleTogglePrivacy('onlyMe', val)}
          />
          <RowItem
            title="Followers Only"
            subTitle="Followers can view outfits"
            icon={imagePath.closet}
            isSwitch={true}
            value={closetPrivacy}
            onValueChange={val => handleTogglePrivacy('followersOnly', val)}
          />
          <RowItem
            isLast={true}
            title="Public"
            subTitle="Anyone can view your profile and outfits"
            icon={imagePath.postMention}
            isSwitch={true}
            value={isPublic}
            onValueChange={val => handleTogglePrivacy('isPublic', val)}
          />
        </Card>
      </ScrollView>

      <View
        style={{
          alignItems: 'center',
          backgroundColor: Colors.white,
          paddingVertical: hp(2),
          borderTopWidth: 1,
          borderTopColor: '#F4F4F5',
        }}
      >
        <TouchableOpacity
          onPress={handleDeleteAccountPress}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: wp(2),
          }}
          activeOpacity={0.8}
        >
          <Image
            source={imagePath.delete}
            style={{ width: wp(5), height: wp(5), tintColor: Colors.red }}
            resizeMode="contain"
          />
          <Text
            style={{
              fontFamily: FontFamily.SemiBold,
              fontSize: FontSize.FONT_16,
              color: Colors.red,
            }}
          >
            Delete Account
          </Text>
        </TouchableOpacity>
      </View>

      <LogoutModal ref={actionModalRef}
        title='Delete Account'
        description='Are you sure you want to delete your account?'
        buttonTitle='Delete'
        popupImage={imagePath.delete}
        onPress={handleDeleteAccountConfirm}
      />
    </View>
  );
};

export default Settings;
