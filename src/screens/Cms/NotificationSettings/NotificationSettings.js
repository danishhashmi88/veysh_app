import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Switch,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import Container from '../../../component/common/Container/Container';
import { Colors } from '../../../constant/colors';
import { getStyles } from './styles';
import Header from '../../../component/common/UI/Header';
import FaqSkeleton from '../../../component/common/Skeletons/FaqSkeleton';
import FaqItem from '../../../component/Help/FaqItem';
import { getGlobalStyles } from '../../../GlobalStyles/GlobalStyles';
import TextSwitch from '../../../component/Settings/TextSwitch';
import { useTheme } from '../../../hooks/useTheme';
import {
  getNotificationSettingsApi,
  updateNotificationSettingsApi,
} from '../../../services/user.service';
import { showDangerToast, showSuccessToast } from '../../../utils/toast';
import { hp, wp } from '../../../utils/helper';
import { FontSize, FontFamily } from '../../../constant/fonts';
import Card from '../../../component/common/UI/Card';
import RowItem from '../../../component/common/UI/RowItem';
import { imagePath } from '../../../constant/imagePath';

const NotificationSettings = ({ navigation, route }) => {
  const Colors = useTheme();
  const GlobalStyle = getGlobalStyles(Colors);
  const styles = getStyles(Colors);

  const [settings, setSettings] = useState({
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
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await getNotificationSettingsApi();
      if (res?.success || res?.status === 200 || res?.data) {
        // Expected payload structure from API inside data
        const data = res?.data?.data || res?.data || {};

        setSettings(prev => ({
          push: { ...prev.push, ...data.push, likes_comments: data.push?.likes_comments || (data.push?.likes || data.push?.comments) },
          email: { ...prev.email, ...data.email, likes_comments: data.email?.likes_comments || (data.email?.likes || data.email?.comments) },
          sms: { ...prev.sms, ...data.sms },
        }));
      }
    } catch (error) {
      console.log('Error fetching notification settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleToggle = async (category, key) => {
    const currentValue = settings[category]?.[key];
    const newValue = !currentValue;

    // Copy current state for revert on error
    const prevSettings = { ...settings };

    // Optimistic update
    const updatedSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [key]: newValue,
      },
    };

    // Keep likes_comments synced for backward compatibility
    if (key === 'likes' || key === 'comments') {
      updatedSettings[category].likes_comments =
        key === 'likes'
          ? newValue || settings[category].comments
          : newValue || settings[category].likes;
    }

    setSettings(updatedSettings);

    try {
      // Send the entire updated settings payload or just the part depending on backend flexibility
      const res = await updateNotificationSettingsApi(updatedSettings);

      if (!res?.success && res?.status !== 200 && res?.data?.status !== 200) {
        // Revert on failure
        setSettings(prevSettings);
        showDangerToast(
          res?.message || res?.data?.message || 'Failed to update setting',
        );
      } 
       
    } catch (error) {
      console.log('Error updating notification setting:', error);
      // Revert on local error
      setSettings(prevSettings);
      showDangerToast('Something went wrong');
    }
  };


  return (
    <View style={{ flex: 1, backgroundColor: Colors.backGroundColor1 }}>
      <Header
        showLeftButton={true}
        leftButtonBgColor={Colors.backGroundColor1}
        title="Notification Settings"
        headerTextStyle={{
          fontSize: FontSize.FONT_26,
        }}
        backgroundColor={Colors.white}
      />
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size="large" color={Colors.primaryBlue} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: hp(5) }}
        >
          <Text
            style={{
              fontSize: FontSize.FONT_14,
              fontFamily: FontFamily.OutfitMedium,
              color: Colors.graytext,
              marginLeft: wp(6),
              marginTop: hp(3),
              marginBottom: hp(1.5),
              letterSpacing: 1.2,
            }}
          >
            PUSH
          </Text>
          <Card>
            <RowItem
              title="Outfit Reminders"
              subTitle="Never miss a planned look."
              icon={imagePath.outfit}
              isSwitch={true}
              value={settings.push?.outfit_reminders}
              onValueChange={() => handleToggle('push', 'outfit_reminders')}
            />

            <RowItem
              title="New Messages"
              subTitle="Get alerts for new messages"
              icon={imagePath.message}
              isSwitch={true}
              value={settings.push?.new_messages}
              onValueChange={() => handleToggle('push', 'new_messages')}
            />
            <RowItem
              title="Posts with mention"
              subTitle="Alerts for posts that tag you"
              icon={imagePath.postMention}
              isSwitch={true}
              value={settings.push?.posts_with_mention}
              onValueChange={() => handleToggle('push', 'posts_with_mention')}
            />
            <RowItem
              title="Posts from users I follow"
              subTitle="Posts from people you follow"
              icon={imagePath.userFound}
              isSwitch={true}
              value={settings.push?.posts_from_follow}
              onValueChange={() => handleToggle('push', 'posts_from_follow')}
            />
            <RowItem
              title="Bae Notifications"
              subTitle="Smart updates from our AI assistant"
              icon={imagePath.outfit}
              isSwitch={true}
              value={settings.push?.bae_notifications}
              onValueChange={() => handleToggle('push', 'bae_notifications')}
            />
            <RowItem
              title="Like Notification"
              subTitle="Alerts when someone likes your post"
              icon={imagePath.like}
              isSwitch={true}
              value={settings.push?.likes}
              onValueChange={() => handleToggle('push', 'likes')}
            />
            <RowItem
              title="Comment Notification"
              subTitle="Alerts when someone comments"
              icon={imagePath.message}
              isLast={true}
              isSwitch={true}
              value={settings.push?.comments}
              onValueChange={() => handleToggle('push', 'comments')}
            />
          </Card>

          <Text
            style={{
              fontSize: FontSize.FONT_14,
              fontFamily: FontFamily.OutfitMedium,
              color: Colors.graytext,
              marginLeft: wp(6),
              marginTop: hp(4),
              marginBottom: hp(1.5),
              letterSpacing: 1.2,
            }}
          >
            EMAIL
          </Text>
          <Card>
            <RowItem
              title="Outfit Reminders"
              subTitle="Never miss a planned look."
              icon={imagePath.outfit}
              isSwitch={true}
              value={settings.email?.outfit_reminders}
              onValueChange={() => handleToggle('email', 'outfit_reminders')}
            />

            <RowItem
              title="New Messages"
              subTitle="Get alerts for new messages"
              icon={imagePath.message}
              isSwitch={true}
              value={settings.email?.new_messages}
              onValueChange={() => handleToggle('email', 'new_messages')}
            />
            <RowItem
              title="Posts with mention"
              subTitle="Alerts for posts that tag you"
              icon={imagePath.postMention}
              isSwitch={true}
              value={settings.email?.posts_with_mention}
              onValueChange={() => handleToggle('email', 'posts_with_mention')}
            />
            <RowItem
              title="Posts from users I follow"
              subTitle="Posts from people you follow"
              icon={imagePath.userFound}
              isSwitch={true}
              value={settings.email?.posts_from_follow}
              onValueChange={() => handleToggle('email', 'posts_from_follow')}
            />
            <RowItem
              title="Bae Notifications"
              subTitle="Smart updates from our AI assistant"
              icon={imagePath.outfit}
              isSwitch={true}
              value={settings.email?.bae_notifications}
              onValueChange={() => handleToggle('email', 'bae_notifications')}
            />
            <RowItem
              title="Like Notification"
              subTitle="Alerts when someone likes your post"
              icon={imagePath.like}
              isSwitch={true}
              value={settings.email?.likes}
              onValueChange={() => handleToggle('email', 'likes')}
            />
            <RowItem
              title="Comment Notification"
              subTitle="Alerts when someone comments"
              icon={imagePath.message}
              isLast={true}
              isSwitch={true}
              value={settings.email?.comments}
              onValueChange={() => handleToggle('email', 'comments')}
            />
          </Card>
        </ScrollView>
      )}
    </View>
  );
};

export default NotificationSettings;
