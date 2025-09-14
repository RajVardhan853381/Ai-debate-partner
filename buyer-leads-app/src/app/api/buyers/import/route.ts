import { NextRequest, NextResponse } from 'next/server';
import { BuyerService } from '@/lib/services/buyer';
import { csvImportRowSchema } from '@/lib/validations/buyer';
import { getUserFromToken } from '@/lib/auth';
import parse from 'csv-parser';
import { Readable } from 'stream';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const text = await file.text();
    const rows: Record<string, string>[] = [];
    
    await new Promise((resolve, reject) => {
      const stream = Readable.from([text]);
      stream
        .pipe(parse({ headers: true }))
        .on('data', (row: Record<string, string>) => {
          if (rows.length >= 200) {
            reject(new Error('Maximum 200 rows allowed'));
            return;
          }
          rows.push(row);
        })
        .on('end', resolve)
        .on('error', reject);
    });

    const results = {
      success: 0,
      errors: [] as Array<{ row: number; message: string }>,
      buyers: [] as unknown[],
    };

    // Validate and process each row
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 2; // +2 because CSV is 1-indexed and we skip header

      try {
        // Parse tags if present
        if (row.tags) {
          const tagsArray = row.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean);
          row.tags = JSON.stringify(tagsArray);
        } else {
          row.tags = JSON.stringify([]);
        }

        const validatedRow = csvImportRowSchema.parse(row);
        const buyer = await BuyerService.create(validatedRow, user.id);
        results.buyers.push(buyer as unknown);
        results.success++;
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown validation error';
        results.errors.push({ row: rowNum, message });
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('CSV import error:', error);
    
    if (error instanceof Error && error.message.includes('Maximum 200 rows')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}