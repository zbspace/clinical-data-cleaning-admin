//#region Imports
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import sidebarReducer from './sidebarSlice';
//#endregion

//#region Store
const store = configureStore({
  reducer: {
    auth: authReducer,
    sidebar: sidebarReducer,
  },
});
//#endregion

//#region Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
//#endregion

export default store;
