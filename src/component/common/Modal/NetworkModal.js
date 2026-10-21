import React, { useEffect, useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Image } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { Colors } from '../../../constant/colors';
import { FontFamily, FontSize, GaramondFamily } from '../../../constant/fonts';
import { hp, wp } from '../../../utils/helper';
// import LottieAnimation from '../UI/LottieAnimation';
import { lottiePath } from '../../../constant/lottiePath';

const NoInternetModal = () => {
    const [isConnected, setIsConnected] = useState(true);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected ?? false);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const isNetworkConnected = async () => {
        fetch('https://www.google.com/')
            .then(response => {
                if (response.ok) {
                    setIsConnected(true);
                }
            })
            .catch(error => {
                return false;
            });
    };

    return (
        <Modal visible={!isConnected} transparent animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    {/* <LottieAnimation animationJson={lottiePath.no_internet} /> */}
                    {/* <Image source={imagePath.no_internet} style={{ width:wp(70),height: wp(60) }} resizeMode="contain" /> */}
                    <Text style={styles.title}>No Internet Connection</Text>
                    <Text style={styles.message}>Please check your network settings.</Text>
                    <TouchableOpacity onPress={() => isNetworkConnected()} style={styles.button}>
                        <Text style={styles.buttonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: wp(80),
        backgroundColor: Colors.white,
        paddingVertical: hp(10),
        borderRadius: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: FontSize.FONT_18,
        // marginBottom: 10,
        fontFamily: GaramondFamily.Regular,
        textAlign: 'center',
        color:Colors.black
    },
    message: {
        fontSize: FontSize.FONT_14,
        marginBottom: 20,
        textAlign: 'center',
        fontFamily: GaramondFamily.Regular,
        color:Colors.black_scale_700
    },
    button: {
        backgroundColor: Colors.themeColor,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: Colors.white,
        fontSize: FontSize.FONT_15,
        fontFamily: GaramondFamily.Bold,
    },
});

export default NoInternetModal;
