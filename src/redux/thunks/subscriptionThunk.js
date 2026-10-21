import { createAsyncThunk } from '@reduxjs/toolkit';
import { addSubscriptionApi, cancelSubscriptionApi, getActiveSubscriptionDetailsApi, getSubscriptionListApi, updateSubscriptionApi, verifySubscriptionPaymentApi } from '../../services/user.service';

export const getSubscriptionList = createAsyncThunk(
    'subscriptionSlice/getSubscriptionList',
    async (data, { rejectWithValue }) => {
        try {
            const response = await getSubscriptionListApi();
            if (response?.success) {
                return response.data;
            } else {
                return rejectWithValue(response?.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const getActiveSubscriptionDetails = createAsyncThunk(
    'subscriptionSlice/getActiveSubscriptionDetails',
    async (data, { rejectWithValue }) => {
        try {
            const response = await getActiveSubscriptionDetailsApi();
            if (response?.success) {
                return response.data;
            } else {
                return rejectWithValue(response?.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);
export const cancelSubscription = createAsyncThunk(
    'subscriptionSlice/cancelSubscription',
    async (data, { rejectWithValue }) => {
        console.log("data",data)
        try {
            const response = await cancelSubscriptionApi(data);
            if (response?.success) {
                return response;
            } else {
                return rejectWithValue(response?.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const addSubscription = createAsyncThunk(
    'subscriptionSlice/addSubscription',
    async (data, { rejectWithValue }) => {
        try {
            const response = await addSubscriptionApi(data);
            if (response?.success) {
                return response.data;
            } else {
                return rejectWithValue(response?.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);
export const updateSubscription = createAsyncThunk(
    'subscriptionSlice/updateSubscription',
    async (data, { rejectWithValue }) => {
        try {
            const response = await updateSubscriptionApi(data);
            if (response?.success) {
                return response.data;
            } else {
                return rejectWithValue(response?.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);
export const verifySubscriptionPayment = createAsyncThunk(
    'subscriptionSlice/verifySubscriptionPayment',
    async (data, { rejectWithValue }) => {
        console.log("here data is",data)
        try {
            const response = await verifySubscriptionPaymentApi(data);
            if (response?.success) {
                return response;
            } else {
                return rejectWithValue(response?.message);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

