//#region Imports
import request from '@/utils/request';
import type { BaseQueryParam, BasePageVo, StatDataDto, UpdateCleanStatusDto } from './types/company';
import type {
  DrugCleanParam,
  DrugCleanDto,
  DrugShortDto,
  DrugStandardParam,
  DrugStandardDto,
  DrugStandardInfo,
  DrugAcceptanceDto,
  UpdateDrugDto,
  DrugRelationDto,
  EditDrugDevelopmentDto,
  DrugMergeDto,
} from './types/drug';
//#endregion

//#region API Methods
export const drugApi = {
  /** 登记号列表 */
  acceptanceNoList(data: BaseQueryParam) {
    return request.post<any, { code: number; data: BasePageVo<DrugAcceptanceDto>; msg: string }>(
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

  /** 剂型列表(源数据) */
  dosageFormList(data: BaseQueryParam) {
    return request.post<any, { code: number; data: BasePageVo<string>; msg: string }>(
      '/admin/drug/dosageFormList',
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
  saveRelation(data: DrugRelationDto) {
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

  /** 获取统计信息 */
  getStatData(data: BaseQueryParam) {
    return request.post<any, { code: number; data: StatDataDto; msg: string }>('/admin/drug/getStatData', data);
  },
  /** 修改清洗状态 */
  updateCleanStatus(data: UpdateCleanStatusDto) {
    return request.post<any, { code: number; data: boolean; msg: string }>('/admin/drug/updateCleanStatus', data);
  },

  /** 修改研发代码 */
  editDevelopmentCode(data: DrugAcceptanceDto) {
    return request.post<any, { code: number; data: boolean; msg: string }>('/admin/drug/editDevelopmentCode', data);
  },

  /** 修改研发代码(通过公司源名称) */
  editDevelopmentCodeByCompany(data: EditDrugDevelopmentDto) {
    return request.post<any, { code: number; data: boolean; msg: string }>(
      '/admin/drug/editDevelopmentCodeByCompany',
      data,
    );
  },

  /** 查询研发代码 */
  queryDevelopmentCode(data: BaseQueryParam) {
    return request.post<any, { code: number; data: BasePageVo<string>; msg: string }>(
      '/admin/drug/queryDevelopmentCode',
      data,
    );
  },

  /** 药品通用名合并 */
  drugMerge(data: DrugMergeDto) {
    return request.post<any, { code: number; data: boolean; msg: string }>('/admin/drug/drugMerge', data);
  },

  /** 修改药品信息(清洗前) */
  updateDrugInfo(data: UpdateDrugDto) {
    return request.post<any, { code: number; data: boolean; msg: string }>('/admin/drug/updateDrugInfo', data);
  },
};
//#endregion
