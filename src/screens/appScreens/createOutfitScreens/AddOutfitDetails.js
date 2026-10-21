import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors } from '../../../constant/colors'; // Adjust path
import { imagePath } from '../../../constant/imagePath'; // Adjust path
import { wp, hp } from '../../../utils/helper'; // Adjust path
import {
  FontFamily,
  FontSize,
  FontWeight,
  OutfitFamily,
} from '../../../constant/fonts';
import { useDispatch, useSelector } from 'react-redux';
import { createOutfit, editOutfit } from '../../../redux/thunks/outfitsThunk';
import { getItemsList, getCategories } from '../../../redux/thunks/itemsThunk';
import { showToast, showDangerToast, showSuccessToast } from '../../../utils/toast';
import { occasionOptions, seasonOptions } from '../../../constant';
import SizeDropdown from '../../../component/common/Inputs/SizeDropdown';
import { IMAGEURL } from '../../../utils/axios';
import AppButton from '../../../component/common/Buttons/AppButton';
import LabelInput from '../../../component/common/Inputs/LabelInput';
import Header from '../../../component/common/UI/Header';
import PostSwitch from '../../../component/Settings/PostSwitch';
import { getCategoriesApi } from '../../../services/user.service';
const AddOutfitDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { imageUri, category, itemIds, outfitData } = route.params || {}; // Get outfitData for edit
  const isEdit = !!outfitData;
  console.log("outfitData", outfitData)
  const [name, setName] = useState(outfitData?.name || '');
  const [description, setDescription] = useState(outfitData?.description || '');
  const [tags, setTags] = useState(outfitData?.tags || []);
  const [currentTag, setCurrentTag] = useState('');
  const [notes, setNotes] = useState(outfitData?.notes || '');
  // Dropdown States
  const [selectedOccasion, setSelectedOccasion] = useState(
    outfitData?.occasion || null,
  );
  const [tagError, setTagError] = useState('');
  const [rentPurchasePriceError, setRentPurchasePriceError] = useState('');
  const [isAvailableToRentPurchase, setIsAvailableToRentPurchase] = useState(
    outfitData?.isAvailableToRentPurchase ||
    outfitData?.is_available_for_rent_purchase ||
    outfitData?.purchase_rent_toggle ||
    false,
  );
  const [rentPurchasePrice, setRentPurchasePrice] = useState(
    outfitData?.rentPurchasePrice != null
      ? String(outfitData.rentPurchasePrice)
      : outfitData?.rent_purchase_price != null
        ? String(outfitData.rent_purchase_price)
        : outfitData?.purchase_rent_price != null
          ? String(outfitData.purchase_rent_price)
          : '',
  );
  const [selectedSeason, setSelectedSeason] = useState(
    outfitData?.suitable || outfitData?.season || null,
  );
  const [selectedCategory, setSelectedCategory] = useState(
    (() => {
      const initialCat = outfitData?.category?._id || outfitData?.category_id?._id || category;
      if (Array.isArray(outfitData?.category)) {
        return outfitData.category.map(c => c._id || c);
      } else if (Array.isArray(outfitData?.category_id)) {
        return outfitData.category_id.map(c => c._id || c);
      }
      return initialCat ? [initialCat] : [];
    })()
  ); // Pre-fill
  const [loading, setLoading] = useState(false);
  const [categoryOptions, setCateGoryOptions] = useState([]);
  // const { categoriesList } = useSelector(state => state.items);

  useEffect(() => {
    fetchCategories()
  }, []);


  const fetchCategories = async () => {
    try {
      const res = await getCategoriesApi({ type: 'outfit' });
      if (res?.success && res?.data?.list) {
        const mappedCats = res.data.list.map(item => ({
          label: item.title,
          value: item._id,
        }));
        setCateGoryOptions(mappedCats);

      }
    } catch (error) {
      console.log('Error fetching categories:', error);
    }
  };


  // Map categories for dropdown
  // const categoryOptions = (categoriesList || []).map(c => ({
  //   label: c.title,
  //   value: c._id,
  // }));

  // Use constants for dropdowns
  const occasions = occasionOptions;
  const seasons = seasonOptions;

  const handleSave = async () => {
    // 1. Validation
    if (!name.trim()) return showDangerToast('Please enter an outfit name');
    if (!selectedCategory || selectedCategory.length === 0) return showDangerToast('Please select a category');
    if (loading) return;

    setLoading(true);
    try {
      const formData = new FormData();

      // 2. Prepare Data
      const tagList = tags;

      const commonFields = {
        name,
        description,
        notes,
        occasion: selectedOccasion || 'casual',
        suitable: selectedSeason || 'summer',
        purchase_rent_toggle: isAvailableToRentPurchase,
        purchase_rent_price: rentPurchasePrice ? rentPurchasePrice : '0',
      };

      if (isAvailableToRentPurchase) {
        if (!rentPurchasePrice || Number(rentPurchasePrice) < 1) {
          setLoading(false);
          setRentPurchasePriceError('Amount must be at least 1');
          return showDangerToast('Amount must be at least 1');
        }
      }

      if (isEdit) {
        formData.append('o_id', outfitData._id);
      }

      // 3. Append Common Fields
      Object.entries(commonFields).forEach(([key, value]) => {
        if (value !== undefined && value !== null) formData.append(key, value);
      });

      // 4. Append Arrays
      if (tagList.length) formData.append('tags', JSON.stringify(tagList)); // Postman shows tags as JSON string

      if (selectedCategory && selectedCategory.length) {
        formData.append('category', JSON.stringify(selectedCategory));
      }

      // Send item_id as JSON string (matching Postman format)
      if (itemIds?.length) {
        formData.append('item_id', JSON.stringify(itemIds));
      }

      // 5. Append Image
      if (imageUri) {
        let uriToUpload = imageUri;
        // Ensure file:// prefix for iOS
        if (
          !uriToUpload.startsWith('file://') &&
          !uriToUpload.startsWith('http')
        ) {
          uriToUpload = `file://${uriToUpload}`;
        }

        const filename = imageUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image/jpeg`;
        if (type === 'image/jpg') type = 'image/jpeg';

        const imageFile = { uri: uriToUpload, name: filename, type };

        formData.append('images', imageFile);
      } else {
        console.log('No new imageUri to append. Keeping existing image.');
      }

      // 6. Navigate & Submit

      console.log('FormDatanow issss:', formData);

      let result;
      if (isEdit) {
        result = await dispatch(editOutfit(formData)).unwrap();
      } else {
        result = await dispatch(createOutfit(formData)).unwrap();
      }

      if (result?.success) {
        const isPremiumMessage = result?.message
          ?.toLowerCase()
          .includes('premium subscription');

        // Robust ID detection: check outfit, data, or root
        const newId =
          result.outfit?._id ||
          result.data?._id ||
          result.outfit?.id ||
          result.data?.id ||
          result._id ||
          result.id;

        if (isPremiumMessage) {
          showDangerToast(
            result?.message || 'Subscription limit reached. Please upgrade.',
          );
          setLoading(false);
          return;
        }

        // Check if message implies success (fallback for unexpected ID locations)
        const isExplicitSuccess = result?.message
          ?.toLowerCase()
          .includes('successfully');

        if (!isEdit && !newId && !isExplicitSuccess) {
          showDangerToast(result?.message || 'Failed to capture Outfit ID.');
          setLoading(false);
          return;
        }

        showSuccessToast(
          result?.message ||
            (isEdit ? 'Outfit updated successfully' : 'Outfit added successfully'),
        );

        if (isEdit) {
          // Navigate to OutfitHome as explicitly requested
          navigation.reset({
            index: 1,
            routes: [{ name: 'HomeScreen' }, { name: 'OutfitHome' }],
          });
        } else {
          // Navigate to Thanku screen
          navigation.navigate('Thanku', { outfitId: newId || 'ID_NOT_FOUND' });
        }
      } else {
        // Fallback for success: false in result (though unwrap might catch this as error)
        showDangerToast(
          result?.message ||
          (isEdit ? 'Failed to update outfit' : 'Failed to save outfit'),
        );
      }
    } catch (error) {
      console.error('Save Error:', error);
      // Detailed error from backend
      const errorMsg =
        typeof error === 'string'
          ? error
          : error?.message || 'An error occurred';
      showDangerToast(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const renderChips = (data, selected, setSelected, isObject = false) => {
    return (
      <View style={styles.chipContainer}>
        {data.map((item, index) => {
          const label = isObject ? item.label : item;
          const value = isObject ? item.value : item;
          const isSelected = Array.isArray(selected) && selected.includes(value);

          return (
            <TouchableOpacity
              key={index}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => {
                if (isSelected) {
                  setSelected(prev => prev.filter(val => val !== value));
                } else {
                  setSelected(prev => [...prev, value]);
                }
              }}
            >
              <Text
                style={[
                  styles.chipText,
                  isSelected && styles.chipTextSelected,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <>
      <Header
        showLeftButton={true}
        onLeftButtonPress={() => navigation.goBack()}
        title={isEdit ? 'Edit Outfit Details' : 'Add Outfit Details'}
        backgroundColor={Colors.white}
      />
      <SafeAreaView
        style={[styles.container, { paddingTop: 0 }]}
        edges={['left', 'right', 'bottom']}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.content}>
            {/* Image Preview */}
            <View style={styles.imageContainer}>
              {imageUri ? (
                <Image
                  source={{ uri: imageUri }}
                  style={styles.previewImage}
                  resizeMode="contain"
                />
              ) : outfitData?.image ||
                (outfitData?.images && outfitData.images.length > 0) ? (
                <Image
                  source={{
                    uri: (() => {
                      const img = outfitData.image || outfitData.images[0];
                      if (img.startsWith('http')) return img;
                      let path = img;
                      if (!path.includes('uploads/')) {
                        path = `uploads/outfits/${path}`;
                      }
                      return `${IMAGEURL}${path}`;
                    })(),
                  }}
                  style={styles.previewImage}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.placeholderImage}>
                  <Text>No Preview Available</Text>
                </View>
              )}

              {isEdit && (
                <TouchableOpacity
                  style={styles.editCanvasButton}
                  onPress={() =>
                    navigation.navigate('CreateOutfit', { outfitData })
                  }
                >
                  <Image source={imagePath.pencil} style={styles.editIcon} />
                </TouchableOpacity>
              )}
            </View>

            {/* Form Fields */}
            <LabelInput
              title="Outfit Name"
              placeholder="Enter Outfit Name"
              value={name}
              onChangeText={text => {
                const filteredText = text.replace(/[^a-zA-Z0-9\s]/g, '');
                setName(filteredText);
              }}
              maxLength={40}
            />

            <View style={{ marginTop: hp(1.5), marginBottom: hp(1) }}>
              <Text style={styles.label}>Category</Text>
              {renderChips(categoryOptions, selectedCategory, setSelectedCategory, true)}
            </View>

            <LabelInput
              title="Description"
              placeholder="Enter Description"
              value={description}
              onChangeText={setDescription}
              multiline
              inputHeight={hp(10)}
              maxLength={250}
            />

            <LabelInput
              title="Tags"
              placeholder="Add a tag and press Enter"
              value={currentTag}
              onChangeText={text => {
                const filteredText = text.replace(/[^a-zA-Z0-9\s]/g, '');
                setCurrentTag(filteredText);
                if (tagError) setTagError('');
              }}
              onSubmitEditing={() => {
                const trimmedTag = currentTag.trim();
                if (trimmedTag) {
                  if (tags.length >= 8) {
                    setTagError('You can only add up to 8 tags.');
                    return;
                  }
                  if (!tags.includes(trimmedTag)) {
                    setTags([...tags, trimmedTag]);
                    setCurrentTag('');
                    setTagError('');
                  } else {
                    setTagError('This tag is already added.');
                  }
                }
              }}
              errorText={tagError}
              maxLength={20}
            />

            <View style={styles.tagContainer}>
              {tags.map((tag, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.tagChip}
                  onPress={() => {
                    const newTags = tags.filter((_, i) => i !== index);
                    setTags(newTags);
                  }}
                >
                  <Text style={styles.tagText}>{tag}</Text>
                  <Text style={styles.removeTagText}>×</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                marginTop: hp(1.5),
              }}
            >
              <SizeDropdown
                title="Occasion"
                placeholder="Select Occasion"
                data={occasions}
                value={selectedOccasion}
                onChange={val => setSelectedOccasion(val)}
                width="48%"
                marginTop={0}
              />

              <SizeDropdown
                title="Suitable For"
                placeholder="Select Season"
                data={seasons}
                value={selectedSeason}
                onChange={val => setSelectedSeason(val)}
                width="48%"
                marginTop={0}
              />
            </View> */}

            <LabelInput
              title="Style Notes"
              placeholder="Enter Style Notes"
              value={notes}
              onChangeText={text => {
                const filteredText = text.replace(/[^a-zA-Z0-9\s]/g, '');
                setNotes(filteredText);
              }}
              multiline
              inputHeight={hp(10)}
              maxLength={100}
            />

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: Colors.white,
                paddingHorizontal: wp(4),
                paddingVertical: hp(1.7),
                borderRadius: wp(3),
                marginTop: hp(1.5),
                borderWidth: 1,
                borderColor: Colors.borderGrey,
              }}
            >
              <Text
                style={{
                  fontFamily: FontFamily.OutfitMedium,
                  fontSize: FontSize.FONT_16,
                  color: Colors.black,
                }}
              >
                Available to Rent/Purchase?
              </Text>
              {/* <Switch
                value={isAvailableToRentPurchase}
                onValueChange={setIsAvailableToRentPurchase}
                trackColor={{
                  false: Colors.backGroundColor1,
                  true: Colors.themeColor,
                }}
                thumbColor={Colors.white}
                ios_backgroundColor={Colors.backGroundColor1}
              /> */}
              <PostSwitch
                value={isAvailableToRentPurchase}
                onValueChange={setIsAvailableToRentPurchase}
              />
            </View>

            {isAvailableToRentPurchase && (
              <LabelInput
                title="Rent/Purchase Amount"
                placeholder="Enter Amount"
                keyboardType="numeric"
                value={rentPurchasePrice}
                onChangeText={text => {
                  const numericText = text.replace(/[^0-9]/g, '');
                  setRentPurchasePrice(numericText);
                  if (rentPurchasePriceError) setRentPurchasePriceError('');
                }}
                maxLength={10}
                errorText={rentPurchasePriceError}
              />
            )}


            <AppButton style={styles.saveButton} onPress={handleSave}
              title="Save"
              loading={loading}
              disabled={loading}
            >
              {/* {loading ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <Text style={styles.saveButtonText}>Save</Text>
              )} */}
            </AppButton>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backGroundColor1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(5),
    paddingVertical: Platform.OS === 'ios' ? hp(2) : hp(4),
  },
  backButton: {
    padding: wp(2),
    backgroundColor: Colors.lightBorder,
    borderRadius: wp(100),
  },
  backIcon: {
    width: wp(7),
    height: hp(3),
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: FontSize.FONT_24,
    fontFamily: FontFamily.Bold,
    color: Colors.black,
    marginLeft: wp(3),
  },
  content: {
    padding: wp(5),
  },
  imageContainer: {
    width: wp(38),
    height: hp(18),
    backgroundColor: Colors.outfitBGColor,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(1),
    borderColor: Colors.outfitBGColor,
    position: 'relative',
  },
  editCanvasButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: Colors.white,
    padding: 5,
    borderRadius: 20,
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  editIcon: {
    width: 16,
    height: 16,
    tintColor: Colors.black,
  },
  previewImage: {
    width: wp(33),
    height: hp(16),
    borderRadius: wp(5),
    // resizeMode: 'cover',
    overflow: 'hidden',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    // fontSize: FontSize.FONT_14,
    fontFamily: OutfitFamily.Regular,
    color: Colors.blackVar2,
    marginBottom: hp(1),
    marginTop: hp(1.8),
  },
  input: {
    height: hp(6), // matching SizeDropdown inner height
    borderWidth: 1,
    borderColor: Colors.borderGrey,
    borderRadius: wp(3.4),
    paddingHorizontal: wp(4),
    fontFamily: OutfitFamily.Regular,
    color: Colors.black,
    marginBottom: hp(1),
    backgroundColor: Colors.white,
    textAlignVertical: 'center',
  },
  textArea: {
    height: hp(10),
    textAlignVertical: 'top',
    paddingTop: hp(1.5),
  },
  dropdown: {
    height: hp(6), // matching SizeDropdown inner height
    borderColor: Colors.borderGrey,
    borderWidth: 1,
    borderRadius: wp(100),
    paddingHorizontal: wp(4),
    marginBottom: hp(1),
    color: Colors.graytext,
  },
  placeholderStyle: {
    fontFamily: OutfitFamily.Regular,
    color: Colors.graytext,
  },
  selectedTextStyle: {
    fontFamily: OutfitFamily.Regular,
    color: Colors.black,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(2.5),
  },
  chip: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.2),
    borderRadius: wp(100),
    borderWidth: 1,
    borderColor: Colors.borderGrey,
    backgroundColor: Colors.white,
    marginBottom: hp(0.8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: Colors.themeColor,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  chipText: {
    fontSize: FontSize.FONT_13,
    color: Colors.iconGrey || Colors.graytext,
    fontFamily: OutfitFamily.Regular,
  },
  chipTextSelected: {
    fontSize: FontSize.FONT_13,
    color: Colors.white,
    fontFamily: OutfitFamily.Regular,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // marginBottom: hp(1),
  },
  tagChip: {
    backgroundColor: Colors.cardBg,
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderRadius: wp(100),
    marginRight: wp(2),
    marginTop: hp(1),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderGrey,
    maxWidth: '100%',
  },
  tagText: {
    fontFamily: OutfitFamily.Regular,
    color: Colors.blackVar2,
    marginRight: wp(1),
    flexShrink: 1,
  },
  removeTagText: {
    fontFamily: OutfitFamily.Regular,
    color: Colors.danger, // Fallback if danger color not defined
    fontWeight: FontWeight.FONT_700,
    marginLeft: wp(1),
  },
  tagInputContainer: {
    marginBottom: hp(0.5),
  },
  saveButton: {
    backgroundColor: Colors.themeColor,
    // borderRadius: wp(100),
    paddingVertical: hp(2),
    alignItems: 'center',
    marginTop: hp(3),
    marginBottom: hp(5),
  },
  saveButtonText: {
    color: Colors.white,
    fontFamily: FontFamily?.Bold
    // fontSize: FontSize.FONT_16,
  },
  dropdownContainer: {
    borderRadius: wp(3),
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    marginTop: hp(1),
    overflow: 'hidden',
  },
  dropdownItemContainer: {
    // borderBottomWidth: 1,
    // borderBottomColor: Colors.borderGrey,
  },
  dropdownItemText: {
    fontFamily: OutfitFamily.Regular,
    color: Colors.black,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontFamily: OutfitFamily.Regular,
  },
});

export default AddOutfitDetails;
