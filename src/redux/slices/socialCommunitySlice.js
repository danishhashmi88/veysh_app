import { createSlice } from '@reduxjs/toolkit';
import { getLatestPosts } from '../thunks/socialCommunityThunk';
import { likePost } from '../thunks/postsThunk';

const socialCommunitySlice = createSlice({
  name: 'socialCommunity',
  initialState: {
    postsList: [],
    totalRecords: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearSocialError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getLatestPosts.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLatestPosts.fulfilled, (state, action) => {
        state.loading = false;
        const { list, total_records } = action.payload || {};
        const page = action.meta.arg?.page || 1;

        if (page === 1) {
          state.postsList = list || [];
        } else {
          state.postsList = [...state.postsList, ...(list || [])];
        }
        state.totalRecords = total_records || 0;
      })
      .addCase(getLatestPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const postId = action.meta.arg;
        const { likesCount, isLiked } = action.payload || {};
        const post = state.postsList.find(p => p._id === postId);
        if (post) {
          post.likesCount = likesCount ?? post.likesCount;
          // Support both property names used in this codebase
          post.isLiked = isLiked ?? !post.isLiked;
          post.liked = isLiked ?? !post.liked;
        }
      });
  },
});

export const { clearSocialError } = socialCommunitySlice.actions;
export default socialCommunitySlice.reducer;
