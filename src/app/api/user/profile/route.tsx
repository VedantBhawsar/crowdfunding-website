import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { z } from 'zod';
import { authOptions } from '@/config/auth';
import prismaClient from '@/lib/prismadb';

const profileUpdateSchema = z.object({
  displayName: z.string().min(2).optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  image: z.string().optional(),
});

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = profileUpdateSchema.parse(body);

    const updatedUser = await prismaClient.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        displayName: validatedData.displayName,
        bio: validatedData.bio,
        location: validatedData.location,
        image: validatedData.image,
      },
    });

    return NextResponse.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      image: updatedUser.image,
      displayName: updatedUser.displayName,
      bio: updatedUser.bio,
      location: updatedUser.location,
      role: updatedUser.role,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }

    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
