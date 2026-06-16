//#region Types
export interface LoginRequest {
  username?: string;
  password?: string;
  captcha?: string;
  captchaKey?: string;
}

export interface UserDto {
  userId?: number;
  username?: string;
  nickName?: string;
  roles?: string[];
}
//#endregion