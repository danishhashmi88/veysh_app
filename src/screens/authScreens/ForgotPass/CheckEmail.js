import React, { useRef, useState } from 'react';
import {
    Image,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { styles } from './styles';
import Container from '../../../component/common/Container/Container';
import { SafeAreaView } from 'react-native-safe-area-context';
import { imagePath } from '../../../constant/imagePath';
import AppButton from '../../../component/common/Buttons/AppButton';
import { Colors } from '../../../constant/colors';
import { hp } from '../../../utils/helper';
import Back from '../../../component/common/Buttons/Back';
import { getGlobalStyles, GlobalStyle } from '../../../GlobalStyles/GlobalStyles';
import LabelInput from '../../../component/common/Inputs/LabelInput';
import { useNavigation, useTheme } from '@react-navigation/native';
import IconView from '../../../component/Auth/IconView';

function CheckEmail() {
    const navigation = useNavigation();
       const Colors = useTheme();
        const GlobalStyle = getGlobalStyles(Colors);

    return (
        <Container useGradient={true} style={styles.container}>
            <SafeAreaView style={styles.container}>
                <Back style={{ alignSelf: 'left' }} />
                <IconView style={{marginTop:hp(4)}} image={imagePath.check_email} />
                <View style={styles.textView}>
                    <Text style={GlobalStyle.authScreenTitle}>Check Your Email</Text>
                    <Text style={GlobalStyle.authScreenSubtitle}>Open the link in your email to create a new password.</Text>
                </View>
                <AppButton marginTop={hp(2)} title={"Okay"} 
                onPress={() => navigation.navigate('Login')} 
                />
            </SafeAreaView>
        </Container>
    );
}

export default CheckEmail;
