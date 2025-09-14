'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createBuyerSchema, type CreateBuyerInput } from '@/lib/validations/buyer';
import { cityEnum, propertyTypeEnum, bhkEnum, purposeEnum, timelineEnum, sourceEnum } from '@/lib/validations/buyer';

interface BuyerFormProps {
  initialData?: Partial<CreateBuyerInput> & { id?: string; updatedAt?: Date };
  onSubmit: (data: CreateBuyerInput) => Promise<void>;
  loading?: boolean;
}

export function BuyerForm({ initialData, onSubmit, loading = false }: BuyerFormProps) {
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createBuyerSchema),
    defaultValues: {
      ...initialData,
      tags: initialData?.tags || [],
    },
  });

  const propertyType = watch('propertyType');

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      setValue('tags', newTags);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    setValue('tags', newTags);
  };

  const handleFormSubmit = async (data: CreateBuyerInput) => {
    await onSubmit({ ...data, tags });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
            Full Name *
          </label>
          <input
            {...register('fullName')}
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter full name"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            {...register('email')}
            type="email"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter email address"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone *
          </label>
          <input
            {...register('phone')}
            type="tel"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter phone number"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            City *
          </label>
          <select
            {...register('city')}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select city</option>
            {cityEnum.options.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          {errors.city && (
            <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700">
            Property Type *
          </label>
          <select
            {...register('propertyType')}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select property type</option>
            {propertyTypeEnum.options.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.propertyType && (
            <p className="mt-1 text-sm text-red-600">{errors.propertyType.message}</p>
          )}
        </div>

        {propertyType && ['Apartment', 'Villa'].includes(propertyType) && (
          <div>
            <label htmlFor="bhk" className="block text-sm font-medium text-gray-700">
              BHK *
            </label>
            <select
              {...register('bhk')}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select BHK</option>
              {bhkEnum.options.map((bhk) => (
                <option key={bhk} value={bhk}>
                  {bhk}
                </option>
              ))}
            </select>
            {errors.bhk && (
              <p className="mt-1 text-sm text-red-600">{errors.bhk.message}</p>
            )}
          </div>
        )}

        <div>
          <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">
            Purpose *
          </label>
          <select
            {...register('purpose')}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select purpose</option>
            {purposeEnum.options.map((purpose) => (
              <option key={purpose} value={purpose}>
                {purpose}
              </option>
            ))}
          </select>
          {errors.purpose && (
            <p className="mt-1 text-sm text-red-600">{errors.purpose.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="timeline" className="block text-sm font-medium text-gray-700">
            Timeline *
          </label>
          <select
            {...register('timeline')}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select timeline</option>
            {timelineEnum.options.map((timeline) => (
              <option key={timeline} value={timeline}>
                {timeline}
              </option>
            ))}
          </select>
          {errors.timeline && (
            <p className="mt-1 text-sm text-red-600">{errors.timeline.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="source" className="block text-sm font-medium text-gray-700">
            Source *
          </label>
          <select
            {...register('source')}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select source</option>
            {sourceEnum.options.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
          {errors.source && (
            <p className="mt-1 text-sm text-red-600">{errors.source.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="budgetMin" className="block text-sm font-medium text-gray-700">
            Budget Min (INR)
          </label>
          <input
            {...register('budgetMin', { valueAsNumber: true })}
            type="number"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter minimum budget"
          />
          {errors.budgetMin && (
            <p className="mt-1 text-sm text-red-600">{errors.budgetMin.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="budgetMax" className="block text-sm font-medium text-gray-700">
            Budget Max (INR)
          </label>
          <input
            {...register('budgetMax', { valueAsNumber: true })}
            type="number"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter maximum budget"
          />
          {errors.budgetMax && (
            <p className="mt-1 text-sm text-red-600">{errors.budgetMax.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes
        </label>
        <textarea
          {...register('notes')}
          rows={3}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Enter any additional notes"
        />
        {errors.notes && (
          <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tags
        </label>
        <div className="mt-1 flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            className="flex-1 border-gray-300 rounded-l-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Add a tag"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 hover:bg-gray-100"
          >
            Add
          </button>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Saving...' : initialData?.id ? 'Update Lead' : 'Create Lead'}
        </button>
      </div>
    </form>
  );
}