// 通用响应接口
export interface ApiResponse<T = any> {
  success: boolean; // true为成功，false为失败
  msg?: string; // 提示消息
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
  milkAmount: number | string;
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
  /**
   * 辅食列表
   */
  solidFoods?: string[];
  /**
   * 备注
   */
  note: string;
}

export interface EatListRequest {
  current?: number;
  pageSize?: number;
}

export interface EatItemRequest {
  _id: string;
}

export interface IRemoveEatItemById {
  _id: string;
}

export interface BabyRequest {
  name: string;
  gender: string;
  birthDate: string;
  prematureDays?: number;
}

export interface BabyResponse extends ApiResponse<{
  _id: string;
  name: string;
  gender: 'male' | 'female';
  birthDate: string;
  prematureDays: number;
  createdAt: string;
  updatedAt: string;
}> {}
