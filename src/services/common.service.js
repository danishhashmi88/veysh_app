import Axios from '../utils/axios';
import { AUTH_TOKEN_KEY, getData } from '../utils/storage';

const path = 'common';

export const GetFaq = async () => {
  return await Axios().get(`${path}/faq`);
};

export const AddNewInquiry = async body => {
  const token = await getData(AUTH_TOKEN_KEY);
  return await Axios({
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }).post(`${path}/contact-us`, body);
};

export const GetCms = async slug => {
  return await Axios().get(`${path}/cms-page?slug=${slug}&type=app`);
};



// export const getBrandsApi = async () => {
//   return await Axios().post(`${path}/get-brands`);
// };

// export const getColorsApi = async () => {
//   return await Axios().post(`${path}/get-colors`);
// };
