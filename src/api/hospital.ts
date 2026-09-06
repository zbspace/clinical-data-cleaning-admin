//#region Imports
import request from '@/utils/request';
import type { BasePageVo, StatDataDto, UpdateCleanStatusDto } from './types/company';
import type {
  HospitalQueryParam,
  HospitalCleanDto,
  StandardHospitalDto,
  StandardHospitalMergeDto,
  SplitHospitalDto,
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

  /** 获取统计信息 */
  getStatData(data: HospitalQueryParam) {
    return request.post<any, { code: number; data: StatDataDto; msg: string }>('/admin/hospital/getStatData', data);
  },
  /** 修改清洗状态 */
  updateCleanStatus(data: UpdateCleanStatusDto) {
    return request.post<any, { code: number; data: boolean; msg: string }>('/admin/hospital/updateCleanStatus', data);
  },

  /** 源名称拆分 */
  spiltNames(data: SplitHospitalDto) {
    return request.post<any, { code: number; data: boolean; msg: string }>('/admin/hospital/spiltNames', data);
  },

  /** 标准中心合并(转移) */
  standardHospitalMerge(data: StandardHospitalMergeDto) {
    return request.post<any, { code: number; data: boolean; msg: string }>(
      '/admin/hospital/standardHospitalMerge',
      data,
    );
  },
};
//#endregion
