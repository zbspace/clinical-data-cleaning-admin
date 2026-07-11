//#region Imports
import request from '@/utils/request';
import type { BaseQueryParam, BasePageVo, StatDataDto } from './types/company';
import type {
  IndicationCategory,
  IndicationDictParam,
  IndicationDictDto,
  IndicationDetailDto,
  IndicationDto,
  IndicationParam,
  IndicationRelDto,
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

  /** 获取关联登记号 */
  getAcceptanceNos(data: BaseQueryParam) {
    return request.post<any, { code: number; data: BasePageVo<IndicationRelDto>; msg: string }>(
      '/admin/indication/getAcceptanceNos',
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

  /** 适应症字典保存 */
  saveIndicationDict(data: IndicationDictDto) {
    return request.post<any, { code: number; data: boolean; msg: string }>('/admin/indication/saveIndicationDict', data);
  },

  /** 适应症名称查询 */
  shortNameData(data: BaseQueryParam) {
    return request.post<any, { code: number; data: BasePageVo<IndicationShortDto>; msg: string }>(
      '/admin/indication/shortNameData',
      data,
    );
  },

  /** 获取统计信息 */
  getStatData(data: BaseQueryParam) {
    return request.post<any, { code: number; data: StatDataDto; msg: string }>(
      '/admin/indication/getStatData',
      data,
    );
  },
};
//#endregion
