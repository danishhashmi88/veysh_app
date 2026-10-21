import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Modal,
  View,
  Image,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useTheme } from "../../../hooks/useTheme";
import { imagePath } from "../../../constant/imagePath";
import { hp, wp } from "../../../utils/helper";
import { FontSize, FontWeight } from "../../../constant/fonts";
// import { Colors } from "../../../constant/colors";

const CustomModal = forwardRef((props, ref) => {
  const Colors = useTheme();
  const styles = getStyles(Colors)
  const [visible, setVisible] = useState(false);
  const { children, topRightText = "options" } = props;

  const backgroundAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;

  const openModal = () => {
    setVisible(true);
    Animated.parallel([
      Animated.timing(backgroundAnim, {
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
      Animated.timing(backgroundAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 100,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => setVisible(false));
  };

  useImperativeHandle(ref, () => ({
    open: openModal,
    close: closeModal,
  }));

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={closeModal}
      animationType="none"
    >
      <Animated.View
        style={[
          styles.outerModal,
          {
            backgroundColor: backgroundAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ["rgba(0,0,0,0)", "rgba(0,0,0,0.6)"],
            }),
          },
        ]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
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
            <View style={styles.row}>
              <Text style={styles.title}>{topRightText}</Text>
              <TouchableOpacity onPress={closeModal}>
                <Image source={imagePath.cross_black} style={styles.cross} />
              </TouchableOpacity>
            </View>

            {children}
          </Animated.View>
        </KeyboardAvoidingView>
      </Animated.View>
    </Modal>
  );
});

export const getStyles = (Colors) => StyleSheet.create({
  innerModal: {
    width: wp(100),
    backgroundColor: Colors.white,
    paddingBottom: hp(3),
    paddingTop: hp(4),
    borderTopRightRadius:wp(6),
    borderTopLeftRadius:wp(6)
  },
  outerModal: {
    flex: 1,
    justifyContent: "flex-end",
  },
  cross: {
    width: wp(3),
    height: wp(3),
  },
  row: {
    flexDirection: "row",
    width: wp(90),
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "center",
    marginBottom: hp(2),
  },
  title: {
    fontSize: FontSize.FONT_16,
    fontWeight: FontWeight.FONT_700,
    color: Colors.blackVar2,
  },
});

export default CustomModal;
