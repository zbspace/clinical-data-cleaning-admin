//#region Imports
import request from '../utils/request';
import { BaseQueryParam, BasePageVo, CleanCompanyDto } from './company';
//#endregion

//#region Types
export interface DrugCleanParam {
  companyId?: number;
  drugComment?: string;
  drugCommentId?: number;
  drugStandardId?: number;
  drugStandardName?: string;
  pageNum?: number;
  pageSize?: number;
  parentCompanyId?: number;
  status?: number;
}

export interface DrugCleanDto {
  acceptanceCount?: number;
  acceptanceNo?: string;
  companyDtoList?: CleanCompanyDto[];
  companyName?: string;
  companyNameOrigin?: string;
  companyNameParent?: string;
  dosageForm?: string;
  drugCode?: string;
  drugComment?: string;
  drugCommentId?: number;
  drugGoodsNameCn?: string;
  drugGoodsNameEn?: string;
  drugNickName?: string;
  drugNormalNameCn?: string;
  drugNormalNameEn?: string;
  drugSourceStr?: string;
  drugStandardId?: number;
  drugStandardName?: string;
  drugType?: string;
  drugTypeOrigin?: string;
  otherComment?: string;
  refId?: number;
  registerType?: string;
  registerTypeOrigin?: string;
  remark?: string;
  sourceRef?: string;
  sourceType?: number;
  status?: number;
  updateTime?: string;
  updateUser?: string;
}

export interface DrugShortDto {
  drugCd?: string;
  drugStandardName?: string;
  drugType?: string;
  id?: number;
}

export interface DrugStandardParam {
  companyId?: number;
  drugComment?: string;
  drugStandardName?: string;
  pageNum?: number;
  pageSize?: number;
  parentCompanyId?: number;
}

export interface DrugStandardDto {
  companyName?: string;
  developmentCode?: string;
  dosageForm?: string;
  drugStandardName?: string;
  drugType?: string;
  genericNameCn?: string;
  genericNameEn?: string;
  id?: number;
  otherInfo?: string;
  parentCompanyName?: string;
  statisticCount?: number;
  status?: number;
  updateTime?: string;
  updateUser?: string;
}

export interface DrugStandardInfo {
  cleanedDrugName?: string;
  createTime?: string;
  createUser?: string;
  developmentCode?: string;
  dosageForm?: string;
  drugType?: string;
  genericNameCn?: string;
  genericNameEn?: string;
  id?: number;
  isDeleted?: number;
  otherInfo?: string;
  status?: number;
  updateTime?: string;
  updateUser?: string;
}
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
