import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors } from '../../../constant/colors';
import { hp, wp } from '../../../utils/helper';
import { FontSize, FontWeight } from '../../../constant/fonts';
import AppButton from '../../../component/common/Buttons/AppButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { RemoveBgItemPicture } from '../../../services/user.service';
import { updateRootLoadingState } from '../../../redux/slices/rootLoaderSlice';
import { showDangerToast, showSuccessToast } from '../../../utils/toast';
import { useState, useEffect } from 'react';

const ImagePreview = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { imageUri, mediaType } = route.params || {};

  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const dispatch = useDispatch();
  const [currentImage, setCurrentImage] = useState(imageUri);
  const [autoTagData, setAutoTagData] = useState(null);
  const [isAiEnabled, setIsAiEnabled] = useState(false);

  const toggleAi = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsAiEnabled(!isAiEnabled);
  };

  useEffect(() => {
    if (imageUri) {
      handleProcessImage(imageUri);
    }
  }, [imageUri]);

  const handleProcessImage = async (uri) => {
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
        setCurrentImage(res.data?.image);
        setAutoTagData(res.data?.itemData);
      } else {
        showDangerToast(res?.message || 'Failed to process image');
      }
    } catch (error) {
      console.log('Error processing image:', error);
      showDangerToast('Something went wrong processing image');
    } finally {
      dispatch(updateRootLoadingState(false));
    }
  };

  const handleNext = () => {
    if (!currentImage) {
      console.log('No image found, cannot navigate');
      return;
    }
    navigation.navigate('AddItemDetails', {
      imageUri: currentImage,
      mediaType: mediaType || 'image/jpeg',
      autoTagData: autoTagData,
      skipAutoTag: !isAiEnabled,
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
        {currentImage ? (
          <Image
            source={{ uri: currentImage }}
            style={styles.fullImage}
            resizeMode="contain"
          />
        ) : (
          <Text style={styles.errorText}>No Image Selected</Text>
        )}
      </View>

      <View style={styles.aiToggleContainer}>
        <View style={styles.aiInfo}>
          <Text style={styles.aiTitle}>Auto-tag items</Text>
          <Text style={styles.aiDescription}>
            Automatically detect category, brand and color
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={toggleAi}
          style={[
            styles.toggleOuter,
            isAiEnabled && { backgroundColor: Colors.themeColor },
          ]}
        >
          <View
            style={[
              styles.toggleInner,
              isAiEnabled ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' },
            ]}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <AppButton
          title="Next"
          onPress={handleNext}
          width={wp(90)}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  header: {
    marginTop: Platform.OS === 'ios' ? 20 : 20,
    justifyContent: 'center',
    paddingHorizontal: wp(4),
    zIndex: 10,
  },
  backButton: {
    paddingHorizontal: wp(2),
  },
  backText: {
    color: Colors.white,
    fontSize: FontSize.FONT_16,
    fontWeight: FontWeight.FONT_500,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: wp(100),
    height: hp(75),
  },
  errorText: {
    color: Colors.white,
    fontSize: FontSize.FONT_16,
  },
  footer: {
    position: 'absolute',
    bottom: hp(4),
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: wp(5),
  },
  nextButton: {
    backgroundColor: Colors.themeColor,
    width: wp(90),
    height: hp(6),
    borderRadius: wp(100),
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    color: Colors.white,
    fontSize: FontSize.FONT_18,
    fontWeight: FontWeight.FONT_600,
  },
  aiToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: wp(5),
    padding: wp(4),
    borderRadius: wp(4),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: hp(15),
  },
  aiInfo: {
    flex: 1,
  },
  aiTitle: {
    color: Colors.white,
    fontSize: FontSize.FONT_16,
    fontWeight: FontWeight.FONT_600,
  },
  aiDescription: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: FontSize.FONT_12,
    marginTop: 2,
  },
  toggleOuter: {
    width: wp(12),
    height: hp(3),
    borderRadius: wp(10),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 2,
    justifyContent: 'center',
  },
  toggleInner: {
    width: hp(2.5),
    height: hp(2.5),
    borderRadius: hp(1.25),
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default ImagePreview;
