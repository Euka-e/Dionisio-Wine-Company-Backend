import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthService } from 'src/modules/auth/auth.service';
import { MailingModule } from '../mailing/mailing.module';
import { MailingService } from '../mailing/mailing.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), MailingModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, AuthService, MailingService],
})
export class UsersModule { }
