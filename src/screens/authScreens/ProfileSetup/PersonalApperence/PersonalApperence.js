/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserData } from '../../../../redux/slices/userSlice';
import {
  saveAppearanceApi,
  GetUserDetails,
} from '../../../../services/auth.service';
import { showSuccessToast, showDangerToast } from '../../../../utils/toast';

import Container from '../../../../component/common/Container/Container';
import { getStyles } from './styles';
import Back from '../../../../component/common/Buttons/Back';
import { getGlobalStyles } from '../../../../GlobalStyles/GlobalStyles';
import { hp, wp, mapBackendUserToFrontend, safeGoBack } from '../../../../utils/helper';
import ProgressBar from '../../../../component/common/UI/ProgressBar';
import AppButton from '../../../../component/common/Buttons/AppButton';
import BottomSeperator from '../../../../component/common/Seperator/BottomSeperator';
import { useTheme } from '../../../../hooks/useTheme';
import LabelInput from '../../../../component/common/Inputs/LabelInput';
import Header from '../../../../component/common/UI/Header';
import { imagePath } from '../../../../constant/imagePath';
import Skip from '../../../../component/common/Buttons/Skip';
import { Colors as ConstantColors } from '../../../../constant/colors';

import {
  bodyType,
  colorPalette,
  hairTypes,
  faceShapes,
  complexions,
  colorPaletteEye,
} from '../../../../constant';

