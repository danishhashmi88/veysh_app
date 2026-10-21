import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import Container from '../../../component/common/Container/Container';
import { Colors } from '../../../constant/colors';
import { getStyles } from './styles';
import Header from '../../../component/common/UI/Header';

import FaqItem from '../../../component/Help/FaqItem';
import { getGlobalStyles } from '../../../GlobalStyles/GlobalStyles';
import TextSwitch from '../../../component/Settings/TextSwitch';
import { useTheme } from '../../../hooks/useTheme';
import {
  getPrivacySettingsApi,
  updatePrivacySettingsApi,
} from '../../../services/user.service';
import { showDangerToast, showSuccessToast } from '../../../utils/toast';

const PrivacySettings = ({ navigation, route }) => {
  const Colors = useTheme();
  const GlobalStyle = getGlobalStyles(Colors);
  const styles = getStyles(Colors);

  const [postAllowed, setPostAllowed] = useState(true);
  const [closetAllowed, setClosetAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await getPrivacySettingsApi();
      if (res?.success || res?.status === 200 || res?.data) {
        const data = res?.data?.data || res?.data || {};
        // Based on the user's data structure, "closet" and "post" are directly under data
        if (typeof data.post === 'boolean') setPostAllowed(data.post);
        if (typeof data.closet === 'boolean') setClosetAllowed(data.closet);
      }
    } catch (error) {
      console.log('Error fetching privacy settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleToggle = async (key, newValue) => {
    // Save current values for rollback
    const prevPost = postAllowed;
    const prevCloset = closetAllowed;

    // Optimistically update UI
    if (key === 'post') setPostAllowed(newValue);
    if (key === 'closet') setClosetAllowed(newValue);

    const payload = {
      post: key === 'post' ? newValue : postAllowed,
      closet: key === 'closet' ? newValue : closetAllowed,
    };

    try {
      const res = await updatePrivacySettingsApi(payload);

      if (!res?.success && res?.status !== 200 && res?.data?.status !== 200) {
        // Revert on failure
        if (key === 'post') setPostAllowed(prevPost);
        if (key === 'closet') setClosetAllowed(prevCloset);
        showDangerToast(
          res?.message || res?.data?.message || 'Failed to update setting',
        );
      } else {
        showSuccessToast(
          res?.message || res?.data?.message || 'Settings updated successfully',
        );
      }
    } catch (error) {
      console.log('Error updating privacy setting:', error);
      // Revert on catch block
      if (key === 'post') setPostAllowed(prevPost);
      if (key === 'closet') setClosetAllowed(prevCloset);
      showDangerToast('Something went wrong');
    }
  };

  return (
    <Container iosNotchColors={[Colors.white, Colors.white, Colors.zink100]}>
      <SafeAreaView style={[styles.safearea]}>
        <Header showLeftButton={true} title={'Privacy Settings'} />
        {loading ? (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <ActivityIndicator size="large" color={Colors.primaryBlue} />
          </View>
        ) : (
          <View style={styles.inner}>
            <Text style={GlobalStyle.textTitle}>Followers</Text>
            <TextSwitch
              label="Post"
              description="Allow followers to see your post."
              value={postAllowed}
              onValueChange={() => handleToggle('post', !postAllowed)}
            />
            <TextSwitch
              label="Closet"
              description="Allow followers to view your closet."
              value={closetAllowed}
              onValueChange={() => handleToggle('closet', !closetAllowed)}
            />
          </View>
        )}
      </SafeAreaView>
    </Container>
  );
};

export default PrivacySettings;
