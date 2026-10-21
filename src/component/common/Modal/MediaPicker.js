import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
} from "react";
import {
  Modal,
  Animated,
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Easing,
} from "react-native";
import ImagePicker from 'react-native-image-crop-picker';
import { showDangerToast } from "../../../utils/toast";
import { imagePath } from "../../../constant/imagePath";
import { Colors } from "../../../constant/colors";
import { hp, wp } from "../../../utils/helper";
import { FontSize, FontWeight } from "../../../constant/fonts";

const MAX_FILE_SIZE_KB = 10240;

const MediaPickerModal = forwardRef(
  ({ handleSelectedMedia = () => { }, useCropper, cropDimensions }, ref) => {
    const [visible, setVisible] = useState(false);
    const [currentField, setCurrentField] = useState(null);

    const opacityAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(100)).current;

    useEffect(() => {
      requestCameraPermission();
    }, []);

    async function requestCameraPermission() {
      if (Platform.OS === "android") {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: "Camera Permission",
              message: "App needs camera permission",
              buttonNegative: "Cancel",
              buttonPositive: "OK",
            }
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
          console.warn(err);
          return false;
        }
      }
      return true;
    }

    const openModal = (field = null) => {
      setCurrentField(field);
      setVisible(true);
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    };

    const closeModal = () => {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 100,
          duration: 300,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => setVisible(false));
    };

    useImperativeHandle(ref, () => ({
      open: openModal,
      close: closeModal,
    }));

    const handleMedia = (media) => {
      if (currentField) {
        handleSelectedMedia(currentField, media);
      } else {
        handleSelectedMedia(media);
      }
      closeModal();
    };

    const openGallery = () => {
      ImagePicker.openPicker({
        mediaType: "photo",
        compressImageQuality: 0.8,
      }).then(image => {
        const fileSizeInKB = image.size / 1024;
        if (fileSizeInKB > MAX_FILE_SIZE_KB) {
          showDangerToast("Please select an image less than 10 MB.");
          closeModal();
          return;
        }

        let fileName = image.filename;
        if (!fileName && image.path) {
          fileName = image.path.split('/').pop();
        }

        handleMedia({
          name: fileName,
          type: image.mime,
          uri: image.path,
          source: "gallery",
        });
      }).catch(err => {
        if (err.code !== 'E_PICKER_CANCELLED') {
          console.warn("ImagePicker error:", err);
        }
      });
    };

    const openCamera = () => {
      ImagePicker.openCamera({
        mediaType: "photo",
        compressImageQuality: 0.8,
      }).then(image => {
        const fileSizeInKB = image.size / 1024;
        if (fileSizeInKB > MAX_FILE_SIZE_KB) {
          showDangerToast("Please select an image less than 5 MB.");
          closeModal();
          return;
        }

        let fileName = image.filename;
        if (!fileName && image.path) {
          fileName = image.path.split('/').pop();
        }

        handleMedia({
          name: fileName,
          type: image.mime,
          uri: image.path,
          source: "camera",
          sourceType: "camera",
        });
      }).catch(err => {
        if (err.code !== 'E_PICKER_CANCELLED') {
          console.warn("Camera error:", err);
        }
      });
    };

    return (
      <Modal animationType="fade" transparent visible={visible}>
        <Animated.View
          style={[
            styles.outerModal,
            {
              backgroundColor: opacityAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ["rgba(0,0,0,0)", "rgba(0,0,0,0.6)"],
              }),
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={closeModal}
            style={{ flex: 1, width: "100%" }}
          />
          <Animated.View
            style={[
              styles.innerModal,
              {
                transform: [
                  {
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 100],
                      outputRange: [0, 300],
                    }),
                  },
                ],
              },
            ]}
          >
            <TouchableOpacity onPress={openCamera} style={styles.iconText}>
              <Image
                source={imagePath.camera}
                resizeMode="contain"
                style={styles.cross}
              />
              <Text style={styles.title}>Open Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={openGallery} style={styles.iconText}>
              <Image
                source={imagePath.gallery}
                resizeMode="contain"
                style={styles.cross}
              />
              <Text style={styles.title}>Open Gallery</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </Modal>
    );
  }
);

const styles = StyleSheet.create({
  innerModal: {
    width: wp(100),
    backgroundColor: Colors.white,
    borderTopLeftRadius: wp(4),
    borderTopRightRadius: wp(4),
    height: hp(20),
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
  },
  outerModal: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    zIndex: 1000,
  },
  cross: {
    width: wp(8),
    height: wp(8),
    tintColor: Colors.themeColor,
  },
  title: {
    fontSize: FontSize.FONT_16,
    fontWeight: FontWeight.FONT_500,
    color: Colors.black_scale_800,
  },
  iconText: {
    alignItems: "center",
    gap: wp(3),
  },
});

export default MediaPickerModal;
