/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useRef } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserData } from '../../../../redux/slices/userSlice';
import Container from '../../../../component/common/Container/Container';
import { getStyles } from './styles';
import Back from '../../../../component/common/Buttons/Back';
import { getGlobalStyles } from '../../../../GlobalStyles/GlobalStyles';
import { hp, wp, mapBackendUserToFrontend, safeGoBack } from '../../../../utils/helper';
import ProgressBar from '../../../../component/common/UI/ProgressBar';
import AppButton from '../../../../component/common/Buttons/AppButton';
import BottomSeperator from '../../../../component/common/Seperator/BottomSeperator';
import { useTheme } from '../../../../hooks/useTheme';
import { colorPalette, colorPaletteBrand } from '../../../../constant';
import { imagePath } from '../../../../constant/imagePath';
import Skip from '../../../../component/common/Buttons/Skip';
import Header from '../../../../component/common/UI/Header';
import { FontWeight } from '../../../../constant/fonts';

import {
  colorPalette as staticColorPalette,
} from '../../../../constant';
import {
  saveStylePreferencesApi,
  GetUserDetails,
} from '../../../../services/auth.service';
import { showSuccessToast, showDangerToast } from '../../../../utils/toast';

function BrandPreference() {
  const navigation = useNavigation();
  const Colors = useTheme();
  const GlobalStyle = getGlobalStyles(Colors);
  const styles = getStyles(Colors);
  const dispatch = useDispatch();
  const { userDetails, tokenAndId } = useSelector(state => state.user);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedColors, setSelectedColors] = useState([]);
  const [brands, setBrands] = useState([]);
  const [customBrand, setCustomBrand] = useState('');
  const [colorList, setColorList] = useState([]);
  const scrollRef = useRef(null);
  const hasPrefillRef = useRef(false);

  const prefillData = () => {
    if (!userDetails || hasPrefillRef.current) return;

    const savedColors =
      userDetails.preferred_colors ||
      userDetails.stylePreferences?.preferred_colors ||
      [];
    const savedBrands = Array.isArray(
      userDetails.brands || userDetails.stylePreferences?.brands,
    )
      ? userDetails.brands || userDetails.stylePreferences?.brands
      : [];

    setSelectedColors(Array.isArray(savedColors) ? savedColors : []);
    setBrands(savedBrands);
    hasPrefillRef.current = true;
  };



  const fetchColors = async token => {
    try {
      const colorRes = await saveStylePreferencesApi({}, token);
      console.log('BrandPreference: getColorsApi response', colorRes);
      const colorData = colorRes?.data;
      if (colorData) {
        const apiColors =
          colorData?.colors ||
          colorData?.data ||
          colorData?.preferred_colors ||
          (Array.isArray(colorData) ? colorData : []);
        if (Array.isArray(apiColors) && apiColors.length > 0) {
          const formattedColors = apiColors.map(c => ({
            name: c.name || c,
            colorCode: c.code || c.colorCode || '#000000',
            showBorder: c.name === 'White' || c === 'White',
          }));
          setColorList(colorPaletteBrand);
        } else {
          console.log('BrandPreference: API colors empty, using fallback');
          setColorList(colorPaletteBrand);
        }
      } else {
        setColorList(colorPaletteBrand);
      }
    } catch (err) {
      console.log('BrandPreference: getColorsApi error', err);
      setColorList(colorPaletteBrand);
    }
  };

  const handleAddCustomBrand = () => {
    if (customBrand.trim().length > 0) {
      if (!brands.includes(customBrand.trim())) {
        setBrands([...brands, customBrand.trim()]);
      }
      setCustomBrand('');
    }
  };

  const removeBrand = index => {
    setBrands(brands.filter((_, i) => i !== index));
  };

  const scrollBrandInputIntoView = () => {
    // After several brand chips, keyboard can cover the input so typed text
    // looks "missing" — keep the field visible while typing.
    setTimeout(() => {
      scrollRef.current?.scrollToEnd?.({ animated: true });
    }, 150);
  };

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
          console.log('BrandPreference: Fetch User Error', error);
        }
      }
    };
    fetchUserData();
  }, [tokenAndId]);

  useEffect(() => {
    if (tokenAndId?.token) {
      fetchColors(tokenAndId.token);
    }
  }, [tokenAndId]);

  useFocusEffect(
    React.useCallback(() => {
      prefillData();
    }, [userDetails]),
  );

  const handleColorSelect = colorName => {
    let newColors = [...selectedColors];
    const index = newColors.findIndex(
      c => c.toLowerCase() === colorName.toLowerCase(),
    );
    if (index !== -1) {
      newColors.splice(index, 1);
    } else {
      newColors.push(colorName);
    }
    setSelectedColors(newColors);
  };

  const onSkipPress = () => {
    console.log('Skipped Brand Info');
    navigation.navigate('SizeInfo');
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
            onLeftButtonPress={() => safeGoBack(navigation, 'CompleteProfile')}
            title=""
            backgroundColor={Colors.white}
            rightComponent={<Skip onPress={onSkipPress} />}
          />

          {/* Content Area */}
          <View style={{ flex: 1, backgroundColor: '#F7F6FA' }}>
            <View style={{ width: wp(90), alignSelf: 'center' }}>
              <ProgressBar
                style={{ marginVertical: hp(2) }}
                progress={12.5 * 2}
              />
            </View>
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              keyboardVerticalOffset={Platform.OS === 'ios' ? hp(2) : 0}
            >
              <ScrollView
                ref={scrollRef}
                contentContainerStyle={{
                  paddingBottom: hp(6),
                  width: wp(90),
                  alignSelf: 'center',
                }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                automaticallyAdjustKeyboardInsets={true}
              >
                <View style={[styles.topText, { alignSelf: 'flex-start' }]}>
                  <Text style={GlobalStyle.authScreenTitle}>
                    Color & Brand Preferences
                  </Text>
                  <Text
                    style={[
                      GlobalStyle.authScreenSubtitle,
                      { textAlign: 'left' },
                    ]}
                  >
                    Choose your favorite colors and brands for more personalized
                    styling.
                  </Text>
                </View>

                <View style={styles.midBox}>
                  <Text style={[styles.inputTitle]}>Preferred Colors</Text>
                  <View style={styles.colorPallet}>
                    {(colorList.length > 0 ? colorList : colorPaletteBrand).map(
                      (color, index) => {
                        const isSelected = selectedColors.some(
                          c => c.toLowerCase() === color.name.toLowerCase(),
                        );
                        return (
                          <TouchableOpacity
                            key={index}
                            onPress={() => handleColorSelect(color.name)}
                            style={[
                              styles.colorView,
                              isSelected && {
                                borderColor: Colors.themeColor,
                                borderWidth: 1.5,
                              },
                              !isSelected &&
                              color.showBorder && {
                                borderColor: Colors.colorScreenBorder,
                                borderWidth: 1,
                              },
                            ]}
                          >
                            <View
                              style={[
                                styles.colorViewInner,
                                { backgroundColor: color.colorCode },
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
                      },
                    )}
                  </View>
                </View>

                <View style={{ marginTop: hp(3) }}>
                  <Text style={styles.inputTitle}>Favorite Designers / Brands</Text>
                  
                  {brands.length > 0 && (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: hp(1) }}>
                      {brands.map((brand, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.selectedStyle}
                          onPress={() => removeBrand(index)}
                        >
                          <Text style={styles.textSelectedStyle}>{brand}</Text>
                          <Image source={imagePath.cross} style={styles.cross} />
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  <View style={styles.addBrandRow}>
                    <TextInput
                      style={styles.addBrandInput}
                      placeholder="Type brand name..."
                      placeholderTextColor={Colors.grey || '#999'}
                      value={customBrand}
                      onChangeText={setCustomBrand}
                      onSubmitEditing={handleAddCustomBrand}
                      onFocus={scrollBrandInputIntoView}
                      blurOnSubmit={false}
                      returnKeyType="done"
                      autoCorrect={false}
                      textAlignVertical="center"
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
                  title={'Next'}
                  onPress={() => {
                    if (
                      selectedColors.length === 0 &&
                      brands.length === 0 &&
                      !customBrand
                    ) {
                    }

                    if (customBrand.length > 0 && !customBrand.trim()) {
                      showDangerToast('Brand name cannot be empty spaces');
                      return;
                    }

                    const VALID_COLOR_ENUMS = [
                      'red',
                      'blue',
                      'green',
                      'black',
                      'white',
                      'pink',
                      'purple',
                      'orange',
                      'yellow',
                      'brown',
                      'grey',
                      'beige',
                    ];

                    const finalColors = selectedColors
                      .map(c => {
                        const lowerC = c.toLowerCase();
                        if (VALID_COLOR_ENUMS.includes(lowerC)) return lowerC;

                        const paletteMatch = staticColorPalette.find(
                          p => p.name.toLowerCase() === lowerC,
                        );
                        if (
                          paletteMatch &&
                          VALID_COLOR_ENUMS.includes(
                            paletteMatch.name.toLowerCase(),
                          )
                        ) {
                          return paletteMatch.name.toLowerCase();
                        }

                        if (c.startsWith('#')) {
                          const hexMatch = staticColorPalette.find(
                            p => p.colorCode.toLowerCase() === lowerC,
                          );
                          if (
                            hexMatch &&
                            VALID_COLOR_ENUMS.includes(
                              hexMatch.name.toLowerCase(),
                            )
                          ) {
                            return hexMatch.name.toLowerCase();
                          }
                        }

                        return null;
                      })
                      .filter(c => c !== null);

                    const payload = new FormData();
                    payload.append(
                      'preferred_colors',
                      JSON.stringify(finalColors),
                    );
                    payload.append('preferred_brands', JSON.stringify(brands));
                    payload.append('custom_brand', customBrand);
                    payload.append('first_name', userDetails?.firstName || '');

                    console.log(
                      'BrandPreference: Saving...',
                      JSON.stringify(payload),
                    );
                    setIsLoading(true);

                    saveStylePreferencesApi(payload, tokenAndId?.token)
                      .then(res => {
                        setIsLoading(false);
                        if (res?.success) {
                          const currentPrefs =
                            userDetails?.stylePreferences || {};

                          dispatch(
                            updateUserData({
                              preferred_colors: selectedColors,
                              brands: brands,
                              custom_brand: customBrand,
                              stylePreferences: {
                                ...currentPrefs,
                                colors: selectedColors,
                                preferred_colors: selectedColors,
                                brands: brands,
                                preferred_brands: brands,
                                custom_brand: customBrand,
                              },
                            }),
                          );

                          navigation.navigate('SizeInfo');
                        } else {
                          showDangerToast(
                            res?.message || 'Failed to save preferences',
                          );
                        }
                      })
                      .catch(err => {
                        setIsLoading(false);
                        console.log('BrandPreference Save Error', err);
                        showDangerToast('Failed to save preferences');
                      });
                  }}
                />
              </View>
            </KeyboardAvoidingView>
          </View>
        </View>
      </View>
    </Container>
  );
}

export default BrandPreference;
