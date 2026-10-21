import React from 'react';
import { View, Text, Modal, StyleSheet, Image } from 'react-native';
import { imagePath } from '../../../constant/imagePath';
import { Colors } from '../../../constant/colors';
import { FontFamily, FontSize, GaramondFamily } from '../../../constant/fonts';
import { hp, wp } from '../../../utils/helper';
// import LottieAnimation from '../UI/LottieAnimation';

const MaintainanceModal = ({showModal = false}) => {

    return (
        <Modal visible={showModal} transparent animationType="fade">
            <View style={styles.modalContent}>
                {/* <LottieAnimation/> */}
                {/* <Image source={imagePath.maintainance} style={{ width:wp(80),height:wp(60) }} resizeMode="contain" /> */}
                <Text style={styles.title}>We're Under Maintenance</Text>
                <Text style={styles.message}>Our app is temporarily unavailable while we make some improvements. Please check back shortly.</Text>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContent: {
        width: wp(100),
        height: hp(100),
        backgroundColor: '#fbfcff',
        paddingVertical: hp(10),
        borderRadius: 10,
        alignItems: 'center',
        justifyContent:'center',
        gap:10,
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
        textAlign: 'center',
        fontFamily: GaramondFamily.Regular,
        width:'80%',
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

export default MaintainanceModal;
