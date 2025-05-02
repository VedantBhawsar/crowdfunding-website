import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      onboarded?: boolean;
      role?: string;
      bio?: string;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role?: string;
    onboarded?: boolean;
    bio?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId: string;
    role?: string;
    onboarded?: boolean;
    bio?: string;
  }
}
