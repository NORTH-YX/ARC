import { User } from '../interfaces/user';
import { apiClient } from './client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  jwt: string;
  user: User;
}

// // Dummy data for testing
// // const DUMMY_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkR1bW15IFVzZXIiLCJpYXQiOjE1MTYyMzkwMjJ9';
// // const DUMMY_USER: User = {
// //   id:  '1',
// //   name: 'Dummy User',
// //   email: 'dummy@example.com',
// //   role: 'admin'
// // };

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    console.log('Login credentials:', credentials);
    return apiClient.post('/auth/login', credentials);
  }
}; 

// Dummy data for testing
// const DUMMY_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkR1bW15IFVzZXIiLCJpYXQiOjE1MTYyMzkwMjJ9';
// const DUMMY_USER: User = {
//   userId: 1,
//   name: 'Dummy User',
//   email: 'dummy@example.com',
//   role: 'admin',
//   workModality: 'remote',
//   creationDate: new Date().toISOString()
// };

// export const authApi = {
//   login: async (_credentials: LoginCredentials): Promise<LoginResponse> => {
   
//     return Promise.resolve({
//       jwt: DUMMY_TOKEN,
//       user: DUMMY_USER
//     });
//   }
// };