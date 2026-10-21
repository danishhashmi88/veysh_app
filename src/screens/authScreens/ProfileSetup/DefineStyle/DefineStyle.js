/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserData } from '../../../../redux/slices/userSlice';
import {
  saveStyleInfoApi,
  GetUserDetails,
} from '../../../../services/auth.service';
import { showSuccessToast, showDangerToast } from '../../../../utils/toast';

import Container from '../../../../component/common/Container/Container';
import { getStyles } from './styles';
import Back from '../../../../component/common/Buttons/Back';
import Skip from '../../../../component/common/Buttons/Skip';
import { getGlobalStyles } from '../../../../GlobalStyles/GlobalStyles';
import { hp, wp, mapBackendUserToFrontend } from '../../../../utils/helper';
import ProgressBar from '../../../../component/common/UI/ProgressBar';
import AppButton from '../../../../component/common/Buttons/AppButton';
import BottomSeperator from '../../../../component/common/Seperator/BottomSeperator';
import { useTheme } from '../../../../hooks/useTheme';
import LabelInput from '../../../../component/common/Inputs/LabelInput';
import Header from '../../../../component/common/UI/Header';
import {
  dressStyles,
  moodboardOptions,
  sustainabilityPreferences,
} from '../../../../constant';
import { FontSize, FontWeight } from '../../../../constant/fonts';

