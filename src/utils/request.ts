//#region Imports
import axios from 'axios';
import { MessagePlugin } from 'tdesign-vue-next';
//#endregion

//#region Instance
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
});
//#endregion

//#region Interceptors
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer_${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

request.interceptors.response.use(
  (response) => {
    if (response.config.responseType === 'blob' || response.config.responseType === 'arraybuffer') {
      return response as any;
    }
    const res = response.data;
    if (res.code && res.code !== 200 && res.code !== 0) {
      MessagePlugin.error(res.message || '系统错误');
      return Promise.reject(new Error(res.message || 'Error'));
    }
    return res;
  },
  (error) => {
    if (error.response?.status === 401) {
      MessagePlugin.error('登录状态已过期，请重新登录');
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else {
      MessagePlugin.error(error.message || '网络请求失败，请稍后重试');
    }
    return Promise.reject(error);
  },
);
//#endregion

export default request;
