import React, { useState } from 'react';
import {
  View,
  Text,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from '../../../constant/colors';
import { hp, wp } from '../../../utils/helper';
import { FontSize, FontFamily } from '../../../constant/fonts';
import Back from '../../../component/common/Buttons/Back';
import LabelInput from '../../../component/common/Inputs/LabelInput';
import AppButton from '../../../component/common/Buttons/AppButton';
import { submitContactQuery } from '../../../redux/thunks/plannerThunk';
import { showDangerToast, showSuccessToast } from '../../../utils/toast';

const ContactUsDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const data = route?.params?.item
  console.log("data iss", data)
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {

    if (!email.trim() || !phone.trim() || !details.trim()) {
      showDangerToast('Please fill all input fields');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('item_id', data?._id);
      formData.append('target_user_id', data?.createdBy?._id);
      formData.append('email', email.trim());
      formData.append('phone', phone.trim());
      formData.append('detail', details.trim());
      console.log(formData, '][][][][');
      const response = await dispatch(submitContactQuery(formData)).unwrap();
      if (response?.success) {
        showSuccessToast(response?.message || 'Query sent successfully');
        navigation.goBack();
      }
    } catch (error) {
      showDangerToast(error || 'Failed to send query');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.backGroundColor1 }}>
      <SafeAreaView
        style={{ backgroundColor: Colors.white }}
        edges={['top', 'left', 'right']}
      >
        <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: wp(5),
            paddingVertical: hp(1),
            backgroundColor: Colors.white,
            gap: wp(4),
          }}
        >
          <Back
            style={{ backgroundColor: Colors.backGroundColor1 }}
            isOnBackPress={true}
            onPress={() => navigation.goBack()}
          />
          <Text
            style={{
              fontFamily: FontFamily.Bold,
              fontSize: FontSize.FONT_26,
              color: Colors.blackVar2,
            }}
          >
            Contact Details
          </Text>
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: wp(5),
            paddingTop: hp(2),
            paddingBottom: hp(10),
          }}
        >
          <LabelInput
            title="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            maxLength={60}
          />
          <LabelInput
            title="Phone Number"
            placeholder="Enter your phone number"
            value={phone}
            onChangeText={(text) => {
              const numericValue = text.replace(/[^0-9]/g, '');
              setPhone(numericValue);
            }}
            keyboardType="phone-pad"
            maxLength={10}
          />
          <LabelInput
            title="Details"
            placeholder="Write your query details"
            value={details}
            onChangeText={setDetails}
            multiline={true}
            inputHeight={hp(15)}
            borderRadius={wp(2)}
            showToggleIcon={false}
            maxLength={300}
          />
        </ScrollView>

        <View
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            backgroundColor: Colors.white,
            paddingHorizontal: wp(5),
            paddingTop: hp(2),
            paddingBottom: hp(4),
            shadowColor: Colors.black,
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.05,
            shadowRadius: 5,
            elevation: 10,
          }}
        >
          <AppButton
            title="Submit"
            onPress={handleSubmit}
            width={wp(90)}
            loading={loading}
            disabled={loading}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ContactUsDetails;
