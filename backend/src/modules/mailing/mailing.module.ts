import { Module } from '@nestjs/common';
import { MailingService } from './mailing.service';
import { UsersService } from '../users/users.service';

@Module({
  providers: [MailingService, UsersService],
  exports: [MailingService],
})
export class MailingModule {}
