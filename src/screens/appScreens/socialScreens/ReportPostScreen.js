import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { hp, wp } from '../../../utils/helper';
import AppButton from '../../../component/common/Buttons/AppButton';
import { useTheme } from '../../../hooks/useTheme';
import { reportPostapi } from '../../../services/user.service';
import { showDangerToast, showSuccessToast } from '../../../utils/toast';
import { Colors } from '../../../constant/colors';
import { FontFamily, FontSize, FontWeight } from '../../../constant/fonts';
import Header from '../../../component/common/UI/Header';
import LabelInput from '../../../component/common/Inputs/LabelInput';

const REPORT_REASONS = [
  'Spam',
  'Inappropriate Content',
  'Harassment or Bullying',
  'Hate Speech',
  'Violence',
  'False Information',
  'Other',
];

const ReportPostScreen = ({ route, navigation }) => {
  const Colors = useTheme();
  const { postId } = route.params || {};
  const [selectedReason, setSelectedReason] = useState(null);
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    if (!selectedReason) {
      showDangerToast('Please select a reason');
      return;
    }
    try {
      const payload = {
        post_id: postId,
        reason: selectedReason,
        description: description,
      };
      const res = await reportPostapi(payload);
      if (res?.success) {
        showSuccessToast(res?.message);
        navigation.goBack();
      } else {
        showDangerToast(res?.message);
        navigation.goBack();
      }
    } catch (error) {
      console.log('Error reporting post', error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <Header
        showLeftButton={true}
        onLeftButtonPress={() => navigation.goBack()}
        title="Report Post"
        backgroundColor={Colors.white}
      />

      {/* Body content with grey background */}
        <View style={{ flex: 1, backgroundColor: Colors.backGroundColor1 }}>
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: wp(7),
              paddingVertical: wp(3),
            }}
            showsVerticalScrollIndicator={false}
          >
            {REPORT_REASONS.map((reason, index) => (
              <TouchableOpacity
                key={index}
                style={styles.reasonContainer}
                onPress={() => setSelectedReason(reason)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.radioOuter,
                    { borderColor: Colors.themeColor },
                  ]}
                >
                  {selectedReason === reason && (
                    <View
                      style={[
                        styles.radioInner,
                        { backgroundColor: Colors.themeColor },
                      ]}
                    />
                  )}
                </View>
                <Text style={styles.reasonText}>{reason}</Text>
              </TouchableOpacity>
            ))}

            <LabelInput
              title="Additional Details (Optional)"
              multiline={true}
              inputHeight={hp(15)}
              placeholder="Write more details..."
              value={description}
              onChangeText={setDescription}
              marginTop={hp(1.5)}
            />

            <AppButton
              marginTop={hp(3)}
              title={'Submit Report'}
              onPress={handleSubmit}
            />
          </ScrollView>
        </View>
    </View>
  );
};

export default ReportPostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backGroundColor1,
  },
  reasonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  radioOuter: {
    width: wp(5.5),
    height: wp(5.5),
    borderRadius: wp(5),
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(3),
  },
  radioInner: {
    width: wp(3),
    height: wp(3),
    borderRadius: wp(3),
  },
  reasonText: {
    fontSize: FontSize.FONT_16,
    fontFamily: FontFamily.OutfitMedium,
    color: Colors.black,
  },
  label: {
    marginTop: hp(2.5),
    marginBottom: hp(1),
    fontSize: FontSize.FONT_16,
    fontFamily: FontFamily.OutfitMedium,
    color: Colors.black,
  },
  input: {
    height: hp(15),
    borderWidth: 1,
    borderColor: Colors.greyBorder,
    borderRadius: wp(3.5),
    padding: wp(3),
    textAlignVertical: 'top',
    fontSize: FontSize.FONT_14,
    fontFamily: FontFamily.OutfitRegular,
    color: Colors.black,
    backgroundColor: Colors.white,
  },
});
