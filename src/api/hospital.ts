//#region Imports
import request from '@/utils/request';
import type { BasePageVo } from './types/company';
import type {
  HospitalQueryParam,
  HospitalCleanDto,
  StandardHospitalDto,
} from './types/hospital';
//#endregion

//#region API Methods
export const hospitalApi = {
  /** 获取关联登记号 */
  getAcceptanceNos(data: HospitalQueryParam) {
    return request.post<any, { code: number; data: BasePageVo<string>; msg: string }>(
      '/admin/hospital/getAcceptanceNos',
      data,
    );
  },

  /** 中心(原数据)信息获取 */
  pageData(data: HospitalQueryParam) {
    return request.post<any, { code: number; data: BasePageVo<HospitalCleanDto>; msg: string }>(
      '/admin/hospital/pageData',
      data,
    );
  },

  /** 获取中心别名列表 */
  queryOriginHospitalList(data: HospitalQueryParam) {
    return request.post<any, { code: number; data: BasePageVo<string>; msg: string }>(
      '/admin/hospital/queryOriginHospitalList',
      data,
    );
  },

  /** 获取中心字典(标准名)列表 */
  queryStandardList(data: HospitalQueryParam) {
    return request.post<any, { code: number; data: BasePageVo<StandardHospitalDto>; msg: string }>(
      '/admin/hospital/queryStandardList',
      data,
    );
  },

  /** 中心信息手动清洗 */
  saveClean(data: HospitalCleanDto) {
    return request.post<any, { code: number; data: boolean; msg: string }>('/admin/hospital/saveClean', data);
  },

  /** 中心(标准名)信息保存 */
  saveStandardHospital(data: StandardHospitalDto) {
    return request.post<any, { code: number; data: boolean; msg: string }>(
      '/admin/hospital/saveStandardHospital',
      data,
    );
  },
};
//#endregion
