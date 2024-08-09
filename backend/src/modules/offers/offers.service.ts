import { Injectable } from '@nestjs/common';
import { OffersRepository } from './offers.repository';
import { ApplyDiscountCodeDto } from './dto/applyCode.dto';
import { GenerateDiscountCodeDto } from './dto/discountCode.dto';

@Injectable()
export class OffersService {
  constructor(private offerRepository: OffersRepository) { }

  generateCode(dto: GenerateDiscountCodeDto) {
    return this.offerRepository.generateCode(dto);
  }

  applyCode(dto: ApplyDiscountCodeDto) {
    return this.offerRepository.applyCode(dto);
  }
}
