import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import { StyleSheet } from 'react-native';

import { FontFamily, FontSize, FontWeight } from '../../../constant/fonts';
import { useTheme } from '../../../hooks/useTheme';
import { imagePath } from '../../../constant/imagePath';
import { wp, hp, getImageUrl } from '../../../utils/helper';
import { updateUserData } from '../../../redux/slices/userSlice';
import { editStylePreferencesApi } from '../../../services/auth.service';
import { showSuccessToast, showDangerToast } from '../../../utils/toast';
import LabelInput from '../../../component/common/Inputs/LabelInput';
import Header from '../../../component/common/UI/Header';
import AppButton from '../../../component/common/Buttons/AppButton';
// import { useNavigation } from '@react-navigation/native';
import SizeDropdown from '../../../component/common/Inputs/SizeDropdown';
import FullScreenImageModal from '../../../component/common/Modal/FullScreenImageModal';

import {
  colorPalette,
  colorPaletteEye,
  bodyType,
  hairTypes,
  faceShapes,
  complexions,
  shirtSizeOptions,
  trouserSizeOptions,
  shoeSizeOptions,
  wristSizeOptions,
  bustOptions,
  waistOptions,
  circumferenceOptions,
  heightOptions,
  shoulderOptions,
} from '../../../constant';
import { getStylePreferencesStyles } from './styles';
import { IMAGEURL } from '../../../utils/axios';

const formatValue = val => {
  if (!val || typeof val !== 'string') return null;
  return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
};

const resolveBodyPhotoUri = photo => {
  if (!photo) return '';
  if (typeof photo === 'object') {
    return photo.uri || photo.path || '';
  }
  const uri = String(photo);
  if (uri.startsWith('http') || uri.startsWith('file://') || uri.startsWith('content://')) {
    return uri;
  }
  return getImageUrl(uri, 'uploads/users');
};

const normalizeBodyPhotos = photos => {
  let list = photos;
  if (!list) return [];
  if (typeof list === 'string') list = [list];
  if (!Array.isArray(list)) return [];
  const unique = [
    ...new Set(
      list
        .map(p => (typeof p === 'object' ? p?.uri || p?.path || p : p))
        .filter(Boolean),
    ),
  ];
  // Only one full-body photo allowed in UI
  return unique.slice(-1);
};

