'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { CsvImport } from '@/components/buyers/csv-import';

interface ImportResult {
  success: number;
  errors: Array<{ row: number; message: string }>;
  buyers: unknown[];
}

export default function ImportPage() {
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const router = useRouter();

  const handleImportComplete = (result: ImportResult) => {
    setImportResult(result);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Import Leads</h1>
            <p className="mt-1 text-sm text-gray-600">
              Upload a CSV file to import multiple buyer leads at once.
            </p>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <CsvImport onImportComplete={handleImportComplete} />
            </div>
          </div>

          {importResult && importResult.success > 0 && (
            <div className="mt-6">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Import Successful
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Successfully imported {importResult.success} leads.
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => router.push('/buyers')}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      View All Leads
                    </button>
                    <button
                      onClick={() => {
                        setImportResult(null);
                        window.location.reload();
                      }}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Import More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">CSV Format Requirements</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p className="mb-2">Your CSV file should include these columns:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>fullName</strong> (required) - 2-80 characters</li>
                    <li><strong>phone</strong> (required) - 10-15 digits</li>
                    <li><strong>city</strong> (required) - Chandigarh, Mohali, Zirakpur, Panchkula, or Other</li>
                    <li><strong>propertyType</strong> (required) - Apartment, Villa, Plot, Office, or Retail</li>
                    <li><strong>bhk</strong> (required for Apartment/Villa) - 1, 2, 3, 4, or Studio</li>
                    <li><strong>purpose</strong> (required) - Buy or Rent</li>
                    <li><strong>timeline</strong> (required) - 0-3m, 3-6m, &gt;6m, or Exploring</li>
                    <li><strong>source</strong> (required) - Website, Referral, Walk-in, Call, or Other</li>
                    <li><strong>email</strong> (optional) - valid email format</li>
                    <li><strong>budgetMin</strong> (optional) - positive integer</li>
                    <li><strong>budgetMax</strong> (optional) - positive integer, must be ≥ budgetMin</li>
                    <li><strong>notes</strong> (optional) - max 1000 characters</li>
                    <li><strong>tags</strong> (optional) - comma-separated values</li>
                    <li><strong>status</strong> (optional) - defaults to New</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}