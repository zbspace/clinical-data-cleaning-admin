//#region Imports
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
//#endregion

//#region State
interface SidebarState {
  collapsed: boolean;
}

const initialState: SidebarState = {
  collapsed: localStorage.getItem('sidebar-collapsed') === 'true',
};
//#endregion

//#region Slice
const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    toggleCollapsed(state) {
      state.collapsed = !state.collapsed;
      localStorage.setItem('sidebar-collapsed', String(state.collapsed));
    },
    setCollapsed(state, action: PayloadAction<boolean>) {
      state.collapsed = action.payload;
      localStorage.setItem('sidebar-collapsed', String(state.collapsed));
    },
  },
});
//#endregion

//#region Exports
export const { toggleCollapsed, setCollapsed } = sidebarSlice.actions;
export default sidebarSlice.reducer;
//#endregion
