import { buyerRouteName, sellerRouteName, user_roles } from '../constant';
import Axios from '../utils/axios';
import { AUTH_TOKEN_KEY, getData, USER_ROLE } from '../utils/storage';

const buyerPath = `${buyerRouteName}/user`;
const sellerPath = `${sellerRouteName}/user`;

const getApiRouteForRole = userRole => {
  if (userRole === user_roles.seller || userRole === 'stylist') {
    return sellerRouteName;
  }
  return buyerRouteName;
};

export const editProfileApi = async formData => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  }).put(`${buyerPath}/edit-profile`, formData);
};

export const sendEditProfileOtpSendApi = async formData => {
  const userRole = await getData(USER_ROLE);
  const token = await getData(AUTH_TOKEN_KEY);
  const url =
    userRole === user_roles.buyer
      ? `${buyerPath}/send-update-otp`
      : `${sellerPath}/send-update-otp`;
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).post(url, formData);
};

export const verifyEditProfileOtpSendApi = async formData => {
  const userRole = await getData(USER_ROLE);
  const token = await getData(AUTH_TOKEN_KEY);
  const url =
    userRole === user_roles.buyer
      ? `${buyerPath}/verify-update-otp`
      : `${sellerPath}/verify-update-otp`;
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).put(url, formData);
};

export const CheckForPassword = async () => {
  const token = await getData(AUTH_TOKEN_KEY);
  const userRole = await getData(USER_ROLE);
  const url =
    userRole === user_roles.buyer
      ? `${buyerPath}/check-for-password`
      : `${sellerPath}/check-for-password`;
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).get(url);
};

export const changePassword = async formData => {
  const token = await getData(AUTH_TOKEN_KEY);
  const userRole = await getData(USER_ROLE);
  const url =
    userRole === user_roles.buyer
      ? `${buyerPath}/update-user-password`
      : `${sellerPath}/change-password`;
  return await Axios({
    extraHeaders: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  }).patch(url, formData);
};
export const EnableRentItemApi = async formData => {
  const token = await getData(AUTH_TOKEN_KEY);
  const url = `/${buyerRouteName}/items/enable-rent-item`
  return await Axios({
    extraHeaders: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  }).put(url, formData);
};
export const EnableRentOutfitApi = async formData => {
  const token = await getData(AUTH_TOKEN_KEY);
  const url = `/${buyerRouteName}/outfits/enable-rent-outfit`
  return await Axios({
    extraHeaders: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  }).put(url, formData);
};

export const getItemsListApi = async data => {
  const token = await getData(AUTH_TOKEN_KEY);
  const url = `/${buyerRouteName}/items/list`;
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).post(url, data);
};

export const getItemdetailApi = async (id) => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).get(`/${buyerRouteName}/items/details?o_id=${id}`);
};

export const GetFavouriteStreamer = async () => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).get(`${buyerPath}/get-favourite-streamers`);
};

export const ManageFavouriteStreamer = async data => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).post(`${buyerPath}/add-remove-favourite-streamer`, data);
};
/////////////////////////
export const addItemApi = async formData => {
  const token = await getData(AUTH_TOKEN_KEY);
  const userRole = await getData(USER_ROLE);
  const route =
    userRole === user_roles.buyer ? buyerRouteName : sellerRouteName;

  return await Axios({
    extraHeaders: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  }).post(`/${buyerRouteName}/items/add`, formData);
};
export const updateItemApi = async formData => {
  const token = await getData(AUTH_TOKEN_KEY);
  const userRole = await getData(USER_ROLE);
  const route =
    userRole === user_roles.buyer ? buyerRouteName : sellerRouteName;

  return await Axios({
    extraHeaders: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  }).put(`/${buyerRouteName}/items/edit-items`, formData);
};

export const getCategoriesApi = async data => {
  const token = await getData(AUTH_TOKEN_KEY);
  const userRole = await getData(USER_ROLE);
  console.log('usert role is', userRole);
  const route =
    userRole === user_roles.buyer ? buyerRouteName : sellerRouteName;
  console.log('route is now', route);

  let url = `/${buyerRouteName}/category/list`;
  if (data?.type) {
    url += `?type=${data.type}`;
  }

  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).post(url, data);
};

export const getBrandsListApi = async data => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).post(`/${buyerRouteName}/brand/list`, data);
};

export const deleteItemApi = async id => {
  const token = await getData(AUTH_TOKEN_KEY);
  const userRole = await getData(USER_ROLE);
  // Assuming 'user' (buyer) route
  const route =
    userRole === user_roles.buyer ? buyerRouteName : sellerRouteName;

  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).post(`/${buyerRouteName}/items/delete?o_id=${id}`);
};

