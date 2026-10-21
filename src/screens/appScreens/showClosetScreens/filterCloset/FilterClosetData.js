import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StatusBar } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getStyles } from './styles';
import { useTheme } from '../../../../hooks/useTheme';
import { wp } from '../../../../utils/helper';
import Back from '../../../../component/common/Buttons/Back';
import RangeSlider from '../../../../component/common/UI/RangeSlider';
import SizeDropdown from '../../../../component/common/Inputs/SizeDropdown';
import { useDispatch, useSelector } from 'react-redux';
import { getCategories } from '../../../../redux/thunks/itemsThunk';
import { showSuccessToast } from '../../../../utils/toast';
import { getUniqueSizesFromCategories, getCategorySizeLabels } from '../../../../utils/helper';
import {
  categoriesList,
  colorPalette, // [{name, colorCode, showBorder}]
  fabricOptions, // array of objects {label, value}
  occasionsList, // array of strings
  moodsList, // array of strings
  seasonsList, // array of strings
  statusList, // array of strings
  careList, // array of strings
} from '../../../../constant';
import { SafeAreaView } from 'react-native-safe-area-context';
import { imagePath } from '../../../../constant/imagePath';
import AppButton from '../../../../component/common/Buttons/AppButton';
import { FontFamily, FontSize, OutfitFamily } from '../../../../constant/fonts';
import Header from '../../../../component/common/UI/Header';

