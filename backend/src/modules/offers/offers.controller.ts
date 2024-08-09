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
import { Offer } from './entities/offer.entity';
import { GenerateDiscountCodeDto } from './dto/discountCode.dto';
import { ApplyDiscountCodeDto } from './dto/applyCode.dto';

@Controller('offers')
@ApiTags('Offers')
export class OffersController {
  constructor(
    private readonly offersService: OffersService,
  ) {}

  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Post('generate')
  generateCode(@Body() dto: GenerateDiscountCodeDto) {
    return this.offersService.generateCode(dto);
  }

  @Post('apply')
  applyCode(@Body() dto: ApplyDiscountCodeDto) {
    return this.offersService.applyCode(dto);
  }
}
