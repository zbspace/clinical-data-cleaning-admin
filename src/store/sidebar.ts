//#region Imports
import { defineStore } from 'pinia';
//#endregion

//#region Store
interface SidebarState {
  collapsed: boolean;
}

export const useSidebarStore = defineStore('sidebar', {
  state: (): SidebarState => ({
    collapsed: localStorage.getItem('sidebar-collapsed') === 'true',
  }),
  actions: {
    toggleCollapsed() {
      this.collapsed = !this.collapsed;
      localStorage.setItem('sidebar-collapsed', String(this.collapsed));
    },
    setCollapsed(collapsed: boolean) {
      this.collapsed = collapsed;
      localStorage.setItem('sidebar-collapsed', String(this.collapsed));
    },
  },
});
//#endregion
