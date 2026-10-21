import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  Modal,
  ScrollView,
} from 'react-native';

import { hp, wp } from '../../../utils/helper';
import { FontFamily, FontSize, FontWeight } from '../../../constant/fonts';
import { Colors } from '../../../constant/colors';
import AppButton from '../Buttons/AppButton';
// import AppButton from '../AppButton';

const { height } = Dimensions.get('window');

const sortOptionsList = [
  { id: 1, label: 'Recently Added', value: { column: '_id', order: -1 } },
  {
    id: 2,
    label: 'Price High to Low',
    value: { column: 'price_sort', order: -1 },
  },
  {
    id: 3,
    label: 'Price Low to High',
    value: { column: 'price_sort', order: 1 },
  },
  { id: 4, label: 'Most Worn', value: { column: 'worn_count', order: -1 } },
  { id: 5, label: 'Never Worn', value: { column: 'worn_count', order: 1 } },
];

const SortModal = ({
  visible,
  onClose,
  onApply,
  currentSort = { column: 'price_sort', order: 1 },
}) => {
  const [selectedSort, setSelectedSort] = useState(currentSort);

  useEffect(() => {
    setSelectedSort(currentSort);
  }, [currentSort, visible]);

  const handleApply = () => {
    onApply(selectedSort);
    onClose();
  };

  const isSelected = optionValue => {
    if (!selectedSort || !optionValue) return false;
    return (
      String(selectedSort.column) === String(optionValue.column) &&
      String(selectedSort.order) === String(optionValue.order)
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Sort</Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* flexShrink: 1 is crucial here to prevent the ScrollView from pushing the button out */}
          <ScrollView
            style={styles.listContainer}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {sortOptionsList.map(option => (
              <TouchableOpacity
                key={option.id}
                style={styles.optionRow}
                onPress={() => setSelectedSort(option.value)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.radioOutline,
                    isSelected(option.value) && styles.radioActive,
                  ]}
                >
                  {isSelected(option.value) && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <Text style={styles.optionLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Safe wrapper for the apply button */}
          <View style={styles.buttonWrapper}>
            {/* <AppButton
              title="Apply"
              onPress={handleApply}
              activeOpacity={0.8}
            /> */}
            <AppButton
              style={styles.applyButton}
              onPress={handleApply}
              activeOpacity={0.8}
              title={"Apply"}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  container: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: wp(6),
    borderTopRightRadius: wp(6),
    paddingHorizontal: wp(6),
    paddingTop: hp(2.5),
    paddingBottom: Platform.OS === 'ios' ? hp(4) : hp(3),
    maxHeight: height * 0.8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  title: {
    fontSize: FontSize.FONT_24,
    fontFamily: FontFamily.Bold,
    color: Colors.black,
  },
  closeIcon: {
    fontSize: FontSize.FONT_20,
    color: '#71717A',
    fontWeight: '300',
  },
  listContainer: {
    // THIS is the property that fixes the layout issue
    flexShrink: 1,
    marginBottom: hp(1),
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1.5),
  },
  radioOutline: {
    width: wp(5.5),
    height: wp(5.5),
    borderRadius: wp(3),
    borderWidth: 1,
    borderColor: Colors.greyVar1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(3),
  },
  radioActive: {
    borderColor: '#7100D7',
    borderWidth: 1.5,
  },
  radioInner: {
    width: wp(2.5),
    height: wp(2.5),
    borderRadius: wp(2),
    backgroundColor: '#7100D7',
  },
  optionLabel: {
    fontSize: FontSize.FONT_14,
    color: Colors.black,
    fontFamily: FontFamily.OutfitMedium,
  },
  buttonWrapper: {
    // paddingTop: hp(2),
    paddingBottom: hp(1),
  },
  applyButton: {
    // backgroundColor: '#7100D7',
    // borderRadius: wp(8),
    height: hp(6.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButtonText: {
    color: Colors.white,
    fontSize: FontSize.FONT_16,
  },
});

export default SortModal;
