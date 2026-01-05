import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactEntity } from 'src/entities/contact.entity';
import { UserEntity } from 'src/entities/user.entity';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { FileModule } from '../file/file.module';

@Module({
  imports: [TypeOrmModule.forFeature([ContactEntity, UserEntity]), FileModule],
  controllers: [ContactController],
  providers: [ContactService],
  exports: [ContactService],
})
export class ContactModule {}
