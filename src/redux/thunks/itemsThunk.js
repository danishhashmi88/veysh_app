import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  addItemApi,
  updateItemApi,
  getItemsListApi,
  deleteItemApi,
} from '../../services/user.service';

const getErrorMessage = errOrRes => {
  const data = errOrRes?.response?.data || errOrRes;
  if (data?.error && Array.isArray(data.error)) {
    return data.error.map(e => e.msg).join(', ');
  }
  return data?.message || errOrRes?.message || 'Something went wrong';
};

export const addItem = createAsyncThunk(
  'items/addItem',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await addItemApi(formData);
      if (response?.success || response?.data?.success) {
        return response.data || response;
      }
      return rejectWithValue(getErrorMessage(response));
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const updateItem = createAsyncThunk(
  'items/updateItem',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await updateItemApi(formData);
      if (response?.success || response?.data?.success) {
        return response.data || response;
      }
      return rejectWithValue(getErrorMessage(response));
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const getItemsList = createAsyncThunk(
  'items/getItemsList',
  async (data, { rejectWithValue }) => {
    try {
      const response = await getItemsListApi(data);
      if (response?.success || response?.data?.success) {
        return response.data || response;
      }
      return rejectWithValue(getErrorMessage(response));
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const getCategories = createAsyncThunk(
  'items/getCategories',
  async (data, { rejectWithValue }) => {
    try {
      const { getCategoriesApi } = require('../../services/user.service');
      const response = await getCategoriesApi(data);
      if (response?.success || response?.data?.success) {
        return response.data || response;
      }
      return rejectWithValue(getErrorMessage(response));
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const deleteItem = createAsyncThunk(
  'items/deleteItem',
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteItemApi(id);
      if (
        response?.success ||
        response?.data?.success ||
        response?.status === 1
      ) {
        return { id, ...(response.data || response) };
      }
      return rejectWithValue(getErrorMessage(response));
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);
