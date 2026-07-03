//#region Imports
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
//#endregion

//#region State
interface AuthState {
  token: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
};
//#endregion

//#region Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
    clearToken(state) {
      state.token = null;
      localStorage.removeItem('token');
    },
  },
});
//#endregion

//#region Exports
export const { setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;
//#endregion
