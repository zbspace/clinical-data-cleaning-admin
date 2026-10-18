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
  standardId?: number;
}

export interface DrugStandardParam {
  developmentCode?: string;
  genericNameCn?: string;
  drugStandardName?: string;
  followStatus?: number;
  pageNum?: number;
  pageSize?: number;
  standardId?: number;
  year?: string;
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
  standardId?: number;
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

export interface DrugMergeDto {
  sourceStandardId?: number;
  targetStandardId?: number;
}

export interface EditDrugDevelopmentDto {
  companyNameOriginList?: string[];
  developmentCode?: string;
  drugCommentId?: number;
  indDrugRelId?: number;
}

export interface DrugRelationDto {
  developmentCodeFlag?: number;
  drugComment?: string;
  drugCommentId?: number;
  drugStandardId?: number;
}

export interface UpdateDrugDto {
  cleanedDrugName?: string;
  dosageForm?: string;
  drugComment?: string;
  drugCommentId?: number;
}

export interface DrugAcceptanceDto {
  acceptanceNo?: string;
  companyNameOrigin?: string;
  developmentCode?: string;
  id?: number;
  registrationCategoryCleaned?: string;
  registrationCategoryOrigin?: string;
}
//#endregion
