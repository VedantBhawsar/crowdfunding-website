import prismaClient from '@/lib/prismadb';
import { NextResponse } from 'next/server';

// Mark this route as dynamic to prevent static generation
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = await prismaClient.campaign.findMany({
      where: {},
      select: {
        category: true,
      },
    });

    let categoriesMap = new Map();
    for (let i = 0; i < categories.length; i++) {
      categoriesMap.set(categories[i].category, categories[i].category);
    }

    let categoriesArray = Array.from(categoriesMap.values());
    console.log(categoriesMap);
    return NextResponse.json(categoriesArray, {
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return new Response(`Failed to fetch categories. ${error}`, { status: 500 });
  }
}
