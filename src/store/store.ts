import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/auth/authSlice';
import themeReducer from './slice/theme/themeSlice';
const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer
  }
});
export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
