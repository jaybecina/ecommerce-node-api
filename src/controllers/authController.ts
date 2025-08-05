import { Request, Response } from 'express';
import { usersTable } from '../db/usersSchema';
import bcrypt from 'bcryptjs';
import { db } from '../db/index';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

const generateUserToken = (user: any) => {
  return jwt.sign({ userId: user.id, role: user.role }, 'your-secret', {
    expiresIn: '30d',
  });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.cleanBody;
    data.password = await bcrypt.hash(data.password, 10);

    const [user] = await db.insert(usersTable).values(data).returning();

    // @ts-ignore
    delete user.password;
    const token = generateUserToken(user);

    res.status(201).json({ user, token });
    return;
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Something went wrong',
    });
    return;
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.cleanBody;

    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (!user) {
      res.status(401).json({ error: 'Authentication failed' });
      return;
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      res.status(401).json({ error: 'Authentication failed' });
      return;
    }

    // create a jwt token
    const token = generateUserToken(user);
    // @ts-ignore
    delete user.password;
    res.status(200).json({ token, user });
    return;
  } catch {
    res.status(500).send('Something went wrong');
    return;
  }
};
