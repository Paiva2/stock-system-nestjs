export interface IUser {
  id: string;
  fullName: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  role: string;
}

export interface IUserCreation {
  email: string;
  password: string;
  fullName: string;
}
