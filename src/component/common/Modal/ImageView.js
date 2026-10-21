import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Modal, View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { imagePath } from '../../../constant/imagePath';
import { hp, wp } from '../../../utils/helper';
import { Colors } from '../../../constant/colors';

const ImageView = forwardRef(({
    imageUrl = '',
}, ref) => {
    const [visible, setVisible] = useState(false);

    useImperativeHandle(ref, () => ({
        open: () => {
            setVisible(true);
        },
        close: () => {
            setVisible(false);
        },
    }));

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
        >
            <View style={styles.outerModal}>
                <View style={styles.innerModal}>
                    <TouchableOpacity onPress={()=>setVisible(false)}>
                        <Image source={imagePath.big_cross} resizeMode="contain" style={styles.cross} />
                    </TouchableOpacity>
                    <Image resizeMode="contain" source={{uri:imageUrl}} style={styles.image} />
                </View>
            </View>
        </Modal>

    );
});


const styles = StyleSheet.create({
    innerModal: {
        width: wp(90),
        // height: hp(50),
        backgroundColor: Colors.white,
        borderRadius: wp(4),
        gap: hp(2),
        paddingVertical: hp(3),
        height:hp(80),
        alignSelf:"center"
    },
    outerModal: {
        flex: 1,
        backgroundColor: Colors.black_55_pee,
        justifyContent: 'center',
    },
    cross: {
        width: wp(7),
        height: wp(7),
        alignSelf: 'flex-end',
        marginHorizontal: wp(4),
    },
    image:{
        width:'100%',
        height:'90%'
    }
});


export default ImageView;