export const createOutfitApi = async data => {
  console.log('createOutfitApi: Data:', data);
  const token = await getData(AUTH_TOKEN_KEY);

  return await Axios({
    extraHeaders: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  }).post(`/${buyerRouteName}/outfits/add`, data);
};

export const addToLookbookApi = async formData => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  }).post(`/${buyerRouteName}/lookbook/add`, formData);
};

export const getLookbookListApi = async data => {
  const token = await getData(AUTH_TOKEN_KEY);
  const page = data?.page || 1;
  const limit = data?.limit || 100;
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).get(`/${buyerRouteName}/lookbook/list?page=${page}&limit=${limit}`);
};

export const getFollowersApi = async () => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).get(`/${buyerRouteName}/profile/followers`);
};

export const deleteLookbookItemApi = async data => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).delete(`/${buyerRouteName}/lookbook/delete`, { data });
};

// export const getLookbookListApi = async data => {
//   const token = await getData(AUTH_TOKEN_KEY);
//   return await Axios({
//     extraHeaders: {
//       Authorization: `Bearer ${token}`,
//     },
//   }).post(`/user/lookbook/list`, data); // Ensure path perfectly matches Postman url !!
// };

export const getOutfitsListApi = async data => {
  const token = await getData(AUTH_TOKEN_KEY);
  // Using the path implied by the user request or standard convent
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).post(`/${buyerRouteName}/outfits/list`, data);
};

export const getOutfitDetailsApi = async outfitId => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).get(`/${buyerRouteName}/outfits/details?o_id=${outfitId}`);
};

export const deleteOutfitApi = async outfitId => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).post(`/${buyerRouteName}/outfits/delete?o_id=${outfitId}`);
};

export const editOutfitApi = async formData => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  }).put(`/${buyerRouteName}/outfits/edit`, formData);
};

export const plannerList = async data => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).post(`/${buyerRouteName}/planner/list`, data);
};

export const createEvent = async data => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).post(`/${buyerRouteName}/planner/add`, data);
};

export const deleteEventapi = async id => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).post(`/${buyerRouteName}/planner/delete?o_id=${id}`);
};

export const editEventapi = async data => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).put(`/${buyerRouteName}/planner/edit`, data);
};

export const socialCommunityPost = async data => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).post(`/${buyerRouteName}/posts/latest-posts`, data);
};
export const outfitOfTheDay = async data => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).post(`/${buyerRouteName}/planner/todayOutfit`, data);
};

export const getLatest_Postapi = async data => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).get(`/${buyerRouteName}/dashboard/dashboard-latest-posts`);
};

export const getProfileCompletionApi = async () => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).get(`/${buyerRouteName}/profile/profile-completion`);
};

export const getUserInformation = async data => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).post(`/${buyerRouteName}/profile/all-users`, data);
};

export const blockUserapi = async data => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).post(`/${buyerRouteName}/profile/block-user`, data);
};

export const unblockUserapi = async data => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).post(`/${buyerRouteName}/profile/unblock-user`, data);
};

export const getBlockedUsersApi = async () => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).get(`/${buyerRouteName}/profile/blocked-users`);
};

export const followUserapi = async data => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).post(`/${buyerRouteName}/profile/follow-user`, data);
};
export const unFollowUserapi = async data => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).post(`/${buyerRouteName}/profile/unfollow-user`, data);
};

export const wardrobeInsights = async data => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).post(`/${buyerRouteName}/dashboard/get-wardrobe-insights`, data);
};

export const TotalSpend = async () => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  }).get(`/${buyerRouteName}/dashboard/wardrobe-dashboard`);
};

export const reportPostapi = async data => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).post(`/${buyerRouteName}/posts/report`, data);
};

export const ClosetInsights = async () => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  }).get(`/${buyerRouteName}/closet/get-closet-insights`);
};

export const askQuestionApi = async data => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).post(`/${buyerRouteName}/outfits/ask-question`, data);
};

export const saveSuggestedOutfitApi = async data => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  }).post(`/${buyerRouteName}/outfits/save-suggested`, data);
};

export const getChatHistoryApi = async data => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).post(`${buyerRouteName}/outfits/chat-history`, data);
};

export const getDefaultQuestionsApi = async () => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).get(`${buyerRouteName}/outfits/default-questions`);
};

export const searchUsersApi = async query => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).get(`${buyerRouteName}/profile/search-users?q=${query}`);
};

export const postListApi = async data => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).post(`${buyerRouteName}/posts/latest-posts`, data);
};

