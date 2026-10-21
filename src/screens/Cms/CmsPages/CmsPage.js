/* eslint-disable react-hooks/exhaustive-deps */
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import RenderHTML from 'react-native-render-html';
import { Colors } from '../../../constant/colors';
import Header from '../../../component/common/UI/Header';
import { styles } from './styles';
import {
  extractInlineStylesFromHtml,
  handleServerValidations,
  wp,
  hp,
} from '../../../utils/helper';
import { GetCms } from '../../../services/common.service';
import { showDangerToast } from '../../../utils/toast';
import { SKELETON_TIME_OUT } from '../../../constant';
import { FontSize, FontFamily, FontWeight } from '../../../constant/fonts';

const CmsScreen = ({ navigation, route }) => {
  const { screenType } = route.params || {};
  const [cmsData, setCmsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getScreenTitle = () => {
    switch (screenType) {
      case 'about_us':
        return 'About Us';
      case 'privacy':
        return 'Privacy Policy';
      case 'terms':
        return 'Terms of Service';
      default:
        return 'CMS Page';
    }
  };
  const cms_slug = {
    terms: 'terms_and_conditions',
    about_us: 'about_us',
    privacy: 'privacy_policy',
  };

  useEffect(() => {
    fetchCms();
  }, []);

  const fetchCms = async () => {
    try {
      setLoading(true);
      const slug = cms_slug[screenType];
      console.log("SLUG ISSS", slug)
      const response = await GetCms(slug);
      console.log("response", response)

      if (!response.success) throw response;
      const { html: cleanHtml, classesStyles } = extractInlineStylesFromHtml(
        response?.data?.description,
      );
      setCmsData({ cleanHtml, classesStyles });
    } catch (error) {
      const errorData = handleServerValidations(error);
      showDangerToast(errorData ?? 'Something went wrong');
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, SKELETON_TIME_OUT);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.backGroundColor1 }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <Header
        showLeftButton={true}
        leftButtonBgColor={Colors.backGroundColor1}
        title={getScreenTitle()}
        headerTextStyle={{
          fontSize: FontSize.FONT_26,
        }}
        backgroundColor={Colors.white}
      />
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size="large" color={Colors.black} />
        </View>
      ) : (
        <ScrollView
          style={{
            paddingHorizontal: 16,
            paddingTop: 10,
            backgroundColor: Colors.backGroundColor1,
          }}
          contentContainerStyle={{
            paddingBottom: 40,
          }}
        >
          {cmsData !== null && (
            <RenderHTML
              contentWidth={wp(100)}
              source={{ html: cmsData?.cleanHtml }}
              classesStyles={cmsData?.classesStyles}
              baseStyle={{
                marginTop: 0,
                paddingTop: 0,
                textAlign: 'left',
                color: Colors.black,
              }}
              tagsStyles={{
                b: { fontWeight: FontWeight.FONT_700 },
                strong: { fontWeight: FontWeight.FONT_700 },
                i: { fontStyle: 'italic' },
                u: { textDecorationLine: 'underline' },
                p: { marginTop: 0 },
                body: { marginTop: 0 },
              }}
            />
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default CmsScreen;
