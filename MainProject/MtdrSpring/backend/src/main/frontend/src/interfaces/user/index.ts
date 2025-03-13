export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  workModality: string;
  telegramId: string;
  phoneNumber: string;
  teamId: string;
}

export type SetUser = React.Dispatch<React.SetStateAction<User | null>>;
