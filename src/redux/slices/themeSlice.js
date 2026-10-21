// themeSlice.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice } from '@reduxjs/toolkit';
import { APP_THEME } from '../../utils/storage';

const initialState = {
  theme: 'light',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme(state, action) {
      state.theme = action.payload;
    },
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;

export const loadTheme = () => async (dispatch) => {
  try {
    const theme = await AsyncStorage.getItem(APP_THEME);

    if (theme) {
      dispatch(setTheme(theme));
    }else{
      await AsyncStorage.setItem(APP_THEME, initialState.theme);
      dispatch(setTheme(initialState.theme));
    }
  } catch (e) {
    console.log('Failed to load theme', e);
  }
};

export const saveTheme = () => async (dispatch, getState) => {
  try {
    dispatch(toggleTheme());
    const theme = getState().themeSetting.theme;
    await AsyncStorage.setItem(APP_THEME, theme);
  } catch (e) {
    console.log('Failed to save theme', e);
  }
};
