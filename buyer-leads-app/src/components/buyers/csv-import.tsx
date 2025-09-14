'use client';

import { useState } from 'react';

interface ImportResult {
  success: number;
  errors: Array<{ row: number; message: string }>;
  buyers: unknown[];
}

interface CsvImportProps {
  onImportComplete: (result: ImportResult) => void;
}

export function CsvImport({ onImportComplete }: CsvImportProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/buyers/import', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setResult(data);
      onImportComplete(data);
    } catch (error) {
      console.error('Import failed:', error);
      setResult({
        success: 0,
        errors: [{ row: 0, message: 'Import failed. Please try again.' }],
        buyers: [],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Select CSV File
        </label>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
        <p className="mt-1 text-sm text-gray-500">
          Maximum 200 rows. Required columns: fullName, phone, city, propertyType, purpose, timeline, source
        </p>
      </div>

      {file && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
          </span>
          <button
            onClick={handleImport}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Importing...' : 'Import CSV'}
          </button>
        </div>
      )}

      {result && (
        <div className="mt-4">
          <div className={`p-4 rounded-md ${
            result.errors.length === 0 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {result.errors.length === 0 ? (
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.725-1.36 3.49 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <h3 className={`text-sm font-medium ${
                  result.errors.length === 0 ? 'text-green-800' : 'text-yellow-800'
                }`}>
                  Import Complete
                </h3>
                <div className={`mt-2 text-sm ${
                  result.errors.length === 0 ? 'text-green-700' : 'text-yellow-700'
                }`}>
                  <p>Successfully imported {result.success} leads.</p>
                  {result.errors.length > 0 && (
                    <p>{result.errors.length} rows had errors and were skipped.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {result.errors.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Import Errors:</h4>
              <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Row
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Error
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {result.errors.map((error, index) => (
                      <tr key={index}>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                          {error.row}
                        </td>
                        <td className="px-3 py-2 text-sm text-red-600">
                          {error.message}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}