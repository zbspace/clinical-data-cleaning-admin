//#region Imports
import { defineStore } from 'pinia';
//#endregion

//#region Store
interface AuthState {
  token: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('token'),
  }),
  actions: {
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('token', token);
    },
    clearToken() {
      this.token = null;
      localStorage.removeItem('token');
    },
  },
});
//#endregion
