import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { FontFamily, FontSize, FontWeight } from '../../../constant/fonts';
import { hp, wp } from '../../../utils/helper';
import { imagePath } from '../../../constant/imagePath';
import { Colors } from '../../../constant/colors';
import AppButton from '../Buttons/AppButton';

const DeleteItemModal = ({
  visible,
  onClose,
  onDelete,
  deleteMessage,
  imagess,
  showtitle,
  rightText,
  imageStyle,
}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Image
              source={imagess || imagePath.delete_Img || imagePath.cross_black}
              style={[styles.icon, imageStyle]}
              resizeMode="contain"
            />
          </View>

          {/* Text */}
          {!showtitle && <Text style={styles.title}>Delete Item</Text>}
          <Text style={styles.subtitle}>
            {deleteMessage
              ? deleteMessage
              : 'Are you sure you want to delete the item?'}
          </Text>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelButtonText}>No</Text>
            </TouchableOpacity>

            <AppButton
              style={styles.deleteButton}
              onPress={onDelete}
              activeOpacity={0.8}
              title={rightText ? rightText : 'Yes, Delete'}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const getStyles = Colors =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    modalContainer: {
      width: wp(100),
      backgroundColor: Colors.white,
      borderTopLeftRadius: wp(8),
      borderTopRightRadius: wp(8),
      paddingHorizontal: wp(5),
      paddingTop: hp(3),
      paddingBottom: hp(5),
      alignItems: 'center',
      // Shadow for iOS
      shadowColor: Colors.black,
      shadowOffset: {
        width: 0,
        height: -2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      // Elevation for Android
      elevation: 10,
    },
    iconContainer: {
      width: wp(16),
      height: wp(16),
      borderRadius: wp(6),
      backgroundColor: Colors.greyDark, // Light red background matching image
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: hp(1),
    },
    icon: {
      width: wp(10),
      height: wp(10),
      // tintColor: Colors.red, // Red Icon
    },
    title: {
      fontFamily: FontFamily.Bold,
      fontSize: FontSize.FONT_24,
      color: Colors.black,
      marginBottom: hp(1),
      textAlign: 'center',
    },
    subtitle: {
      // fontSize: FontSize.FONT_14,
      color: Colors.graytext,
      textAlign: 'center',
      marginBottom: hp(2),
      paddingHorizontal: wp(5),
      lineHeight: 20,
      fontFamily: FontFamily.OutfitMedium,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      gap: 15, // Gap between buttons
    },
    cancelButton: {
      flex: 1,
      backgroundColor: '#F7F6FA',
      paddingVertical: hp(2),
      borderRadius: wp(4.5),
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: '#ECEAF0',
    },
    cancelButtonText: {
      color: Colors.black,
      fontFamily: FontFamily.OutfitMedium,
      fontSize: FontSize.FONT_16,
    },
    deleteButton: {
      flex: 1,
      backgroundColor: Colors.themeColor, // Purple color matching screenshot
      paddingVertical: hp(2),
      //   borderRadius: wp(100),
      alignItems: 'center',
      justifyContent: 'center',
    },
    deleteButtonText: {
      color: Colors.white,
      fontFamily: FontFamily.OutfitMedium,
      fontSize: FontSize.FONT_16,
    },
  });

export default DeleteItemModal;
