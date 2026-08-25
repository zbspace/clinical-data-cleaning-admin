//#region Imports
import request from '@/utils/request';
import type { BasePageVo } from './types/company';
import type { VipApplicationReq, VipApplication } from './types/vipApplication';
//#endregion

//#region API Methods
export const vipApplicationApi = {
  /** 查询审批记录 */
  getVipApplicationList(data: VipApplicationReq) {
    return request.post<any, { code: number; data: BasePageVo<VipApplication>; msg: string }>(
      '/admin/vipApplication/getVipApplicationList',
      data,
    );
  },

  /** 申请审批（只需填id、审批状态(2审批通过,3审批不通过)、审批备注） */
  approval(data: VipApplication) {
    return request.post<any, { code: number; data: unknown; msg: string }>('/admin/vipApplication/approval', data);
  },
};
//#endregion
