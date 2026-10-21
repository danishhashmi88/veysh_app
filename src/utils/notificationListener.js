// import messaging from '@react-native-firebase/messaging';
// import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
// import { navigate } from './navigationService';
// import { appointment_status } from '../constant';

// export async function requestUserPermission() {
//     await notifee.requestPermission();
//     // getFCMToken()
//     const authStatus = await messaging().requestPermission();
//     const enabled =
//         authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//         authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//     if (enabled) {
//         console.log('Authorization status:', authStatus);
//     }
// }

// let channelId = '';

// export const getFCMToken = async () => {
//     try {
//         let FCMToken = await messaging().getToken();
//         if (FCMToken) {
//             channelId = await notifee.createChannel({
//                 id: 'default',
//                 name: 'Default Channel',
//                 vibration: true,
//                 importance: AndroidImportance.HIGH,
//             });
//             return FCMToken
//         }
//     } catch (error) {
//         return error
//     }
// }

// export const NotificationListner = async () => {
//     messaging().onNotificationOpenedApp(remoteMessage => {
//         console.log(
//             'Notification caused app to open from background state:',
//             remoteMessage,
//         );
//         handleNavigationFromNotification(remoteMessage.data);
//     });
//     messaging()
//         .getInitialNotification()
//         .then(remoteMessage => {
//             if (remoteMessage) {
//                 console.log('Notification caused app to open from quit state:', remoteMessage);
//                 handleNavigationFromNotification(remoteMessage.data);
//             }
//         });
//     messaging().onMessage(async remoteMessage => {
//         console.log('Message in foregroung', remoteMessage);
//         await notifee.displayNotification({
//             title: remoteMessage?.notification?.title,
//             body: remoteMessage?.notification?.body,
//             android: {
//                 channelId: channelId || 'default',
//                 pressAction: {
//                     id: 'default',
//                 },
//             },
//             data: remoteMessage?.data,
//         });
//     });

//     notifee.onForegroundEvent(({ type, detail }) => {
//         if (type === EventType.PRESS) {
//             const { notification } = detail;
//             if (notification?.data) {
//                 handleNavigationFromNotification(notification.data);
//             }
//         }
//     });
// };

// export const handleNavigationFromNotification = (data) => {
//     const { type, appointmentID, chatType, userName, user, image, status } = data;

//     switch (type) {
//         case 'appointments':
//             setTimeout(() => {
//                 navigate('AppointmentDetails', { appointmentId: appointmentID });
//             }, 1000);
//             break;

//         case 'chat':
//             setTimeout(() => {
//                 let canDoFurtherChat = (status === appointment_status.CONFIRMED || status === appointment_status.IN_ROUTE) ? true : false;
//                 // navigate('Notifications');
//                 navigate('ChatMessages', { type: chatType, appointmentID: appointmentID, userName: userName, user: { _id: user }, image: image, canDoFurtherChat, appointmentStaus: status });
//             }, 1000);
//             break;

//         default:
//             console.warn('Unhandled type:', type);
//     }
// };
