import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../../../constant/colors';
import {
  FontFamily,
  FontSize,
  FontWeight,
  OutfitFamily,
} from '../../../../constant/fonts';
import { hp, wp } from '../../../../utils/helper';
import { imagePath } from '../../../../constant/imagePath';
import { showSuccessToast, showDangerToast } from '../../../../utils/toast';
import MediaPickerModal from '../../../../component/common/Modal/MediaPicker';
import LabelInput from '../../../../component/common/Inputs/LabelInput';
import Header from '../../../../component/common/UI/Header';
import AppButton from '../../../../component/common/Buttons/AppButton';
import { addToLookbookApi } from '../../../../services/user.service';

const CreateLookbook = () => {
  const navigation = useNavigation();
  const mediaPickerRef = React.useRef(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [websiteLink, setWebsiteLink] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSelectedMedia = media => {
    setSelectedImage(media);
  };

  const handleCreate = async () => {
    if (!selectedImage) {
      showDangerToast('Please select an image');
      return;
    }

    if (!title.trim()) {
      showDangerToast('Please enter title');
      return;
    }
    if (!websiteLink.trim()) {
      showDangerToast('Please enter website link');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('type', 'website'); // Can be 'outfit', 'website', or 'post'. Assuming custom ones might be website or outfit
      formData.append('title', title);
      formData.append('description', description);
      formData.append('isLookbook', true);

      if (websiteLink.trim()) {
        formData.append('website_link', websiteLink);
      }

      if (selectedImage) {
        formData.append('image', {
          uri: selectedImage.uri,
          type: selectedImage.type || 'image/jpeg',
          name: selectedImage.name || 'lookbook_image.jpg',
        });
      }

      const res = await addToLookbookApi(formData);
      if (res?.success === true || res?.status === 200) {
        showSuccessToast(res?.message || 'Lookbook created successfully');
        navigation.goBack();
      } else {
        let errorMsg = res?.message || 'Failed to create lookbook';
        if (Array.isArray(res?.error) && res.error.length > 0) {
          const messages = res.error
            .map(err => err?.msg || err)
            .filter(Boolean);
          if (messages.length > 0) {
            errorMsg = messages.join('\n');
          }
        } else if (res?.error && typeof res.error === 'string') {
          errorMsg = res.error;
        }
        showDangerToast(errorMsg);
      }
    } catch (error) {
      console.log('Error creating lookbook:', error?.response?.data || error);

      const errorData = error?.response?.data || error;
      let errorMsg =
        errorData?.message ||
        errorData?.error ||
        errorData?.msg ||
        error?.message ||
        'Something went wrong';

      if (Array.isArray(errorData?.error) && errorData.error.length > 0) {
        const messages = errorData.error
          .map(err => err?.msg || err)
          .filter(Boolean);
        if (messages.length > 0) {
          errorMsg = messages.join('\n');
        }
      } else if (typeof errorMsg === 'object') {
        if (Array.isArray(errorMsg)) {
          errorMsg =
            errorMsg
              .map(err => err?.msg || err)
              .filter(Boolean)
              .join('\n') || JSON.stringify(errorMsg);
        } else {
          errorMsg = JSON.stringify(errorMsg);
        }
      }

      showDangerToast(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        showLeftButton={true}
        onLeftButtonPress={() => navigation.goBack()}
        title="Create Lookbook"
        backgroundColor={Colors.white}
      />
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>Upload Image</Text>
          <TouchableOpacity
            style={styles.imagePickerContainer}
            onPress={() => mediaPickerRef.current?.open()}
          >
            <View style={styles.imagePlaceholder}>
              <Image
                source={imagePath.upload_icon_purple}
                style={styles.uploadIcon}
              />
              <Text style={styles.uploadText}>Upload Photo</Text>
              <Text style={styles.uploadSubText}>
                Tap to take a photo or choose from gallery
              </Text>
            </View>
          </TouchableOpacity>

          {selectedImage && (
            <View style={styles.thumbnailContainer}>
              <Image
                source={{ uri: selectedImage.uri }}
                style={styles.thumbnailImage}
              />
              <TouchableOpacity
                style={styles.removeIconContainer}
                onPress={() => setSelectedImage(null)}
              >
                <Text style={styles.removeIconText}>✕</Text>
              </TouchableOpacity>
            </View>
          )}

          <LabelInput
            title="Title"
            placeholder="Enter title"
            value={title}
            onChangeText={setTitle}
            marginTop={hp(2)}
            titleFont={FontSize.FONT_15}
            titleStyle={{ fontWeight: FontWeight.FONT_400 }}
          />

          <LabelInput
            title="Description"
            placeholder="Enter description"
            value={description}
            onChangeText={setDescription}
            multiline
            inputHeight={hp(12)}
            centerAlign={false}
            marginTop={hp(2)}
            borderRadius={wp(3)}
            titleFont={FontSize.FONT_15}
            titleStyle={{ fontWeight: FontWeight.FONT_400 }}
          />

          <LabelInput
            title="Website Link"
            placeholder="https://example.com"
            value={websiteLink}
            onChangeText={setWebsiteLink}
            keyboardType="url"
            autoCapitalize="none"
            marginTop={hp(2)}
            titleFont={FontSize.FONT_15}
            titleStyle={{ fontWeight: FontWeight.FONT_400 }}
          />

          <AppButton
            title="Save"
            onPress={handleCreate}
            loading={loading}
            disabled={loading}
            marginTop={hp(4)}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <MediaPickerModal
        ref={mediaPickerRef}
        handleSelectedMedia={handleSelectedMedia}
      />
    </View>
  );
};

export default CreateLookbook;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backGroundColor1,
  },
  scrollContent: {
    paddingHorizontal: wp(5),
    paddingBottom: hp(5),
    paddingTop: hp(2),
  },
  imagePickerContainer: {
    width: '100%',
    height: hp(15),
    backgroundColor: 'white',
    borderRadius: wp(3),
    marginBottom: hp(3),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.greyBorder,
  },
  sectionTitle: {
    fontSize: FontSize.FONT_16,
    color: Colors.black,
    fontFamily: FontFamily.OutfitMedium,
    marginBottom: hp(2),
  },
  thumbnailContainer: {
    width: wp(25),
    height: wp(25),
    borderRadius: wp(3),
    marginBottom: hp(2),
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: wp(3),
    resizeMode: 'cover',
  },
  removeIconContainer: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeIconText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: FontWeight.FONT_700,
  },
  imagePlaceholder: {
    alignItems: 'center',
  },
  uploadIcon: {
    width: wp(6),
    height: wp(6),
    tintColor: Colors.themeColor,
    marginBottom: hp(1),
  },
  uploadText: {
    fontSize: FontSize.FONT_13,
    color: Colors.black,
    fontFamily: FontFamily.OutfitMedium,
  },
  uploadSubText: {
    fontSize: FontSize.FONT_11,
    color: Colors.graytext,
    fontFamily: FontFamily.OutfitMedium,
    marginTop: hp(0.5),
  },
});
