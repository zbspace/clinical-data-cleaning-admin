//#region Imports
import request from '../utils/request';
import type { LoginRequest, UserDto } from './types/auth';
//#endregion

//#region API Methods
export const authApi = {
  /** 获取验证码 */
  getCaptcha() {
    return request.get('/adminLogin/captcha', { responseType: 'blob' });
  },

  /** 登录以后返回token */
  login(data: LoginRequest) {
    return request.post('/adminLogin/login', data);
  },

  /** 登出功能 */
  logout(name?: string) {
    return request.post('/adminLogin/logout', null, { params: { name } });
  },

  /** 刷新token */
  refreshToken() {
    return request.get('/adminLogin/refreshToken');
  },

  /** 获取用户信息 */
  getUserInfo() {
    return request.get<any, { code: number; data: UserDto; msg: string }>('/adminUser/info');
  },
};
//#endregion
