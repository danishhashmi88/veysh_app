import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';


import { useTheme } from '../../../hooks/useTheme';
import { wp, hp } from '../../../utils/helper';
import LabelInput from '../../../component/common/Inputs/LabelInput';
import Back from '../../../component/common/Buttons/Back';
// import { updateUserData } from '../../../redux/slices/userSlice'; 
// import { AppButton } from '../../Bu' ;
import { styleTags, moodboardTags, sustainabilityTags } from '../../../constant/index.js';
import { getEditMyStyleStyles } from './styles.js';
import { FontSize } from '../../../constant/fonts.js';



const EditMyStyle = () => {
  const navigation = useNavigation();
  const Colors = useTheme();
  const styles = getEditMyStyleStyles(Colors);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    styleIcons: '',
    selectedStyles: [],
    selectedMoodboard: [],
    pinterestLink: '',
    preferredBrands: '',
    selectedSustainability: []
  });

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

  const handleSave = () => {
    console.log("Saving Data:", formData);
    // dispatch(updateUserData({ myStyle: formData })); 
    navigation.goBack();
  };


  const renderChipSection = (title, data, key) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.chipsRow}>
        {data.map((item) => {
          const isSelected = formData[key].includes(item.label);
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.chip,
                isSelected && styles.chipActive
              ]}
              onPress={() => toggleChip(key, item.label)}
            >
              <Text style={[
                styles.chipText,
                isSelected && styles.chipTextActive
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />


      <View style={styles.headerRow}>
        <Back style={{ backgroundColor: Colors.bgGrey }} />
        <Text style={styles.headerTitle}>Edit My Style</Text>
        <View style={{ width: wp(10) }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>


        <View style={styles.sectionContainer}>
          <LabelInput
            title="Who are your style icons?"
            placeholder="Enter celebs/influencers or Pinterest/Instagram"
            value={formData.styleIcons}
            onChangeText={(val) => updateState('styleIcons', val)}
            inputHeight={hp(11.5)}
            multiline={true}
            // inputStyle={{ textAlignVertical: 'top', paddingTop: hp(1.5), fontSize: 13 }} 
            // titleFont={FontSize.FONT_14}
            // style={{ fontSize: 5 }}
            width="100%"
            borderRadius={hp(1)}
          />
        </View>


        {renderChipSection("Style", styleTags, 'selectedStyles')}
        {renderChipSection("Moodboard", moodboardTags, 'selectedMoodboard')}


        <View style={styles.sectionContainer}>
          <LabelInput
            title="Pinterest link"
            placeholder="Enter Pinterest link"
            value={formData.pinterestLink}
            onChangeText={(val) => updateState('pinterestLink', val)}
            width="100%"
          />
        </View>

        {/* <View style={[styles.sectionContainer, { marginTop: wp(-1.5) }]}>
          <LabelInput
            title="Preferred brands/marketplaces"
            placeholder="Enter Preferred brands/marketplaces"
            value={formData.preferredBrands}
            onChangeText={(val) => updateState('preferredBrands', val)}
            width="100%"
          />
        </View> */}


        {renderChipSection("Sustainability Preferences", sustainabilityTags, 'selectedSustainability')}

        {/* Save Button */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>
        {/* <AppButton /> */}

      </ScrollView>
    </SafeAreaView>
  );
};

export default EditMyStyle;