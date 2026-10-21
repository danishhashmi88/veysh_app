import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  StatusBar,
  Text,
} from 'react-native';
import React from 'react';
import { Colors } from '../../../constant/colors';
import { styles } from './styles';
import Header from '../../../component/common/UI/Header';
import { handleServerValidations, hp, wp } from '../../../utils/helper';
import LabelInput from '../../../component/common/Inputs/LabelInput';
import AppButton from '../../../component/common/Buttons/AppButton';
import { FontSize, FontFamily } from '../../../constant/fonts';
import { useFormik } from 'formik';
import { contactUsSchema } from '../../../validations/cmsValidation';
import { useDispatch } from 'react-redux';
import { updateRootLoadingState } from '../../../redux/slices/rootLoaderSlice';
import { AddNewInquiry } from '../../../services/common.service';
import { showDangerToast, showToast } from '../../../utils/toast';
import { useNavigation } from '@react-navigation/native';

const ContactUs = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: { name: '', email: '', message: '', subject: '' },
    validationSchema: contactUsSchema,
    onSubmit: values => {
      console.log('Contact Us Submitted:', values);
      addNewinquiry({
        name: values.name,
        email: values.email,
        message: values.message,
        subject: values.subject,
      });
    },
  });

  const addNewinquiry = async body => {
    try {
      dispatch(updateRootLoadingState(true));
      const response = await AddNewInquiry(body);
      console.log(response);

      if (!response.success) throw response;
      showToast(response?.message);
      dispatch(updateRootLoadingState(false));
      navigation.goBack();
    } catch (error) {
      const errorData = handleServerValidations(error);
      showDangerToast(errorData ?? 'Something went wrong');
      dispatch(updateRootLoadingState(false));
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.backGroundColor1 }}>
      <Header
        showLeftButton={true}
        leftButtonBgColor={Colors.backGroundColor1}
        title="Contact Us"
        headerTextStyle={{
          fontSize: FontSize.FONT_26,
        }}
        backgroundColor={Colors.white}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false} style={styles.inner}>
          <View style={styles.helpCard}>
            <Text style={styles.helpTitle}>Need Help?</Text>
            <Text style={styles.helpSubText}>
              Contact our team for support, queries, or feedback.
            </Text>
          </View>

          <View style={{ marginTop: hp(1) }}>
            <LabelInput
              title="Name"
              placeholder="Enter name"
              value={formik.values.name}
              onChangeText={formik.handleChange('name')}
              errorText={
                formik.touched.name && formik.errors.name
                  ? formik.errors.name
                  : ''
              }
            />
            <LabelInput
              value={formik.values.email}
              onChangeText={formik.handleChange('email')}
              errorText={
                formik.touched.email && formik.errors.email
                  ? formik.errors.email
                  : ''
              }
              title="Email"
              placeholder="Enter email"
              style={{}}
            />
            <LabelInput
              value={formik.values.subject}
              onChangeText={formik.handleChange('subject')}
              errorText={
                formik.touched.message && formik.errors.subject
                  ? formik.errors.subject
                  : ''
              }
              title="Subject"
              placeholder="Enter Subject"
              style={{}}
            />
            <LabelInput
              showToggleIcon={false}
              title={'Message'}
              placeholder={'Write message'}
              value={formik.values.message}
              onChangeText={formik.handleChange('message')}
              errorText={
                formik.touched.message && formik.errors.message
                  ? formik.errors.message
                  : ''
              }
              multiline={true}
              inputHeight={hp(15)}
              centerAlign={false}
              borderRadius={wp(2)}
            />
          </View>
        </ScrollView>
        <AppButton
          textColor={Colors.white}
          backgroundColor={Colors.lightRed}
          width={wp(90)}
          title={'Submit'}
          onPress={formik.handleSubmit}
          textSize={FontSize.FONT_15}
          marginTop={hp(2)}
          marginBottom={hp(2)}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

export default ContactUs;
