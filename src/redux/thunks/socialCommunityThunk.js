import { createAsyncThunk } from '@reduxjs/toolkit';
import { socialCommunityPost } from '../../services/user.service';

export const getLatestPosts = createAsyncThunk(
    'socialCommunity/getLatestPosts',
    async (data, { rejectWithValue }) => {
        try {
            const response = await socialCommunityPost(data);
            console.log('getLatestPosts Response:', response);
            if (response?.success) {
                return response.data;
            } else {
                return rejectWithValue(response?.message || 'Failed to fetch latest posts');
            }
        } catch (error) {
            console.error('getLatestPosts Error:', error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);
