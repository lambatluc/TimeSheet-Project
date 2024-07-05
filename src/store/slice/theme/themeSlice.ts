import { createSlice } from '@reduxjs/toolkit';
import { getStorage, setStorage } from '@/utils';

const initialState = {
  theme: getStorage('theme') ?? 'light',
  themeColor: getStorage('themeColor') ?? ''
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
      setStorage('theme', action.payload);
    },
    setThemeColor: (state, action) => {
      state.themeColor = action.payload;
      setStorage('themeColor', action.payload);
    }
  }
});

export const { setTheme, setThemeColor } = themeSlice.actions;
export default themeSlice.reducer;
