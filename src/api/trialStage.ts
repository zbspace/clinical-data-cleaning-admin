//#region Imports
import request from '../utils/request';
import type { BaseQueryParam, BasePageVo } from './types/company';
import type { CdeTrialStagesMapping } from './types/trialStage';
//#endregion

//#region API Methods
export const trialStageApi = {
  /** 试验分期列表 */
  pageData(data: BaseQueryParam) {
    return request.post<any, { code: number; data: BasePageVo<CdeTrialStagesMapping>; msg: string }>(
      '/admin/trialStagesMapping/pageData',
      data,
    );
  },

  /** 编辑保存 */
  save(data: CdeTrialStagesMapping) {
    return request.post<any, { code: number; data: boolean; msg: string }>('/admin/trialStagesMapping/save', data);
  },
};
//#endregion
