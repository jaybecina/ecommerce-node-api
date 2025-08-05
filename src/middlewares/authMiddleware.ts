import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    res.status(401).json({ error: 'Access denied' });
    return;
  }

  // Extract token if Bearer
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

  try {
    // For debugging
    console.log('Token received:', token);

    // decode jwt token data
    const decoded = jwt.verify(token, 'your-secret');
    console.log('Decoded token:', decoded);

    if (typeof decoded !== 'object' || !decoded?.userId) {
      res.status(401).json({ error: 'Invalid token structure' });
      return;
    }
    if (!decoded.role) {
      res.status(401).json({ error: 'No role in token' });
      return;
    }
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
}

export function verifyRoles(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log('Current user role:', req.role);
    const role = req.role;
    if (!allowedRoles.includes(role)) {
      res.status(401).json({
        error: `Access denied. Required roles: ${allowedRoles.join(' or ')}, Current role: ${role}`,
      });
      return;
    }
    next();
  };
}

// Shorthand middlewares for common role combinations
export const verifySeller = verifyRoles(['seller', 'admin']);
export const verifyAdmin = verifyRoles(['admin']);
export const verifySellerOrAdmin = verifyRoles(['seller', 'admin']);
