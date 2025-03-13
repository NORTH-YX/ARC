import { User } from '../interfaces/user';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// Dummy data for testing
const DUMMY_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkR1bW15IFVzZXIiLCJpYXQiOjE1MTYyMzkwMjJ9';
const DUMMY_USER: User = {
  id: '1',
  name: 'Dummy User',
  email: 'dummy@example.com',
  role: 'admin'
};

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      token: DUMMY_TOKEN,
      user: DUMMY_USER
    };
  },

  getCurrentUser: async (): Promise<User> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return DUMMY_USER;
  }
}; 