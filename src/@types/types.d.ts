export interface IUser {
  id: string;
  fullName: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  role: string;
  secretQuestion: string;
  secretAnswer: string;
  stocks?: [];
}

export interface IUserUpdate {
  fullName?: string;
  email?: string;
  password?: string;
  updatedAt?: Date;
}

export interface IUserCreation {
  email: string;
  password: string;
  fullName: string;
  secretQuestion: string;
  secretAnswer: string;
}

export interface IStock {
  id: string;
  stockName: string;
  stockOwner: string;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
}

export interface IStockUpdate {
  id: string;
  stockName?: string;
  active?: boolean;
}

export interface IStockCreate {
  stockName: string;
}

export interface IJwtSchema {
  sub: string;
  iat: number;
  exp: number;
}
