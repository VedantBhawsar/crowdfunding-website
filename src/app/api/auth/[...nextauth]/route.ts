import NextAuth, { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import prismaClient from '@/lib/prismadb';
import { authOptions } from '@/config/auth';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
