import React from 'react';
import { Platform } from 'react-native';
import SubscriptionAndroid from './SubscriptionAndroid';
import SubscriptionIOS from './SubscriptionIOS';

const SubscriptionPlans = () => {
  if (Platform.OS === 'android') {
    return <SubscriptionAndroid />;
  }

  return <SubscriptionIOS />;
};

export default SubscriptionPlans;