const FeatureSection = React.memo(
  ({ title, data, selectedValue, onSelect, sectionKey, styles, Colors }) => {
    return (
      <View style={styles.midBox}>
        {/* 🟢 FIX: Yahan inline fontWeight '600' add kiya gaya hai */}
        <Text style={[styles.inputTitle]}>{title}</Text>
        <View style={styles.feartureBox}>
          {data.map((item, index) => {
            const isSelected = Array.isArray(selectedValue)
              ? selectedValue.some(
                  v => v.toLowerCase() === item.label.toLowerCase(),
                )
              : selectedValue?.toLowerCase() === item.label.toLowerCase();

            return (
              <TouchableOpacity
                key={index}
                onPress={() => onSelect(sectionKey, item.label)}
                style={[
                  styles.feartureView,
                  isSelected && styles.feartureViewSelected,
                ]}
              >
                <Text
                  style={[
                    styles.genderTitle,
                    isSelected && styles.genderTitleSelected,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  },
);

const formatValue = val => {
  if (!val || typeof val !== 'string') return null;
  return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
};

const formatArray = val => {
  if (!val) return [];
  const iter = Array.isArray(val)
    ? val
    : typeof val === 'string'
    ? JSON.parse(val || '[]').catch(() => [val])
    : [val];
  return iter.map(v =>
    typeof v === 'string'
      ? v.charAt(0).toUpperCase() + v.slice(1).toLowerCase()
      : v,
  );
};

const createStylePayload = styleData => ({
  style_desc: styleData.styleDesc || '',
  style: JSON.stringify(styleData.style || []),
  mood_board: JSON.stringify(styleData.moodboard || []),
  pinterest_link: styleData.pinterestLink || '',
  market_place: styleData.preferredBrands ? [styleData.preferredBrands] : [],
  sustain_preferences: JSON.stringify(styleData.sustainablityPreference || []),
});

const getReduxPayload = (styleData, userDetails) => ({
  stylePreferences: {
    ...(userDetails?.stylePreferences || {}),
    ...createStylePayload(styleData),
  },
});

const useStyleSave = (userDetails, tokenAndId) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const save = async styleData => {
    setIsLoading(true);
    try {
      const payload = createStylePayload(styleData);
      const res = await saveStyleInfoApi(payload, tokenAndId?.token);

      if (res?.success || res?.status) {
        dispatch(updateUserData(getReduxPayload(styleData, userDetails)));
        navigation.navigate('PrivacySetting');
      } else {
        throw new Error(res?.message || 'Failed to save style details');
      }
    } catch (error) {
      console.log('Style Save Error:', error);
      showDangerToast(error.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, save };
};

const getPrefilledData = (prev, userDetails) => {
  const prefs = userDetails?.stylePreferences || {};

  const parseSafe = val => {
    if (!val) return [];
    if (Array.isArray(val)) return val.map(v => formatValue(v));
    if (typeof val === 'string') {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) return parsed.map(v => formatValue(v));
      } catch (e) {
        return [formatValue(val)];
      }
    }
    return [];
  };

  return {
    ...prev,
    styleDesc: userDetails?.styleDesc || prefs.style_desc || prev.styleDesc,
    style: parseSafe(userDetails?.style || prefs.style) || prev.style,
    moodboard:
      parseSafe(
        userDetails?.moodboard || prefs.mood_board || prefs.moodboard,
      ) || prev.moodboard,
    pinterestLink:
      userDetails?.pinterestLink || prefs.pinterest_link || prev.pinterestLink,
    preferredBrands:
      userDetails?.preferredBrands ||
      (prefs.market_place ? prefs.market_place[0] : '') ||
      prev.preferredBrands,
    sustainablityPreference:
      parseSafe(
        userDetails?.sustainablityPreference ||
          prefs.sustain_preferences ||
          prefs.sustainability,
      ) || prev.sustainablityPreference,
  };
};

function DefineYourStyle() {
  const navigation = useNavigation();
  const Colors = useTheme();
  const GlobalStyle = getGlobalStyles(Colors);
  const styles = getStyles(Colors);

  const { userDetails, tokenAndId } = useSelector(state => state.user);
  const { isLoading, save } = useStyleSave(userDetails, tokenAndId);

  const [styleData, setStyleData] = useState({
    styleDesc: '',
    style: [],
    moodboard: [],
    pinterestLink: '',
    preferredBrands: '',
    sustainablityPreference: [],
  });

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
          console.log('DefineStyle: Fetch Error', error);
        }
      }
    };
    fetchUserData();
  }, [tokenAndId]);

  useEffect(() => {
    if (userDetails) {
      setStyleData(prev => getPrefilledData(prev, userDetails));
    }
  }, [userDetails]);

  const handleState = useCallback((key, value) => {
    setStyleData(prev => {
      if (Array.isArray(prev[key])) {
        const currentArr = prev[key];
        const isSelected = currentArr.some(
          v => v.toLowerCase() === value.toLowerCase(),
        );

        if (isSelected) {
          return {
            ...prev,
            [key]: currentArr.filter(
              v => v.toLowerCase() !== value.toLowerCase(),
            ),
          };
        } else {
          return { ...prev, [key]: [...currentArr, value] };
        }
      }
      return { ...prev, [key]: value };
    });
  }, []);

  const onSkipPress = () => {
    navigation.navigate('PrivacySetting');
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
                navigation.navigate('PersonalApperence');
              }
            }}
            title=""
            backgroundColor={Colors.white}
            rightComponent={
              <Skip onPress={() => navigation.navigate('PrivacySetting')} />
            }
          />

          {/* Content Area */}
          <View style={{ flex: 1, backgroundColor: '#F7F6FA' }}>
            <View style={{ width: wp(90), alignSelf: 'center' }}>
              <ProgressBar
                style={{ marginVertical: hp(2) }}
                progress={12.5 * 5}
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
                    Define Your Style
                  </Text>
                  <Text
                    style={[
                      GlobalStyle.authScreenSubtitle,
                      { textAlign: 'left' },
                    ]}
                  >
                    Help us understand your fashion taste and values.
                  </Text>
                </View>

                <LabelInput
                  onChangeText={val => handleState('styleDesc', val)}
                  value={styleData.styleDesc}
                  title="Who are your style icons?"
                  placeholder="e.g. I love vintage and classic vibes..."
                  marginTop={hp(2)}
                  multiline
                  inputHeight={hp(14)}
                  borderRadius={wp(2)}
                  titleFont={FontSize.FONT_16}
                  // titleStyle={{ fontWeight: '600' }} // 🟢 Title bold
                  maxLength={200}
                />

                <FeatureSection
                  title="Style"
                  data={dressStyles}
                  selectedValue={styleData.style}
                  sectionKey="style"
                  onSelect={handleState}
                  styles={styles}
                  Colors={Colors}
                />

                <FeatureSection
                  title="Moodboard"
                  data={moodboardOptions}
                  selectedValue={styleData.moodboard}
                  sectionKey="moodboard"
                  onSelect={handleState}
                  styles={styles}
                  Colors={Colors}
                />

                <View style={{ marginTop: hp(1.5) }}>
                  <Text style={[styles.inputTitle]}>Pinterest link</Text>
                  <LabelInput
                    onChangeText={val => handleState('pinterestLink', val)}
                    value={styleData.pinterestLink}
                    title="Pinterest link"
                    placeholder="Enter Pinterest link"
                    showTitle={false}
                    maxLength={500}
                  />
                </View>

                <View style={{ marginTop: hp(1.5) }}>
                  {/* 🟢 Title bold */}
                  <Text style={[styles.inputTitle]}>
                    Preferred brands/marketplaces
                  </Text>
                  <LabelInput
                    onChangeText={val => handleState('preferredBrands', val)}
                    value={styleData.preferredBrands}
                    title="Preferred brands/marketplaces"
                    placeholder="Enter Preferred brands/marketplaces"
                    showTitle={false}
                    maxLength={100}
                  />
                </View>

                <FeatureSection
                  title="Sustainability Preference"
                  data={sustainabilityPreferences}
                  selectedValue={styleData.sustainablityPreference}
                  sectionKey="sustainablityPreference"
                  onSelect={handleState}
                  styles={styles}
                  Colors={Colors}
                />

                <BottomSeperator />
                <AppButton
                  marginTop={hp(3)}
                  marginBottom={Platform.OS === 'android' ? hp(4) : hp(2)}
                  loading={isLoading}
                  title={'Next'}
                  onPress={() => save(styleData)}
                />
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </View>
      </View>
    </Container>
  );
}

export default DefineYourStyle;