const RenderSection = React.memo(
  ({ title, data, stateKey, isColor, selectedValue, onSelect, styles }) => {
    const Colors = useTheme();
    return (
      <View style={styles.midBox}>
        <Text style={styles.inputTitle}>{title}</Text>
        <View style={isColor ? styles.colorPallet : styles.feartureBox}>
          {data.map((item, index) => {
            // Dynamic Access: Colors use 'name', others use 'label'
            const val = isColor ? item.name : item.label;
            const isSelected = selectedValue === val;

            if (isColor) {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => onSelect(val)}
                  style={[
                    styles.colorViewContainer,
                    isSelected && {
                      borderColor: Colors.themeColor,
                      borderWidth: 2,
                    },
                    !isSelected &&
                    item.showBorder && {
                      borderColor: Colors.colorScreenBorder,
                      borderWidth: 1,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.colorViewInner,
                      { backgroundColor: item.colorCode },
                    ]}
                  />
                  {isSelected && (
                    <View style={styles.tickView}>
                      <Image
                        style={styles.smallTick}
                        source={imagePath.white_tick}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              );
            }
            return (
              <TouchableOpacity
                key={index}
                onPress={() => onSelect(val)}
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
                  {val}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  },
);

function PersonalApperence() {
  const Colors = useTheme();
  const navigation = useNavigation();
  const GlobalStyle = getGlobalStyles(Colors);
  const styles = getStyles(Colors);
  const dispatch = useDispatch();

  const { userDetails, tokenAndId } = useSelector(state => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [bodyImages, setBodyImages] = useState([]);

  const [formData, setFormData] = useState({
    bodyType: null,
    hairColor: null,
    hairType: null,
    eyeColor: null,
    faceShape: null,
    complexion: null,
    dislikes: '',
  });

  const sections = useMemo(
    () => [
      {
        title: 'Body type',
        data: bodyType,
        stateKey: 'bodyType',
        isColor: false,
      },
      {
        title: 'Hair color',
        data: colorPalette,
        stateKey: 'hairColor',
        isColor: true,
      },
      {
        title: 'Hair type',
        data: hairTypes,
        stateKey: 'hairType',
        isColor: false,
      },
      {
        title: 'Eye color',
        data: colorPaletteEye,
        stateKey: 'eyeColor',
        isColor: true,
      },
      {
        title: 'Face shape',
        data: faceShapes,
        stateKey: 'faceShape',
        isColor: false,
      },
      {
        title: 'Complexion',
        data: complexions,
        stateKey: 'complexion',
        isColor: false,
      },
    ],
    [],
  );

  const formatValue = val =>
    val && typeof val === 'string'
      ? val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()
      : null;

  useEffect(() => {
    if (!tokenAndId?.token) return;
    // Only fetch if userDetails is missing to avoid overwriting local Redux state
    if (userDetails?._id) return;

    GetUserDetails(tokenAndId.token)
      .then(res => {
        if (res?.data?.user)
          dispatch(updateUserData(mapBackendUserToFrontend(res.data.user)));
      })
      .catch(err => console.log('Fetch Error', err));
  }, [tokenAndId, dispatch]);

  useEffect(() => {
    if (!userDetails) return;
    const prefs = userDetails.stylePreferences || {};
    setFormData(prev => ({
      bodyType:
        formatValue(userDetails.bodyType || prefs.body_type) || prev.bodyType,
      hairColor:
        formatValue(userDetails.hairColor || prefs.hair_color) ||
        prev.hairColor,
      hairType:
        formatValue(userDetails.hairType || prefs.hair_type) || prev.hairType,
      eyeColor:
        formatValue(userDetails.eyeColor || prefs.eye_color) || prev.eyeColor,
      faceShape:
        formatValue(userDetails.faceShape || prefs.face_shape) ||
        prev.faceShape,
      complexion:
        formatValue(userDetails.complexion || prefs.complexion) ||
        prev.complexion,
      dislikes: userDetails.dislikes || prefs.dislikes || prev.dislikes || '',
    }));
    if (Array.isArray(userDetails.bodyImages)) {
      const unique = [...new Set(userDetails.bodyImages.filter(Boolean))];
      setBodyImages(unique.slice(-1));
    } else if (
      typeof userDetails.full_body_image === 'string' &&
      userDetails.full_body_image
    ) {
      setBodyImages([userDetails.full_body_image]);
    } else if (Array.isArray(userDetails.full_body_image)) {
      const unique = [...new Set(userDetails.full_body_image.filter(Boolean))];
      setBodyImages(unique.slice(-1));
    }
  }, [userDetails]);

  const handleState = useCallback(
    (key, value) => setFormData(prev => ({ ...prev, [key]: value })),
    [],
  );

  const handleImagePick = async type => {
    try {
      const picker =
        type === 'camera' ? ImagePicker.openCamera : ImagePicker.openPicker;
      const image = await picker({
        width: 400,
        height: 600,
        cropping: true,
        mediaType: 'photo',
      });
      // Only one full-body photo — replace existing
      setBodyImages([image.path]);
    } catch (err) {
      console.log('Image Picker Error:', err);
    }
  };

  const onSelectImage = () => {
    Alert.alert('Upload Photo', 'Choose an option', [
      { text: 'Camera', onPress: () => handleImagePick('camera') },
      { text: 'Gallery', onPress: () => handleImagePick('gallery') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const onSave = async () => {
    setIsLoading(true);
    try {
      const apiFormData = new FormData();

      Object.keys(formData).forEach(key => {
        const snakeKey = key.replace(
          /[A-Z]/g,
          letter => `_${letter.toLowerCase()}`,
        );
        apiFormData.append(snakeKey, formData[key]);
      });

      const photosToUpload = bodyImages.slice(-1);
      photosToUpload.forEach(uri => {
        const name = uri.split('/').pop();
        const match = /\.(\w+)$/.exec(name);
        apiFormData.append('full_body_image', {
          uri:
            Platform.OS === 'ios' && !uri.startsWith('file://')
              ? `file://${uri}`
              : uri,
          name,
          type: match ? `image/${match[1]}` : 'image/jpeg',
        });
      });

      const res = await saveAppearanceApi(apiFormData, tokenAndId?.token);
      if (res?.success || res?.status) {
        dispatch(
          updateUserData({
            ...formData,
            bodyImages: photosToUpload,
            stylePreferences: {
              ...userDetails?.stylePreferences,
              ...formData,
              full_body_image: photosToUpload,
            },
          }),
        );
        navigation.navigate('DefineYourStyle');
      } else throw new Error(res?.message || 'Failed to save');
    } catch (error) {
      showDangerToast(error.message || 'Something went wrong.');
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
            showLeftButton={navigation.canGoBack()}
            onLeftButtonPress={() => safeGoBack(navigation, 'SizeInfo')}
            title=""
            backgroundColor={Colors.white}
            rightComponent={
              <Skip onPress={() => navigation.navigate('DefineYourStyle')} />
            }
          />

          {/* Content Area */}
          <View style={{ flex: 1, backgroundColor: '#F7F6FA' }}>
            <View style={{ width: wp(90), alignSelf: 'center' }}>
              <ProgressBar style={{ marginVertical: hp(2) }} progress={50} />
            </View>
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : hp(2)}
            >
              <ScrollView
                contentContainerStyle={{
                  flexGrow: 1,
                  paddingBottom: hp(5),
                  width: wp(90),
                  alignSelf: 'center',
                }}
                showsVerticalScrollIndicator={false}
              >
                <View style={[styles.topText, { alignSelf: 'flex-start' }]}>
                  <Text style={GlobalStyle.authScreenTitle}>
                    Personal Appearance
                  </Text>
                  <Text
                    style={[
                      GlobalStyle.authScreenSubtitle,
                      { textAlign: 'left' },
                    ]}
                  >
                    Share your appearance details
                  </Text>
                </View>

                {/* --- DYNAMIC RENDERING LOOP --- */}
                {sections.map((section, index) => (
                  <RenderSection
                    key={index}
                    {...section} // Spreads title, data, stateKey, isColor
                    selectedValue={formData[section.stateKey]}
                    onSelect={val => handleState(section.stateKey, val)}
                    styles={styles}
                  />
                ))}

                <View style={{ marginTop: hp(1.5) }}>
                  <Text style={styles.inputTitle}>
                    Upload Your Full Body Photo
                  </Text>
                  <TouchableOpacity
                    onPress={onSelectImage}
                    style={styles.uploadImageBox}
                  >
                    <View style={styles.editIcon}>
                      <Image
                        style={styles.icon}
                        source={imagePath.upload_icon_purple}
                      />
                    </View>
                    <Text style={styles.uploadTitle}>Upload Image</Text>
                  </TouchableOpacity>
                  <View style={styles.imageViews}>
                    {bodyImages.slice(0, 1).map((uri, index) => (
                      <ImageBackground
                        key={index}
                        style={styles.image}
                        source={{ uri }}
                        imageStyle={{ borderRadius: wp(2) }}
                      >
                        <TouchableOpacity
                          onPress={() => setBodyImages([])}
                          style={styles.crossIconView}
                        >
                          <Image
                            style={styles.crossIcon}
                            source={imagePath.white_cross}
                          />
                        </TouchableOpacity>
                      </ImageBackground>
                    ))}
                  </View>
                </View>

                <LabelInput
                  title="Dislikes"
                  placeholder="Enter your dislikes"
                  value={formData.dislikes}
                  onChangeText={val => {
                    const filteredVal = val.replace(/[^a-zA-Z0-9\s]/g, '');
                    handleState('dislikes', filteredVal);
                  }}
                  maxLength={40}
                />
                <BottomSeperator />
                <AppButton
                  marginTop={hp(3)}
                  marginBottom={Platform.OS === 'android' ? hp(1) : hp(2)}
                  loading={isLoading}
                  title="Next"
                  onPress={onSave}
                />
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </View>
      </View>
    </Container>
  );
}

export default PersonalApperence;