const EditStylePreferences = () => {
  const navigation = useNavigation();
  const Colors = useTheme();
  const styles = getStylePreferencesStyles(Colors);
  const dispatch = useDispatch();

  const { userDetails, tokenAndId } = useSelector(state => state.user);
  const initialBodyPhotosRef = useRef([]);

  const [formData, setFormData] = useState({
    selectedColors: [],
    selectedBrands: ['Zara', 'Gucci'],
    shirtSize: '',
    trouserSize: '',
    shoeSize: '',
    wristSize: '',
    bust: '',
    waist: '',
    circumference: '',
    height: '',
    shoulder: '',
    bodyType: '',
    hairColor: '',
    hairType: '',
    eyeColor: '',
    faceShape: '',
    complexion: '',
    dislikes: '',
    bodyPhotos: [],
  });

  const [showAddBrand, setShowAddBrand] = useState(false);
  const [newBrandText, setNewBrandText] = useState('');
  const [fullScreenImage, setFullScreenImage] = useState(null);

  useEffect(() => {
    if (userDetails) {
      // Map Redux state (nested) to Component state (flat)
      const preferences = userDetails || {};
      const sizes = preferences.sizes || {};
      const measurements =
        preferences.measurements || preferences.measurement || {};

      setFormData(prev => ({
        ...prev,
        // Colors & Brands
        selectedColors: Array.isArray(preferences.preferred_colors)
          ? preferences.preferred_colors
          : [],
        selectedBrands: [
          ...(Array.isArray(preferences.brands) ? preferences.brands : []),
          ...(preferences.custom_brand ? [preferences.custom_brand] : []),
        ].filter((v, i, a) => a.indexOf(v) === i), // Ensure unique values

        // Sizes
        shirtSize: sizes.shirt_size ? String(sizes.shirt_size) : '',
        trouserSize: sizes.trouser_size ? String(sizes.trouser_size) : '',
        shoeSize: sizes.shoe_size ? String(sizes.shoe_size) : '',
        wristSize: sizes.wrist_size ? String(sizes.wrist_size) : '',

        // Measurements
        bust: measurements.bust ? String(measurements.bust) : '',
        waist: measurements.waist ? String(measurements.waist) : '',
        circumference: measurements.circumference
          ? String(measurements.circumference)
          : '',
        height: measurements.height ? String(measurements.height) : '',
        shoulder: measurements.shoulder ? String(measurements.shoulder) : '',

        // Body Details
        bodyType:
          formatValue(preferences.bodyType || preferences.body_type) || '',
        hairColor:
          formatValue(preferences.hairColor || preferences.hair_color) || '',
        hairType:
          formatValue(preferences.hairType || preferences.hair_type) || '',
        eyeColor:
          formatValue(preferences.eyeColor || preferences.eye_color) || '',
        faceShape:
          formatValue(preferences.faceShape || preferences.face_shape) || '',
        complexion: formatValue(preferences.complexion) || '',
        dislikes: Array.isArray(preferences.dislikes)
          ? preferences.dislikes[0] || ''
          : preferences.dislikes || '',
        bodyPhotos: (() => {
          const normalized = normalizeBodyPhotos(
            preferences.bodyImages || preferences.full_body_image || [],
          );
          initialBodyPhotosRef.current = normalized;
          return normalized;
        })(),
      }));
    }
  }, [userDetails]);

  const updateState = (key, value) => {
    const numericFields = [
      // 'shirtSize', // Removed: contains non-numeric strings like 'XS'
      'trouserSize',
      'shoeSize',
      // 'wristSize', // Removed as it is now string dropdown
      'bust',
      'waist',
      'circumference',
      // 'height', // Removed: contains non-numeric strings like 4'0"
      'shoulder',
    ];

    if (numericFields.includes(key)) {
      if (/^\d*$/.test(value)) {
        if (value.length <= 3) {
          setFormData(prev => ({ ...prev, [key]: value }));
        }
      }
    } else {
      setFormData(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleColorSelect = (key, colorValue) => {
    if (key === 'selectedColors') {
      const list = Array.isArray(formData[key]) ? formData[key] : [];
      const updatedList = list.includes(colorValue)
        ? list.filter(c => c !== colorValue)
        : [...list, colorValue];
      updateState(key, updatedList);
    } else {
      updateState(key, colorValue);
    }
  };

  const toggleListSelection = (key, item) => {
    const list = formData[key] || [];
    let updatedList;
    if (list.includes(item)) {
      updatedList = list.filter(i => i !== item);
    } else {
      updatedList = [...list, item];
    }
    updateState(key, updatedList);
  };

  const handleAddCustomBrand = () => {
    if (newBrandText.trim().length > 0) {
      updateState('selectedBrands', [
        ...formData.selectedBrands,
        newBrandText.trim(),
      ]);
      setNewBrandText('');
      setShowAddBrand(false);
    }
  };

  const showImageOptions = () => {
    Alert.alert('Upload Photo', 'Choose an option', [
      { text: 'Camera', onPress: onCamera },
      { text: 'Gallery', onPress: onGallery },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const onCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      mediaType: 'photo',
    })
      .then(image => {
        // Only one full-body photo — replace existing
        updateState('bodyPhotos', [image.path]);
      })
      .catch(e => console.log('Camera Error:', e));
  };

  const onGallery = () => {
    ImagePicker.openPicker({
      multiple: false,
      mediaType: 'photo',
      cropping: true,
      width: 300,
      height: 400,
    })
      .then(image => {
        // Only one full-body photo — replace existing
        updateState('bodyPhotos', [image.path]);
      })
      .catch(e => console.log('Gallery Error:', e));
  };

  const removePhoto = () => {
    updateState('bodyPhotos', []);
  };

  const handleBackPress = () => {
    // Discard unsaved photo changes and restore original
    setFormData(prev => ({
      ...prev,
      bodyPhotos: initialBodyPhotosRef.current,
    }));
    navigation.goBack();
  };

  const handleSave = async () => {
    if (formData.dislikes && !/^[a-zA-Z0-9\s,.]*$/.test(formData.dislikes)) {
      showMessage({
        message: 'Dislikes should not contain special characters',
        type: 'danger',
      });
      return;
    }

    const hasLocalImages = formData.bodyPhotos.some(
      uri => uri && !uri.startsWith('http'),
    );

    let finalData;

    if (hasLocalImages) {
      finalData = new FormData();
      finalData.append(
        'preferred_colors',
        JSON.stringify(formData.selectedColors),
      );
      finalData.append('brands', JSON.stringify(formData.selectedBrands));
      finalData.append(
        'sizes',
        JSON.stringify({
          shirt_size: formData.shirtSize,
          trouser_size: formData.trouserSize,
          shoe_size: formData.shoeSize,
          wrist_size: formData.wristSize,
        }),
      );
      finalData.append(
        'measurement',
        JSON.stringify({
          bust: formData.bust,
          waist: formData.waist,
          circumference: formData.circumference,
          height: formData.height,
          shoulder: formData.shoulder,
        }),
      );
      finalData.append('body_type', formData.bodyType.toLowerCase());
      finalData.append('hair_color', formData.hairColor.toLowerCase());
      finalData.append('hair_type', formData.hairType.toLowerCase());
      finalData.append('eye_color', formData.eyeColor.toLowerCase());
      finalData.append('face_shape', formData.faceShape.toLowerCase());
      finalData.append('complexion', formData.complexion.toLowerCase());
      finalData.append('dislikes', formData.dislikes);

      const photosToUpload = normalizeBodyPhotos(formData.bodyPhotos);
      photosToUpload.forEach(uri => {
        if (uri && typeof uri === 'string' && !uri.startsWith('http')) {
          const name = uri.split('/').pop();
          const match = /\.(\w+)$/.exec(name || '');
          finalData.append('full_body_image', {
            uri:
              Platform.OS === 'ios' && !uri.startsWith('file://')
                ? `file://${uri}`
                : uri,
            name: name || `photo_${Date.now()}.jpg`,
            type: match ? `image/${match[1]}` : 'image/jpeg',
          });
        }
      });
    } else {
      finalData = {
        preferred_colors: formData.selectedColors,
        brands: formData.selectedBrands,
        sizes: {
          shirt_size: formData.shirtSize,
          trouser_size: formData.trouserSize,
          shoe_size: formData.shoeSize,
          wrist_size: formData.wristSize,
        },
        measurement: {
          bust: formData.bust,
          waist: formData.waist,
          circumference: formData.circumference,
          height: formData.height,
          shoulder: formData.shoulder,
        },
        body_type: formData.bodyType.toLowerCase(),
        hair_color: formData.hairColor.toLowerCase(),
        hair_type: formData.hairType.toLowerCase(),
        eye_color: formData.eyeColor.toLowerCase(),
        face_shape: formData.faceShape.toLowerCase(),
        complexion: formData.complexion.toLowerCase(),
        dislikes: formData.dislikes,
        full_body_image: normalizeBodyPhotos(formData.bodyPhotos),
      };
    }

    try {
      const response = await editStylePreferencesApi(
        finalData,
        tokenAndId?.token,
      );
      if (response?.success) {
        const savedPhotos = normalizeBodyPhotos(
          response?.data?.user?.full_body_image || formData.bodyPhotos,
        );
        initialBodyPhotosRef.current = savedPhotos;
        // Update Redux with the NEW structure
        const reduxPayload = {
          ...userDetails,
          preferred_colors: formData.selectedColors,
          brands: formData.selectedBrands,
          sizes: {
            shirt_size: formData.shirtSize,
            trouser_size: formData.trouserSize,
            shoe_size: formData.shoeSize,
            wrist_size: formData.wristSize,
          },
          measurement: {
            bust: formData.bust,
            waist: formData.waist,
            circumference: formData.circumference,
            height: formData.height,
            shoulder: formData.shoulder,
          },
          body_type: formData.bodyType,
          hair_color: formData.hairColor,
          hair_type: formData.hairType,
          eye_color: formData.eyeColor,
          face_shape: formData.faceShape,
          complexion: formData.complexion,
          dislikes: formData.dislikes,
          full_body_image: savedPhotos,
          bodyImages: savedPhotos.map(img =>
            typeof img === 'string' && img.startsWith('http')
              ? img
              : typeof img === 'string' && !img.startsWith('file://') && !img.startsWith('content://')
                ? `${IMAGEURL}uploads/users/${img}`
                : img,
          ),
        };
        dispatch(updateUserData(reduxPayload));
        showSuccessToast(response.message || 'Preferences updated');
        navigation.goBack();
      } else {
        showDangerToast(response?.message || 'Failed to update preferences');
      }
    } catch (error) {
      console.log('Style Pref Save Error', error);
      showDangerToast('Failed to update preferences');
    }
  };
  console.log("sformDataelectedColors", formData?.selectedColors)
  const renderColorSection = (title, key, titleStyle = {}) => (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, titleStyle]}>{title}</Text>

      <View style={styles.colorsContainer}>
        { (key === 'eyeColor' ? colorPaletteEye : colorPalette).length > 0 ? (
          (key === 'eyeColor' ? colorPaletteEye : colorPalette).map(
            (item, index) => {
              const isSelected =
                key === 'selectedColors'
                  ? (formData[key] || []).includes(item.colorCode)
                  : formData[key] === item.name;
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.colorCircleContainer,
                    isSelected && {
                      borderColor: Colors.primaryBlue,
                      borderWidth: 2,
                    },
                    item.colorCode === Colors.white &&
                    !isSelected && {
                      borderWidth: 1,
                      borderColor: Colors.greyBorder,
                    },
                  ]}
                  onPress={() =>
                    handleColorSelect(
                      key,
                      key === 'selectedColors' ? item.colorCode : item.name,
                    )
                  }
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.colorCircleInner,
                      { backgroundColor: item.colorCode },
                    ]}
                  />
                  {isSelected && (
                    <View style={styles.checkmarkContainer}>
                      <Image
                        source={imagePath.white_tick}
                        style={styles.checkIcon}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              );
            },
          )
        ) : (
          <Text style={styles.noData}>No data found</Text>
        )}
      </View>
    </View>
  );

  const renderChipsSection = (title, data, key, titleStyle = {}) => (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, titleStyle]}>{title}</Text>
      <View style={styles.chipsRow}>
        {data.length > 0 ? (
          data.map(item => {
            const isSelected = formData[key] === item.label;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.chip, isSelected && styles.chipActive]}
                onPress={() => updateState(key, item.label)}
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

  const renderGridRow = (input1, input2) => (
    <View style={styles.rowContainer}>
      <View style={{ flex: 1, marginRight: wp(2) }}>{input1}</View>
      <View style={{ flex: 1, marginLeft: wp(2) }}>{input2}</View>
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
        onLeftButtonPress={handleBackPress}
        title="Edit Style Preferences"
        backgroundColor={Colors.white}
      />
      <View style={{ flex: 1, backgroundColor: '#F7F6FA' }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {renderColorSection('Preferred Colors', 'selectedColors', {
            marginTop: hp(1),
          })}

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Favorite Designers / Brands</Text>

            {formData.selectedBrands.length > 0 && (
              <View style={[styles.chipsRow, { marginBottom: hp(1) }]}>
                {formData.selectedBrands.map((brand, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.removableChip}
                    onPress={() => toggleListSelection('selectedBrands', brand)}
                  >
                    <Text style={styles.chipText}>{brand}</Text>
                    <Text style={styles.crossText}> ✕</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={styles.addBrandRow}>
              <TextInput
                style={styles.addBrandInput}
                placeholder="Type brand name..."
                placeholderTextColor={Colors.grey || '#999'}
                value={newBrandText}
                onChangeText={setNewBrandText}
                onSubmitEditing={handleAddCustomBrand}
                textAlignVertical="center"
                autoCorrect={false}
                returnKeyType="done"
              />
              <TouchableOpacity
                style={styles.addBrandBtn}
                onPress={handleAddCustomBrand}
              >
                <Text style={{ color: Colors.white, fontWeight: FontWeight.FONT_600 }}>
                  ADD
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Sizes</Text>
            {renderGridRow(
              <SizeDropdown
                title="Shirt Size"
                placeholder="Select"
                data={shirtSizeOptions}
                value={formData.shirtSize}
                onChange={val => updateState('shirtSize', val)}
                width="100%"
                marginTop={0}
                marginBottom={hp(1)}
              />,
              <SizeDropdown
                title="Trouser Size"
                placeholder="Select"
                data={trouserSizeOptions}
                value={formData.trouserSize}
                onChange={val => updateState('trouserSize', val)}
                width="100%"
                marginTop={0}
                marginBottom={hp(1)}
              />,
            )}
            {renderGridRow(
              <SizeDropdown
                title="Shoe Size"
                placeholder="Select"
                data={shoeSizeOptions}
                value={formData.shoeSize}
                onChange={val => updateState('shoeSize', val)}
                width="100%"
                marginTop={0}
                marginBottom={hp(1)}
              />,
              <SizeDropdown
                title="Wrist Size"
                placeholder="Select"
                data={wristSizeOptions}
                value={formData.wristSize}
                onChange={val => updateState('wristSize', val)}
                width="100%"
                marginTop={0}
                marginBottom={hp(1)}
              />,
            )}
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Measurements / in</Text>
            {renderGridRow(
              <SizeDropdown
                title="Bust"
                placeholder="Select"
                data={bustOptions}
                value={formData.bust}
                onChange={val => updateState('bust', val)}
                width="100%"
                marginTop={0}
                marginBottom={hp(1)}
              />,

              <SizeDropdown
                title="Waist"
                placeholder="Select"
                data={waistOptions}
                value={formData.waist}
                onChange={val => updateState('waist', val)}
                width="100%"
                marginTop={0}
                marginBottom={hp(1)}
              />,
            )}
            {renderGridRow(
              <SizeDropdown
                title="Height"
                placeholder="Select"
                data={heightOptions}
                value={formData.height}
                onChange={val => updateState('height', val)}
                width="100%"
                marginTop={0}
                marginBottom={hp(1)}
              />,
              <SizeDropdown
                title="Shoulder"
                placeholder="Select"
                data={shoulderOptions}
                value={formData.shoulder}
                onChange={val => updateState('shoulder', val)}
                width="100%"
                marginTop={0}
                marginBottom={hp(1)}
              />,
            )}
          </View>

          {renderChipsSection('Body type', bodyType, 'bodyType')}
          {renderColorSection('Hair color', 'hairColor')}
          {renderChipsSection('Hair type', hairTypes, 'hairType')}
          {renderColorSection('Eye color', 'eyeColor')}
          {renderChipsSection('Face shape', faceShapes, 'faceShape')}
          {renderChipsSection('Complexion', complexions, 'complexion')}

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Upload Your Full Body Photo</Text>
            <TouchableOpacity
              style={styles.uploadBox}
              onPress={showImageOptions}
            >
              <Image
                source={imagePath.uploadIcon || imagePath.ic_upload}
                style={styles.uploadMainIcon}
                tintColor={Colors.primaryBlue}
              />
              <Text style={styles.uploadText}>Upload Image</Text>
            </TouchableOpacity>
            <View style={styles.photoRow}>
              {formData.bodyPhotos.length > 0 ? (
                formData.bodyPhotos.slice(0, 1).map((photo, index) => {
                  const photoUri = resolveBodyPhotoUri(photo);
                  return (
                    <View key={index} style={styles.thumbnailWrapper}>
                      <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => setFullScreenImage(photoUri)}
                      >
                        <Image source={{ uri: photoUri }} style={styles.thumbnail} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.closeBtn}
                        onPress={removePhoto}
                      >
                        <Text style={{ color: Colors.white, fontSize: 10 }}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  );
                })
              ) : (
                <Text style={[styles.noData, { marginLeft: wp(1) }]}>No photos uploaded</Text>
              )}
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Dislikes</Text>
            <LabelInput
              placeholder="Enter your dislikes"
              value={formData.dislikes}
              onChangeText={val => updateState('dislikes', val)}
              showTitle={false}
              maxLength={150}
            />
          </View>

          <AppButton
            title="Save"
            onPress={handleSave}
            marginTop={hp(3)}
            marginBottom={hp(5)}
          />
        </ScrollView>
      </View>

      <FullScreenImageModal
        visible={!!fullScreenImage}
        imageUri={fullScreenImage}
        onClose={() => setFullScreenImage(null)}
      />
    </View>
  );
};

export default EditStylePreferences;
