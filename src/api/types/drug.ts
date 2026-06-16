//#region Imports
import type { CleanCompanyDto } from './company';
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