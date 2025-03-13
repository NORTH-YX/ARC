export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export type SetUser = React.Dispatch<React.SetStateAction<User | null>>;
