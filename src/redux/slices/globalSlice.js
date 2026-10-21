import { createSlice } from "@reduxjs/toolkit";
import { user_roles } from "../../constant";

const initialState = {
  isLoggedIn: false,
  isGuestUser: false,
  showGlobalModal: false,
  showOnboard: false,
  initialAppRoute: 'HomeScreen',
  // Only used by AuthNavigation (e.g. return to Login after profile back)
  authInitialRoute: null,
};

export const GlobalSlice = createSlice({
  name: "GlobalSlice",
  initialState,
  reducers: {
    updateGlobalSliceState: (state, action) => {
      state.isLoggedIn = action.payload;
      // App stack must never inherit auth-only routes like "Login"
      if (action.payload === true) {
        state.authInitialRoute = null;
        if (
          !state.initialAppRoute ||
          state.initialAppRoute === 'Login' ||
          state.initialAppRoute === 'AuthSelection' ||
          state.initialAppRoute === 'Signup'
        ) {
          state.initialAppRoute = 'MainTab';
        }
      }
    },

    updateIsGuestUser: (state, action) => {
      state.isGuestUser = action.payload;
    },

    updateShowGlobalModal: (state, action) => {
      state.showGlobalModal = action.payload;
    },

    updateShowOnboard: (state, action) => {
      state.showOnboard = action.payload;
    },

    updateInitialAppRoute: (state, action) => {
      state.initialAppRoute = action.payload;
    },

    updateAuthInitialRoute: (state, action) => {
      state.authInitialRoute = action.payload;
    },

    resetSomeState: (state, action) => {
      state.isLoggedIn = false
      state.isGuestUser = false
      state.showGlobalModal = false
    },

    // resetGlobalState: () => initialState,

    resetGlobalState: (state) => {
      return {
        ...initialState,
        showOnboard: state.showOnboard,
      };
    },


  },
});

export const {
  updateGlobalSliceState,
  updateIsGuestUser,
  updateShowGlobalModal,
  resetGlobalState,
  resetSomeState,
  updateShowOnboard,
  updateInitialAppRoute,
  updateAuthInitialRoute,
} = GlobalSlice.actions;

export default GlobalSlice.reducer;
