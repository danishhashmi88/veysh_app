import React from 'react';
import {
  Modal,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Video from 'react-native-video';
import { wp, hp } from '../../../utils/helper';
import { Colors } from '../../../constant/colors';
import { imagePath } from '../../../constant/imagePath';

/**
 * FullScreenImageModal
 * Props:
 *   visible  - boolean, controls modal visibility
 *   imageUri - string, full URI of the image to display
 *   mediaType - string, 'image' or 'video'
 *   onClose  - function, called when the close button is pressed
 */
const FullScreenImageModal = ({ visible, imageUri, mediaType = 'image', onClose, style }) => {
  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={[styles.container, style]}>
        {/* Full-screen image/video */}
        {imageUri && mediaType === 'video' ? (
          <Video
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="contain"
            controls={true}
            paused={false}
          />
        ) : imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="contain"
          />
        ) : null}

        {/* Close button at bottom center */}
        <SafeAreaView style={styles.bottomBar}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.8}>
            <Image source={imagePath.crossbottom} style={styles.closeIcon} resizeMode="contain" />
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default FullScreenImageModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: 'center',
    paddingBottom: hp(3),
  },
  closeButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    width: wp(22),
    height: wp(22),
  },
});
