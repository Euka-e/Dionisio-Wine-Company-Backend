import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('offers')
@ApiTags('Offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  async create(@Body() createOfferDto: CreateOfferDto) {
    return this.offersService.create(createOfferDto);
  }

  @Get()
  findAll() {
    return this.offersService.findAll();
  }

  @Get(':offerId')
  findOne(@Param('offerId') offerId: string) {
    return this.offersService.findOne(offerId);
  }

  @Patch(':offerId')
  update(@Param('offerId') offerId: string, @Body() updateOfferDto: UpdateOfferDto) {
    return this.offersService.update(offerId, updateOfferDto);
  }

  @Delete(':offerId')
  delete(@Param('offerId') offerId: string) {
    return this.offersService.delete(offerId);
  }
}