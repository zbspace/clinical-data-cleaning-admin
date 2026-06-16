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
