export interface User {
  userID: number;
  userName: string;
  role: string;
  isActive: boolean;
  personID: number;
}

export interface UserCreate {
  personID: number;
  userName: string;
  password: string;
  role: string;
  isActive: boolean;
}

export interface UserUpdate {
  userID: number;
  userName: string;
  role: string;
  isActive: boolean;
  personID: number;
  password?: string;
}
