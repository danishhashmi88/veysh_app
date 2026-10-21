import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  plannerList,
  createEvent,
  outfitOfTheDay,
  deleteEventapi,
  editEventapi,
  wardrobeInsights,
  TotalSpend,
  getRentItemsListApi,
  contactQueryApi,
} from '../../services/user.service';
import moment from 'moment';
import {
  extractPlannerList,
  filterPlannerEventsForToday,
} from '../../utils/helper';

export const getPlannerList = createAsyncThunk(
  'planner/getPlannerList',
  async (data, { rejectWithValue }) => {
    try {
      const response = await plannerList(data);
      console.log('getPlannerList Response:', response);
      if (response?.success) {
        return response.data;
      } else {
        return rejectWithValue(
          response?.message || 'Failed to fetch planner list',
        );
      }
    } catch (error) {
      console.error('getPlannerList Error:', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const getOutfitOfTheDay = createAsyncThunk(
  'planner/getOutfitOfTheDay',
  async (data, { rejectWithValue }) => {
    try {
      const today = moment().format('YYYY-MM-DD');
      const requestPayload = {
        page: 1,
        per_page: 10,
        event_date: today,
        ...data,
      };

      const response = await outfitOfTheDay(requestPayload);

      let list = [];
      if (response?.success) {
        list = extractPlannerList(response.data);
      }

      if (list.length === 0) {
        const plannerResponse = await plannerList({
          global_search: '',
          page: 1,
          per_page: 100,
          month: moment().month() + 1,
          sort_by: 'event_date',
        });
        if (plannerResponse?.success) {
          list = filterPlannerEventsForToday(
            extractPlannerList(plannerResponse.data),
          );
        }
      }

      return { list };
    } catch (error) {
      console.error('getOutfitOfTheDay Error:', error);
      try {
        const plannerResponse = await plannerList({
          global_search: '',
          page: 1,
          per_page: 100,
          month: moment().month() + 1,
          sort_by: 'event_date',
        });
        if (plannerResponse?.success) {
          return {
            list: filterPlannerEventsForToday(
              extractPlannerList(plannerResponse.data),
            ),
          };
        }
      } catch (fallbackError) {
        console.error('getOutfitOfTheDay fallback error:', fallbackError);
      }
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const addPlannerEvent = createAsyncThunk(
  'planner/addPlannerEvent',
  async (data, { rejectWithValue }) => {
    try {
      const response = await createEvent(data);
      console.log('addPlannerEvent Response:', response);
      if (response?.success) {
        return response.data;
      } else {
        let errorMsg = response?.message || 'Failed to add planner';
        if (response?.error && Array.isArray(response.error) && response.error.length > 0) {
          errorMsg = response.error[0].msg || errorMsg;
        }
        return rejectWithValue(errorMsg);
      }
    } catch (error) {
      console.error('addPlannerEvent Error:', error);
      let errorMsg = error.response?.data?.message || error.message;
      if (error.response?.data?.error && Array.isArray(error.response.data.error) && error.response.data.error.length > 0) {
        errorMsg = error.response.data.error[0].msg || errorMsg;
      }
      return rejectWithValue(errorMsg);
    }
  },
);

export const deleteEvent = createAsyncThunk(
  'planner/deleteEvent',
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await deleteEventapi(eventId);
      if (response?.success) {
        return eventId; // Return ID to remove from state
      } else {
        return rejectWithValue(response?.message || 'Failed to delete outfit');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);
export const updateEvent = createAsyncThunk(
  'planner/updateEvent',
  async (data, { rejectWithValue }) => {
    try {
      const response = await editEventapi(data);
      console.log('addPlannerEvent Response:', response);
      if (response?.success) {
        return response.data;
      } else {
        let errorMsg = response?.message || 'Failed to update planner';
        if (response?.error && Array.isArray(response.error) && response.error.length > 0) {
          errorMsg = response.error[0].msg || errorMsg;
        }
        return rejectWithValue(errorMsg);
      }
    } catch (error) {
      console.error('updateEvent Error:', error);
      let errorMsg = error.response?.data?.message || error.message;
      if (error.response?.data?.error && Array.isArray(error.response.data.error) && error.response.data.error.length > 0) {
        errorMsg = error.response.data.error[0].msg || errorMsg;
      }
      return rejectWithValue(errorMsg);
    }
  },
);

export const getWardrobeInsights = createAsyncThunk(
  'planner/getWardrobeInsights',
  async (data, { rejectWithValue }) => {
    try {
      const response = await wardrobeInsights(data);
      console.log('getWardrobeInsights Response:', response);
      if (response?.success) {
        let items = [];
        const resData = response.data?.data || response.data || {};

        if (data?.type === 'most_worn') {
          items = resData.mostWornItems || resData.items || [];
        } else if (data?.type === 'least_worn') {
          items = resData.leastWornItems || resData.items || [];
        } else if (data?.type === 'never_worn') {
          items = resData.neverWornItems || resData.items || [];
        }

        console.log(`--- Wardrobe Insights (${data?.type}) Diagnostic ---`, {
          mostWornCount: resData.mostWornItems?.length || 0,
          leastWornCount: resData.leastWornItems?.length || 0,
          neverWornCount: resData.neverWornItems?.length || 0,
          itemsCount: resData.items?.length || 0,
          returnedItemsCount: items.length,
        });

        if (!Array.isArray(items)) items = [];

        return { type: data?.type, items: items, averageClosetValue: resData.average_closet_value ?? 0 };
      } else {
        return rejectWithValue(
          response?.message || 'Failed to fetch wardrobe insights',
        );
      }
    } catch (error) {
      console.error('getWardrobeInsights Error:', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const getTotalSpend = createAsyncThunk(
  'planner/getTotalSpend',
  async (_, { rejectWithValue }) => {
    try {
      const response = await TotalSpend();
      if (response?.success) {
        console.log('getTotalSpend API Response Data:', response.data);
        return response.data;
      } else {
        return rejectWithValue(response?.message || 'Failed to fetch details');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const getRentItemsList = createAsyncThunk(
  'planner/getRentItemsList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRentItemsListApi();
      if (response?.success) {
        return response.data;
      } else {
        return rejectWithValue(response?.message || 'Failed to fetch rent items');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);
export const submitContactQuery = createAsyncThunk(
  'planner/submitContactQuery',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await contactQueryApi(formData);
      if (response?.success) {
        return response;
      } else {
        return rejectWithValue(
          response?.message || 'Failed to submit contact query',
        );
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

