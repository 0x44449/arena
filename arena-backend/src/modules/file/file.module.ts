import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from 'src/entities/file.entity';
import { UserEntity } from 'src/entities/user.entity';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { S3Service } from './s3.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity, UserEntity]),
    forwardRef(() => UserModule),
  ],
  controllers: [FileController],
  providers: [FileService, S3Service],
  exports: [FileService, S3Service],
})
export class FileModule {}
