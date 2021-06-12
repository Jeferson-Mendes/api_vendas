import AppError from '@shared/errors/AppErros';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '@config/auth';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function isAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT Token is missing');
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    throw new AppError('Token malformated');
  }

  // Bearer 54353453jkh5kjh53hgjhgh5f5hgf45gh34f53h4gf
  const [, token] = parts;

  try {
    const decodedToken = verify(token, authConfig.jwft.secret);

    const { sub } = decodedToken as ITokenPayload;

    request.user = {
      id: sub,
    };

    return next();
  } catch {
    throw new AppError('Invalid JWT token.');
  }
}
