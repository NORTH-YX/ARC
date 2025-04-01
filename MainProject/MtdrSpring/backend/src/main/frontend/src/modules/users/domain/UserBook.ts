import { User, UserCreate, UserUpdate } from '../../../interfaces/user';
import { createUser, updateUser, deleteUser, restoreUser } from '../../../api/users';

export default class UserBook {
  private users: User[];
  public injectable: any[];

  constructor(users: User[]) {
    this.users = users;
    
    // Define which methods should be injectable into the store
    this.injectable = [
      this.createUser,
      this.updateUser,
      this.deleteUser,
      this.restoreUser,
      this.getUserById,
      this.getUserByEmail,
      this.getUsersByTeam
    ];
    
    // Bind methods to maintain correct 'this' context
    this.createUser = this.createUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.restoreUser = this.restoreUser.bind(this);
    this.getUserById = this.getUserById.bind(this);
    this.getUserByEmail = this.getUserByEmail.bind(this);
    this.getUsersByTeam = this.getUsersByTeam.bind(this);
  }

  getUsers(): User[] {
    return this.users;
  }

  getUserById(userId: number): User | undefined {
    return this.users.find(user => user.userId === userId);
  }

  getUserByEmail(email: string): User | undefined {
    return this.users.find(user => user.email === email);
  }

  getUsersByTeam(teamId: number): User[] {
    return this.users.filter(user => user.teamId === teamId);
  }

  async createUser(userData: UserCreate): Promise<User> {
    const response = await createUser(userData);
    this.users.push(response);
    return response;
  }

  async updateUser(userId: number, userData: UserUpdate): Promise<User | undefined> {
    const userIndex = this.users.findIndex(user => user.userId === userId);
    if (userIndex === -1) return undefined;

    const response = await updateUser(userId, userData);
    this.users[userIndex] = response;
    return response;
  }

  async deleteUser(userId: number): Promise<boolean> {
    const userIndex = this.users.findIndex(user => user.userId === userId);
    if (userIndex === -1) return false;

    await deleteUser(userId);
    this.users[userIndex] = {
      ...this.users[userIndex],
      deletedAt: new Date().toISOString(),
    };
    return true;
  }

  async restoreUser(userId: number): Promise<boolean> {
    const userIndex = this.users.findIndex(user => user.userId === userId);
    if (userIndex === -1) return false;

    await restoreUser(userId);
    this.users[userIndex] = {
      ...this.users[userIndex],
      deletedAt: undefined,
    };
    return true;
  }
} 