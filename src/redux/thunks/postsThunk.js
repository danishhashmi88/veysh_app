import { createAsyncThunk } from '@reduxjs/toolkit';
import { addCommentPostapi, getPostsApi, likePostapi } from '../../services/auth.service';
import { getLatest_Postapi } from '../../services/user.service';

export const getPostlist = createAsyncThunk(
    'PostsSlice/getPostlist',
    async (data, { rejectWithValue }) => {
        try {
            const response = await getPostsApi();
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
export const likePost = createAsyncThunk(
    'PostsSlice/likePost',
    async (data, { rejectWithValue }) => {
        try {
            const response = await likePostapi(data);
            console.log('get like response:', response);
            if (response?.success) {
                return response.data;
            } else {
                return rejectWithValue(response?.message || 'Failed to fetch latest posts');
            }
        } catch (error) {
            console.error('get Error:', error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const addCommentPost = createAsyncThunk(
    'PostsSlice/addcommentPost',
    async ({ postId, comment }, { rejectWithValue }) => {
        try {
            const response = await addCommentPostapi(postId, comment);
            console.log('get Response comment:', response);
            if (response?.success) {
                return response.data;
            } else {
                return rejectWithValue(response?.message || 'Failed to fetch latest posts');
            }
        } catch (error) {
            console.error('get Error:', error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);
export const getHomeLatestpost = createAsyncThunk(
    'PostsSlice/getHomeLatestpost',
    async (data, { rejectWithValue }) => {
        try {
            const response = await getLatest_Postapi();
            console.log(response,'fdfnjdsfjudsbfisdfdsfdsf');
            
            if (response?.success) {
                return response.data;
            } else {
                return rejectWithValue(response?.message || 'Failed to fetch latest posts');
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);
