import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

export const buyers = sqliteTable('buyers', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  fullName: text('full_name').notNull(),
  email: text('email'),
  phone: text('phone').notNull(),
  city: text('city', { enum: ['Chandigarh', 'Mohali', 'Zirakpur', 'Panchkula', 'Other'] }).notNull(),
  propertyType: text('property_type', { 
    enum: ['Apartment', 'Villa', 'Plot', 'Office', 'Retail'] 
  }).notNull(),
  bhk: text('bhk', { enum: ['1', '2', '3', '4', 'Studio'] }),
  purpose: text('purpose', { enum: ['Buy', 'Rent'] }).notNull(),
  budgetMin: integer('budget_min'),
  budgetMax: integer('budget_max'),
  timeline: text('timeline', { 
    enum: ['0-3m', '3-6m', '>6m', 'Exploring'] 
  }).notNull(),
  source: text('source', { 
    enum: ['Website', 'Referral', 'Walk-in', 'Call', 'Other'] 
  }).notNull(),
  status: text('status', { 
    enum: ['New', 'Qualified', 'Contacted', 'Visited', 'Negotiation', 'Converted', 'Dropped'] 
  }).notNull().default('New'),
  notes: text('notes'),
  tags: text('tags'), // JSON string array
  ownerId: text('owner_id').notNull().references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

export const buyerHistory = sqliteTable('buyer_history', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  buyerId: text('buyer_id').notNull().references(() => buyers.id),
  changedBy: text('changed_by').notNull().references(() => users.id),
  changedAt: integer('changed_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  diff: text('diff', { mode: 'json' }).notNull(), // JSON object of changed fields
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Buyer = typeof buyers.$inferSelect;
export type NewBuyer = typeof buyers.$inferInsert;
export type BuyerHistory = typeof buyerHistory.$inferSelect;
export type NewBuyerHistory = typeof buyerHistory.$inferInsert;