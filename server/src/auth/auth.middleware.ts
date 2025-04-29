import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ArenaRequest } from './arena-request';
import { UserEntity } from '@/entity/user.entity';
import { UserService } from '@/user/user.service';

@Injectable()
export class AuthMiddelware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: ArenaRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    req.user = await this.userService.getUserByUserId('admin') || undefined;
    // if (authHeader && authHeader.startsWith("Bearer ")) {
    //   const token = authHeader.split(" ")[1];
    // }

    next();
  }
}