// 通用响应接口
export interface ApiResponse<T = any> {
  code: number; // 1为成功，0为失败
  msg: string; // 提示消息
  time: string;
  data: T;
}
export interface LoginResponse extends ApiResponse {}
export interface LoginRequest {
  username: string;
  password: string;
}
export interface EatResponse extends ApiResponse {}
export interface EatRequest {
  /**
   * 奶量单位ml
   */
  milkAmount: number;
  /**
   * 吃奶时间
   */
  milkTime: string;
  /**
   * 小便
   */
  pee: boolean;
  /**
   * 大便
   */
  poo: boolean;
  /**
   * 母乳
   */
  breastMilk: boolean;
  /**
   * 是否喝水
   */
  drinkWater: boolean;
}

export interface EatListRequest {
  current?: number;
  pageSize?: number;
}
