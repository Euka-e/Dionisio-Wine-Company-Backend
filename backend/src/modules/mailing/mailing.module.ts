import { Module } from '@nestjs/common';
import { MailingService } from './mailing.service';

@Module({
  imports: [],
  providers: [MailingService],
  exports: [MailingService],
})
export class MailingModule {}
