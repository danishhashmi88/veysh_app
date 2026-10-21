import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  Alert,
  KeyboardAvoidingView,
  Switch,
  Modal,
  TextInput,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-native-date-picker';
import ImagePicker from 'react-native-image-crop-picker';
import { useTheme } from '../../../../hooks/useTheme';
import AppButton from '../../../../component/common/Buttons/AppButton';
import SizeDropdown from '../../../../component/common/Inputs/SizeDropdown';
import MultiSelectDropdown from '../../../../component/common/Inputs/MultiSelectDropdown';
import LabelInput from '../../../../component/common/Inputs/LabelInput';
import Header from '../../../../component/common/UI/Header';
import AppCheckbox from '../../../../component/common/Inputs/AppCheckbox';
// import SizeDropdown from '../../../../component/common/Inputs/SizeDropdown';
// import Back from '../../../../component/common/Buttons/Back';
import { wp, hp, getCategorySizeLabels } from '../../../../utils/helper';
// import { addItem } from '../../../../redux/thunks/itemsThunk';
import {
  setTempItemData,
  clearTempItemData,
} from '../../../../redux/slices/itemsSlice';
import { addItem, updateItem } from '../../../../redux/thunks/itemsThunk';
import { getCategoriesApi, RemoveBgItemPicture, getBrandsListApi } from '../../../../services/user.service';
import { updateRootLoadingState } from '../../../../redux/slices/rootLoaderSlice';
import FullScreenImageModal from '../../../../component/common/Modal/FullScreenImageModal';

import { FontFamily, FontSize, FontWeight } from '../../../../constant/fonts';
import { showDangerToast, showSuccessToast } from '../../../../utils/toast';
import { imagePath } from '../../../../constant/imagePath';
import {
  moodsList,
  seasonsList,
  occasionsList,
  statusList,
  careList,
  categoriesList,
  subCategoriesList,
  colorPaletteBrand,
} from '../../../../constant';

const statusMap = {
  Donate: 0,
  Laundry: 1,
  Closet: 2,
  Sell: 3,
  Repair: 4,
  Lent: 5,
};

const CUSTOM_COLOR_PRESETS = [
  '#FF0000', '#FF4D4D', '#FF8C1A', '#FFD43B', '#F1C40F', '#2ECC71',
  '#1ABC9C', '#3498DB', '#5B2DFF', '#6A0DAD', '#FF4DFF', '#E056FD',
  '#000000', '#34495E', '#7B3F00', '#9E9E9E', '#BDC3C7', '#FFCC99',
  '#FFFFFF', '#ECF0F1', '#FFB6C1', '#87CEEB', '#708090', '#8B4513',
];

