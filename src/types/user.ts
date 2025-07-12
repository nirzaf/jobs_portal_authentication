export interface User {
  _id?: string;
  id?: string;
  name?: string;
  email: string;
  password?: string;
  role: 'job_seeker' | 'employer';
  emailVerified?: Date | null;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserRegistration {
  name: string;
  email: string;
  password: string;
  role: 'job_seeker' | 'employer';
}

export interface UserLogin {
  email: string;
  password: string;
}
