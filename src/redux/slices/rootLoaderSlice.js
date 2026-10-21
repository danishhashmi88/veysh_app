import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  rootLoadingState: false,
};

export const RootWorkSlice = createSlice({
  name: 'RootWorkSlice',
  initialState,
  reducers: {
    updateRootLoadingState: (state, action) => {
      state.rootLoadingState = action.payload;
    },
  },
});

export const { updateRootLoadingState } = RootWorkSlice.actions;

export default RootWorkSlice.reducer;
