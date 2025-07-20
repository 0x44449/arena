import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UserEntity } from '@/entities/user.entity';
import { UsersController } from './users.controller';
import { FileEntity } from '@/entities/file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, FileEntity])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [TypeOrmModule],
})
export class UsersModule {}