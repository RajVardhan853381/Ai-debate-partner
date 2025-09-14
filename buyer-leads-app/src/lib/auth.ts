import { db, users, type User } from '@/lib/db';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function createOrGetUser(email: string, name: string): Promise<User> {
  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
  
  if (existing.length > 0) {
    return existing[0];
  }

  const [newUser] = await db.insert(users).values({
    email,
    name,
  }).returning();

  return newUser;
}

export function createToken(user: User): string {
  return jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): { userId: string; email: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
  } catch {
    return null;
  }
}

export async function getUserFromToken(token: string): Promise<User | null> {
  const payload = verifyToken(token);
  if (!payload) return null;

  const [user] = await db.select().from(users).where(eq(users.id, payload.userId)).limit(1);
  return user || null;
}