import { buyerRouteName, sellerRouteName, user_roles } from '../constant';
import Axios from '../utils/axios';
import { AUTH_TOKEN_KEY, getData, USER_ROLE } from '../utils/storage';

const buyerPath = `${buyerRouteName}/auth`; // resolves to: 'user/auth'
const buyerUserPath = `${buyerRouteName}/user`;
const sellerUserPath = `${sellerRouteName}/user`;
const sellerPath = `${sellerRouteName}/auth`;

// --- Stylist APIs ---
export const SignUpSellerApi = async payload => {
  return await Axios().post(`${sellerPath}/sign-up`, payload);
};

export const emailPhoneOtpApi = async values => {
  return await Axios().patch(`${sellerPath}/verify-email-phone-otp`, values);
};

export const emailPhoneResendOtpApi = async values => {
  return await Axios().patch(`${sellerPath}/resend-email-otp`, values);
};

export const businessProfileApi = async (formData, token) => {
  return await Axios({
    extraHeaders: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  }).patch(`${sellerPath}/complete-business-profile`, formData);
};

export const kycDetailsApi = async (formData, token) => {
  return await Axios({
    extraHeaders: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  }).patch(`${sellerPath}/complete-kyc`, formData);
};

// --- Buyer/User APIs (FIXED) ---

export const SignUpApi = async values => {
  const basePath = `${buyerRouteName}/auth`;
  if (values.phone) {
    return await Axios().post(`/${basePath}/signUpWithMobile`, values);
  }
  return await Axios().post(`/${basePath}/signup`, values);
};

export const LoginApi = async values => {
  if (values.phone) {
    return await Axios().post(`/${buyerPath}/login`, values);
  }
  return await Axios().post(`/${buyerPath}/login`, values);
};

// --- OTP Logic (FIXED) ---

export const otpVerificationApi = async values => {
  const userRole = await getData(USER_ROLE);

  // 1. Seller Logic
  if (userRole === user_roles.seller) {
    return await Axios().post(`${sellerPath}/verify-otp`, values);
  }

  const basePath = `${buyerRouteName}/auth`;

  if (values.email) {
    return await Axios().post(`${basePath}/verifyOTPWithEmail`, values);
  } else {
    return await Axios().post(`${basePath}/verifyOTPWithMobile`, values);
  }
};

export const resendApi = async values => {
  const userRole = values?.role;
  console.log('user role is', userRole);
  if (userRole == user_roles?.seller) {
    return await Axios().post(`/${sellerPath}/resend-otp`, values);
  }

  const basePath = `${buyerRouteName}/auth`;

  return await Axios().post(`${basePath}/resend-otp`, values);
};

// --- Other APIs ---

export const forgotPasswordApi = async values => {
  return await Axios().post(`/${buyerPath}/forget-password`, values);
};

export const googleLoginApi = async values => {
  return await Axios().post(`/${buyerPath}/google`, values);
};

export const appleLoginApi = async values => {
  return await Axios().post(`/${buyerPath}/apple`, values);
};

export const GetUserDetails = async (token, userId = null) => {
  const userRole = await getData(USER_ROLE);
  let url;

  if (!userId) {
    console.warn('GetUserDetails: Missing userId! The backend requires it.');
  }

  // Unified endpoint for both Users and Stylists
  url = `user/profile/user-details?_id=${userId}`;

  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).get(url);
};

export const saveProfileApi = async (values, token) => {
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  }).post(`/user/profile/save-basic-profile`, values);
};

// ... Remaining Profile APIs
export const saveStylePreferencesApi = async (values, token) => {
  const isFormData = values instanceof FormData;
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
      ...(isFormData && { 'Content-Type': 'multipart/form-data' }),
    },
  }).post(`/user/profile/save-preferences`, values);
};

export const editStylePreferencesApi = async (values, token) => {
  const isFormData = values instanceof FormData;
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
      ...(isFormData && { 'Content-Type': 'multipart/form-data' }),
    },
  }).put(`/user/profile/edit-preferences`, values);
};
export const savePrivacySettingsApi = async (values, token) => {           
  return await Axios({
    extraHeaders: { Authorization: `Bearer ${token}` },
  }).post(`user/profile/save-privacy-settings`, values);
};

export const editPrivacySettingsApi = async (values, token) => {
  return await Axios({
    extraHeaders: { Authorization: `Bearer ${token}` },
  }).put(`user/profile/edit-privacy-settings`, values);
};
export const editMyProfileApi = async (values, token) => {
  return await Axios({
    extraHeaders: { Authorization: `Bearer ${token}` },
  }).put(`user/profile/edit-myProfile`, values);
};

export const editBasicProfileApi = async (values, token) => {
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  }).put(`user/profile/edit-basic-profile`, values);
};
export const saveSizeInfoApi = async (values, token) => {
  return await Axios({
    extraHeaders: { Authorization: `Bearer ${token}` },
  }).post(`user/profile/save-sizeInfo`, values);
};
export const saveAppearanceApi = async (values, token) => {
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  }).post(`user/profile/save-appearance`, values);
};
export const saveStyleInfoApi = async (values, token) => {
  return await Axios({
    extraHeaders: { Authorization: `Bearer ${token}` },
  }).post(`user/profile/save-saveStyleInfo`, values);
};

export const editStyleInfoApi = async (values, token) => {
  return await Axios({
    extraHeaders: { Authorization: `Bearer ${token}` },
  }).put(`user/profile/edit-styleInfo`, values);
};

export const getPostsApi = async data => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  }).post(`/user/posts/list`);
};

export const deletePostApi = async (postId, token) => {
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).post(`/user/posts/delete?o_id=${postId}`);
};

export const createPostApi = async values => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  }).post(`/user/posts/add`, values);
};

export const likePostapi = async postId => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: { Authorization: `Bearer ${token}` },
  }).post(`/user/posts/like/${postId}`, { post_id: postId, type: 'post' });
};

export const addCommentPostapi = async (postId, comment) => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: { Authorization: `Bearer ${token}` },
  }).post(`user/posts/comment/${postId}`, { comment: comment });
};

export const getCommentPostapi = async (post_id, values) => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: { Authorization: `Bearer ${token}` },
  }).post(`user/posts/comment-list/${post_id}`, values);
};
export const getLikelistapi = async (post_id, values) => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: { Authorization: `Bearer ${token}` },
  }).post(`user/posts/like-list/${post_id}`, values);
};

export const editPostApi = async values => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  }).put(`/user/posts/edit`, values);
};

export const resetPasswordApi = async values => {
  return await Axios().post(`${buyerPath}/reset-password`, values);
};

export const verifyOtpApi = async payload => {
  return await Axios().post(`${buyerPath}/verifyOTPWithEmail`, payload);
};

export const deleteAccountApi = async () => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: { Authorization: `Bearer ${token}` },
  }).delete(`user/profile/delete-account`);
};