export const getSubscriptionListApi = async data => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).post(`/${buyerRouteName}/subscribe/list`);
};

export const getActiveSubscriptionDetailsApi = async data => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).get(`/${buyerRouteName}/subscribe/active`);
};

export const cancelSubscriptionApi = async data => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).post(`/${buyerRouteName}/subscribe/cancel`, data);
};
export const addSubscriptionApi = async data => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).post(`/${buyerRouteName}/subscribe/create-subscription`, data);
};
export const updateSubscriptionApi = async data => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).put(`/${buyerRouteName}/subscribe/edit`, data);
};

export const verifySubscriptionPaymentApi = async data => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).post(`/${buyerRouteName}/subscribe/save-subscription`, data);
};

export const getChatListApi = async data => {
  const token = await getData(AUTH_TOKEN_KEY);
  const userRole = await getData(USER_ROLE);
  const route =
    userRole === user_roles.buyer ? buyerRouteName : sellerRouteName;

  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).post(`${route}/chat/list`, data);
};

export const clearChatApi = async data => {
  const token = await getData(AUTH_TOKEN_KEY);
  const userRole = await getData(USER_ROLE);
  const route =
    userRole === user_roles.buyer ? buyerRouteName : sellerRouteName;

  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).post(`/${route}/chat/clear-chat`, data);
};

export const getChatMessagesApi = async room => {
  const token = await getData(AUTH_TOKEN_KEY);
  const userRole = await getData(USER_ROLE);
  const route =
    userRole === user_roles.buyer ? buyerRouteName : sellerRouteName;

  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).get(`/${route}/chat/messages?room=${room}`);
};

export const getNotificationSettingsApi = async () => {
  const token = await getData(AUTH_TOKEN_KEY);
  const userRole = await getData(USER_ROLE);
  const route =
    userRole === user_roles.buyer ? buyerRouteName : sellerRouteName;

  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).get(`/${route}/notification/get-notification-settings`);
};

export const updateNotificationSettingsApi = async data => {
  const token = await getData(AUTH_TOKEN_KEY);
  const userRole = await getData(USER_ROLE);
  const route =
    userRole === user_roles.buyer ? buyerRouteName : sellerRouteName;

  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).put(`/${route}/notification/update-notification-settings`, data);
};

export const getPrivacySettingsApi = async () => {
  const token = await getData(AUTH_TOKEN_KEY);
  const userRole = await getData(USER_ROLE);
  const route =
    userRole === user_roles.buyer ? buyerRouteName : sellerRouteName;

  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).get(`/${route}/notification/get-privacy-settings`);
};

export const updatePrivacySettingsApi = async data => {
  const token = await getData(AUTH_TOKEN_KEY);
  const userRole = await getData(USER_ROLE);
  const route =
    userRole === user_roles.buyer ? buyerRouteName : sellerRouteName;

  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).put(`/${route}/notification/update-privacy-settings`, data);
};

export const getNotificationsListApi = async params => {
  const token = await getData(AUTH_TOKEN_KEY);
  const userRole = await getData(USER_ROLE);
  const route = getApiRouteForRole(userRole);

  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).get(`/${route}/notification/list`, { params });
};

export const markAllNotificationsReadApi = async () => {
  const token = await getData(AUTH_TOKEN_KEY);
  const userRole = await getData(USER_ROLE);
  const route = getApiRouteForRole(userRole);

  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).put(`/${route}/notification/mark-all-read`);
};

export const markNotificationReadApi = async id => {
  const token = await getData(AUTH_TOKEN_KEY);
  const userRole = await getData(USER_ROLE);
  const route = getApiRouteForRole(userRole);

  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).put(`/${route}/notification/mark-read/${id}`);
};

export const getRentItemsListApi = async () => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).get(`/${buyerRouteName}/common/rent-items-list`);
};
export const getRentItemsDetailsApi = async params => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).get(`/${buyerRouteName}/common/rent-items-details`, { params });
};
export const contactQueryApi = async formData => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  }).post(`/${buyerRouteName}/common/contact-query`, formData);
};

export const RemoveBgItemPicture = async body => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  }).post(`/${buyerRouteName}/common/remove-bg-and-tag`, body);
};
export const uploadChatFileApi = async formData => {
  const token = await getData(AUTH_TOKEN_KEY);
  const userRole = await getData(USER_ROLE);
  const route =
    userRole === user_roles.buyer ? buyerRouteName : sellerRouteName;

  return await Axios({
    extraHeaders: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  }).post(`/${route}/chat/upload-file`, formData);
};
