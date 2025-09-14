import { z } from 'zod';

export const cityEnum = z.enum(['Chandigarh', 'Mohali', 'Zirakpur', 'Panchkula', 'Other']);
export const propertyTypeEnum = z.enum(['Apartment', 'Villa', 'Plot', 'Office', 'Retail']);
export const bhkEnum = z.enum(['1', '2', '3', '4', 'Studio']);
export const purposeEnum = z.enum(['Buy', 'Rent']);
export const timelineEnum = z.enum(['0-3m', '3-6m', '>6m', 'Exploring']);
export const sourceEnum = z.enum(['Website', 'Referral', 'Walk-in', 'Call', 'Other']);
export const statusEnum = z.enum(['New', 'Qualified', 'Contacted', 'Visited', 'Negotiation', 'Converted', 'Dropped']);

export const createBuyerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(80, 'Full name must be at most 80 characters'),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  phone: z.string()
    .min(10, 'Phone must be at least 10 digits')
    .max(15, 'Phone must be at most 15 digits')
    .regex(/^\d+$/, 'Phone must contain only digits'),
  city: cityEnum,
  propertyType: propertyTypeEnum,
  bhk: bhkEnum.optional(),
  purpose: purposeEnum,
  budgetMin: z.number().int().positive('Budget must be positive').optional(),
  budgetMax: z.number().int().positive('Budget must be positive').optional(),
  timeline: timelineEnum,
  source: sourceEnum,
  notes: z.string().max(1000, 'Notes must be at most 1000 characters').optional().or(z.literal('')),
  tags: z.array(z.string()).optional().default([]),
}).refine((data) => {
  // bhk is required for Apartment and Villa
  if (['Apartment', 'Villa'].includes(data.propertyType) && !data.bhk) {
    return false;
  }
  return true;
}, {
  message: 'BHK is required for Apartment and Villa property types',
  path: ['bhk'],
}).refine((data) => {
  // budgetMax must be >= budgetMin if both present
  if (data.budgetMin && data.budgetMax && data.budgetMax < data.budgetMin) {
    return false;
  }
  return true;
}, {
  message: 'Maximum budget must be greater than or equal to minimum budget',
  path: ['budgetMax'],
});

export const updateBuyerSchema = createBuyerSchema.partial().extend({
  id: z.string().uuid(),
  updatedAt: z.date(),
});

export const buyerFiltersSchema = z.object({
  search: z.string().optional(),
  city: cityEnum.optional(),
  propertyType: propertyTypeEnum.optional(),
  status: statusEnum.optional(),
  timeline: timelineEnum.optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  sortBy: z.enum(['updatedAt', 'fullName', 'createdAt']).default('updatedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const csvImportRowSchema = z.object({
  fullName: z.string().min(2).max(80),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().min(10).max(15).regex(/^\d+$/),
  city: cityEnum,
  propertyType: propertyTypeEnum,
  bhk: bhkEnum.optional().or(z.literal('')).transform((val) => val === '' ? undefined : val),
  purpose: purposeEnum,
  budgetMin: z.string().transform((val) => val ? parseInt(val, 10) : undefined).optional(),
  budgetMax: z.string().transform((val) => val ? parseInt(val, 10) : undefined).optional(),
  timeline: timelineEnum,
  source: sourceEnum,
  notes: z.string().max(1000).optional().or(z.literal('')),
  tags: z.string().optional().or(z.literal('')).transform((val) => {
    if (!val) return [];
    try {
      return JSON.parse(val);
    } catch {
      return val.split(',').map((tag: string) => tag.trim()).filter(Boolean);
    }
  }),
  status: statusEnum.optional().default('New'),
}).refine((data) => {
  if (['Apartment', 'Villa'].includes(data.propertyType) && !data.bhk) {
    return false;
  }
  return true;
}, {
  message: 'BHK is required for Apartment and Villa property types',
  path: ['bhk'],
}).refine((data) => {
  if (data.budgetMin && data.budgetMax && data.budgetMax < data.budgetMin) {
    return false;
  }
  return true;
}, {
  message: 'Maximum budget must be greater than or equal to minimum budget',
  path: ['budgetMax'],
});

export type CreateBuyerInput = z.infer<typeof createBuyerSchema>;
export type UpdateBuyerInput = z.infer<typeof updateBuyerSchema>;
export type BuyerFilters = z.infer<typeof buyerFiltersSchema>;
export type CsvImportRow = z.infer<typeof csvImportRowSchema>;