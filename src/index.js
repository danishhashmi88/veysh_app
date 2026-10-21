import React, { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { Colors } from './constant/colors';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import RootLoaderView from './utils/rootLoaderView';
import FlashMessage from 'react-native-flash-message';
import MainNavigation from './navigation';
import NoInternetModal from './component/common/Modal/NetworkModal';
import messaging from '@react-native-firebase/messaging';

const App = () => {
  useEffect(() => {
    // 1. Permission & Token accepting
    const requestPermissionAndGetToken = async () => {
      if (Platform.OS === 'ios') {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        console.log(enabled, 'enabled');

        if (enabled) {
          getFCMToken();
        }
      } else if (Platform.OS === 'android') {
        if (Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            getFCMToken();
          }
        } else {
          getFCMToken();
        }
      }
    };

    // 2. Token generate
    const getFCMToken = async () => {
      try {
        if (Platform.OS === 'ios') {
          await messaging().registerDeviceForRemoteMessages();
        }
        const token = await messaging().getToken();
        console.log('🔥 FCM Token:', token);
        //copy this toekn and test in firebase console
      } catch (error) {
        console.log('Error getting token:', error);
      }
    };

    requestPermissionAndGetToken();

    // 3. Foreground Notification
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
      showMessage({
        message: remoteMessage.notification?.title || 'New Notification',
        description: remoteMessage.notification?.body || '',
        type: 'default',
        backgroundColor: Colors.themeColor,
        color: Colors.white,
        icon: 'auto',
        duration: 4000,
        style: { paddingTop: 10 },
      });
    });

    return unsubscribe;
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <NoInternetModal />
        {/* <StatusBar barStyle={"dark-content"} backgroundColor={Colors.lightThemePrimnaryColor} /> */}
        <MainNavigation />
        <RootLoaderView />
        <FlashMessage style={{ zIndex: 10000 }} />
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
