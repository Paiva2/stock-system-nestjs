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
  userAttatchments?: IUserAttatchments[];
}

export interface IUserAttatchments {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
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
  role?: string;
}

export interface IStock {
  id: string;
  stockName: string;
  stockOwner: string;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  totalItems?: number;
  totalItemsQuantity?: number;
  items?: IStockItem[];
}

export interface IStockUpdate {
  id: string;
  stockName?: string;
  active?: boolean;
}

export interface IStockCreate {
  stockName: string;
}

export interface ICategory {
  id: string;
  name: string;
  createdAt: Date;
  stockItem?: [];
}

export interface ICategoryCreation {
  name: string;
}

export interface IITem {
  id?: string;
  userAttatchmentsId?: string;
  itemName: string;
  description?: string;
  categoryId: string;
  createdAt?: Date;
  updatedAt?: Date;
  categoryName?: string;
}

export interface IStockItem {
  id: string;
  itemName: string;
  quantity: number;
  stockId: string;
  description?: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
  categoryName?: string;
}

export interface IStockItemCreate {
  itemName: string;
  quantity: number;
  stockId?: string;
  description?: string;
  categoryId: string;
}

export interface IStockItemUpdate {
  id: string;
  itemName?: string;
  quantity?: number;
  description?: string;
  categoryId?: string;
}

export interface IJwtSchema {
  sub: string;
  iat: number;
  exp: number;
}
