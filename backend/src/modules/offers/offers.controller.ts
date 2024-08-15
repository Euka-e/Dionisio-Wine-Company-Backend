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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/authorization.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Role } from '../users/dto/roles.enum';
import { Roles } from 'src/decorators/roles.decorator';
//import { Offer } from './entities/offer.entity';
import { GenerateDiscountCodeDto } from './dto/discountCode.dto';
import { ApplyDiscountCodeDto } from './dto/applyCode.dto';

@Controller('offers')
@ApiTags('Offers')
export class OffersController {
  constructor(
    private readonly offersService: OffersService,
  ) { }

  @ApiBearerAuth()
  @ApiOperation({
  summary: 'Generate a new discount code',
  description: `This endpoint generates a new discount code based on the provided details.
    - It requires authentication and authorization with either Admin or SuperAdmin role.
    - The request body should include details necessary to generate the discount code.
    - Use this endpoint to create unique discount codes that can be used for promotions or special offers.`,
})
  @ApiBody({
  description: 'Details for generating a discount code',
  type: GenerateDiscountCodeDto,
})
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  @Post('generate')
  generateCode(@Body() dto: GenerateDiscountCodeDto) {
    return this.offersService.generateCode(dto);
  }

  @ApiBearerAuth()
  @ApiOperation({
  summary: 'Apply a discount code',
  description: `This endpoint applies a discount code to a purchase or order.
    - It requires authentication with any user role.
    - The request body should include the discount code to be applied.
    - Use this endpoint to validate and apply discount codes to reduce the total price of purchases or orders.`,
})
  @ApiBody({
  description: 'Details for applying a discount code',
  type: ApplyDiscountCodeDto,
})
  @Roles(Role.User, Role.Admin, Role.SuperAdmin)
  @Post('apply')
  applyCode(@Body() dto: ApplyDiscountCodeDto) {
    return this.offersService.applyCode(dto);
  }
}
