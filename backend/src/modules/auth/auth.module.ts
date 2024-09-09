import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersRepository } from 'src/modules/users/users.repository';
import { User } from 'src/modules/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { MailingModule } from '../mailing/mailing.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), MailingModule],
  controllers: [AuthController],
  providers: [AuthService, UsersRepository, UsersService],
})
export class AuthModule {}
