import {
  RefreshControl,
  ScrollView,
  View,
  ActivityIndicator,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Container from '../../../component/common/Container/Container';
import { Colors } from '../../../constant/colors';
import { styles } from './styles';
import Header from '../../../component/common/UI/Header';
import FaqItem from '../../../component/Help/FaqItem';
import { GetFaq } from '../../../services/common.service';
import { handleServerValidations, hp } from '../../../utils/helper';
import { showDangerToast } from '../../../utils/toast';
import { SKELETON_TIME_OUT } from '../../../constant';

const FrequentQuestions = () => {
  const [faqList, setFaqList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchFaq();
  }, []);

  const fetchFaq = async () => {
    try {
      const response = await GetFaq();
      if (!response.success) throw response;
      setFaqList(response.data.list);
    } catch (error) {
      const errorData = handleServerValidations(error);
      showDangerToast(errorData ?? 'Something went wrong');
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, SKELETON_TIME_OUT);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchFaq();
    setRefreshing(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container iosNotchColors={[Colors.white, Colors.white, Colors.zink100]}>

      <Header showLeftButton={true} title={'FAQ'} />
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size="large" color={Colors.black} />
        </View>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          style={{ paddingHorizontal: 16, paddingTop: 10 }}
        >
          {faqList?.length > 0
            ? faqList.map(item => (
              <FaqItem
                key={item.id}
                title={item.title}
                detail={item.description}
              />
            ))
            : null}
        </ScrollView>
      )}

    </Container>
  );
};

export default FrequentQuestions;
