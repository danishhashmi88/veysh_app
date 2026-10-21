import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../../../hooks/useTheme';
import AppButton from '../../../../component/common/Buttons/AppButton';
import Header from '../../../../component/common/UI/Header';
// import Back from '../../../../component/common/Buttons/Back';
import { wp, hp } from '../../../../utils/helper';
import { getCategoriesApi } from '../../../../services/user.service';
import {
  getCategorySizeLabels,
  getUniqueSizesFromCategories,
} from '../../../../utils/helper';
import {
  careList,
  bustOptions as chestOptions,
  waistOptions,
  hipOptions,
  inseamOptions,
} from '../../../../constant';
import { FontSize, FontWeight } from '../../../../constant/fonts';
import SizeDropdown from '../../../../component/common/Inputs/SizeDropdown';
import AppCheckbox from '../../../../component/common/Inputs/AppCheckbox';
import { addItem, updateItem } from '../../../../redux/thunks/itemsThunk';
import { showDangerToast, showSuccessToast } from '../../../../utils/toast';

const statusMap = {
  Donate: 0,
  Laundry: 1,
  Closet: 2,
  Sell: 3,
  Repair: 4,
  Lent: 5,
};

import { getStyles } from './styles';
import { capitalizeFirstLetter } from '../../../../constant/functions';
import { imagePath } from '../../../../constant/imagePath';

