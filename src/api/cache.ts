//#region Imports
import request from '../utils/request';
//#endregion

//#region API Methods
export const cacheApi = {
  /**
   * getVal
   */
  getVal(key: string) {
    return request.get<any, { code: number; data: string; msg: string }>('/admin/cache/getVal', {
      params: { key },
    });
  },

  /**
   * setVal
   */
  setVal(key: string, val?: string) {
    return request.post<any, { code: number; data: string; msg: string }>('/admin/cache/setVal', null, {
      params: { key, val },
    });
  },
};
//#endregion
