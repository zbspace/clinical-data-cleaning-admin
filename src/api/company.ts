//#region Imports
import request from '../utils/request';
//#endregion

//#region Types
export interface CompanyQueryParam {
  companyName?: string;
  pageNum?: number;
  pageSize?: number;
  queryId?: number;
  status?: number;
}

export interface BaseQueryParam {
  id?: number;
  pageNum?: number;
  pageSize?: number;
  searchKey?: string;
}

export interface CleanCompanyDto {
  acceptanceNo?: string;
  cnt?: number;
  companyOriginName?: string;
  companyShortName?: string;
  companyStandardName?: string;
  companyType?: string;
  id?: number;
  parentCompanyId?: number;
  parentCompanyShortName?: string;
  remark?: string;
  sources?: string[];
  standardId?: number;
  status?: number;
  updateTime?: string;
  updater?: string;
}

export interface StandardCompanyDto {
  cnt?: number;
  companyShortName?: string;
  companyStandardName?: string;
  companyType?: string;
  id?: number;
  parentCompanName?: number;
  parentCompanyId?: number;
  relation?: string;
  remark?: string;
  status?: number;
  updateTime?: string;
  updater?: string;
}

export interface CompanyShortDto {
  companyShortName?: string;
  companyStandardName?: string;
  companyType?: string;
  id?: number;
  parentCompanyId?: number;
  parentCompanyShortName?: string;
}

export interface BasePageVo<T> {
  list: T[];
  pages: number;
  total: number;
}
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
