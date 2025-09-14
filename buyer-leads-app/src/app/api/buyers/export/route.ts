import { NextRequest, NextResponse } from 'next/server';
import { BuyerService } from '@/lib/services/buyer';
import { buyerFiltersSchema } from '@/lib/validations/buyer';
import { getUserFromToken } from '@/lib/auth';
import { stringify } from 'csv-stringify';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filters = {
      search: searchParams.get('search') || undefined,
      city: searchParams.get('city') || undefined,
      propertyType: searchParams.get('propertyType') || undefined,
      status: searchParams.get('status') || undefined,
      timeline: searchParams.get('timeline') || undefined,
      page: 1,
      limit: 10000, // Large limit for export
      sortBy: searchParams.get('sortBy') || 'updatedAt',
      sortOrder: searchParams.get('sortOrder') || 'desc',
    };

    const validatedFilters = buyerFiltersSchema.parse(filters);
    const { buyers } = await BuyerService.findMany(validatedFilters);

    // Convert to CSV format
    const csvData = buyers.map(buyer => ({
      fullName: buyer.fullName,
      email: buyer.email || '',
      phone: buyer.phone,
      city: buyer.city,
      propertyType: buyer.propertyType,
      bhk: buyer.bhk || '',
      purpose: buyer.purpose,
      budgetMin: buyer.budgetMin || '',
      budgetMax: buyer.budgetMax || '',
      timeline: buyer.timeline,
      source: buyer.source,
      notes: buyer.notes || '',
      tags: buyer.tags ? JSON.parse(buyer.tags).join(',') : '',
      status: buyer.status,
    }));

    const csv = await new Promise<string>((resolve, reject) => {
      stringify(csvData, {
        header: true,
        columns: [
          'fullName', 'email', 'phone', 'city', 'propertyType', 'bhk',
          'purpose', 'budgetMin', 'budgetMax', 'timeline', 'source',
          'notes', 'tags', 'status'
        ]
      }, (err, output) => {
        if (err) reject(err);
        else resolve(output);
      });
    });

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="buyers.csv"',
      },
    });
  } catch (error) {
    console.error('CSV export error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}