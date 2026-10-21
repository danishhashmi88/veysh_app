import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { Colors } from '../../../constant/colors';
import { wp, hp } from '../../../utils/helper';
import { FontFamily, FontSize, OutfitFamily } from '../../../constant/fonts';
import AppButton from '../Buttons/AppButton';

const RentBuyModal = ({ visible, onClose, onSubmit }) => {
  const [price, setPrice] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');

  const handlePickImage = async () => {
    try {
      const selectedImages = await ImagePicker.openPicker({
        multiple: true,
        mediaType: 'photo',
      });
      if (selectedImages) {
        const newImages = selectedImages.map((img) => ({
          uri: img.path,
          type: img.mime,
          name: img.filename || img.path.split('/').pop(),
        }));
        setImages((prev) => [...prev, ...newImages]);
      }
    } catch (error) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        console.warn('ImagePicker error:', error);
      }
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleApply = () => {
    if (!price || price.trim() === '') {
      setError('Please enter a Rent/Buy price.');
      return;
    }

    if (onSubmit) {
      onSubmit({ price, images });
    }
    setPrice('');
    setImages([]);
    setError('');
    onClose();
  };

  const handleClose = () => {
    setPrice('');
    setImages([]);
    setError('');
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={styles.modalBg}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Add to Rent/Buy</Text>

          <Text style={styles.label}>Rent / Buy Price</Text>
          <TextInput
            style={[styles.input, error ? { borderColor: Colors.danger || 'red', marginBottom: hp(0.5) } : {}]}
            placeholder="Enter Amount"
            keyboardType="numeric"
            value={price}
            maxLength={10}
            onChangeText={(text) => {
              setPrice(text.replace(/[^0-9]/g, ''));
              if (error) setError('');
            }}
          />
          {!!error && <Text style={styles.errorText}>{error}</Text>}

          <View style={styles.imageSelectorRow}>
            <Text style={styles.label}>Additional Images</Text>
            <TouchableOpacity onPress={handlePickImage} style={styles.addImgBtn}>
              <Text style={styles.addImgTxt}>+ Pick Images</Text>
            </TouchableOpacity>
          </View>

          <View style={{ maxHeight: hp(15), marginVertical: hp(1) }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {images.map((img, index) => (
                <View key={index} style={styles.imagePreviewWrapper}>
                  <Image source={{ uri: img.uri }} style={styles.imagePreview} />
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => handleRemoveImage(index)}
                  >
                    <Text style={styles.removeBtnTxt}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
              {images.length === 0 && (
                <Text style={styles.noImagesText}>No images selected.</Text>
              )}
            </ScrollView>
          </View>

          <View style={styles.footerBtns}>
            <AppButton
              title="Cancel"
              onPress={handleClose}
              width={wp(38)}
              backgroundColor={Colors.white}
              textColor={Colors.black}
              borderWidth={1}
              borderColor={Colors.borderGrey}
            />
            <AppButton title="Apply" onPress={handleApply} width={wp(38)} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: wp(90),
    backgroundColor: Colors.white,
    borderRadius: wp(4),
    padding: wp(5),
  },
  title: {
    fontSize: FontSize.FONT_20,
    fontFamily: FontFamily.Bold,
    color: Colors.black,
    marginBottom: hp(2),
    textAlign: 'center',
  },
  label: {
    fontSize: FontSize.FONT_14,
    fontFamily: OutfitFamily.Medium,
    color: Colors.blackVar2,
    marginBottom: hp(1),
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.borderGrey,
    borderRadius: wp(2),
    paddingHorizontal: wp(3),
    height: hp(6),
    fontFamily: OutfitFamily.Regular,
    color: Colors.black,
    marginBottom: hp(2),
  },
  errorText: {
    color: Colors.danger || 'red',
    fontSize: FontSize.FONT_12,
    fontFamily: OutfitFamily.Regular,
    marginBottom: hp(1.5),
  },
  imageSelectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  addImgBtn: {
    backgroundColor: Colors.voiletLight,
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    borderRadius: wp(1),
  },
  addImgTxt: {
    color: Colors.themeColor,
    fontFamily: OutfitFamily.Medium,
    fontSize: FontSize.FONT_12,
  },
  imagePreviewWrapper: {
    width: wp(20),
    height: wp(20),
    marginRight: wp(3),
    position: 'relative',
    borderRadius: wp(2),
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeBtn: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: wp(6),
    height: wp(6),
    borderBottomLeftRadius: wp(2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeBtnTxt: {
    color: Colors.white,
    fontSize: FontSize.FONT_16,
    fontWeight: 'bold',
  },
  noImagesText: {
    color: Colors.graytext,
    fontFamily: OutfitFamily.Regular,
    alignSelf: 'center',
    marginTop: hp(2),
  },
  footerBtns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(2),
  },
});

export default RentBuyModal;
