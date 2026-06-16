//#region Types
export interface IndicationCategory {
  categoryLevel?: number;
  categoryName?: string;
  createTime?: string;
  createUser?: string;
  id?: number;
  isDeleted?: number;
  updateTime?: string;
  updateUser?: string;
}

export interface IndicationDictParam {
  indicationCategoryId?: string;
  indicationCategoryName?: string;
  indicationStandard?: string;
  pageNum?: number;
  pageSize?: number;
}

export interface IndicationDictDto {
  indicationCategoryId?: number;
  indicationCategoryName?: string;
  indicationStandard?: string;
  indicationTagId?: number;
  statisticCount?: number;
  updateTime?: string;
  updateUser?: string;
}

export interface IndicationTagDto {
  createTime?: string;
  createUser?: string;
  id?: number;
  indicationCategoryId?: number;
  indicationCategoryName?: string;
  indicationIcdName?: string;
  indicationIcdScope?: string;
  indicationStandard?: string;
  isDeleted?: number;
  updateTime?: string;
  updateUser?: string;
}

export interface IndicationDetailDto {
  indicationComment?: string;
  indicationCommentId?: number;
  indicationTagDtoList?: IndicationTagDto[];
  sourceList?: string[];
  statisticCount?: number;
  status?: number;
  updateUser?: string;
}

export interface IndicationTagInfo {
  createTime?: string;
  createUser?: string;
  id?: number;
  indicationCategoryId?: number;
  indicationCategoryName?: string;
  indicationStandard?: string;
  isDeleted?: number;
  updateTime?: string;
  updateUser?: string;
}

export interface IndicationDto {
  indicationComment?: string;
  indicationCommentId?: number;
  indicationTagList?: IndicationTagInfo[];
  sourceList?: string[];
  statisticCount?: number;
  status?: number;
  updateUser?: string;
}

export interface IndicationParam {
  indicationParentId?: number;
  indicationTagId?: number;
  pageNum?: number;
  pageSize?: number;
  status?: number;
}

export interface IndicationShortDto {
  indicationComment?: string;
  indicationCommentId?: number;
}
//#endregion