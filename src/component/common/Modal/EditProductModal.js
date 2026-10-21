import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import AppButton from "../Buttons/AppButton";
import { Colors } from "../../../constant/colors";
import { hp, wp } from "../../../utils/helper";
import { FontSize, FontWeight } from "../../../constant/fonts";
import { imagePath } from "../../../constant/imagePath";
import LabelInput from "../Inputs/LabelInput";
import MediaPickerModal from "./MediaPicker";
import { editProductSchema } from "../../../validations/userValidation";
import { useFormik } from "formik";
import { useNavigation } from "@react-navigation/native";
import { default_product_image } from "../../../constant";

const EditProductModal = forwardRef(({ onPress = () => { }, buttonTitle = t("save_change_text"), productData = null }, ref) => {
  const [visible, setVisible] = useState(false);
  const mediaPickerRef = useRef(null);
  const navigation = useNavigation();

  const closeModal = () => {
    setVisible(false);
    formik.resetForm();
  };

  useImperativeHandle(ref, () => ({
    open: () => setVisible(true),
    close: closeModal,
  }));

  const formik = useFormik({
    initialValues: {
      productName: "",
      price: "",
      description: "",
      image: "",
    },
    validationSchema: editProductSchema,
    onSubmit: (values) => {
      onPress(values);
    },
  });

  useEffect(() => {
    if (productData) {
      formik.setValues({
        productName: productData.title || "",
        price: productData.price ? String(productData.price) : "",
        description: productData.description || "",
        image: productData.image !== default_product_image
          ? {
            uri: productData.image,
            name: productData.image.split("/").pop(),
            type: "image/jpeg",
          }
          : null,
      });
    }
  }, [productData]);

  const handleSelectedMedia = (media) => {
    if (!media?.uri) return;

    let fileName = media.name || media.uri.split("/").pop() || "image.jpg";

    formik.setFieldValue("image", {
      uri: media.uri,
      name: fileName,
      type: media.type || "image/jpeg",
    });

    formik.setFieldTouched("image", true, false);
    formik.setErrors((prev) => ({ ...prev, image: undefined }));
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={closeModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>{t("editProduct_text")}</Text>
            <TouchableOpacity onPress={closeModal}>
              <Image source={imagePath.cross_circle} style={styles.cross} />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={{ paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <LabelInput
              showToggleIcon={false}
              title={t("product_name")}
              placeholder={t("placeholder_name")}
              value={formik.values.productName}
              onChangeText={formik.handleChange("productName")}
              errorText={
                formik.touched.productName && formik.errors.productName
                  ? t(formik.errors.productName)
                  : ""
              }
            />

            <LabelInput
              title={t("product_image")}
              type={"press"}
              placeholder={t("upload_text")}
              value={formik.values.image?.name || ""}
              errorText={
                formik.touched.image && formik.errors.image
                  ? t(formik.errors.image)
                  : ""
              }
              editable={false}
              clickable
              onRightIconPress={() => mediaPickerRef.current?.open()}
              showRightIcon
              rightIcon={imagePath.gallery_icon}
              tintColor={Colors.black}
            />

            <LabelInput
              showToggleIcon={false}
              keyboardType="number-pad"
              title={t("price_text")}
              placeholder={t("placeholder_price")}
              value={formik.values.price}
              onChangeText={formik.handleChange("price")}
              errorText={
                formik.touched.price && formik.errors.price
                  ? t(formik.errors.price)
                  : ""
              }
            />

            <LabelInput
              showToggleIcon={false}
              title={t("description_text")}
              placeholder={t("enter_text")}
              multiline
              inputHeight={hp(15)}
              centerAlign={false}
              value={formik.values.description}
              onChangeText={formik.handleChange("description")}
              errorText={
                formik.touched.description && formik.errors.description
                  ? t(formik.errors.description)
                  : ""
              }
            />
          </ScrollView>

          <View style={styles.buttonRow}>
            <AppButton
              width={wp(43)}
              title={t("cancel")}
              onPress={() => {
                setVisible(false);
              }}
              backgroundColor={Colors.white}
              borderWidth={1}
              textColor={Colors.lightRed}
            />
            <AppButton
              width={wp(43)}
              title={buttonTitle}
              onPress={formik.handleSubmit}
            />
          </View>

          <MediaPickerModal
            ref={mediaPickerRef}
            handleSelectedMedia={handleSelectedMedia}
          />
        </View>
      </View>
    </Modal>
  );
}
);

export default EditProductModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContainer: {
    width: wp(100),
    maxHeight: hp(80),
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: wp(4),
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: hp(2),
  },
  headerTitle: {
    fontSize: FontSize.FONT_18,
    fontWeight: FontWeight.FONT_600,
    color: Colors.black,
  },
  cross: {
    width: wp(5),
    height: wp(5),
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp(2),
    marginBottom: hp(3),
  },
});
