import axios from 'axios';
import {
  AUTH_TOKEN_KEY,
  getData,
  removeData,
  USER_DATA,

  
  USER_ROLE,
} from './storage';
import { showDangerToast } from './toast';
import { Platform } from 'react-native';
import { handleUnauthorizedAccess } from './helper';
import { BASEURL, IMAGEURL, SOCKET_URL, SHARE_BASE_URL } from '../config/env';

export { BASEURL, IMAGEURL, SOCKET_URL, SHARE_BASE_URL };


const Axios = (
  options = {
    extraHeaders: { 'Content-Type': 'application/json' },
  },
) => {
  let headers = {
    accept: 'application/json',
    Authorization: 'Bearer ' + global.token,
    ...options.extraHeaders,
  };

  const axiosInstance = axios.create({
    baseURL: BASEURL,
    headers,
  });

  // Interceptor for request to log the full URL
  axiosInstance.interceptors.request.use(
    async request => {
      console.log(
        'Axios Request:',
        request.method.toUpperCase(),
        request.baseURL + request.url,
        request.headers,
      );
      return request;
    },
    error => {
      return Promise.reject(error);
    },
  );

  axiosInstance.interceptors.response.use(
    response => {
      // console.log(
      //   'Axios Response Interceptor RAW:',
      //   JSON.stringify(response.data, null, 2),
      // );
      return new Promise((resolve, reject) => {
        resolve(response.data);
      });
    },
    async error => {
      // console.error("error -----> ", error?.response);
      if (error && error && error.status && error.status === 401) {
        handleUnauthorizedAccess();
        showDangerToast(error?.response?.data?.message || 'Session expired');
        await removeData(AUTH_TOKEN_KEY);
        await removeData(USER_DATA);
        // await removeData(USER_ROLE);
        // if (global.navigation) {
        //   global.navigation.reset({
        //     index: 0,
        //     routes: [{ name: 'login' }],
        //   });
        // }
      }
      return Promise.reject(error);
    },
  );
  return axiosInstance;
};

export default Axios;
