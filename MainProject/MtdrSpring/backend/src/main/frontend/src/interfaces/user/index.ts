export interface User {
  userId: number;
  name: string;
  email: string;
  role: string;
  workModality: string;
  telegramId?: string;
  phoneNumber?: string;
  creationDate: string;
  deletedAt?: string;
  teamId?: number;
}

export type SetUser = React.Dispatch<React.SetStateAction<User | null>>;

export interface UserCreate extends Omit<User, 'userId' | 'creationDate' | 'deletedAt'> {
  password: string;
}

export interface UserUpdate extends Partial<UserCreate> {
  userId: number;
}

export interface UsersResponse {
  users: User[];
} 