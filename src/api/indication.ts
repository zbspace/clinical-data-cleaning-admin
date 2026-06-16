//#region Imports
import request from '../utils/request';
import type { BaseQueryParam, BasePageVo } from './types/company';
import type {
  IndicationCategory,
  IndicationDictParam,
  IndicationDictDto,
  IndicationDetailDto,
  IndicationDto,
  IndicationParam,
  IndicationShortDto,
} from './types/indication';
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
