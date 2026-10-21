import { showMessage } from 'react-native-flash-message';
import { Colors } from '../constant/colors';
import { Platform, StatusBar } from 'react-native';

export function showToast(message, type = 'success') {
  showMessage({
    position: 'top',
    message: message,
    icon: 'success',
    description: '',
    duration: 3000,
    type: type,
    backgroundColor: Colors.toastSuccess,
    titleStyle: {
      color: Colors.white,
      fontSize: 14,
    },
    textStyle: {
      color: Colors.white,
    },
    statusBarHeight:
      Platform.OS === 'android' ? StatusBar.currentHeight + 17 : 47,
    style: {
      paddingHorizontal: 20,
      paddingBottom: 15,
      minHeight: 60,
      justifyContent: 'flex-end',
    },
  });
}

export function showDangerToast(message, type = 'danger') {
  showMessage({
    position: 'top',
    message: message,
    icon: 'danger',
    description: '',
    duration: 3000,
    type: type,
    backgroundColor: Colors.toastDanger,
    titleStyle: {
      color: Colors.white,
      fontSize: 14,
    },
    textStyle: {
      color: Colors.white,
    },
    statusBarHeight:
      Platform.OS === 'android' ? StatusBar.currentHeight + 17 : 47,
    style: {
      paddingHorizontal: 20,
      paddingBottom: 15,
      minHeight: 60,
      justifyContent: 'flex-end',
    },
  });
}

export function showSuccessToast(message) {
  showToast(message);
}
