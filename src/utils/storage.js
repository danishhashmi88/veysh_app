import AsyncStorage from '@react-native-async-storage/async-storage';

export const AUTH_TOKEN_KEY = 'AUTH_TOKEN';
export const USER_DATA = 'USER_DATA';
export const USER_ID = 'USER_ID';
export const USER_ROLE = 'USER_ROLE';
export const APP_THEME = 'app_theme';
export const IS_REMEMBER = 'is_remember';
export const ONBOARD_SHOWN_KEY = 'onboard_shown';
export const SAVED_EMAIL = 'SAVED_EMAIL';
export const SAVED_PHONE = 'SAVED_PHONE';
export const SAVED_PASSWORD = 'SAVED_PASSWORD';

// This is the function Login.js is looking for.
// We alias it to setData so both names work.
export const storeData = async (key, val) => {
  await setData(key, val);
};

export const setData = async (key, val) => {
  try {
    let tempValue;
    if (typeof val === 'string') {
      tempValue = val;
    } else {
      tempValue = JSON.stringify(val);
    }
    await AsyncStorage.setItem(key, tempValue);
  } catch (error) {
    console.log(error, 'AsyncStorage');
  }
};

export const removeData = async key => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log(error, 'AsyncStorage');
  }
};

export const getData = async key => {
  try {
    let value = await AsyncStorage.getItem(key);
    if (value) {
      try {
        const newValue = JSON.parse(value);
        return newValue;
      } catch (e) {
        // If parsing fails, it's already a raw string (like token)
        return value;
      }
    }
    return null;
  } catch (error) {
    console.log(error, 'AsyncStorage');
    return null;
  }
};

export const saveAuthToken = async token => {
  try {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
  } catch (error) {
    console.error('Error saving auth token', error);
  }
};

export const getAllStorageValues = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const result = await AsyncStorage.multiGet(keys);
    const allValues = {};
    result.forEach(([key, value]) => {
      allValues[key] = value;
    });
    console.log(allValues);
    return allValues;
  } catch (error) {
    console.error('Error fetching AsyncStorage values', error);
    return {};
  }
};
