import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  createOutfitApi,
  getOutfitsListApi,
  getOutfitDetailsApi,
  deleteOutfitApi,
  editOutfitApi,
} from '../../services/user.service';

export const deleteOutfit = createAsyncThunk(
  'outfits/deleteOutfit',
  async (outfitId, { rejectWithValue }) => {
    try {
      const response = await deleteOutfitApi(outfitId);
      if (response?.success) {
        return outfitId; // Return ID to remove from state
      } else {
        return rejectWithValue(response?.message || 'Failed to delete outfit');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const getOutfitDetails = createAsyncThunk(
  'outfits/getOutfitDetails',
  async (outfitId, { rejectWithValue }) => {
    try {
      const response = await getOutfitDetailsApi(outfitId);
      if (response?.success) {
        return response.data;
      } else {
        return rejectWithValue(response?.message || 'Failed to fetch details');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const getOutfitsList = createAsyncThunk(
  'outfits/getOutfitsList',
  async (data, { rejectWithValue }) => {
    try {
      const response = await getOutfitsListApi(data);
      if (response?.success) {
        // Return explicitly the 'data' field from the response, which contains { list, total_records, ... }
        return response.data;
      } else {
        return rejectWithValue(response?.message || 'Failed to fetch outfits');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const createOutfit = createAsyncThunk(
  'outfits/createOutfit',
  async (data, { rejectWithValue }) => {
    try {
      const response = await createOutfitApi(data);
      console.log(
        'createOutfitApi Response:',
        JSON.stringify(response, null, 2),
      );
      if (response?.success) {
        return response; // Return the success data
      } else {
        console.log('createOutfitApi Failed Logic:', response);
        return rejectWithValue(response?.message || 'Server error');
      }
    } catch (error) {
      console.error('createOutfitApi Error Object:', error);
      console.error('createOutfitApi Error Response:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const editOutfit = createAsyncThunk(
  'outfits/editOutfit',
  async (data, { rejectWithValue }) => {
    try {
      const response = await editOutfitApi(data);
      if (response?.success) {
        return response;
      } else {
        return rejectWithValue(response?.message || 'Failed to update outfit');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);