const FilterClosetData = () => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  const { ItemCategoryList: apiCategories } = useSelector(state => state.items);

  // Fetch Categories on Mount
  React.useEffect(() => {
    dispatch(getCategories({ type: 'item' }));
  }, [dispatch]);

  // Map API data to Dropdown format
  const categoryData =
    apiCategories?.map(item => ({
      label: item.title, // Fixed: API uses 'title', not 'name'
      value: item._id,
    })) || [];

  // State for filters
  const [category, setCategory] = useState(null);
  const [selectedColor, setSelectedColor] = useState([]); // Multi selection enabled
  const [selectedSize, setSelectedSize] = useState([]);
  const [selectedFabric, setSelectedFabric] = useState([]);
  const [selectedOccasion, setSelectedOccasion] = useState([]);
  const [selectedMood, setSelectedMood] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedCare, setSelectedCare] = useState([]);

  const filterSizes = React.useMemo(() => {
    if (category?.value) {
      const selectedCategory = apiCategories?.find(
        item => item._id === category.value,
      );
      return getCategorySizeLabels(selectedCategory?.sizes);
    }
    return getUniqueSizesFromCategories(apiCategories);
  }, [apiCategories, category]);

  // Price Range
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });

  // Set initial filters if provided
  React.useEffect(() => {
    const initialFilters = route.params?.initialFilters;
    if (initialFilters) {
      console.log(
        'FilterClosetData: Applying initial filters:',
        initialFilters,
      );

      // Category (needs apiCategories for the label/value object)
      if (initialFilters.category && apiCategories?.length > 0) {
        const found = apiCategories.find(
          c => c._id === initialFilters.category,
        );
        if (found) {
          setCategory({ label: found.title, value: found._id });
        }
      }

      if (initialFilters.colors) {
        const mapped = initialFilters.colors.map(fc => {
          const match = colorPalette.find(
            cp => cp.name.toLowerCase() === fc.toLowerCase(),
          );
          return match ? match.name : fc;
        });
        setSelectedColor(mapped);
      }

      if (initialFilters.size) setSelectedSize(initialFilters.size);
      if (initialFilters.fabric) setSelectedFabric(initialFilters.fabric);

      const findOrig = (list, val) =>
        list.find(l => l.toLowerCase() === val.toLowerCase()) || val;

      if (initialFilters.occasion)
        setSelectedOccasion(
          initialFilters.occasion.map(o => findOrig(occasionsList, o)),
        );
      if (initialFilters.mood)
        setSelectedMood(initialFilters.mood.map(m => findOrig(moodsList, m)));
      if (initialFilters.season)
        setSelectedSeason(
          initialFilters.season.map(s => findOrig(seasonsList, s)),
        );
      if (initialFilters.care)
        setSelectedCare(initialFilters.care.map(c => findOrig(careList, c)));

      if (initialFilters.status) {
        const revMap = {
          0: 'Donate',
          1: 'Laundry',
          2: 'Closet',
          3: 'Sell',
          4: 'Repair',
          5: 'Lent',
        };
        setSelectedStatus(
          initialFilters.status.map(s => revMap[s]).filter(Boolean),
        );
      }

      if (initialFilters.price) {
        setPriceRange(initialFilters.price);
      }
    }
  }, [apiCategories, route.params?.initialFilters]);

  const handleClearAll = () => {
    setCategory(null);
    setSelectedColor([]);
    setSelectedSize([]);
    setSelectedFabric([]);
    setSelectedOccasion([]);
    setSelectedMood([]);
    setSelectedSeason([]);
    setSelectedStatus([]);
    setSelectedCare([]);
    setPriceRange({ min: 1, max: 10000 });

    // Directly call onApply with empty filters and go back
    if (route.params?.onApply) {
      route.params.onApply({});
    }
    navigation.goBack();
  };

  const handleApply = () => {
    const filters = {};

    if (category) filters.category = category.value;

    if (selectedColor.length > 0)
      filters.colors = selectedColor.map(c => c.toLowerCase());

    if (selectedSize.length > 0) filters.size = selectedSize;

    if (selectedFabric.length > 0) filters.fabric = selectedFabric;

    if (selectedOccasion.length > 0)
      filters.occasion = selectedOccasion.map(o => o.toLowerCase());

    if (selectedMood.length > 0)
      filters.mood = selectedMood.map(m => m.toLowerCase());

    if (selectedSeason.length > 0)
      filters.season = selectedSeason.map(s => s.toLowerCase());

    if (selectedCare.length > 0)
      filters.care = selectedCare.map(c => c.toLowerCase());

    if (selectedStatus.length > 0) {
      const statusMap = {
        donate: 0,
        laundry: 1,
        closet: 2,
        sell: 3,
        repair: 4,
        lent: 5,
      };

      filters.status = selectedStatus
        .map(s => statusMap[s.toLowerCase()])
        .filter(v => v !== undefined);
    }

    if (priceRange.min >= 0 || priceRange.max < 10000) {
      filters.price = {
        min: priceRange.min,
        max: priceRange.max,
      };
    }

    if (route.params?.onApply) {
      route.params.onApply(filters);
    }

    navigation.goBack();
  };

  // Generic Chip Renderer (Single Select)
  // const renderChips = (data, selected, setSelected, isObject = false) => {
  //     return (
  //         <View style={styles.chipContainer}>
  //             {data.map((item, index) => {
  //                 const label = isObject ? item.label : item;
  //                 const value = isObject ? item.value : item;
  //                 const isSelected = selected === (isObject ? item : item);

  //                 return (
  //                     <TouchableOpacity
  //                         key={index}
  //                         style={[
  //                             styles.chip,
  //                             isSelected && { backgroundColor: Colors.limeGreen, borderWidth: 0, borderColor: 'transparent' }
  //                         ]}
  //                         onPress={() => setSelected(isSelected ? null : (isObject ? item : value))}
  //                     >
  //                         <Text style={[
  //                             styles.chipText,
  //                             isSelected && { color: Colors.black, fontWeight: '500' }
  //                         ]}>
  //                             {label}
  //                         </Text>
  //                     </TouchableOpacity>
  //                 );
  //             })}
  //         </View>
  //     );
  // };
  const renderChips = (data, selected, setSelected, isObject = false) => {
    return (
      <View style={styles.chipContainer}>
        {data.map((item, index) => {
          const label = isObject ? item.label : item;
          const value = isObject ? item.value : item;
          const isSelected =
            Array.isArray(selected) && selected.includes(value);

          // const isSelected = selected.includes(value);

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

  // Color Chip Renderer (Multi Select)
  const renderColorChips = () => {
    return (
      <View style={styles.chipContainer}>
        {colorPalette.map((item, index) => {
          const isSelected = selectedColor.includes(item.name);
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.colorCircleContainer,
                isSelected && {
                  borderColor: Colors.themeColor,
                  borderWidth: 2,
                },
                item.colorCode === Colors.white &&
                !isSelected && {
                  borderWidth: 1,
                  borderColor: Colors.borderGrey,
                },
              ]}
              onPress={() => {
                if (isSelected) {
                  setSelectedColor(prev => prev.filter(c => c !== item.name));
                } else {
                  setSelectedColor(prev => [...prev, item.name]);
                }
              }}
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
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <Header
        showLeftButton={true}
        onLeftButtonPress={() => navigation.goBack()}
        title="Filter"
        rightComponent={
          <TouchableOpacity
            onPress={handleClearAll}
          >
            <Text style={styles.clearAll}>Clear all</Text>
          </TouchableOpacity>
        }
        backgroundColor={Colors.white}
      />
      <View style={{ flex: 1, backgroundColor: Colors.backGroundColor1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Category */}
          <View style={styles.sectionContainer}>
            <SizeDropdown
              title="Category"
              placeholder="Select Category"
              data={categoryData}
              value={category}
              onChange={item => setCategory(item)}
              titleStyle={styles.sectionTitle} // 🟢 Yahan titleStyle pass kiya
            />
          </View>

          {/* Color */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Color</Text>
            {renderColorChips()}
          </View>

          {/* Size */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Size</Text>
            {renderChips(filterSizes, selectedSize, setSelectedSize)}
          </View>

          {/* Fabric */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Fabric</Text>
            {renderChips(
              fabricOptions,
              selectedFabric,
              setSelectedFabric,
              true,
            )}
          </View>

          {/* Occasion */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Occasion</Text>
            {renderChips(occasionsList, selectedOccasion, setSelectedOccasion)}
          </View>

          {/* Mood */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Mood</Text>
            {renderChips(moodsList, selectedMood, setSelectedMood)}
          </View>

          {/* Season */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Season</Text>
            {renderChips(seasonsList, selectedSeason, setSelectedSeason)}
          </View>

          {/* Status */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Status</Text>
            {renderChips(statusList, selectedStatus, setSelectedStatus)}
          </View>

          {/* Care */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Care</Text>
            {renderChips(careList, selectedCare, setSelectedCare)}
          </View>

          {/* Price Range */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Price Range</Text>
            <RangeSlider
              min={0}
              max={10000}
              initialMin={priceRange.min}
              initialMax={priceRange.max}
              onValueChange={val => {
                console.log('FilterClosetData: onValueChange received:', val);
                setPriceRange(val);
              }}
            />
          </View>

          {/* Footer Apply Button (Moved inside ScrollView) */}
          <View style={styles.footer}>
            <AppButton
              style={styles.applyButton}
              onPress={handleApply}
              activeOpacity={0.8}
              title="Apply"
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default FilterClosetData;
