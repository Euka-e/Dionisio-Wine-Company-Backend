import { Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { OffersRepository } from './offers.repository';

@Injectable()
export class OffersService {
  constructor(private offerRepository:OffersRepository) {}
  
  create(createOfferDto: CreateOfferDto) {
    return this.offerRepository.create(createOfferDto) ;
  }

  findAll() {
    return this.offerRepository.findAll();
  }

  findOne(id: string) {
    return this.offerRepository.findOne(id);
  }

  update(id: string, updateOfferDto: UpdateOfferDto) {
    return this.offerRepository.update(id, updateOfferDto);
  }

  delete(id: string) {
    return this.offerRepository.delete(id);
  }
}
