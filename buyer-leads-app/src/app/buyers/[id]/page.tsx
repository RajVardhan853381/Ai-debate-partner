'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { BuyerForm } from '@/components/buyers/buyer-form';
import { type Buyer, type BuyerHistory } from '@/lib/db';
import { type CreateBuyerInput } from '@/lib/validations/buyer';
import { formatDate, formatCurrency } from '@/lib/utils';

interface BuyerDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function BuyerDetailPage({ params }: BuyerDetailPageProps) {
  const [buyer, setBuyer] = useState<Buyer | null>(null);
  const [history, setHistory] = useState<BuyerHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadBuyer = async () => {
      const { id } = await params;
      await fetchBuyer(id);
    };
    loadBuyer();
  }, [params]);

  const fetchBuyer = async (id: string) => {
    try {
      const response = await fetch(`/api/buyers/${id}`);
      if (response.ok) {
        const data = await response.json();
        setBuyer(data.buyer);
        setHistory(data.history);
      } else if (response.status === 404) {
        setError('Buyer not found');
      } else {
        setError('Failed to load buyer details');
      }
    } catch (error) {
      setError('Failed to load buyer details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data: CreateBuyerInput) => {
    if (!buyer) return;

    setSaving(true);
    setError('');

    try {
      const { id } = await params;
      const response = await fetch(`/api/buyers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          id: buyer.id,
          updatedAt: buyer.updatedAt,
        }),
      });

      if (response.ok) {
        const updatedBuyer = await response.json();
        setBuyer(updatedBuyer);
        setEditing(false);
        const { id } = await params;
        await fetchBuyer(id); // Refresh history
      } else if (response.status === 409) {
        const errorData = await response.json();
        setError(errorData.error);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update lead');
      }
    } catch (error) {
      setError('Failed to update lead. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!buyer || !confirm('Are you sure you want to delete this lead?')) return;

    setSaving(true);
    try {
      const { id } = await params;
      const response = await fetch(`/api/buyers/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/buyers');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to delete lead');
      }
    } catch (error) {
      setError('Failed to delete lead. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!buyer) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Buyer Not Found</h1>
              <p className="mt-2 text-gray-600">{error}</p>
              <button
                onClick={() => router.push('/buyers')}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Back to Leads
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const tags = buyer.tags ? JSON.parse(buyer.tags) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{buyer.fullName}</h1>
              <p className="text-sm text-gray-600">Lead Details</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setEditing(!editing)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {editing ? 'Cancel' : 'Edit'}
              </button>
              <button
                onClick={handleDelete}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {saving ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {editing ? (
                <div className="bg-white shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <BuyerForm
                      initialData={{
                        fullName: buyer.fullName,
                        email: buyer.email || undefined,
                        phone: buyer.phone,
                        city: buyer.city,
                        propertyType: buyer.propertyType,
                        bhk: buyer.bhk || undefined,
                        purpose: buyer.purpose,
                        budgetMin: buyer.budgetMin || undefined,
                        budgetMax: buyer.budgetMax || undefined,
                        timeline: buyer.timeline,
                        source: buyer.source,
                        notes: buyer.notes || undefined,
                        tags: buyer.tags ? JSON.parse(buyer.tags) : [],
                        id: buyer.id,
                        updatedAt: buyer.updatedAt || new Date(),
                      }}
                      onSubmit={handleUpdate}
                      loading={saving}
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-white shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                        <dd className="mt-1 text-sm text-gray-900">{buyer.fullName}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Email</dt>
                        <dd className="mt-1 text-sm text-gray-900">{buyer.email || '-'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Phone</dt>
                        <dd className="mt-1 text-sm text-gray-900">{buyer.phone}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">City</dt>
                        <dd className="mt-1 text-sm text-gray-900">{buyer.city}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Property Type</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {buyer.propertyType}
                          {buyer.bhk && ` (${buyer.bhk} BHK)`}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Purpose</dt>
                        <dd className="mt-1 text-sm text-gray-900">{buyer.purpose}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Budget</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {buyer.budgetMin && buyer.budgetMax
                            ? `${formatCurrency(buyer.budgetMin)} - ${formatCurrency(buyer.budgetMax)}`
                            : buyer.budgetMin
                            ? `Min: ${formatCurrency(buyer.budgetMin)}`
                            : buyer.budgetMax
                            ? `Max: ${formatCurrency(buyer.budgetMax)}`
                            : '-'}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Timeline</dt>
                        <dd className="mt-1 text-sm text-gray-900">{buyer.timeline}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Source</dt>
                        <dd className="mt-1 text-sm text-gray-900">{buyer.source}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Status</dt>
                        <dd className="mt-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            buyer.status === 'New' ? 'bg-blue-100 text-blue-800' :
                            buyer.status === 'Qualified' ? 'bg-green-100 text-green-800' :
                            buyer.status === 'Converted' ? 'bg-purple-100 text-purple-800' :
                            buyer.status === 'Dropped' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {buyer.status}
                          </span>
                        </dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Notes</dt>
                        <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                          {buyer.notes || '-'}
                        </dd>
                      </div>
                      {tags.length > 0 && (
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">Tags</dt>
                          <dd className="mt-1 flex flex-wrap gap-2">
                            {tags.map((tag: string) => (
                              <span
                                key={tag}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                              >
                                {tag}
                              </span>
                            ))}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Changes</h3>
                  {history.length === 0 ? (
                    <p className="text-sm text-gray-500">No changes recorded</p>
                  ) : (
                    <div className="space-y-4">
                      {history.map((change) => {
                        const diff = JSON.parse(change.diff as string);
                        return (
                          <div key={change.id} className="border-l-4 border-gray-200 pl-4">
                            <div className="text-sm text-gray-900">
                              {diff.action === 'created' ? 'Lead created' : 'Lead updated'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatDate(change.changedAt || new Date())}
                            </div>
                            {diff.changes && Object.keys(diff.changes).length > 0 && (
                              <div className="mt-2 text-xs text-gray-600">
                        {Object.entries(diff.changes).map(([field, changeData]: [string, unknown]) => {
                          const change = changeData as { from: string; to: string };
                          return (
                            <div key={field} className="mt-1">
                              <span className="font-medium">{field}:</span>{' '}
                              <span className="text-red-600">{change.from}</span> →{' '}
                              <span className="text-green-600">{change.to}</span>
                            </div>
                          );
                        })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}