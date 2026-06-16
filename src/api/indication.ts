//#region Imports
import request from '../utils/request';
import { BaseQueryParam, BasePageVo } from './company';
//#endregion

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

//#region API Methods
export const indicationApi = {
  /** 适应症-分类列表 */
  categoryPageData(data: BaseQueryParam) {
    return request.post<any, { code: number; data: BasePageVo<IndicationCategory>; msg: string }>(
      '/admin/indication/categoryPageData',
      data,
    );
  },

  /** 适应症字典列表 */
  dictPageData(data: IndicationDictParam) {
    return request.post<any, { code: number; data: BasePageVo<IndicationDictDto>; msg: string }>(
      '/admin/indication/dictPageData',
      data,
    );
  },

  /** 适应症字典-源数据 */
  getIndicationCommentList(data: BaseQueryParam) {
    return request.post<any, { code: number; data: BasePageVo<string>; msg: string }>(
      '/admin/indication/getIndicationCommentList',
      data,
    );
  },

  /** 适应症信息详情 */
  getIndicationDetail(indicationCommentId: number) {
    return request.post<any, { code: number; data: IndicationDetailDto; msg: string }>(
      '/admin/indication/getIndicationDetail',
      { indicationCommentId },
    );
  },

  /** 适应症信息查询 */
  pageData(data: IndicationParam) {
    return request.post<any, { code: number; data: BasePageVo<IndicationDto>; msg: string }>(
      '/admin/indication/pageData',
      data,
    );
  },

  /** 适应症信息保存 */
  saveIndication(data: IndicationDetailDto) {
    return request.post<any, { code: number; data: boolean; msg: string }>('/admin/indication/saveIndication', data);
  },

  /** 适应症名称查询 */
  shortNameData(data: BaseQueryParam) {
    return request.post<any, { code: number; data: BasePageVo<IndicationShortDto>; msg: string }>(
      '/admin/indication/shortNameData',
      data,
    );
  },
};
//#endregion
