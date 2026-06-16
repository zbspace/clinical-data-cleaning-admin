//#region Imports
import request from '../utils/request';
import type {
  BasePageVo,
  BaseQueryParam,
  CleanCompanyDto,
  CompanyQueryParam,
  CompanyShortDto,
  StandardCompanyDto,
} from './types/company';
//#endregion

//#region API Methods
export const companyApi = {
  /** 获取关联登记号 */
  getAcceptanceNos(data: CompanyQueryParam) {
    return request.post<any, { code: number; data: BasePageVo<string>; msg: string }>(
      '/admin/company/getAcceptanceNos',
      data,
    );
  },

  /** 获取原始公司信息列表 */
  getOriginCompanies(data: CompanyQueryParam) {
    return request.post<any, { code: number; data: BasePageVo<string>; msg: string }>(
      '/admin/company/getOriginCompanies',
      data,
    );
  },

  /** 获取公司字典信息记录 */
  getStandardCompany(id: number) {
    return request.get<any, { code: number; data: StandardCompanyDto; msg: string }>(
      '/admin/company/getStandardCompany',
      {
        params: { id },
      },
    );
  },

  /** 公司信息查询 */
  pageData(data: CompanyQueryParam) {
    return request.post<any, { code: number; data: BasePageVo<CleanCompanyDto>; msg: string }>(
      '/admin/company/pageData',
      data,
    );
  },

  /** 公司标准信息获取 */
  queryByName(data: BaseQueryParam) {
    return request.post<any, { code: number; data: BasePageVo<CompanyShortDto>; msg: string }>(
      '/admin/company/queryByName',
      data,
    );
  },

  /** 获取公司字典(标准名)列表 */
  queryStandardList(data: CompanyQueryParam) {
    return request.post<any, { code: number; data: BasePageVo<StandardCompanyDto>; msg: string }>(
      '/admin/company/queryStandardList',
      data,
    );
  },

  /** 公司信息手动清洗 */
  saveClean(data: CleanCompanyDto) {
    return request.post<any, { code: number; data: boolean; msg: string }>('/admin/company/saveClean', data);
  },

  /** 公司字典(标准名)信息保存 */
  saveStandardCompany(data: StandardCompanyDto) {
    return request.post<any, { code: number; data: boolean; msg: string }>('/admin/company/saveStandardCompany', data);
  },
};
//#endregion
