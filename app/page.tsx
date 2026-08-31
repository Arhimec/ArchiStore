import { prisma } from '@/lib/prisma';
import HomeClient from '@/components/HomeClient';

export const revalidate = 0;

export default async function HomePage() {
  let featuredPlans: any[] = [];
  try {
    featuredPlans = await prisma.plan.findMany({
      where: { isPublished: true, featured: true },
      take: 3,
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });
  } catch (err) {
    console.error('Database query error on HomePage:', err);
  }

  return <HomeClient featuredPlans={featuredPlans} />;
}
