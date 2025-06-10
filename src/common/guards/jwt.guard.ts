import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'];

    const openRoutes = [
      { path: '/auth/signup', method: 'POST' },
      { path: '/auth/login', method: 'POST' },
      { path: '/auth/refresh', method: 'POST' },
    ];

    const isPublic = openRoutes.some(
      (route) =>
        req.path === route.path && req.method.toUpperCase() === route.method,
    );

    if (isPublic) return true;

    if (!authHeader || !authHeader.startsWith('Bearer '))
      throw new UnauthorizedException('Missing bearer token');

    try {
      const token = authHeader.split(' ')[1];
      const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
