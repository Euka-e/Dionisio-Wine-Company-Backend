import { Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { OffersRepository } from './offers.repository';

@Injectable()
export class OffersService {
  constructor(private offerRepository: OffersRepository) { }

  create(createOfferDto: CreateOfferDto) {
    return this.offerRepository.create(createOfferDto);
  }

  findAll() {
    return this.offerRepository.findAll();
  }

  findOne(offerId: string) {
    return this.offerRepository.findOne(offerId);
  }

  update(offerId: string, updateOfferDto: UpdateOfferDto) {
    return this.offerRepository.update(offerId, updateOfferDto);
  }

  delete(offerId: string) {
    return this.offerRepository.delete(offerId);
  }
}
