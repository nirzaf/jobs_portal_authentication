import bcrypt from 'bcryptjs';
import clientPromise from './mongodb';
import { User, UserRegistration } from '@/types/user';
import { ObjectId } from 'mongodb';

export class UserService {
  private static async getCollection() {
    const client = await clientPromise;
    const db = client.db('auth'); // Using the 'auth' database as specified
    return db.collection<User>('users'); // Using the 'users' collection as specified
  }

  static async createUser(userData: UserRegistration): Promise<User> {
    const collection = await this.getCollection();

    // Check if user already exists
    const existingUser = await collection.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    // Create user object
    const newUser: Omit<User, '_id'> = {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: userData.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert user
    const result = await collection.insertOne(newUser);

    // Return user without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = newUser;
    return {
      ...userWithoutPassword,
      _id: result.insertedId.toString(),
    };
  }

  static async findUserByEmail(email: string): Promise<User | null> {
    const collection = await this.getCollection();
    const user = await collection.findOne({ email });

    if (user) {
      return {
        ...user,
        _id: user._id?.toString(),
      };
    }

    return null;
  }

  static async findUserById(id: string): Promise<User | null> {
    const collection = await this.getCollection();
    let user;

    try {
      // Try to find by ObjectId first
      user = await collection.findOne({ _id: new ObjectId(id) });
    } catch {
      // If ObjectId fails, try to find by string id
      user = await collection.findOne({ _id: id });
    }

    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;
      return {
        ...userWithoutPassword,
        _id: user._id?.toString(),
      };
    }

    return null;
  }

  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