const ClosetFormData = () => {
  const route = useRoute();
  const { item, itemDetail } = route.params || {};
  console.log('itemDetail', itemDetail);
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { tempItemData, loading } = useSelector(state => state.items);
  const { userDetails } = useSelector(state => state.user);
  const [selectedSize, setSelectedSize] = useState('');
  const [dynamicSizes, setDynamicSizes] = useState([]);
  const [matchSize, setMatchSize] = useState(false);
  const [measurements, setMeasurements] = useState({
    chest: '',
    waist: '',
    hip: '',
    inseam: '',
  });

  // Sync selectedSize with tempItemData
  useEffect(() => {
    if (tempItemData?.selectedSize) {
      setSelectedSize(tempItemData.selectedSize);
    }
  }, [tempItemData]);

  // Effect to auto-fill measurements when "Match with my size" is checked
  useEffect(() => {
    if (matchSize && userDetails?.measurements) {
      const userMeas = userDetails.measurements;
      setMeasurements({
        chest: userMeas.chest || userMeas.bust || '',
        waist: userMeas.waist || '',
        hip: userMeas.hips || userMeas.hip || '',
        inseam: userMeas.inseam || '',
      });
    }
  }, [matchSize, userDetails]);

  useEffect(() => {
    const loadSizes = async () => {
      try {
        const res = await getCategoriesApi({ type: 'item' });
        if (res?.success && res?.data?.list) {
          const categoryId =
            itemDetail?.category?._id || tempItemData?.category?.value;
          const selectedCategory = res.data.list.find(
            cat => String(cat._id) === String(categoryId),
          );
          const mappedSizes = selectedCategory
            ? getCategorySizeLabels(selectedCategory.sizes)
            : getUniqueSizesFromCategories(res.data.list);
          setDynamicSizes(mappedSizes);
        }
      } catch (error) {
        console.log('Error fetching sizes:', error);
      }
    };

    loadSizes();
  }, [itemDetail, tempItemData?.category?.value]);

  useEffect(() => {
    if (itemDetail) {
      if (itemDetail?.size) {
        setSelectedSize(capitalizeFirstLetter(String(itemDetail.size)));
      } else {
        setSelectedSize('');
      }

      if (itemDetail?.measurements) {
        setMeasurements({
          chest: itemDetail.measurements.chest != null ? String(itemDetail.measurements.chest) : '',
          waist: itemDetail.measurements.waist != null ? String(itemDetail.measurements.waist) : '',
          hip: itemDetail.measurements.hip != null ? String(itemDetail.measurements.hip) : '',
          inseam: itemDetail.measurements.inseam != null ? String(itemDetail.measurements.inseam) : '',
        });
      }
      setMatchSize(itemDetail?.match_with_my_size || false);
    }
  }, [itemDetail]);

  const handleMeasurementChange = (field, value) => {
    setMeasurements({ ...measurements, [field]: value });
  };

  const handleSave = async () => {
    if (!tempItemData) {
      showDangerToast('Missing item details. Please go back.');
      return;
    }

    const formData = new FormData();

    // Append tempItemData
    const {
      imageUri,
      mediaType,
      name,
      price,
      brand,
      purchasedOn,
      category,
      subCategory,
      occasion,
      mood,
      season,
      status,
      care,
      wearCount,
      isAvailableToRentPurchase,
      rentPurchasePrice,
      selectedColors,
      selectedFabrics,
      notes,
      tags,
    } = tempItemData;

    if (itemDetail?._id) {
      formData.append('o_id', itemDetail?._id);
    }

    if (imageUri) {
      // 🔹 If image already from server → skip uploading
      if (imageUri.startsWith('http')) {
        console.log('Existing image detected. Using server URL.');
        const filename =
          imageUri.split('/').pop() || `photo_${Date.now()}.jpg`;

        const match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : 'image/jpeg';

        if (type === 'image/jpg') type = 'image/jpeg';

        const imageFile = {
          uri: imageUri,
          name: filename,
          type,
        };
        formData.append('images', imageFile);
      }

      // 🔹 If new local image → upload
      else {
        let uriToUpload = imageUri;

        // Ensure proper prefix (but don't break content://)
        if (
          !uriToUpload.startsWith('file://') &&
          !uriToUpload.startsWith('content://')
        ) {
          uriToUpload = `file://${uriToUpload}`;
        }

        const filename =
          uriToUpload.split('/').pop() || `photo_${Date.now()}.jpg`;

        const match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : 'image/jpeg';

        if (type === 'image/jpg') type = 'image/jpeg';

        const imageFile = {
          uri: uriToUpload,
          name: filename,
          type,
        };

        formData.append('images', imageFile);
      }
    }

    formData.append('name', name ? name : 'Untitled Item');
    formData.append('price', price ? price : '0');
    formData.append('wear_count', wearCount ? wearCount : '0');
    formData.append('brand_name', brand ? brand : 'None');
    if (purchasedOn) {
      formData.append('purchased_on', purchasedOn);
    }

    if (category?.value) formData.append('category', category.value);
    if (subCategory?.value) formData.append('sub_category', subCategory.value);

    const attributes = {
      occasion,
      mood,
      season,
      care,
      status: statusMap[status],
    };

    if (occasion) formData.append('occasion', occasion.toLowerCase());
    if (mood) formData.append('mood', mood.toLowerCase());
    if (season) formData.append('season', season.toLowerCase());
    if (care) formData.append('care', care.toLowerCase());
    if (status) formData.append('status', statusMap[status]);

    if (selectedSize) {
      formData.append('size', selectedSize);
    }

    // RELOCATED DATA APPENDS
    if (selectedColors?.length > 0) {
      formData.append('colors', JSON.stringify(selectedColors));
    }
    if (selectedFabrics?.length > 0) {
      formData.append('fabric', JSON.stringify(selectedFabrics));
    }
    if (notes) formData.append('notes', notes);
    if (tags && tags.length > 0) {
      formData.append('tags', JSON.stringify(tags));
    }

    formData.append('match_with_my_size', matchSize);

    // Measurements - Send as JSON string
    const formattedMeasurements = {};
    Object.keys(measurements).forEach(key => {
      if (measurements[key]) {
        formattedMeasurements[key] = measurements[key];
      }
    });

    if (Object.keys(formattedMeasurements).length > 0) {
      formData.append('measurements', JSON.stringify(formattedMeasurements));
    }

    console.log('=== FORMDATA CONTENTS ===', formData);

    try {
      let resultAction;
      if (itemDetail?._id) {
        console.log('Updating Item:', itemDetail._id);
        resultAction = await dispatch(updateItem(formData));
      } else {
        console.log('Adding New Item');
        resultAction = await dispatch(addItem(formData));
      }

      if (itemDetail) {
        if (updateItem.fulfilled.match(resultAction)) {
          if (typeof showSuccessToast === 'function') {
            showSuccessToast('Item updated successfully!');
          }

          const payload = resultAction.payload;
          const createdItem =
            payload?.data || payload?.item || payload?.item_details || payload;
          const itemId = createdItem?._id || createdItem?.id;
          navigation.popToTop();
          // navigation.navigate('AddClosetFinalScreen', { itemId:itemDetail?._id });
        } else {
          console.log('AddItem FAILED Actionedit:', resultAction);
          const errorMsg =
            resultAction.payload ||
            resultAction.error?.message ||
            'Failed to add item';
          console.log('AddItem Error Message to Show:', errorMsg);

          if (typeof showDangerToast === 'function') {
            showDangerToast(`Error: ${errorMsg}`);
          }
        }
      } else {
        if (addItem.fulfilled.match(resultAction)) {
          if (typeof showSuccessToast === 'function') {
            showSuccessToast('Item added successfully!');
          }
          // console.log(
          //   'AddItem Success Payload:',
          //   JSON.stringify(resultAction.payload, null, 2),
          // );

          // Extract Item ID safely
          const payload = resultAction.payload;
          const createdItem =
            payload?.data || payload?.item || payload?.item_details || payload;
          const itemId = createdItem?._id || createdItem?.id;

          navigation.navigate('AddClosetFinalScreen', {
            itemId,
            itemName: tempItemData?.name,
          });
        } else {
          console.log('AddItem FAILED Actionadddddd:', resultAction);
          const errorMsg =
            resultAction.payload ||
            resultAction.error?.message ||
            'Failed to add item';
          console.log('AddItem Error Message to Show:', errorMsg);

          if (typeof showDangerToast === 'function') {
            showDangerToast(`Error: ${errorMsg}`);
          }
        }
      }
    } catch (error) {
      console.error('Submission Error:', error);
    }
  };

  return (
    <>
      <Header
        showLeftButton={true}
        onLeftButtonPress={() => navigation.goBack()}
        title={itemDetail ? 'Update Item Details' : 'Add Item Details'}
        backgroundColor={Colors.white}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={-28}
      >
        <SafeAreaView
          style={[styles.container, { paddingTop: 0 }]}
          edges={['left', 'right', 'bottom']}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Size Chips */}
            <Text style={[styles.label, { marginTop: hp(2) }]}>Size</Text>
            <View style={styles.sizeContainer}>
              {dynamicSizes.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.sizeChip,
                    selectedSize === item && styles.sizeChipSelected,
                  ]}
                  onPress={() => setSelectedSize(item)}
                >
                  <Text
                    style={[
                      styles.sizeText,
                      selectedSize === item && styles.sizeTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label, styles.sectionHeader]}>Measurement (Optional)</Text>
            <AppCheckbox
              label="Match with my size"
              checked={matchSize}
              onPress={() => setMatchSize(!matchSize)}
            />
            
            {/* Measurement Inputs - 2 Columns */}
            <View style={styles.row}>
              <View style={styles.col}>
                <SizeDropdown
                  title="Chest"
                  placeholder="Select"
                  marginTop={0}
                  data={chestOptions}
                  value={measurements.chest}
                  onChange={val => handleMeasurementChange('chest', val)}
                />
              </View>
              <View style={styles.col}>
                <SizeDropdown
                  title="Waist"
                  placeholder="Select"
                  marginTop={0}
                  data={waistOptions}
                  value={measurements.waist}
                  onChange={val => handleMeasurementChange('waist', val)}
                />
              </View>
            </View>
            <View style={[styles.row, { marginTop: hp(1.5) }]}>
              <View style={styles.col}>
                <SizeDropdown
                  title="Hip"
                  placeholder="Select"
                  marginTop={0}
                  data={hipOptions}
                  value={measurements.hip}
                  onChange={val => handleMeasurementChange('hip', val)}
                />
              </View>
              <View style={styles.col}>
                <SizeDropdown
                  title="Inseam"
                  placeholder="Select"
                  marginTop={0}
                  data={inseamOptions}
                  value={measurements.inseam}
                  onChange={val => handleMeasurementChange('inseam', val)}
                />
              </View>
            </View>

            <AppButton
              title="Next"
              onPress={handleSave}
              loading={loading}
              marginTop={hp(3)}
              marginBottom={hp(5)}
            />
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </>
  );
};

export default ClosetFormData;
