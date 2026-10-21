import { createSlice } from '@reduxjs/toolkit';
import {
  addCommentPost,
  getHomeLatestpost,
  getPostlist,
  likePost,
} from '../thunks/postsThunk';

const initialState = {
  postsList: [],
  totalRecords: 0,
  loading: false,
  error: null,
  latestpostList: [],
};

export const postsSlice = createSlice({
  name: 'PostsSlice',
  initialState,
  reducers: {
    clearSocialError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getPostlist.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPostlist.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        const incomingPosts = action.payload.list || [];
        state.postsList = incomingPosts.map(newPost => {
          const existingPost = state.postsList?.find(
            p => p._id === newPost._id,
          );
          if (
            existingPost &&
            (existingPost.liked !== undefined ||
              existingPost.isLiked !== undefined)
          ) {
            return {
              ...newPost,
              isLiked:
                existingPost.liked || existingPost.isLiked || newPost.isLiked,
              liked:
                existingPost.liked !== undefined
                  ? existingPost.liked
                  : existingPost.isLiked,
            };
          }
          return newPost;
        });

        state.totalRecords = action.payload.total_records;
      })
      .addCase(getPostlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = true;
      });

    //likeEvent
    builder.addCase(likePost.pending, state => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(likePost.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      const postId = action.meta.arg;
      const { likesCount, isLiked } = action.payload || {};

      // Helper function to update post in a list
      const updatePostInList = list => {
        const post = list.find(p => p._id === postId);
        if (post) {
          post.likesCount = likesCount ?? post.likesCount;
          post.isLiked = isLiked ?? !post.isLiked;
          post.liked = isLiked ?? !post.liked;
        }
      };

      if (state.postsList) updatePostInList(state.postsList);
      if (state.latestpostList) updatePostInList(state.latestpostList);
    });
    builder.addCase(likePost.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    });

    //getComments
    builder.addCase(addCommentPost.pending, state => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(addCommentPost.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
    });
    builder.addCase(addCommentPost.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.comments;
      state.success = false;
    });

    //latestPost
    builder.addCase(getHomeLatestpost.pending, state => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(getHomeLatestpost.fulfilled, (state, action) => {
      state.loading = false;

      const incomingPosts = action.payload.posts || [];
      state.latestpostList = incomingPosts.map(newPost => {
        const existingPost = state.latestpostList?.find(
          p => p._id === newPost._id,
        );
        if (
          existingPost &&
          (existingPost.liked !== undefined ||
            existingPost.isLiked !== undefined)
        ) {
          return {
            ...newPost,
            isLiked:
              existingPost.liked || existingPost.isLiked || newPost.isLiked,
            liked:
              existingPost.liked !== undefined
                ? existingPost.liked
                : existingPost.isLiked,
          };
        }
        return newPost;
      });

      state.totalRecords = action.payload.total_records;
      state.success = true;
    });
    builder.addCase(getHomeLatestpost.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    });
  },
});

export const { clearSocialError } = postsSlice.actions;
export default postsSlice.reducer;
