import { BuyerList } from '@/components/buyers/buyer-list';
import { Header } from '@/components/layout/header';
import { getUserFromToken } from '@/lib/auth';
import { BuyerService } from '@/lib/services/buyer';
import { buyerFiltersSchema } from '@/lib/validations/buyer';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

interface BuyersPageProps {
  searchParams: Promise<{
    search?: string;
    city?: string;
    propertyType?: string;
    status?: string;
    timeline?: string;
    page?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

export default async function BuyersPage({ searchParams }: BuyersPageProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;
  
  if (!token) {
    redirect('/');
  }

  const user = await getUserFromToken(token);
  if (!user) {
    redirect('/');
  }

  const searchParamsData = await searchParams;
  const filters = {
    search: searchParamsData.search || '',
    city: searchParamsData.city || '',
    propertyType: searchParamsData.propertyType || '',
    status: searchParamsData.status || '',
    timeline: searchParamsData.timeline || '',
    page: parseInt(searchParamsData.page || '1'),
    limit: 10,
    sortBy: searchParamsData.sortBy || 'updatedAt',
    sortOrder: searchParamsData.sortOrder || 'desc',
  };

  const validatedFilters = buyerFiltersSchema.parse(filters);
  const { buyers, total } = await BuyerService.findMany(validatedFilters);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Buyer Leads</h1>
            <Link
              href="/buyers/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add New Lead
            </Link>
          </div>
          
          <BuyerList
            initialBuyers={buyers}
            initialTotal={total}
            initialFilters={filters}
          />
        </div>
      </main>
    </div>
  );
}