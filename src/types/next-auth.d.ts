import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      role: 'job_seeker' | 'employer';
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string;
    role: 'job_seeker' | 'employer';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'job_seeker' | 'employer';
  }
}
