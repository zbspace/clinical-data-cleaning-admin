//#region Types
export interface HospitalQueryParam {
  cleanStatus?: number;
  hosOriginName?: string;
  hosStandardName?: string;
  pageNum?: number;
  pageSize?: number;
  queryId?: number;
}

export interface HospitalCleanDto {
  cleanStatus?: number;
  cnt?: number;
  hosOriginName?: string;
  hosStandardId?: number;
  hosStandardName?: string;
  id?: number;
  remark?: string;
  updateTime?: string;
  updater?: string;
  country?: string;
  province?: string;
  city?: string;
}

export interface StandardHospitalDto {
  city?: string;
  cleanStatus?: number;
  cnt?: number;
  country?: string;
  hosShortName?: string;
  hosStandardName?: string;
  id?: number;
  province?: string;
  remark?: string;
  updateTime?: string;
  updater?: string;
}

export interface SplitHospitalDto {
  hosOriginName?: string;
  id?: number;
  spiltNames?: SplitHospitalDto[];
}
//#endregion