const isLightColor = hex => {
  if (!hex || typeof hex !== 'string') return false;
  const color = hex.replace('#', '');
  if (color.length !== 6) return false;
  const r = parseInt(color.slice(0, 2), 16);
  const g = parseInt(color.slice(2, 4), 16);
  const b = parseInt(color.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.78;
};

const resetColorModalState = (setters) => {
  setters.setNewColor('');
  setters.setNewColorCode(CUSTOM_COLOR_PRESETS[8]);
  setters.setColorError('');
  setters.setShowColorModal(false);
};

import { getStyles } from './styles';
import { capitalizeFirstLetter } from '../../../../constant/functions';
import PostSwitch from '../../../../component/Settings/PostSwitch';

const AddItemDetails = () => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
const scale = useSharedValue(0);
  const { imageUri, mediaType, itemDetail, autoTagData, skipAutoTag } = route.params || {};
  console.log("auto tag is", autoTagData)
  const { loading } = useSelector(state => state.items);
  const { userDetails } = useSelector(state => state.user);

  const [name, setName] = useState('');
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState(null);
  const [brand, setBrand] = useState('');
  const [brandList, setBrandList] = useState([]);
  const [price, setPrice] = useState('');
  const [purchasedOn, setPurchasedOn] = useState(null);

  const [openDate, setOpenDate] = useState(false);
  const [dynamicCategories, setDynamicCategories] = useState([]);
  const [dynamicSubCategories, setDynamicSubCategories] = useState([]);
  const [occasion, setOccasion] = useState('');
  const [mood, setMood] = useState('');
  const [season, setSeason] = useState('');
  const [status, setStatus] = useState('');
  const [care, setCare] = useState('');
  const [wearCount, setWearCount] = useState('');
  const [isAvailableToRentPurchase, setIsAvailableToRentPurchase] =
    useState(false);
  const [rentPurchasePrice, setRentPurchasePrice] = useState('');

  // RELOCATED STATE FROM CLOSET FORMDATA
  const [colorOptions, setColorOptions] = useState(
    colorPaletteBrand.map(c => ({
      label: c.name,
      value: c.name.toLowerCase(),
      colorCode: c.colorCode,
      showBorder: c.showBorder,
    })),
  );
  const [selectedColors, setSelectedColors] = useState([]);
  const [colorValue, setColorValue] = useState(null);
  const [showColorModal, setShowColorModal] = useState(false);
  const [newColor, setNewColor] = useState('');
  const [newColorCode, setNewColorCode] = useState(CUSTOM_COLOR_PRESETS[8]);
  const [colorError, setColorError] = useState('');

  const [fabricOptions, setFabricOptions] = useState([
    { label: 'Cotton', value: 'cotton' },
    { label: 'Linen', value: 'linen' },
    { label: 'Polyester', value: 'polyester' },
    { label: 'Nylon', value: 'nylon' },
    { label: 'Rayon', value: 'rayon' },
    { label: 'Viscose', value: 'viscose' },
    { label: 'Wool', value: 'wool' },
    { label: 'Silk', value: 'silk' },
    { label: 'Cashmere', value: 'cashmere' },
  ]);
  const [selectedFabrics, setSelectedFabrics] = useState([]);
  const [showFabricInput, setShowFabricInput] = useState(false);
  const [newFabric, setNewFabric] = useState('');
  const [fabricError, setFabricError] = useState('');

  const [notes, setNotes] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [tagError, setTagError] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [dynamicSizes, setDynamicSizes] = useState([]);
  // Validation States
  const [showSizeInput, setShowSizeInput] = useState(false);
  const [newSize, setNewSize] = useState('');
  const [sizeError, setSizeError] = useState('');
  const [nameError, setNameError] = useState('');
  const [priceError, setPriceError] = useState('');
  const [rentPurchasePriceError, setRentPurchasePriceError] = useState('');
  const [dateError, setDateError] = useState('');
  const [pendingAutoTag, setPendingAutoTag] = useState(null);

  const [selectedImage, setSelectedImage] = useState(imageUri || null);
  const [showPreview, setShowPreview] = useState(false);
  const scrollRef = React.useRef(null);
  const nameRef = React.useRef(null);
  const categoryRef = React.useRef(null);
  const subCategoryRef = React.useRef(null);
  const rentPriceRef = React.useRef(null);

  const [fieldLayouts, setFieldLayouts] = useState({});

  const onFieldLayout = (name) => (event) => {
    const { y } = event.nativeEvent.layout;
    setFieldLayouts(prev => ({ ...prev, [name]: y }));
  };

  const scrollToField = (fieldName) => {
    const yPos = fieldLayouts[fieldName];
    if (yPos !== undefined) {
      scrollRef.current?.scrollTo({
        y: yPos - hp(2),
        animated: true,
      });
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    if (showPreview) {
      scale.value = withSpring(1);
    } else {
      scale.value = 0;
    }
  }, [showPreview]);

  useEffect(() => {
    dispatch(clearTempItemData());
    fetchCategories();
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const payload = {
        page: 1,
        per_page: 100,
        sort: JSON.stringify({ column: 'title', order: 1 }),
      };
      const response = await getBrandsListApi(payload);
      console.log(response,"Brand List Response")
      if (response?.success && response?.data?.list) {
        const formattedBrands = response.data.list.map(b => ({
          label: b.title,
          value: b.title,
        }));
        setBrandList(formattedBrands);
      }
    } catch (error) {
      console.log('Error fetching brands:', error);
    }
  };

  // Synchronize Auto-Tagging Categories once Dynamic Categories are loaded
  useEffect(() => {
    if (pendingAutoTag && dynamicCategories && dynamicCategories.length > 0) {
      const itemData = pendingAutoTag;

      if (itemData.category && itemData.category !== 'N/A') {
        const foundCategory = dynamicCategories.find(
          cat => String(cat.value) === String(itemData.category),
        );
        if (foundCategory) {
          setCategory([foundCategory]);
          // Populate sub-categories for this category
          const mappedSubs = (foundCategory.subCategories || []).map(sub => ({
            label: sub.title,
            value: sub._id,
          }));
          setDynamicSubCategories(mappedSubs);

          // Populate sizes for this category
          console.log('Sizes API (auto-tag):', {
            category: foundCategory.label,
            rawSizes: foundCategory.sizes,
            mappedSizes: getCategorySizeLabels(foundCategory.sizes),
          });
          const mappedSizes = getCategorySizeLabels(foundCategory.sizes);
          setDynamicSizes(mappedSizes);

          // Now match sub-category
          if (itemData.sub_category && itemData.sub_category !== 'N/A') {
            const foundSub = mappedSubs.find(
              sub => String(sub.value) === String(itemData.sub_category),
            );
            if (foundSub) {
              setSubCategory(foundSub);
            }
          }
          if (itemData.size && itemData.size !== 'N/A') {
            const foundSub = mappedSizes.find(
              sub => String(sub) === String(itemData.size),
            );
            if (foundSub) {
              setSelectedSize(foundSub);
            }
          }
        }
      }
      setPendingAutoTag(null);
    }
  }, [dynamicCategories, pendingAutoTag]);

  // RELOCATED LOGIC FROM CLOSET FORMDATA
  const handleAddFabric = () => {
    setShowFabricInput(true);
  };

  const addNewColor = () => {
    const trimmed = newColor.trim();
    if (!trimmed) {
      setColorError('Color name cannot be empty.');
      return;
    }
    if (!newColorCode) {
      setColorError('Please select a color.');
      return;
    }
    const valueLower = trimmed.toLowerCase();
    const existing = colorOptions.find(
      item => item.value.toLowerCase() === valueLower,
    );

    // Already in palette: re-select if removed, only error if still selected
    if (existing) {
      if (selectedColors.includes(existing.value)) {
        setColorError('This color already exists.');
        return;
      }
      setSelectedColors(prev => [...prev, existing.value]);
      setColorValue(existing.value);
      resetColorModalState({
        setNewColor,
        setNewColorCode,
        setColorError,
        setShowColorModal,
      });
      return;
    }

    const newItem = {
      label: capitalizeFirstLetter(trimmed),
      value: valueLower,
      colorCode: newColorCode,
      showBorder: isLightColor(newColorCode),
    };
    setColorOptions([...colorOptions, newItem]);
    setSelectedColors(prev =>
      prev.includes(newItem.value) ? prev : [...prev, newItem.value],
    );
    setColorValue(newItem.value);
    resetColorModalState({
      setNewColor,
      setNewColorCode,
      setColorError,
      setShowColorModal,
    });
  };

  const openColorModal = () => {
    setNewColor('');
    setNewColorCode(CUSTOM_COLOR_PRESETS[8]);
    setColorError('');
    setShowColorModal(true);
  };

  const closeColorModal = () => {
    resetColorModalState({
      setNewColor,
      setNewColorCode,
      setColorError,
      setShowColorModal,
    });
  };

  const addNewSize = () => {
    const trimmed = newSize.trim();
    if (!trimmed) {
      setSizeError('Size cannot be empty.');
      return;
    }
    if (dynamicSizes.includes(trimmed)) {
      setSizeError('This size already exists.');
      return;
    }
    setDynamicSizes([...dynamicSizes, trimmed]);
    setSelectedSize(trimmed);
    setNewSize('');
    setShowSizeInput(false);
    setSizeError('');
  };

  const addNewFabric = () => {
    const trimmed = newFabric.trim();
    if (!trimmed) {
      setFabricError('Fabric name cannot be empty.');
      return;
    }
    const valueLower = trimmed.toLowerCase();
    const isDuplicate = fabricOptions.some(
      item => item.value.toLowerCase() === valueLower,
    );
    if (isDuplicate) {
      setFabricError('This fabric already exists.');
      return;
    }
    const newItem = {
      label: capitalizeFirstLetter(trimmed),
      value: valueLower,
    };
    setFabricOptions([...fabricOptions, newItem]);
    setSelectedFabrics(prev =>
      prev.includes(newItem.value) ? prev : [...prev, newItem.value],
    );
    setNewFabric('');
    setShowFabricInput(false);
    setFabricError('');
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (!trimmedTag) return;
    if (tags.length >= 7) {
      setTagError('You can only add up to 7 tags.');
      return;
    }
    const isDuplicate = tags.some(
      tag => tag.toLowerCase() === trimmedTag.toLowerCase(),
    );
    if (isDuplicate) {
      setTagError('You have already added this tag.');
      return;
    }
    setTags([...tags, trimmedTag]);
    setTagInput('');
    setTagError('');
  };

  const removeTag = indexToRemove => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleRemoveBackground = async uri => {
    try {
      dispatch(updateRootLoadingState(true));
      const formData = new FormData();
      const filename = uri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('image', {
        uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
        name: filename,
        type: type,
      });

      const res = await RemoveBgItemPicture(formData);

      if (res?.success && res?.data) {
        setSelectedImage(res.data?.image);
        const itemData = res.data?.itemData;
        if (itemData) {
          if (itemData.name && itemData.name !== 'N/A') setName(itemData.name);

          if (itemData.occasion && itemData.occasion !== 'N/A') {
            const matched = occasionsList.find(
              o => o.toLowerCase() === itemData.occasion.toLowerCase(),
            );
            if (matched) setOccasion(matched);
          }

          if (itemData.season && itemData.season !== 'N/A') {
            const matched = seasonsList.find(
              s => s.toLowerCase() === itemData.season.toLowerCase(),
            );
            if (matched) setSeason(matched);
          }

          if (itemData.mood && itemData.mood !== 'N/A') {
            const moodVal = itemData.mood.toLowerCase().replace(/[\s/]/g, '_');
            const matched = moodsList.find(
              m => m.toLowerCase().replace(/[\s/]/g, '_') === moodVal,
            );
            if (matched) setMood(matched);
          }

          if (itemData.care && itemData.care !== 'N/A') {
            const careVal = itemData.care.toLowerCase().replace(/[\s/]/g, '_');
            const matched = careList.find(
              c => c.toLowerCase().replace(/[\s/]/g, '_') === careVal,
            );
            if (matched) setCare(matched);
          }

          if (itemData.statuses && itemData.statuses !== 'N/A') {
            const matched = statusList.find(
              s => s.toLowerCase() === itemData.statuses.toLowerCase(),
            );
            if (matched) setStatus(matched);
          }

          // Handle Brand Name from API
          if (itemData.brand_name && itemData.brand_name !== 'N/A') {
            setBrand(itemData.brand_name);
          }

          // Trigger Category and Sub-category synchronization
          setPendingAutoTag(itemData);

          // Handle Detect Color
          if (itemData.colors && Array.isArray(itemData.colors)) {
            const normalized = itemData.colors.map(c => c.toLowerCase());
            setSelectedColors(prev => Array.from(new Set([...prev, ...normalized])));
          } else if (itemData.colors && typeof itemData.colors === 'string' && itemData.colors !== 'N/A') {
            const val = itemData.colors.toLowerCase();
            setSelectedColors(prev => (prev.includes(val) ? prev : [...prev, val]));
          }

          showSuccessToast('Item details auto-taged!');
        }
      } else {
        showDangerToast(res?.message || 'Failed to remove background');
      }
    } catch (error) {
      console.log('Error removing background:', error);
      showDangerToast('Something went wrong while removing background');
    } finally {
      dispatch(updateRootLoadingState(false));
    }
  };
  useEffect(() => {
    if (itemDetail) {
      if (Array.isArray(itemDetail?.images) && itemDetail?.images?.length > 0) {
        setSelectedImage(itemDetail?.images[0]);
      }
      setName(itemDetail?.name);
      setPrice(itemDetail?.price ? String(itemDetail?.price) : '');
      setOccasion(
        itemDetail?.occasion ? capitalizeFirstLetter(itemDetail?.occasion) : '',
      );
      setMood(
        itemDetail?.mood
          ? moodsList.find(m => m.toLowerCase().replace(/[\s/]/g, '_') === itemDetail.mood.toLowerCase()) || capitalizeFirstLetter(itemDetail.mood)
          : '',
      );
      setSeason(
        itemDetail?.season ? capitalizeFirstLetter(itemDetail?.season) : '',
      );
      setStatus(
        itemDetail?.statuses ? capitalizeFirstLetter(itemDetail?.statuses) : '',
      );
      setCare(
        itemDetail?.care
          ? careList.find(c => c.toLowerCase().replace(/[\s/]/g, '_') === itemDetail.care.toLowerCase()) || capitalizeFirstLetter(itemDetail.care)
          : '',
      );
      setIsAvailableToRentPurchase(
        itemDetail?.isAvailableToRentPurchase ||
        itemDetail?.is_available_for_rent_purchase ||
        itemDetail?.purchase_rent_toggle ||
        false,
      );
      setRentPurchasePrice(
        itemDetail?.rentPurchasePrice != null
          ? String(itemDetail.rentPurchasePrice)
          : itemDetail?.rent_purchase_price != null
            ? String(itemDetail.rent_purchase_price)
            : itemDetail?.purchase_rent_price != null
              ? String(itemDetail.purchase_rent_price)
              : '',
      );
      setPurchasedOn(
        itemDetail?.purchased_on ? new Date(itemDetail.purchased_on) : null,
      );
      if (itemDetail?.brand_name) {
        setBrand(itemDetail.brand_name);
      }
      setWearCount(
        itemDetail?.wear_count != null
          ? String(itemDetail.wear_count)
          : '',
      );

      // RELOCATED INITIALIZATION FOR EDITING
      if (itemDetail?.notes) setNotes(itemDetail.notes);
      if (itemDetail?.tags) setTags(itemDetail.tags);
      if (itemDetail?.colors?.length) {
        const apiColors = (itemDetail.colors || [])
          .filter(Boolean)
          .map(c => String(c).toLowerCase());
        setSelectedColors(apiColors);
        setColorOptions(prev => {
          const missingColors = apiColors.filter(
            colorVal => !prev.some(option => option.value === colorVal),
          );
          if (!missingColors.length) return prev;

          const extraOptions = missingColors.map(colorVal => {
            const paletteMatch = colorPaletteBrand.find(
              c => c.name.toLowerCase() === colorVal,
            );
            const colorCode = paletteMatch?.colorCode || '#9E9E9E';
            return {
              label: capitalizeFirstLetter(colorVal),
              value: colorVal,
              colorCode,
              showBorder: paletteMatch?.showBorder ?? isLightColor(colorCode),
            };
          });

          return [...prev, ...extraOptions];
        });
      }
      if (itemDetail?.fabric?.length) {
        const apiFabrics = (itemDetail.fabric || [])
          .filter(Boolean)
          .map(f => String(f).toLowerCase());
        setSelectedFabrics(apiFabrics);
        setFabricOptions(prev => {
          const missingFabrics = apiFabrics.filter(
            fabricVal => !prev.some(option => option.value === fabricVal),
          );
          if (!missingFabrics.length) return prev;

          const extraOptions = missingFabrics.map(fabricVal => ({
            label: capitalizeFirstLetter(fabricVal),
            value: fabricVal,
          }));

          return [...prev, ...extraOptions];
        });
      }
      if (itemDetail?.size) {
        setSelectedSize(capitalizeFirstLetter(String(itemDetail.size)));
      }
    }
  }, [itemDetail]);

  const fetchCategories = async () => {
    try {
      const res = await getCategoriesApi({ type: 'item' });
      if (res?.success && res?.data?.list) {
        console.log(
          'Sizes API (all categories):',
          JSON.stringify(
            res.data.list.map(item => ({
              category: item.title,
              categoryId: item._id,
              rawSizes: item.sizes,
              mappedSizes: getCategorySizeLabels(item.sizes),
            })),
            null,
            2,
          ),
        );

        const mappedCats = res.data.list.map(item => ({
          label: item.title,
          value: item._id,
          subCategories: item.subCategories || [],
          sizes: item.sizes || [],
        }));
        setDynamicCategories(mappedCats);

        if (itemDetail?.category) {
          const categoriesToLoad = Array.isArray(itemDetail.category) 
            ? itemDetail.category 
            : [itemDetail.category];
          
          const selectedCategories = mappedCats.filter(cat => 
            categoriesToLoad.some(c => String(c?._id || c?.value || c) === String(cat.value))
          );

          if (selectedCategories.length > 0) {
            setCategory(selectedCategories);

            let allMappedSubs = [];
            let allMappedSizes = [];

            selectedCategories.forEach(selectedCat => {
              const mappedSubs = (selectedCat.subCategories || []).map(sub => ({
                label: sub.title,
                value: sub._id,
              }));
              allMappedSubs = [...allMappedSubs, ...mappedSubs];

              const mappedSizes = (selectedCat.sizes || []).map(s =>
                typeof s === 'object' ? s.title : s,
              );
              allMappedSizes = [...allMappedSizes, ...mappedSizes];
            });

            const uniqueSubs = Array.from(
              new Map(allMappedSubs.map(item => [item.value, item])).values(),
            );
            const uniqueSizes = Array.from(new Set(allMappedSizes));

            setDynamicSubCategories(uniqueSubs);
            setDynamicSizes(uniqueSizes);

            const primaryCategory = selectedCategories[0];
            let mappedSizes = getCategorySizeLabels(primaryCategory.sizes);
            if (itemDetail?.size) {
              const savedSize = capitalizeFirstLetter(String(itemDetail.size));
              if (!mappedSizes.includes(savedSize)) {
                mappedSizes = [...mappedSizes, savedSize];
              }
              setSelectedSize(savedSize);
            }
            console.log('Sizes API (edit item):', {
              category: primaryCategory.label,
              rawSizes: primaryCategory.sizes,
              mappedSizes,
            });
            setDynamicSizes(mappedSizes);
            if (itemDetail?.sub_category?._id) {
              const selectedSubCategory = uniqueSubs.find(
                sub => String(sub.value) === String(itemDetail.sub_category._id),
              );

              if (selectedSubCategory) {
                setSubCategory(selectedSubCategory);
              }
            }
          }
        }
      }
    } catch (error) {
      console.log('Error fetching categories:', error);
    }
  };

  const handleCategoryChange = categoryIds => {
    const categoryListToSearch =
      dynamicCategories.length > 0 ? dynamicCategories : categoriesList;
    
    const selectedCategories = categoryListToSearch.filter(
      cat => categoryIds.includes(String(cat.value)),
    );

    setCategory(selectedCategories);
    setSubCategory(null);
    setSelectedSize('');

    if (selectedCategories.length === 0) {
      setDynamicSubCategories([]);
      setDynamicSizes([]);
      return;
    }

    let allMappedSubs = [];
    let allMappedSizes = [];

    selectedCategories.forEach(selectedCat => {
      const mappedSubs = (selectedCat.subCategories || []).map(sub => ({
        label: sub.title,
        value: sub._id,
      }));
      allMappedSubs = [...allMappedSubs, ...mappedSubs];

      const mappedSizes = getCategorySizeLabels(selectedCat.sizes || []);
      allMappedSizes = [...allMappedSizes, ...mappedSizes];
    });

    const uniqueSubs = Array.from(
      new Map(allMappedSubs.map(item => [item.value, item])).values(),
    );
    const uniqueSizes = Array.from(new Set(allMappedSizes));

    setDynamicSubCategories(uniqueSubs);
    setDynamicSizes(uniqueSizes);

    const primaryCategory = selectedCategories[0];
    console.log('Sizes API (category selected):', {
      categories: selectedCategories.map(cat => cat.label),
      primaryCategory: primaryCategory.label,
      rawSizes: primaryCategory.sizes,
      mappedSizes: uniqueSizes,
    });
  };

  useEffect(() => {
    if (imageUri && !itemDetail) {
      setSelectedImage(imageUri);

      // Only process auto-tag data if we haven't explicitly skipped it
      if (!skipAutoTag) {
        if (autoTagData) {
          processAutoTagData(autoTagData);
        } else {
          // Fallback: trigger background removal/tagging if data is missing
          handleRemoveBackground(imageUri);
        }
      }
    }
  }, [imageUri, autoTagData, itemDetail]);

  const processAutoTagData = (itemData) => {
    if (!itemData) return;

    if (itemData.name && itemData.name !== 'N/A') setName(itemData.name);

    if (itemData.occasion && itemData.occasion !== 'N/A') {
      const matched = occasionsList.find(
        o => o.toLowerCase() === itemData.occasion.toLowerCase(),
      );
      if (matched) setOccasion(matched);
    }

    if (itemData.season && itemData.season !== 'N/A') {
      const matched = seasonsList.find(
        s => s.toLowerCase() === itemData.season.toLowerCase(),
      );
      if (matched) setSeason(matched);
    }

    if (itemData.mood && itemData.mood !== 'N/A') {
      const matched = moodsList.find(
        m => m.toLowerCase() === itemData.mood.toLowerCase(),
      );
      if (matched) setMood(matched);
    }

    if (itemData.care && itemData.care !== 'N/A') {
      const matched = careList.find(
        c => c.toLowerCase() === itemData.care.toLowerCase(),
      );
      if (matched) setCare(matched);
    }

    if (itemData.statuses && itemData.statuses !== 'N/A') {
      const matched = statusList.find(
        s => s.toLowerCase() === itemData.statuses.toLowerCase(),
      );
      if (matched) setStatus(matched);
    }

    // Handle Brand Name from API
    if (itemData.brand_name && itemData.brand_name !== 'N/A') {
      setBrand(itemData.brand_name);
    }

    // Trigger Category and Sub-category synchronization
    setPendingAutoTag(itemData);

    // Handle Detect Color
    if (itemData.colors && Array.isArray(itemData.colors)) {
      const normalized = itemData.colors.map(c => c.toLowerCase());
      setSelectedColors(prev => Array.from(new Set([...prev, ...normalized])));
    } else if (itemData.colors && typeof itemData.colors === 'string' && itemData.colors !== 'N/A') {
      const val = itemData.colors.toLowerCase();
      setSelectedColors(prev => (prev.includes(val) ? prev : [...prev, val]));
    }
  };

  const handleImageSelect = () => {
    Alert.alert('Select Image', 'Choose an option', [
      {
        text: 'Camera',
        onPress: openCamera,
      },
      {
        text: 'Gallery',
        onPress: openGallery,
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const openCamera = () => {
    ImagePicker.openCamera({
      cropping: true,
      mediaType: 'photo',
      includeBase64: false,
      freeStyleCropEnabled: true,
      cropperFixedAspectRatio: false,
      cropperToolbarTitle: 'Crop Image',
    })
      .then(image => {
        console.log('Camera Image:', image);
        // setSelectedImage(image.path);
        handleRemoveBackground(image.path);
      })
      .catch(err => {
        console.log('Camera Error:', err);
        if (err.code !== 'E_PICKER_CANCELLED') {
          showDangerToast('Failed to open camera');
        }
      });
  };

  const openGallery = () => {
    ImagePicker.openPicker({
      cropping: true,
      mediaType: 'photo',
      includeBase64: false,
      freeStyleCropEnabled: true,
      cropperFixedAspectRatio: false,
      cropperToolbarTitle: 'Crop Image',
    })
      .then(image => {
        console.log('Selected Image:', image);
        // setSelectedImage(image.path);
        handleRemoveBackground(image.path);
      })
      .catch(err => {
        console.log('Image Picker Error:', err);
        if (err.code !== 'E_PICKER_CANCELLED') {
          showDangerToast('Failed to pick image');
        }
      });
  };

  const handleSave = async () => {
    // Reset errors
    setNameError('');
    setPriceError('');
    setDateError('');
    setRentPurchasePriceError('');

    let isValid = true;

    if (!name || name.trim().length === 0) {
      showDangerToast("Please enter a name.");
      setNameError("Please enter a name.");
      scrollToField('name');
      nameRef.current?.focus();
      isValid = false;
    } else if (!category || category.length === 0) {
      showDangerToast("Please select a category.");
      scrollToField('category');
      categoryRef.current?.focus();
      isValid = false;
    } else if (!subCategory || subCategory.length === 0) {
      showDangerToast("Please select a sub category.");
      scrollToField('subCategory');
      isValid = false;
    } else if (isAvailableToRentPurchase) {
      if (!rentPurchasePrice || Number(rentPurchasePrice) < 1) {
        setRentPurchasePriceError('Amount must be at least 1');
        scrollToField('rentPrice');
        rentPriceRef.current?.focus();
        isValid = false;
      }
    }

    if (!isValid) return;

    try {
      dispatch(updateRootLoadingState(true));
      const formData = new FormData();

      if (itemDetail?._id) {
        formData.append('o_id', itemDetail?._id);
      }

      if (selectedImage) {
        if (selectedImage.startsWith('http')) {
          const filename = selectedImage.split('/').pop() || `photo_${Date.now()}.jpg`;
          const match = /\.(\w+)$/.exec(filename);
          let type = match ? `image/${match[1]}` : 'image/jpeg';
          if (type === 'image/jpg') type = 'image/jpeg';
          formData.append('images', { uri: selectedImage, name: filename, type });
        } else {
          let uriToUpload = selectedImage;
          if (!uriToUpload.startsWith('file://') && !uriToUpload.startsWith('content://')) {
            uriToUpload = `file://${uriToUpload}`;
          }
          const filename = uriToUpload.split('/').pop() || `photo_${Date.now()}.jpg`;
          const match = /\.(\w+)$/.exec(filename);
          let type = match ? `image/${match[1]}` : 'image/jpeg';
          if (type === 'image/jpg') type = 'image/jpeg';
          formData.append('images', { uri: uriToUpload, name: filename, type });
        }
      }

      formData.append('name', name ? name : 'Untitled Item');
      formData.append('price', price ? price : '0');
      formData.append('wear_count', wearCount ? wearCount : '0');
      formData.append('brand_name', brand ? brand : 'None');
      if (purchasedOn) {
        formData.append('purchased_on', purchasedOn instanceof Date ? purchasedOn.toISOString() : purchasedOn);
      }

      if (category && category.length > 0) {
        formData.append('category', category.map(c => c.value).join(','));
      }
      if (subCategory?.value) formData.append('sub_category', subCategory.value);

      if (occasion) formData.append('occasion', occasion.toLowerCase());
      if (mood) formData.append('mood', mood.toLowerCase().replace(/[\s/]/g, '_'));
      if (season) formData.append('season', season.toLowerCase());
      if (care) formData.append('care', care.toLowerCase().replace(/[\s]+/g, '_'));
      if (status) formData.append('statuses', status.toLowerCase());

      if (selectedSize) {
        formData.append('size', selectedSize);
      }

      if (selectedColors?.length > 0) {
        formData.append('colors', JSON.stringify(selectedColors));
      }
      if (selectedFabrics?.length > 0) {
        formData.append('fabric', JSON.stringify(selectedFabrics));
      }
      if (notes) formData.append('notes', notes);
      let finalTags = [...tags];
      const pendingTag = tagInput.trim();
      if (pendingTag && !finalTags.includes(pendingTag) && finalTags.length < 7) {
        finalTags.push(pendingTag);
      }

      if (finalTags.length > 0) {
        formData.append('tags', JSON.stringify(finalTags));
      }

      formData.append('purchase_rent_toggle', isAvailableToRentPurchase);
      if (isAvailableToRentPurchase && rentPurchasePrice) {
        formData.append('purchase_rent_price', rentPurchasePrice);
      }

      console.log('formdata is1111', formData);
      let resultAction;
      if (itemDetail?._id) {
        resultAction = await dispatch(updateItem(formData));
      } else {
        resultAction = await dispatch(addItem(formData));
      }

      if (addItem.fulfilled.match(resultAction) || updateItem.fulfilled.match(resultAction)) {
        const payload = resultAction.payload;
        const createdItem = payload?.data || payload?.item || payload;
        const itemId = createdItem?._id || createdItem?.id;

        const isPremiumMessage = payload?.message
          ?.toLowerCase()
          .includes('premium subscription');

        if (isPremiumMessage || (!itemDetail && !itemId)) {
          showDangerToast(
            payload?.message || 'Subscription limit reached. Please upgrade.',
          );
          dispatch(updateRootLoadingState(false));
          return;
        }

        showSuccessToast(
          payload?.message ||
          (itemDetail ? 'Item updated successfully!' : 'Item added successfully!'),
        );

        if (itemDetail) {
          navigation.popToTop();
        } else {
          navigation.navigate('AddClosetFinalScreen', {
            itemId,
            itemName: name,
          });
        }
      } else {
        console.log("resultAction", resultAction)
        const errorMsg = resultAction.payload || resultAction.error?.message || 'Failed to save item';
        showDangerToast(`Error: ${errorMsg}`);
      }
    } catch (error) {
      console.error('Submission Error:', error);
      showDangerToast('An unexpected error occurred.');
    } finally {
      dispatch(updateRootLoadingState(false));
    }
  };

  const renderChipSection = (title, data, selected, setSelected) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.chipContainer}>
        {data.map((item, index) => {
          const label = typeof item === 'object' ? item.label : item;
          return (
            <TouchableOpacity
              key={index}
              style={[styles.chip, selected === label && styles.chipSelected]}
              onPress={() => setSelected(label === selected ? '' : label)}
            >
              <Text
                style={[
                  styles.chipText,
                  selected === label && styles.chipTextSelected,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <>
      <Header
        showLeftButton={true}
        onLeftButtonPress={() => navigation.goBack()}
        title={itemDetail ? 'Update Item Details' : 'Add Item Details'}
        backgroundColor={Colors.white}
      />
      <SafeAreaView
        style={[styles.container, { paddingTop: 0 }]}
        edges={['left', 'right', 'bottom']}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : hp(2)}
        >
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: hp(10) },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Image Upload UI */}
            <View style={styles.imageUploadContainer}>
              <View style={styles.imageUploadCard}>
                <View style={styles.imagePreviewWrapper}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() =>
                      selectedImage ? setShowPreview(true) : handleImageSelect()
                    }
                  >
                    <Image
                      source={
                        selectedImage
                          ? { uri: selectedImage }
                          : imagePath.placeholder
                      }
                      style={[
                        styles.imagePreview,
                        !selectedImage && styles.imagePreviewEmpty,
                      ]}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.imageEditBadge}
                    onPress={handleImageSelect}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    accessibilityLabel={
                      selectedImage ? 'Change image' : 'Upload image'
                    }
                  >
                    <Image
                      source={
                        selectedImage
                          ? imagePath.edit_pen
                          : imagePath.upload_icon
                      }
                      style={styles.imageEditIcon}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.imageActionsRow}>
                  <TouchableOpacity
                    style={styles.imagePrimaryAction}
                    onPress={handleImageSelect}
                    activeOpacity={0.85}
                  >
                    <Image
                      source={
                        selectedImage ? imagePath.edit_pen : imagePath.camera
                      }
                      style={styles.imageActionIcon}
                      resizeMode="contain"
                    />
                    <Text style={styles.imageActionText}>
                      {selectedImage ? 'Change photo' : 'Add photo'}
                    </Text>
                  </TouchableOpacity>

                  {selectedImage ? (
                    <TouchableOpacity
                      style={styles.imageSecondaryAction}
                      onPress={() => setShowPreview(true)}
                      activeOpacity={0.85}
                    >
                      <Image
                        source={imagePath.eye}
                        style={styles.imageActionIconMuted}
                        resizeMode="contain"
                      />
                      <Text style={styles.imageActionTextMuted}>Preview</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>

                <Text style={styles.imageUploadHint}>
                  {selectedImage
                    ? 'Tap the image to preview, or use the buttons below'
                    : 'Upload a clear photo of your item'}
                </Text>
              </View>
            </View>

            {/* {itemDetail?._id && (
              <LabelInput
                title="Item ID"
                value={String(itemDetail._id)}
                editable={false}
              />
            )} */}

            <View onLayout={onFieldLayout('name')}>
              <LabelInput
                title="Name"
                placeholder="Enter Name"
                ref={nameRef}
                value={name}
                // titleStyle={{ fontFamily: FontFamily.OutfitMedium }}
                onChangeText={text => {
                  setName(text);
                  if (nameError) setNameError('');
                }}
                errorText={nameError}
              />
            </View>

            <View style={styles.inputGroup} onLayout={onFieldLayout('category')}>
              <MultiSelectDropdown
                title="Category"
                placeholder="Select Category"
                marginTop={0}
                data={
                  dynamicCategories.length > 0
                    ? dynamicCategories
                    : categoriesList
                }
                ref={categoryRef}
                value={category.map(cat => String(cat.value))}
                onChange={handleCategoryChange}
              />
            </View>

            {/* SubCategory Chips (Only render if there are subcategories available) */}
            {dynamicSubCategories && dynamicSubCategories.length > 0 && (
              <View style={styles.sectionContainer} onLayout={onFieldLayout('subCategory')}>
                <Text style={styles.sectionTitle}>Sub-Category</Text>
                <View style={styles.chipContainer}>
                  {(dynamicSubCategories || []).map((item, index) => {
                    const isActive = subCategory?.value === item.value;
                    return (
                      <TouchableOpacity
                        key={index}
                        style={[styles.chip, isActive && styles.chipSelected]}
                        onPress={() => setSubCategory(isActive ? null : item)}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            isActive && styles.chipTextSelected,
                          ]}
                        >
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Size Chips */}
            {dynamicSizes && dynamicSizes.length > 0 && (
              <>
                <Text
                  style={[styles.label, { marginTop: hp(2), marginLeft: wp(2) }]}
                >
                  Size
                </Text>
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

                  {/* Custom Add Size Button */}
                  <TouchableOpacity
                    style={[
                      styles.sizeChip,
                      {
                        backgroundColor: Colors.voiletLight,
                        borderColor: Colors.themeColor,
                        borderStyle: 'dashed',
                        borderWidth: 1,
                      },
                    ]}
                    onPress={() => setShowSizeInput(true)}
                  >
                    <Text style={[styles.sizeText, { color: Colors.themeColor }]}>
                      + Add
                    </Text>
                  </TouchableOpacity>
                </View>

                {showSizeInput && (
                  <View style={{ marginTop: hp(1), paddingHorizontal: wp(2) }}>
                    <View style={styles.addBrandRow}>
                      <TextInput
                        style={styles.addBrandInput}
                        placeholder="Enter size..."
                        value={newSize}
                        onChangeText={text => {
                          setNewSize(text);
                          if (sizeError) setSizeError('');
                        }}
                        autoFocus
                      />
                      <TouchableOpacity style={styles.addBrandBtn} onPress={addNewSize}>
                        <Text
                          style={{
                            color: Colors.white,
                            fontWeight: FontWeight.FONT_600,
                          }}
                        >
                          ADD
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.cancelBrandBtn}
                        onPress={() => {
                          setShowSizeInput(false);
                          setNewSize('');
                          setSizeError('');
                        }}
                      >
                        <Text style={{ color: Colors.iconGrey }}>✕</Text>
                      </TouchableOpacity>
                    </View>
                    {sizeError ? (
                      <Text style={styles.errorText}>{sizeError}</Text>
                    ) : null}
                  </View>
                )}
              </>
            )}

            <SizeDropdown
              title="Brand Name"
              placeholder="Select Brand Name"
              data={brandList}
              value={brand}
              onChange={val => setBrand(val)}
              search={true}
              searchPlaceholder="Search brand..."
            />

            <LabelInput
              title="Price"
              placeholder="Enter Price"
              keyboardType="numeric"
              value={price}
              // titleStyle={{ fontWeight: FontWeight.FONT_500 }}
              onChangeText={text => {
                setPrice(text);
                if (priceError) setPriceError('');
              }}
              maxLength={10}
              errorText={priceError}
            />
            <LabelInput
              title="Wear Count"
              placeholder="Enter Wear Count"
              keyboardType="numeric"
              value={wearCount}
              // titleStyle={{ fontWeight: FontWeight.FONT_500 }}
              onChangeText={text => {
                const digitsOnly = (text ?? '').replace(/[^\d]/g, '');
                setWearCount(digitsOnly);
              }}
              maxLength={4}
            />

            <LabelInput
              title="Purchased On"
              placeholder="Select Date"
              value={purchasedOn ? purchasedOn.toDateString() : ''}
              type="calender"
              rightIcon={imagePath.calender}
              onRightIconPress={() => setOpenDate(true)}
              showRightIcon={true}
              errorText={dateError}
            />

            <DatePicker
              modal
              open={openDate}
              date={purchasedOn || new Date()}
              mode="date"
              maximumDate={new Date()}
              onConfirm={date => {
                setOpenDate(false);
                setPurchasedOn(date);
              }}
              onCancel={() => setOpenDate(false)}
            />

            {renderChipSection(
              'Occasion',
              occasionsList,
              occasion,
              setOccasion,
            )}
            {renderChipSection('Vibe', moodsList, mood, setMood)}
            {renderChipSection('Season', seasonsList, season, setSeason)}
            {renderChipSection('Status', statusList, status, setStatus)}
            {renderChipSection('Care', careList, care, setCare)}

            {/* RELOCATED COLOR SECTION */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Color</Text>
              <View style={styles.colorPallet}>
                {colorOptions.map((items, index) => {
                  const val = items.value.toLowerCase();
                  const isSelected = selectedColors.includes(val);
                  if (!items.colorCode) return null;
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        setSelectedColors(prev =>
                          prev.includes(val)
                            ? prev.filter(v => v !== val)
                            : [...prev, val],
                        );
                      }}
                      style={[
                        styles.colorViewContainer,
                        isSelected && styles.colorSelectedContainer,
                        !isSelected && items.showBorder && styles.colorBorderedContainer,
                      ]}
                    >
                      <View
                        style={[
                          styles.colorViewInner,
                          { backgroundColor: items.colorCode },
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
                })}

                {/* Aesthetic Add Color Button */}
                {!showColorModal && (
                  <TouchableOpacity
                    style={styles.addColorCircle}
                    onPress={openColorModal}
                  >
                    <Text
                      style={{
                        fontSize: 24,
                        color: Colors.themeColor,
                        fontWeight: '300',
                      }}
                    >
                      +
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {selectedColors?.length > 0 && (
                <View style={[styles.chipContainer, { marginTop: hp(1) }]}>
                  {selectedColors.map((val, index) => {
                    const label =
                      colorOptions.find(o => o.value === val)?.label ||
                      capitalizeFirstLetter(val);
                    return (
                      <View key={`${val}-${index}`} style={styles.tagChip}>
                        <Text style={styles.tagText}>{label}</Text>
                        <TouchableOpacity
                          onPress={() =>
                            setSelectedColors(prev => prev.filter(v => v !== val))
                          }
                        >
                          <Text style={styles.tagClose}>✕</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              )}

              <Modal
                visible={showColorModal}
                transparent
                animationType="slide"
                onRequestClose={closeColorModal}
              >
                <TouchableOpacity
                  style={styles.colorModalOverlay}
                  activeOpacity={1}
                  onPress={closeColorModal}
                >
                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.colorModalSheet}
                    onPress={() => {}}
                  >
                    <Text style={styles.colorModalTitle}>Add Custom Color</Text>

                    <View style={styles.colorPreviewRow}>
                      <View
                        style={[
                          styles.colorPreviewSwatch,
                          { backgroundColor: newColorCode },
                        ]}
                      />
                      <Text style={styles.colorPreviewLabel}>
                        {newColor.trim() || 'Color preview'}
                      </Text>
                    </View>

                    <LabelInput
                      title="Color Name"
                      placeholder="Enter color name..."
                      value={newColor}
                      onChangeText={text => {
                        setNewColor(text);
                        if (colorError) setColorError('');
                      }}
                      maxLength={15}
                    />

                    <Text style={[styles.sectionTitle, { marginTop: hp(1.5) }]}>
                      Pick a Color
                    </Text>
                    <ScrollView
                      nestedScrollEnabled
                      showsVerticalScrollIndicator={false}
                      style={{ maxHeight: hp(22) }}
                    >
                      <View style={styles.colorPickerGrid}>
                        {CUSTOM_COLOR_PRESETS.map((hex, presetIndex) => {
                          const isPicked = newColorCode === hex;
                          return (
                            <TouchableOpacity
                              key={`${hex}-${presetIndex}`}
                              onPress={() => {
                                setNewColorCode(hex);
                                if (colorError) setColorError('');
                              }}
                              style={[
                                styles.colorPickerSwatch,
                                { backgroundColor: hex },
                                isPicked && styles.colorPickerSwatchSelected,
                                !isPicked && isLightColor(hex) && styles.colorPickerSwatchLight,
                              ]}
                            />
                          );
                        })}
                      </View>
                    </ScrollView>

                    {colorError ? (
                      <Text style={styles.errorText}>{colorError}</Text>
                    ) : null}

                    <View style={styles.colorModalActions}>
                      <TouchableOpacity
                        style={styles.colorModalCancelBtn}
                        onPress={closeColorModal}
                      >
                        <Text style={styles.colorModalCancelText}>Cancel</Text>
                      </TouchableOpacity>
                      <AppButton
                        title="Add Color"
                        onPress={addNewColor}
                        style={{ flex: 1 }}
                      />
                    </View>
                  </TouchableOpacity>
                </TouchableOpacity>
              </Modal>
            </View>

            {/* RELOCATED FABRIC SECTION */}
            <View style={styles.sectionContainer}>
              <MultiSelectDropdown
                title="Fabric"
                placeholder="Select Fabric"
                data={fabricOptions}
                value={selectedFabrics}
                onChange={setSelectedFabrics}
              />
              {!showFabricInput ? (
                <TouchableOpacity style={styles.addBtn} onPress={handleAddFabric}>
                  <Text style={styles.addBtnText}>+ Add fabric</Text>
                </TouchableOpacity>
              ) : (
                <View>
                  <View style={styles.addBrandRow}>
                    <TextInput
                      style={styles.addBrandInput}
                      placeholder="Type fabric name..."
                      value={newFabric}
                      onChangeText={text => {
                        setNewFabric(text);
                        if (fabricError) setFabricError('');
                      }}
                      maxLength={15}
                      autoFocus
                    />
                    <TouchableOpacity style={styles.addBrandBtn} onPress={addNewFabric}>
                      <Text style={{ color: Colors.white, fontWeight: FontWeight.FONT_600 }}>ADD</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.cancelBrandBtn}
                      onPress={() => {
                        setShowFabricInput(false);
                        setNewFabric('');
                        setFabricError('');
                      }}
                    >
                      <Text style={{ color: Colors.iconGrey }}>✕</Text>
                    </TouchableOpacity>
                  </View>
                  {fabricError ? <Text style={styles.errorText}>{fabricError}</Text> : null}
                </View>
              )}
            </View>

            {/* RELOCATED TAGS SECTION */}
            <View style={styles.sectionContainer}>
              <LabelInput
                title="Tags"
                placeholder="Add tags..."
                value={tagInput}
                onChangeText={setTagInput}
                onSubmitEditing={addTag}
                onBlur={addTag}
              />
              {tags?.length > 0 && (
                <View style={[styles.chipContainer, { marginTop: hp(1) }]}>
                  {tags.map((tag, index) => (
                    <View key={index} style={styles.tagChip}>
                      <Text style={styles.tagText}>{tag}</Text>
                      <TouchableOpacity onPress={() => removeTag(index)}>
                        <Text style={styles.tagClose}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
              {tagError ? <Text style={styles.errorText}>{tagError}</Text> : null}
            </View>

            {/* RELOCATED NOTES SECTION */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Notes (Optional)</Text>
              <TextInput
                style={styles.textArea}
                multiline
                numberOfLines={4}
                placeholder="Enter notes here..."
                value={notes}
                onChangeText={setNotes}
              />
            </View>

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
              <PostSwitch
                value={isAvailableToRentPurchase}
                onValueChange={setIsAvailableToRentPurchase}
              />

            </View>

            {isAvailableToRentPurchase && (
              <View onLayout={onFieldLayout('rentPrice')}>
                <LabelInput
                  title="Rent/Purchase Amount"
                  placeholder="Enter Amount"
                  keyboardType="numeric"
                  ref={rentPriceRef}
                  value={rentPurchasePrice}
                  onChangeText={text => {
                    const numericText = text.replace(/[^0-9]/g, '');
                    setRentPurchasePrice(numericText);
                    if (rentPurchasePriceError) setRentPurchasePriceError('');
                  }}
                  maxLength={10}
                  errorText={rentPurchasePriceError}
                />
              </View>
            )}

            <AppButton
              title={itemDetail ? 'Update Item' : 'Add Item'}
              onPress={handleSave}
              loading={loading}
              marginTop={hp(3)}
              style={styles.btn}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <FullScreenImageModal
        visible={showPreview}
        imageUri={selectedImage}
        onClose={() => setShowPreview(false)}
        style={{ backgroundColor: Colors.borderGrey }}
      />
    </>
  );
};

export default AddItemDetails;
