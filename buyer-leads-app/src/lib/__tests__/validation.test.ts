import { createBuyerSchema, csvImportRowSchema } from '@/lib/validations/buyer';

describe('Buyer Validation', () => {
  describe('createBuyerSchema', () => {
    it('should validate a valid buyer', () => {
      const validBuyer = {
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        city: 'Chandigarh',
        propertyType: 'Apartment',
        bhk: '2',
        purpose: 'Buy',
        budgetMin: 5000000,
        budgetMax: 8000000,
        timeline: '3-6m',
        source: 'Website',
        notes: 'Interested in 2BHK apartment',
        tags: ['urgent', 'premium'],
      };

      const result = createBuyerSchema.safeParse(validBuyer);
      expect(result.success).toBe(true);
    });

    it('should require bhk for Apartment and Villa', () => {
      const buyerWithoutBhk = {
        fullName: 'John Doe',
        phone: '1234567890',
        city: 'Chandigarh',
        propertyType: 'Apartment',
        purpose: 'Buy',
        timeline: '3-6m',
        source: 'Website',
      };

      const result = createBuyerSchema.safeParse(buyerWithoutBhk);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['bhk']);
      }
    });

    it('should not require bhk for non-residential properties', () => {
      const buyerWithoutBhk = {
        fullName: 'John Doe',
        phone: '1234567890',
        city: 'Chandigarh',
        propertyType: 'Office',
        purpose: 'Buy',
        timeline: '3-6m',
        source: 'Website',
      };

      const result = createBuyerSchema.safeParse(buyerWithoutBhk);
      expect(result.success).toBe(true);
    });

    it('should validate budget constraints', () => {
      const buyerWithInvalidBudget = {
        fullName: 'John Doe',
        phone: '1234567890',
        city: 'Chandigarh',
        propertyType: 'Apartment',
        bhk: '2',
        purpose: 'Buy',
        budgetMin: 8000000,
        budgetMax: 5000000, // Less than min
        timeline: '3-6m',
        source: 'Website',
      };

      const result = createBuyerSchema.safeParse(buyerWithInvalidBudget);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['budgetMax']);
      }
    });

    it('should validate phone number format', () => {
      const buyerWithInvalidPhone = {
        fullName: 'John Doe',
        phone: '123-456-7890', // Invalid format
        city: 'Chandigarh',
        propertyType: 'Apartment',
        bhk: '2',
        purpose: 'Buy',
        timeline: '3-6m',
        source: 'Website',
      };

      const result = createBuyerSchema.safeParse(buyerWithInvalidPhone);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['phone']);
      }
    });
  });

  describe('csvImportRowSchema', () => {
    it('should validate a valid CSV row', () => {
      const validRow = {
        fullName: 'Jane Smith',
        email: 'jane@example.com',
        phone: '9876543210',
        city: 'Mohali',
        propertyType: 'Villa',
        bhk: '3',
        purpose: 'Rent',
        budgetMin: '30000',
        budgetMax: '50000',
        timeline: '0-3m',
        source: 'Referral',
        notes: 'Looking for furnished villa',
        tags: 'furnished,premium',
        status: 'New',
      };

      const result = csvImportRowSchema.safeParse(validRow);
      expect(result.success).toBe(true);
    });

    it('should handle empty optional fields', () => {
      const minimalRow = {
        fullName: 'Bob Wilson',
        phone: '5555555555',
        city: 'Zirakpur',
        propertyType: 'Plot',
        purpose: 'Buy',
        timeline: '>6m',
        source: 'Walk-in',
      };

      const result = csvImportRowSchema.safeParse(minimalRow);
      expect(result.success).toBe(true);
    });

    it('should transform string numbers to integers', () => {
      const rowWithStringNumbers = {
        fullName: 'Alice Brown',
        phone: '1111111111',
        city: 'Panchkula',
        propertyType: 'Apartment',
        bhk: '1',
        purpose: 'Buy',
        budgetMin: '2000000',
        budgetMax: '4000000',
        timeline: '3-6m',
        source: 'Call',
      };

      const result = csvImportRowSchema.safeParse(rowWithStringNumbers);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(typeof result.data.budgetMin).toBe('number');
        expect(typeof result.data.budgetMax).toBe('number');
        expect(result.data.budgetMin).toBe(2000000);
        expect(result.data.budgetMax).toBe(4000000);
      }
    });
  });
});