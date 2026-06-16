//#region Imports
import axios from 'axios';
import { MessagePlugin } from 'tdesign-react';
//#endregion

//#region Instance
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
});
//#endregion

//#region Interceptors
// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const res = response.data;

    // 假设正常业务响应的 code 是 200 或 0
    if (res.code && res.code !== 200 && res.code !== 0) {
      MessagePlugin.error(res.message || '系统错误');
      return Promise.reject(new Error(res.message || 'Error'));
    }

    return res;
  },
  (error) => {
    // 处理 HTTP 状态码错误
    if (error.response?.status === 401) {
      MessagePlugin.error('登录状态已过期，请重新登录');
      localStorage.removeItem('token');
      // window.location.href = '/login';
    } else {
      MessagePlugin.error(error.message || '网络请求失败，请稍后重试');
    }
    return Promise.reject(error);
  },
);
//#endregion

export default request;
