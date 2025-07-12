import bcrypt from 'bcryptjs';
import fs from 'fs/promises';
import path from 'path';
import { User, UserRegistration } from '@/types/user';

// Simple file-based storage for development/testing
const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

export class UserService {
  private static async ensureDataDir() {
    const dataDir = path.dirname(USERS_FILE);
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }
  }

  private static async loadUsers(): Promise<User[]> {
    try {
      await this.ensureDataDir();
      const data = await fs.readFile(USERS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  private static async saveUsers(users: User[]): Promise<void> {
    await this.ensureDataDir();
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
  }

  static async createUser(userData: UserRegistration): Promise<User> {
    const users = await this.loadUsers();

    // Check if user already exists
    const existingUser = users.find(user => user.email === userData.email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    // Create user object
    const newUser: User = {
      _id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: userData.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add user to array and save
    users.push(newUser);
    await this.saveUsers(users);

    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  static async findUserByEmail(email: string): Promise<User | null> {
    const users = await this.loadUsers();
    const user = users.find(user => user.email === email);
    return user || null;
  }

  static async findUserById(id: string): Promise<User | null> {
    const users = await this.loadUsers();
    const user = users.find(user => user._id === id);

    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }

    return null;
  }

  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
