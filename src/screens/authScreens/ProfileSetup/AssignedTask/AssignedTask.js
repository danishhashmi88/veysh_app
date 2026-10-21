/* eslint-disable react-native/no-inline-styles */
import React, { useRef, useState, useEffect } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Container from '../../../../component/common/Container/Container';
import { getStyles } from './styles';
import Back from '../../../../component/common/Buttons/Back';
import Skip from '../../../../component/common/Buttons/Skip';
import { getGlobalStyles } from '../../../../GlobalStyles/GlobalStyles';
import { hp, wp, safeGoBack } from '../../../../utils/helper';
import ProgressBar from '../../../../component/common/UI/ProgressBar';
import AppButton from '../../../../component/common/Buttons/AppButton';
import BottomSeperator from '../../../../component/common/Seperator/BottomSeperator';
import { useTheme } from '../../../../hooks/useTheme';
import { imagePath } from '../../../../constant/imagePath';
import CustomModal from '../../../../component/common/Modal/CustomModal';
import LabelInput from '../../../../component/common/Inputs/LabelInput';
import Header from '../../../../component/common/UI/Header';
import { FontSize } from '../../../../constant/fonts';

function AssignedTask() {
  const navigation = useNavigation();
  const Colors = useTheme();
  const GlobalStyle = getGlobalStyles(Colors);
  const styles = getStyles(Colors);
  const customModalRef = useRef();

  const [loading, setLoading] = useState(true);
  const [stylistData, setStylistData] = useState(null);
  const [task, setTask] = useState('');

  useEffect(() => {
    fetchStylistProfile();
  }, []);

  const fetchStylistProfile = async () => {
    try {
      setLoading(true);

      //  API CALL
      // const response = await fetch('https://your-api.com/get-assigned-stylist');
      // const json = await response.json();

      // mock data (api call tak fake data)

      setTimeout(() => {
        const mockApiData = {
          id: 101,
          name: 'Nancy Pastor',
          expertise: 'Expertise in Luxury fashion, Western Wear',
          profile_image: 'https://randomuser.me/api/portraits/women/44.jpg',
        };

        setStylistData(mockApiData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('API Error:', error);
      setLoading(false);
      Alert.alert('Error', 'Failed to load stylist profile.');
    }
  };

  const handleAssignTask = () => {
    if (!task.trim()) {
      Alert.alert('Validation', 'Please enter a task details.');
      return;
    }

    console.log(`Task Assigned to ${stylistData?.name}:`, task);

    setTask('');
    customModalRef.current.close();
    Alert.alert('Success', 'Task assigned successfully!');
  };

  return (
    <Container backgroundColor="#FFFFFF">
      <View style={{ flex: 1, width: '100%', backgroundColor: '#FFFFFF' }}>
        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

          {/* Header Area */}
          <Header
            showLeftButton={navigation.canGoBack()}
            onLeftButtonPress={() => safeGoBack(navigation, 'DefineYourStyle')}
            title=""
            backgroundColor={Colors.white}
            rightComponent={<Skip onPress={() => navigation.navigate('PrivacySetting')} />}
          />

          {/* Content Area */}
          <View style={{ flex: 1, backgroundColor: '#F7F6FA' }}>
             <View style={{ width: wp(90), alignSelf: 'center' }}>
                <ProgressBar style={{ marginVertical: hp(2) }} progress={13 * 6} />
             </View>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
              <ScrollView contentContainerStyle={{ paddingBottom: hp(3), width: wp(90), alignSelf: 'center' }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

                <View style={[styles.topText, { alignSelf: 'flex-start' }]}>
                  <Text style={GlobalStyle.authScreenTitle}>Assigned Stylist</Text>
                  <Text style={[GlobalStyle.authScreenSubtitle, { textAlign: 'left' }]}>
                     Meet your personal style expert.
                  </Text>
                </View>


            <View style={styles.assignMainBox}>
              {loading ? (
                <View style={{ padding: 50 }}>
                  <ActivityIndicator size="large" color={Colors.themeColor} />
                  <Text style={{ marginTop: 10, color: Colors.graytext }}>
                    Finding your stylist...
                  </Text>
                </View>
              ) : (
                <>
                  <View style={styles.purpleBox} />

                  <Image
                    style={styles.imageView}
                    source={
                      stylistData?.profile_image
                        ? { uri: stylistData.profile_image }
                        : imagePath.assigned_stype_usr
                    }
                  />

                  <Text style={styles.boxTitle}>
                    {stylistData?.name || 'Unknown Stylist'}
                  </Text>
                  <Text style={styles.boxSubTitle}>
                    {stylistData?.expertise || 'Expertise not listed'}
                  </Text>

                  <AppButton
                    backgroundColor={Colors.black}
                    marginTop={hp(2)}
                    title={'Assign Task'}
                    onPress={() => customModalRef.current.open()}
                    width={wp(35)}
                  />
                </>
              )}
            </View>
            <BottomSeperator />
            <AppButton
              marginTop={hp(2)}
              marginBottom={Platform.OS === 'android' ? hp(4) : 0}
              title={'Next'}
              onPress={() => navigation.goBack()}
              disabled={loading}
            />
            </ScrollView>

            <CustomModal topRightText={'AssignTask '} ref={customModalRef}>
              <LabelInput
                onChangeText={text => setTask(text)}
                value={task}
                title="Enter your task"
                placeholder="Type your task here..."
                multiline
                inputHeight={hp(14)}
                borderRadius={wp(2)}
                titleFont={FontSize.FONT_16}
                showTitle={false}
              />
              <AppButton
                marginTop={hp(2)}
                title={'Submit Task'}
                onPress={handleAssignTask}
              />
            </CustomModal>
            </KeyboardAvoidingView>
          </View>
        </View>
      </View>
    </Container>
  );
}

export default AssignedTask;
