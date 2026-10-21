import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { showSuccessToast, showDangerToast } from '../../../utils/toast';

import { useTheme } from '../../../hooks/useTheme';
import { wp, hp, mapBackendUserToFrontend } from '../../../utils/helper';
import LabelInput from '../../../component/common/Inputs/LabelInput';
import Back from '../../../component/common/Buttons/Back';
import { updateUserData } from '../../../redux/slices/userSlice';
import { editStyleInfoApi } from '../../../services/auth.service';
import Header from '../../../component/common/UI/Header';
import {
  styleTags,
  moodboardTags,
  sustainabilityTags,
} from '../../../constant/index.js';
import { getEditMyStyleStyles } from './styles.js';
import { FontFamily, FontSize } from '../../../constant/fonts.js';
import AppButton from '../../../component/common/Buttons/AppButton';
import { imagePath } from '../../../constant/imagePath';

const EditMyStyle = () => {
  const navigation = useNavigation();
  const Colors = useTheme();
  const styles = getEditMyStyleStyles(Colors);
  const dispatch = useDispatch();

  const { userDetails, tokenAndId } = useSelector(state => state.user);

  const [formData, setFormData] = useState({
    styleIcons: '',
    selectedStyles: [],
    selectedMoodboard: [],
    pinterestLink: '',
    preferredBrands: '',
    selectedSustainability: [],
  });

  // Helper to normalize data: splits commas, trims, matches case with tags, deduplicates
  const normalizeData = (dataStrOrArray, tags) => {
    if (!dataStrOrArray) return [];

    let rawValues = [];
    if (Array.isArray(dataStrOrArray)) {
      // Flatten any comma-separated strings that might be inside the array
      rawValues = dataStrOrArray.flatMap(val =>
        typeof val === 'string' ? val.split(',').map(s => s.trim()) : [val],
      );
    } else if (typeof dataStrOrArray === 'string') {
      rawValues = dataStrOrArray.split(',').map(s => s.trim());
    }

    const normalized = rawValues
      .filter(val => val) // Remove empty strings
      .map(val => {
        // Find matching tag (case-insensitive)
        const match = tags.find(t => t.label.toLowerCase() === val.toLowerCase());
        return match ? match.label : val;
      });

    // Deduplicate
    return [...new Set(normalized)];
  };
  useEffect(() => {
    if (userDetails) {
      setFormData({
        styleIcons: userDetails.styleDesc || '',
        selectedStyles: normalizeData(userDetails.style, styleTags),
        selectedMoodboard: normalizeData(userDetails.moodboard, moodboardTags),
        pinterestLink: userDetails.pinterestLink || '',
        preferredBrands:
          userDetails.brands && userDetails.brands.length > 0
            ? userDetails.brands.join(', ')
            : userDetails.marketPlace && userDetails.marketPlace.length > 0
              ? Array.isArray(userDetails.marketPlace)
                ? userDetails.marketPlace.join(', ')
                : userDetails.marketPlace
              : '',
        selectedSustainability: normalizeData(
          userDetails.sustainablityPreference,
          sustainabilityTags,
        ),
      });
    }
  }, [userDetails]);

  const updateState = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const toggleChip = (key, itemLabel) => {
    const list = formData[key] || [];
    let updatedList;
    if (list.includes(itemLabel)) {
      updatedList = list.filter(i => i !== itemLabel);
    } else {
      updatedList = [...list, itemLabel];
    }
    updateState(key, updatedList);
  };

  const handleSave = async () => {
    console.log('Saving Data:', formData);

    const payload = {
      style_desc: formData.styleIcons,
      style:
        formData.selectedStyles.length > 0 ? formData.selectedStyles[0] : '', // Sending single string based on user data example "classic"
      mood_board:
        formData.selectedMoodboard.length > 0
          ? formData.selectedMoodboard[0]
          : '', // Sending single string
      pinterest_link: formData.pinterestLink,
      market_place: formData.preferredBrands ? [formData.preferredBrands] : [],
      sustain_preferences: JSON.stringify(formData.selectedSustainability),
    };

    // Note: If backend accepts arrays, change the above logic.
    // Based on user provided JSON, values like "classic", "thrift", "clean" are strings.
    // However, user might expect multiple selections. Since user data implies single string storage, I'll take the first one or join them if multiples are selected.
    // Given the UI allows multiple, I'll try sending comma joined string or the first one.
    // Actually, EditProfile used `formData.append('gender', selectedGender)` (single).
    // And `JSON.stringify` for arrays.
    // EXCEPT `style` example showed "classic". If I send `["classic"]` stringified, it might be weird.
    // I'll stick to picking the first one OR joining with comma if multiple selected, but "classic, modern" string might be valid.
    // Let's rely on single selection for now or comma separated string if multiple.
    // Since `toggleChip` allows multiple, I should probably join them.
    // JSON Example: "dislikes": "Cbcv" (string).
    // Let's send comma separated string for now if multiple.
    // Wait, the API/User example data has "marketPlace": ["zara"] (array).
    // But "sustain_preferences": "thrift" (string).
    // "style": "classic" (string).
    // So marketPlace is array, others are strings.

    // Revised payload construction:
    const finalPayload = {
      ...payload,
      style: JSON.stringify(formData.selectedStyles),
      mood_board: JSON.stringify(formData.selectedMoodboard),
    };
    try {
      const response = await editStyleInfoApi(finalPayload, tokenAndId?.token);
      console.log('EditMyStyle API Response:', response);

      if (response?.success) {
        const mappedUser = mapBackendUserToFrontend(response.data.user);
        dispatch(updateUserData(mappedUser));

        showSuccessToast(response.message || 'Style info updated successfully');
        navigation.goBack();
      } else {
        showDangerToast(response?.message || 'Failed to update style info');
      }
    } catch (error) {
      console.log('EditMyStyle Save Error', error);
      showDangerToast(
        error?.response?.data?.message || 'Error saving style info',
      );
    }
  };
  const renderChipSection = (title, data, key, titleStyle = {}) => (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, titleStyle]}>{title}</Text>
      <View style={styles.chipsRow}>
        {data.length > 0 ? (
          data.map(item => {
            const isSelected = formData[key].includes(item.label);
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.chip, isSelected && styles.chipActive]}
                onPress={() => toggleChip(key, item.label)}
              >
                <Text
                  style={[styles.chipText, isSelected && styles.chipTextActive]}
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
  );

  return (
    <View style={[styles.mainContainer, { backgroundColor: '#FFFFFF' }]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <Header
        showLeftButton={true}
        onLeftButtonPress={() => navigation.goBack()}
        title="Edit My Style"
        headerTextStyle={{
          fontSize: FontSize.FONT_26,
          fontFamily: FontFamily.Bold,
          color: Colors.black,
        }}
        backgroundColor={Colors.white}
      />
      <View style={{ flex: 1, backgroundColor: '#F7F6FA' }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <LabelInput
            title="Who are your style icons?"
            placeholder="Enter celebs/influencers or Pinterest/Instagram"
            value={formData.styleIcons}
            onChangeText={val => updateState('styleIcons', val)}
            inputHeight={hp(11.5)}
            multiline={true}
            maxLength={200}
            marginTop={hp(2.5)}
            style={{
              textAlignVertical: 'top',
            }}
          />

          {renderChipSection('Style', styleTags, 'selectedStyles')}
          {renderChipSection('Moodboard', moodboardTags, 'selectedMoodboard')}

          <LabelInput
            title="Pinterest link"
            placeholder="Enter Pinterest link"
            value={formData.pinterestLink}
            onChangeText={val => updateState('pinterestLink', val)}
            maxLength={100}
          />
{/* 
          <LabelInput
            title="Preferred brands/marketplaces"
            placeholder={formData.preferredBrands ? "Enter Preferred brands/marketplaces" : "No data found"}
            value={formData.preferredBrands}
            onChangeText={val => updateState('preferredBrands', val)}
            multiline={true}
            marginTop={hp(2.5)}
            inputHeight={hp(8)}
            editable={true}
            maxLength={100}
            style={{
              textAlignVertical: 'top',
              color: formData.preferredBrands ? Colors.black : Colors.greyVar1,
            }}
          /> */}

          {renderChipSection(
            'Sustainability Preferences',
            sustainabilityTags,
            'selectedSustainability',
            { marginTop: hp(2.5) }
          )}

          <AppButton
            title="Save"
            onPress={handleSave}
            marginTop={hp(3)}
            marginBottom={hp(5)}
          />
        </ScrollView>
      </View>
    </View>
  );
};

export default EditMyStyle;
