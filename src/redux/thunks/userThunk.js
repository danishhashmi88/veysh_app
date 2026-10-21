import { createAsyncThunk } from '@reduxjs/toolkit';

export const loginAndSignupUser = createAsyncThunk(
  'auth/loginAndSignupUser',
  async ({}, { rejectWithValue, dispatch }) => {
    try {
      return '';
    } catch (err) {
      // console.log(err);
      return rejectWithValue(err);
    }
  },
);
