//#region Imports
import request from '../utils/request';
import type { BaseQueryParam, BasePageVo } from './types/company';
import type {
  DrugCleanParam,
  DrugCleanDto,
  DrugShortDto,
  DrugStandardParam,
  DrugStandardDto,
  DrugStandardInfo,
} from './types/drug';
//#endregion

//#region API Methods
export const drugApi = {
  /** 登记号列表 */
  acceptanceNoList(data: BaseQueryParam) {
    return request.post<any, { code: number; data: BasePageVo<string>; msg: string }>(
      '/admin/drug/acceptanceNoList',
      data,
    );
  },

  /** 药品清洗列表 */
  cleanPageData(data: DrugCleanParam) {
    return request.post<any, { code: number; data: BasePageVo<DrugCleanDto>; msg: string }>(
      '/admin/drug/cleanPageData',
      data,
    );
  },

  /** 药品别名列表 */
  commentDrugPageData(data: BaseQueryParam) {
    return request.post<any, { code: number; data: BasePageVo<string>; msg: string }>(
      '/admin/drug/commentDrugPageData',
      data,
    );
  },

  /** 药品名称查询 */
  queryByName(data: BaseQueryParam) {
    return request.post<any, { code: number; data: BasePageVo<DrugShortDto>; msg: string }>(
      '/admin/drug/queryByName',
      data,
    );
  },

  /** 关联药品库信息 */
  saveRelation(data: DrugCleanDto) {
    return request.post<any, { code: number; data: boolean; msg: string }>('/admin/drug/saveRelation', data);
  },

  /** 药品标准库列表 */
  standardPageData(data: DrugStandardParam) {
    return request.post<any, { code: number; data: BasePageVo<DrugStandardDto>; msg: string }>(
      '/admin/drug/standardPageData',
      data,
    );
  },

  /** 药品标准信息保存 */
  standardSave(data: DrugStandardInfo) {
    return request.post<any, { code: number; data: boolean; msg: string }>('/admin/drug/standardSave', data);
  },
};
//#endregion
