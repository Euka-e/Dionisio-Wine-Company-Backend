import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/authorization.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Role } from '../users/dto/roles.enum';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('offers')
@ApiTags('Offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Get()
  findAll() {
    return this.offersService.findAll();
  }

  @Get(':offerId')
  findOne(@Param('offerId') offerId: string) {
    return this.offersService.findOne(offerId);
  }
  @Post()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async create(@Body() createOfferDto: CreateOfferDto) {
    return this.offersService.create(createOfferDto);
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
