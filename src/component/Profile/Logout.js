import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  Modal,
  View,
  Image,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { styles } from './styles';
import { imagePath } from '../../constant/imagePath';
import { Colors } from '../../constant/colors';
import { wp } from '../../utils/helper';
import AppButton from '../common/Buttons/AppButton';

const LogoutModal = forwardRef(
  (
    {
      title = 'Logout',
      description = 'Are you sure you want to logout?',
      onPress = () => { },
      buttonTitle = 'Yes',
      popupImage = imagePath.LogOut,
      loading = false,
      iconStyle = { width: wp(11), height: wp(11), tintColor: Colors.themeColor },
      cancelText = 'No',
      showCross = true,
      showIcon = true,
      showCancel = true,
    },
    ref,
  ) => {
    const [visible, setVisible] = useState(false);
    const [modalData, setModalData] = useState({});

    const backgroundAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(100)).current;

    const openModal = (data = {}) => {
      setModalData(data);
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
      ]).start(() => {
        setVisible(false);
      });
    };

    useImperativeHandle(ref, () => ({
      open: openModal,
      close: closeModal,
    }));

    return (
      <Modal transparent visible={visible} onRequestClose={closeModal}>
        <Animated.View
          style={[
            styles.outerModal,
            {
              backgroundColor: backgroundAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.6)'],
              }),
            },
          ]}
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
            {showCross && (
              <TouchableOpacity onPress={closeModal}>
                <Image source={imagePath.cross_circle} style={styles.cross} />
              </TouchableOpacity>
            )}
            <View style={styles.midContent}>
              {showIcon && (
                <View style={styles.midIcon}>
                  <Image
                    source={modalData.LogOut || popupImage}
                    resizeMode="contain"
                    style={iconStyle}
                  />
                </View>
              )}
              <Text style={styles.title}>{modalData.title || title}</Text>
              <Text style={styles.subText}>
                {modalData.description || description}
              </Text>
            </View>
            <View style={styles.row}>
              {showCancel && (
                <AppButton
                  width={wp(42)}
                  title={modalData.cancelText || cancelText}
                  onPress={closeModal}
                  backgroundColor={Colors.backGroundColor1}
                  textColor={Colors.black}
                  borderColor={Colors.borderNoButton}
                  borderWidth={1}
                />
              )}
              <AppButton
                width={showCancel ? wp(42) : wp(90)}
                title={modalData.buttonTitle || buttonTitle}
                onPress={modalData.onPress || onPress}
                loading={loading}
              />
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    );
  },
);

export default LogoutModal;
