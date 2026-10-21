import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Modal, View, Image, Text, TouchableOpacity, Animated, Easing, TextInput, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { styles } from './styles';
import { imagePath } from '../../constant/imagePath';
import AppButton from '../appButton';
import { wp } from '../../utils/helper';
import { Colors } from '../../constant/colors';
import DeviceInfo from 'react-native-device-info';
import { FontWeight } from '../../constant/fonts';

const DeleteModal = forwardRef(({
    title = 'Sign Out',
    description = 'Are you sure you want to sign out?',
    onPress = () => { },
    buttonTitle = 'Sign Out',
    popupImage = imagePath.delete_account,
    loading = false,
    iconStyle = { width: wp(10), height: wp(10) },
    cancelText = 'Cancel',
    showCross = true,
}, ref) => {
    const [visible, setVisible] = useState(false);

    const backgroundAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(100)).current;
    const [typedText, setTypedText] = useState('');

    const openModal = () => {
        setTypedText('');
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
        Keyboard.dismiss();
        setTimeout(() => {
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
                setTypedText('');
                setVisible(false);
            });
        }, 100);
    };

    useImperativeHandle(ref, () => ({
        open: openModal,
        close: closeModal,
    }));

    return (
        <Modal
            animationType="fade"
            transparent
            visible={visible}
            onRequestClose={closeModal}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
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
                                transform: [{
                                    translateY: slideAnim.interpolate({
                                        inputRange: [0, 100],
                                        outputRange: [0, 300],
                                    }),
                                }],
                            },
                        ]}
                    >
                        {
                            showCross &&
                            <TouchableOpacity onPress={closeModal}>
                                <Image source={imagePath.big_cross} resizeMode="contain" style={styles.cross} />
                            </TouchableOpacity>
                        }
                        <View style={styles.midContent}>
                            <View style={[styles.midIcon, { backgroundColor: Colors.appointmentColors.redBg }]}>
                                <Image source={popupImage} resizeMode="contain" style={iconStyle} />
                            </View>
                            <Text style={styles.title}>{title}</Text>
                            <Text style={styles.subText}>{description}</Text>
                            <Text style={[styles.subText, { marginTop: 15 }]}>
                                To confirm, type <Text style={{ fontWeight: FontWeight.FONT_700 }}>Delete</Text> below:
                            </Text>
                            <View style={styles.phoneInputView}>
                                <TextInput
                                    placeholder="Enter text"
                                    placeholderTextColor={Colors.black_scale_500}
                                    style={styles.input}
                                    onChangeText={(data) => setTypedText(data)}
                                    value={typedText}
                                />
                            </View>
                        </View>
                        <View style={styles.row}>
                            <AppButton
                                width={wp(42)}
                                title={cancelText}
                                onPress={closeModal}
                                backgroundColor={Colors.black}
                            />
                            <AppButton
                                width={wp(42)}
                                title={buttonTitle}
                                onPress={onPress}
                                loading={loading}
                                backgroundColor={Colors.red}
                                disabled={typedText !== 'Delete' || loading}
                                opacity={typedText === 'Delete' ? 1 : 0.3}
                            />
                        </View>
                    </Animated.View>
                </Animated.View>
            </KeyboardAvoidingView>
        </Modal>
    );
});

export default DeleteModal;

