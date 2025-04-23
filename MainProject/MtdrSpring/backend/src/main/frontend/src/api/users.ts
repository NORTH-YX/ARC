import { apiClient } from "./client";
import { User, UserCreate, UserUpdate, UsersResponse } from "../interfaces/user/index";

export const getUsers = {
  all: async (): Promise<User[]> => {
    return apiClient.get("/users");
  },
  byId: async (userId: number): Promise<User> => {
    return apiClient.get(`/users/${userId}`);
  },
  byTeam: async (teamId: number): Promise<UsersResponse> => {
    return apiClient.get(`/users/team/${teamId}`);
  },
};

export const createUser = async (userData: UserCreate): Promise<User> => {
  return apiClient.post("/users", userData);
};

export const updateUser = async (userId: number, userData: UserUpdate): Promise<User> => {
  return apiClient.put(`/users/${userId}`, userData);
};

export const deleteUser = async (userId: number): Promise<void> => {
  return apiClient.delete(`/users/${userId}`);
};

export const restoreUser = async (userId: number): Promise<void> => {
  return apiClient.post(`/users/${userId}/restore`, {});
}; 