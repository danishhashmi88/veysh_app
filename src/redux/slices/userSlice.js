import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tokenAndId: {
    token: null,
    userId: null,
    userRole: null,
  },

  userDetails: {},
  sellerHomeData: {
    liveStreams: 0,
    totalProducts: 0,
  },
  unreadConversations: {}, // { room_id: true }
  activeChatRoom: null, // room_id of the currently open chat
};

export const UserSlice = createSlice({
  name: 'UserSlice',
  initialState,
  reducers: {
    updateTokenData: (state, action) => {
      state.tokenAndId = action.payload;
    },
    updateUserData: (state, action) => {
      if (!action.payload) {
        console.warn('REDUX_WARN: updateUserData payload is null or undefined');
        return;
      }
      state.userDetails = { ...state.userDetails, ...action.payload };
    },
    // updateUserData: (state, action) => {
    //   state.userDetails = { ...action.payload };
    // },
    updateSellerHomeData: (state, action) => {
      state.sellerHomeData = { ...state.sellerHomeData, ...action.payload };
    },
    updateNotificationSetting: (state, action) => {
      state.userDetails = { ...state.userDetails, ...action.payload };
    },

    resetAuthState: () => initialState,

    setConversationUnread: (state, action) => {
      const roomId = action.payload;
      if (roomId) {
        state.unreadConversations[roomId] = true;
      }
    },
    clearConversationUnread: (state, action) => {
      const roomId = action.payload;
      if (state.unreadConversations[roomId]) {
        delete state.unreadConversations[roomId];
      }
    },
    clearAllUnreads: (state) => {
      state.unreadConversations = {};
    },
    setActiveChatRoom: (state, action) => {
      state.activeChatRoom = action.payload;
    },
  },
});

export const {
  updateTokenData,
  updateUserData,
  resetAuthState,
  sellerHomeData,
  updateNotificationSetting,
  setConversationUnread,
  clearConversationUnread,
  clearAllUnreads,
  setActiveChatRoom,
} = UserSlice.actions;

export default UserSlice.reducer;
