import { Request, Response } from 'express';
import { usersTable } from '../db/usersSchema';
import bcrypt from 'bcryptjs';
import { db } from '../db/index';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

type User = typeof usersTable.$inferSelect;
type NewUser = typeof usersTable.$inferInsert;
type UserResponse = Omit<User, 'password'>;

const createPublicUser = (user: User): UserResponse => {
  // eslint-disable-next-line no-unused-vars
  const { password: _, ...publicUser } = user;
  return publicUser;
};

const generateUserToken = (user: User) => {
  return jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET_KEY as string, {
    expiresIn: '30d',
  });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.cleanBody as Omit<NewUser, 'id'>;
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const [user] = await db
      .insert(usersTable)
      .values({
        ...data,
        password: hashedPassword,
        role: data.role ?? 'user',
      })
      .returning();

    if (user === undefined || user === null) {
      res.status(500).json({ error: 'Failed to create user' });
      return;
    }

    const publicUser = createPublicUser(user);
    const token = generateUserToken(user);

    res.status(201).json({ user: publicUser, token });
    return;
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Something went wrong',
    });
  }
};

interface LoginCredentials {
  email: string;
  password: string;
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.cleanBody as LoginCredentials;

    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));

    if (user === undefined || user === null) {
      res.status(401).json({ error: 'Authentication failed' });
      return;
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      res.status(401).json({ error: 'Authentication failed' });
      return;
    }

    const token = generateUserToken(user);
    const publicUser = createPublicUser(user);

    res.status(200).json({ token, user: publicUser });
    return;
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Something went wrong',
    });
    return;
  }
};
