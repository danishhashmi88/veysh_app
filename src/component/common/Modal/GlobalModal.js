import React, { useEffect, useRef, useState } from 'react';
import {
    Modal,
    Animated,
    View,
    Image,
    Text,
    TouchableOpacity,
    StyleSheet,
    Easing,
} from 'react-native';
import { hp, wp } from '../../../utils/helper';
import { Colors } from '../../../constant/colors';
import { FontFamily, FontSize, FontWeight } from '../../../constant/fonts';
import { useDispatch, useSelector } from 'react-redux';
import { updateGlobalSliceState, updateIsGuestUser, updateShowGlobalModal } from '../../../redux/slices/globalSlice';
import AppButton from '../Buttons/AppButton';
import { imagePath } from '../../../constant/imagePath';

const GlobalModal = ({
    title = 'Sign In to Proceed',
    description = 'Access your account to enjoy all features.',
    buttonTitle = 'Proceed to Login',
    popupImage = imagePath.guest,
    loading = false,
    iconStyle = { width: wp(26),height: wp(26), }
}) => {
    const dispatch = useDispatch();
    const globalState = useSelector(state => state.global);
    const [visible, setVisible] = useState(globalState?.showGlobalModal);

    const opacityAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(100)).current;

    const animateIn = () => {
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

    const animateOut = (callback) => {
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
        ]).start(() => {
            if (callback) callback();
        });
    };

    useEffect(() => {
        if (globalState?.showGlobalModal) {
            setVisible(true);
            animateIn();
        } else {
            animateOut(() => setVisible(false));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [globalState?.showGlobalModal]);

    const hide = () => {
        dispatch(updateShowGlobalModal());
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={hide}
        >
            <Animated.View
                style={[
                    styles.outerModal,
                    {
                        backgroundColor: opacityAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.6)']
                        })
                    }
                ]}
            >
                <Animated.View
                    style={[
                        styles.innerModal,
                        {
                            transform: [{
                                translateY: slideAnim.interpolate({
                                    inputRange: [0, 100],
                                    outputRange: [0, 300]
                                })
                            }]
                        }
                    ]}
                >
                    <TouchableOpacity onPress={hide}>
                        <Image source={imagePath.cross_circle} resizeMode="contain" style={styles.cross} />
                    </TouchableOpacity>
                    <View style={styles.midContent}>
                        <Image source={popupImage} resizeMode="contain" style={iconStyle} />
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.subText}>{description}</Text>
                    </View>
                    <View style={styles.row}>
                        <AppButton
                            width={wp(50)}
                            title={buttonTitle}
                            onPress={async() => {
                                dispatch(updateGlobalSliceState(false));
                                dispatch(updateShowGlobalModal(false));
                                dispatch(updateIsGuestUser(false))
                            }}
                            loading={loading}
                        />
                    </View>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
};

export const styles = StyleSheet.create({
    innerModal: {
        width: wp(100),
        backgroundColor: Colors.white,
        gap: hp(2),
        paddingVertical: hp(3)
    },
    outerModal: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    cross: {
        width: wp(7),
        height: wp(7),
        alignSelf: 'flex-end',
        marginHorizontal: wp(4),
    },
    midIcon: {
        width: wp(22),
        height: wp(22),
        backgroundColor: Colors.red100,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: wp(8)
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        width: wp(90),
        justifyContent: 'center',
        paddingVertical: hp(2),
    },
    title: {
        fontSize: FontSize.FONT_28,
        fontWeight:FontWeight.FONT_700,
        color: Colors.zink950,
        marginTop:hp(1.5)
    },
    subText: {
        fontSize: FontSize.FONT_14,
        fontWeight:FontWeight.FONT_400,
        color: Colors.zink500,
    },
    midContent: {
        alignItems: 'center',
        gap: wp(2.5),
    },
});

export default GlobalModal;
