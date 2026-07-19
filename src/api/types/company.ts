//#region Types
export interface CompanyQueryParam {
  cleanStatus?: number;
  companyName?: string;
  companyOriginName?: string;
  companyStandardName?: string;
  companyType?: string;
  pageNum?: number;
  pageSize?: number;
  parentCompanyId?: number;
  parentCompanyShortName?: string;
  queryId?: number;
}

export interface BaseQueryParam {
  id?: number | null;
  pageNum?: number;
  pageSize?: number;
  searchKey?: string;
}

export interface CleanCompanyDto {
  acceptanceNo?: string;
  cleanStatus?: number;
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
  updateTime?: string;
  updater?: string;
}

export interface StandardCompanyDto {
  cnt?: number;
  companyShortName?: string;
  companyStandardName?: string;
  companyType?: string;
  id?: number;
  parentCompanyShortName?: number;
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
  standardId?: number;
}

export interface BasePageVo<T> {
  list: T[];
  pages: number;
  total: number;
}

export interface StatDataDto {
  allTotal?: number;
  completedTotal?: number;
  name?: string;
  otherTotal?: number;
  pendingTotal?: number;
}

export interface UpdateCleanStatusDto {
  id: number;
  cleanStatus: number;
}
//#endregion
