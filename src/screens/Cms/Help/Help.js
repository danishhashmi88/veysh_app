import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../../constant/colors';
import { hp, wp } from '../../../utils/helper';
import { FontSize, FontFamily } from '../../../constant/fonts';
import Header from '../../../component/common/UI/Header';
import Card from '../../../component/common/UI/Card';
import RowItem from '../../../component/common/UI/RowItem';
import { imagePath } from '../../../constant/imagePath';

const Help = () => {
  const navigation = useNavigation();

  const helpItems = [
    {
      id: 1,
      title: 'About Us',
      icon: imagePath.profileIcons?.about,
      route: 'CmsScreen',
      params: { screenType: 'about_us' },
    },
    {
      id: 2,
      title: 'Contact Us',
      icon: imagePath.profileIcons?.contact_us,
      route: 'ContactUs',
    },
    {
      id: 3,
      title: 'FAQ',
      icon: imagePath.profileIcons?.faq,
      route: 'FrequentQuestions',
    },
    {
      id: 4,
      title: 'Privacy Policy',
      icon: imagePath.profileIcons?.privacy_policy,
      route: 'CmsScreen',
      params: { screenType: 'privacy' },
    },
    {
      id: 5,
      title: 'Terms of Service',
      icon: imagePath.profileIcons?.terms,
      route: 'CmsScreen',
      params: { screenType: 'terms' },
    },
  ];

  const handlePress = item => {
    navigation.navigate(item.route, item.params);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.backGroundColor1 }}>
      <Header
        showLeftButton={true}
        leftButtonBgColor={Colors.backGroundColor1}
        title="Help"
        headerTextStyle={{
          fontSize: FontSize.FONT_26,
        }}
        backgroundColor={Colors.white}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: hp(5), paddingTop: hp(2) }}
      >
        <Card>
          {helpItems.map((item, index) => (
            <RowItem
              key={item.id}
              title={item.title}
              icon={item.icon}
              onPress={() => handlePress(item)}
              isLast={index === helpItems.length - 1}
            />
          ))}
        </Card>
      </ScrollView>
    </View>
  );
};

export default Help;
