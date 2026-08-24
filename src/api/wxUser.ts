//#region Imports
import request from '@/utils/request';
import type { BasePageVo } from './types/company';
import type { WxUserQueryParam, WxUserDto, EditVipParam } from './types/wxUser';
//#endregion

//#region API Methods
export const wxUserApi = {
  /** 微信用户列表 */
  pageData(data: WxUserQueryParam) {
    return request.post<any, { code: number; data: BasePageVo<WxUserDto>; msg: string }>(
      '/admin/wxUserManage/pageData',
      data,
    );
  },

  /** 编辑VIP信息 */
  editUserVIP(data: EditVipParam) {
    return request.post<any, { code: number; data: boolean; msg: string }>(
      '/admin/wxUserManage/editUserVIP',
      data,
    );
  },
};
//#endregion
