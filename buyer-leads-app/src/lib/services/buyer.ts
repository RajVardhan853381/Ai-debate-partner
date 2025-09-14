import { db, buyers, buyerHistory, type Buyer, type NewBuyer, type BuyerHistory } from '@/lib/db';
import { eq, and, desc, asc, like, or, sql } from 'drizzle-orm';
import { type CreateBuyerInput, type UpdateBuyerInput, type BuyerFilters } from '@/lib/validations/buyer';

export class BuyerService {
  static async create(data: CreateBuyerInput, ownerId: string): Promise<Buyer> {
    const newBuyer: NewBuyer = {
      ...data,
      ownerId,
      tags: JSON.stringify(data.tags || []),
    };

    const [buyer] = await db.insert(buyers).values(newBuyer).returning();
    
    // Create history entry
    await this.createHistoryEntry(buyer.id, ownerId, 'created', {});
    
    return buyer;
  }

  static async update(id: string, data: UpdateBuyerInput, ownerId: string, currentUpdatedAt: Date): Promise<Buyer> {
    // Check if record was modified since last read
    const existing = await db.select().from(buyers).where(eq(buyers.id, id)).limit(1);
    if (existing.length === 0) {
      throw new Error('Buyer not found');
    }
    
    if (existing[0].updatedAt && existing[0].updatedAt.getTime() !== currentUpdatedAt.getTime()) {
      throw new Error('Record has been modified by another user. Please refresh and try again.');
    }

    // Check ownership
    if (existing[0].ownerId !== ownerId) {
      throw new Error('You can only edit your own leads');
    }

    const updateData = {
      ...data,
      tags: data.tags ? JSON.stringify(data.tags) : undefined,
      updatedAt: new Date(),
    };

    const [updated] = await db.update(buyers)
      .set(updateData)
      .where(and(eq(buyers.id, id), eq(buyers.ownerId, ownerId)))
      .returning();

    if (!updated) {
      throw new Error('Buyer not found or access denied');
    }

    // Create history entry for changes
    const changes = this.getChangedFields(existing[0], updated);
    if (Object.keys(changes).length > 0) {
      await this.createHistoryEntry(id, ownerId, 'updated', changes);
    }

    return updated;
  }

  static async delete(id: string, ownerId: string): Promise<void> {
    const deleted = await db.delete(buyers)
      .where(and(eq(buyers.id, id), eq(buyers.ownerId, ownerId)))
      .returning();

    if (deleted.length === 0) {
      throw new Error('Buyer not found or access denied');
    }
  }

  static async findById(id: string): Promise<Buyer | null> {
    const [buyer] = await db.select().from(buyers).where(eq(buyers.id, id)).limit(1);
    return buyer || null;
  }

  static async findMany(filters: BuyerFilters): Promise<{ buyers: Buyer[], total: number }> {
    const { search, city, propertyType, status, timeline, page, limit, sortBy, sortOrder } = filters;
    
    const whereConditions = [];
    
    if (search) {
      whereConditions.push(
        or(
          like(buyers.fullName, `%${search}%`),
          like(buyers.phone, `%${search}%`),
          like(buyers.email, `%${search}%`)
        )!
      );
    }
    
    if (city) {
      whereConditions.push(eq(buyers.city, city));
    }
    
    if (propertyType) {
      whereConditions.push(eq(buyers.propertyType, propertyType));
    }
    
    if (status) {
      whereConditions.push(eq(buyers.status, status));
    }
    
    if (timeline) {
      whereConditions.push(eq(buyers.timeline, timeline));
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;
    
    // Get total count
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(buyers)
      .where(whereClause);

    // Get paginated results
    const orderBy = sortOrder === 'asc' 
      ? asc(buyers[sortBy]) 
      : desc(buyers[sortBy]);

    const buyersList = await db
      .select()
      .from(buyers)
      .where(whereClause)
      .orderBy(orderBy)
      .limit(limit)
      .offset((page - 1) * limit);

    return {
      buyers: buyersList,
      total: count,
    };
  }

  static async getHistory(buyerId: string, limit = 5): Promise<BuyerHistory[]> {
    return await db
      .select()
      .from(buyerHistory)
      .where(eq(buyerHistory.buyerId, buyerId))
      .orderBy(desc(buyerHistory.changedAt))
      .limit(limit);
  }

  private static async createHistoryEntry(
    buyerId: string, 
    changedBy: string, 
    action: 'created' | 'updated' | 'deleted',
    changes: Record<string, { from: unknown; to: unknown }>
  ): Promise<void> {
    await db.insert(buyerHistory).values({
      buyerId,
      changedBy,
      diff: JSON.stringify({ action, changes }),
    });
  }

  private static getChangedFields(oldRecord: Record<string, unknown>, newRecord: Record<string, unknown>): Record<string, { from: unknown; to: unknown }> {
    const changes: Record<string, { from: unknown; to: unknown }> = {};
    
    for (const key in newRecord) {
      if (key === 'updatedAt') continue;
      
      if (oldRecord[key] !== newRecord[key]) {
        changes[key] = {
          from: oldRecord[key],
          to: newRecord[key],
        };
      }
    }
    
    return changes;
  }
}