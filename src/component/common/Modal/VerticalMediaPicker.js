import React, {
    forwardRef,
    useImperativeHandle,
    useState,
    useEffect,
} from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    PermissionsAndroid,
    Platform,
    Image,
    TouchableWithoutFeedback,
} from "react-native";
import ImagePicker from 'react-native-image-crop-picker';
import { showDangerToast } from "../../../utils/toast";
// Ensure correct import path for toast helper
import { imagePath } from "../../../constant/imagePath";
import { Colors } from "../../../constant/colors";
import { hp, wp } from "../../../utils/helper";
import { FontSize, FontWeight } from "../../../constant/fonts";

const MAX_FILE_SIZE_KB = 10240; // 5MB Limit
// const MAX_FILE_SIZE_KB = 5120; // 5MB Limit

const VerticalMediaPicker = forwardRef(
    ({ handleSelectedMedia = () => { } }, ref) => {
        const [visible, setVisible] = useState(false);

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

        const openModal = () => setVisible(true);
        const closeModal = () => setVisible(false);

        useImperativeHandle(ref, () => ({
            open: openModal,
            close: closeModal,
        }));

        const handleMedia = (media) => {
            handleSelectedMedia(media);
            closeModal();
        };

        const processImage = (image, source) => {
            console.log("image sis", image)
            const fileSizeInKB = image.size / 1024;
            console.log("fileSizeInKB", fileSizeInKB)
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
                source: source,
            });
        }

        const openGallery = () => {
            ImagePicker.openPicker({
                mediaType: "photo",
                cropping: true,
                freeStyleCropEnabled: true,
                cropperFixedAspectRatio: false,
                cropperToolbarTitle: "Crop Image",
            }).then(image => processImage(image, "gallery"))
                .catch(err => {
                    if (err.code !== 'E_PICKER_CANCELLED') console.warn("ImagePicker error:", err);
                });
        };

        const openCamera = () => {
            ImagePicker.openCamera({
                mediaType: "photo",
                cropping: true,
                freeStyleCropEnabled: true,
                cropperFixedAspectRatio: false,
                cropperToolbarTitle: "Crop Image",
            }).then(image => processImage(image, "camera"))
                .catch(err => {
                    if (err.code !== 'E_PICKER_CANCELLED') console.warn("Camera error:", err);
                });
        };

        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={visible}
                onRequestClose={closeModal}
            >
                <TouchableWithoutFeedback onPress={closeModal}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>

                            <View style={styles.modalContainer}>


                                <TouchableOpacity
                                    onPress={openCamera}
                                    style={styles.optionButton}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.iconContainer}>
                                        <Image
                                            source={imagePath.camera}
                                            resizeMode="contain"
                                            style={styles.optionIcon}
                                        />
                                    </View>
                                    <Text style={styles.optionText}>Take a Photo</Text>
                                </TouchableOpacity>


                                <View style={{ height: hp(1.5) }} />


                                <TouchableOpacity
                                    onPress={openGallery}
                                    style={styles.optionButton}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.iconContainer}>
                                        <Image
                                            source={imagePath.gallery}
                                            resizeMode="contain"
                                            style={styles.optionIcon}
                                        />
                                    </View>
                                    <Text style={styles.optionText}>Choose from Gallery</Text>
                                </TouchableOpacity>

                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        );
    }
);

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    modalContainer: {
        width: wp(90),
        backgroundColor: Colors.white,
        borderRadius: wp(5),
        padding: wp(4),
        marginBottom: hp(5),
        alignItems: 'center',
        shadowColor: Colors.blackVar2,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.profileTabBg,
        width: '100%',
        paddingVertical: hp(2.2),
        paddingHorizontal: wp(5),
        borderRadius: wp(3),
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: wp(4),
    },
    optionIcon: {
        width: wp(6),
        height: wp(6),
        tintColor: Colors.themeColor,
    },
    optionText: {
        fontSize: FontSize.FONT_16,
        fontWeight: FontWeight.FONT_600,
        color: Colors.black,
    },
});

export default VerticalMediaPicker;