import Config from 'react-native-config';

const readEnv = (key, fallback = '') => {
  const value = Config?.[key];
  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }
  return fallback;
};

const withTrailingSlash = url => {
  if (!url) {
    return '';
  }
  return url.endsWith('/') ? url : `${url}/`;
};

const splitList = value =>
  String(value || '')
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);

export const ENV = {
  APP_ENV: readEnv('APP_ENV', 'production'),
  API_BASE_URL: readEnv(
    'API_BASE_URL',
    'https://api.veysh.com/webservice/api/v1',
  ),
  IMAGE_BASE_URL: withTrailingSlash(
    readEnv('IMAGE_BASE_URL', 'https://api.veysh.com/'),
  ),
  SOCKET_URL: withTrailingSlash(
    readEnv('SOCKET_URL', 'https://api.veysh.com/'),
  ),
  SHARE_BASE_URL: readEnv('SHARE_BASE_URL', 'https://veysh.com').replace(
    /\/$/,
    '',
  ),
  DEEP_LINK_SCHEME: readEnv('DEEP_LINK_SCHEME', 'veysh'),
  GOOGLE_WEB_CLIENT_ID: readEnv(
    'GOOGLE_WEB_CLIENT_ID',
    '263239818614-98qrkcb2t6oeoopt7m4dcnd2tpf5k4dq.apps.googleusercontent.com',
  ),
  GOOGLE_IOS_CLIENT_ID: readEnv(
    'GOOGLE_IOS_CLIENT_ID',
    '263239818614-b57ee2h2lb2mja426fhsuq9rn74cfn2b.apps.googleusercontent.com',
  ),
  IOS_IAP_PRODUCT_ID: readEnv('IOS_IAP_PRODUCT_ID', 'premium_subscription'),
  ANDROID_IAP_PRODUCT_ID: readEnv(
    'ANDROID_IAP_PRODUCT_ID',
    'premium_subscription',
  ),
  ANDROID_IAP_BASE_PLAN_ID: readEnv(
    'ANDROID_IAP_BASE_PLAN_ID',
    'monthy-subscription-99',
  ),
  APPLE_EULA_URL: readEnv(
    'APPLE_EULA_URL',
    'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/',
  ),
};

ENV.LINKING_PREFIXES = splitList(
  readEnv(
    'LINKING_PREFIXES',
    `${ENV.DEEP_LINK_SCHEME}://,${ENV.SHARE_BASE_URL}`,
  ),
);

export const BASEURL = ENV.API_BASE_URL;
export const IMAGEURL = ENV.IMAGE_BASE_URL;
export const SOCKET_URL = ENV.SOCKET_URL;
export const SHARE_BASE_URL = ENV.SHARE_BASE_URL;

export default ENV;
