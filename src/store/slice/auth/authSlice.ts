import { getStorage, setStorage, removeStorage } from '@/utils';
import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean
}
const initialState: AuthState = {
  isAuthenticated: Boolean(getStorage('token'))
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signInSuccess (state, action) {
      setStorage('token', action.payload);
      state.isAuthenticated = true;
    },
    signOut (state) {
      const theme = getStorage('theme');
      const themeColor = getStorage('themeColor');
      removeStorage('token');
      removeStorage('theme');
      removeStorage('themeColor');
      document.documentElement.classList.remove(theme);
      document.documentElement.classList.remove(themeColor);
      state.isAuthenticated = false;
    }
  }
});

export const { signInSuccess, signOut } = authSlice.actions;
export default authSlice.reducer;
