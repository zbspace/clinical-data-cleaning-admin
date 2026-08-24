//#region Types
export interface WxUserQueryParam {
  nickname?: string;
  pageNum?: number;
  pageSize?: number;
  phone?: string;
  username?: string;
  vipCode?: number;
}

export interface WxUserAuthDto {
  appId?: string;
  authBeginTime?: string;
  authDays?: number;
  authEndTime?: string;
  authLevel?: string;
  id?: number;
  levelCd?: number;
  unionId?: string;
  wxUserId?: number;
}

export interface WxAppDto {
  appId?: string;
  appName?: string;
}

export interface WxUserDto {
  authDto?: WxUserAuthDto;
  authDtoList?: WxUserAuthDto[];
  avatarUrl?: string;
  city?: string;
  createTime?: string;
  enable?: number;
  id?: number;
  lastLoginTime?: string;
  levelCd?: number;
  nickname?: string;
  openid?: string;
  phone?: string;
  province?: string;
  unionid?: string;
  userApps?: WxAppDto[];
  userRole?: string;
  username?: string;
  vipBeginTime?: string;
  vipDesc?: string;
  vipEndTime?: string;
  wxNickname?: string;
}

export interface EditVipParam {
  id?: number;
  pageNum?: number;
  pageSize?: number;
  vipBeginTime?: string;
  vipCode?: number;
  vipEndTime?: string;
}
//#endregion
