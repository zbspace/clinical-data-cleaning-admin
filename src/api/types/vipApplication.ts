//#region Types
export interface VipApplicationReq {
  approvalStatus?: number;
  pageNum?: number;
  pageSize?: number;
  userCompany?: string;
  userName?: string;
  userPhone?: string;
}

export interface VipApplication {
  applicateDate?: string;
  approvalDate?: string;
  approvalRemark?: string;
  approvalStatus?: number;
  id?: number;
  userCompany?: string;
  userId?: number;
  userName?: string;
  userPhone?: string;
  userPosition?: string;
}
//#endregion
