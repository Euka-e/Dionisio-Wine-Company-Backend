import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { AuthGuard } from '../auth/guards/authorization.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from '../users/dto/roles.enum';

@Controller('products')
@ApiTags('Products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  //! Si el usuario puede comprar productos sin tener una cuenta, entonces la guarda aca puede dar conflictos
  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    return this.productsService.findAll(pageNumber, limitNumber);
  }

  @Get(':productId')
  findOne(@Param('productId') product_id: string) {
    return this.productsService.findOne(product_id);
  }
  @Post()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  create(@Body() product: CreateProductDto) {
    return this.productsService.create(product);
  }

  @Patch(':productId')
  update(
    @Param('productId') product_id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(product_id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('productId') product_id: string) {
    return this.productsService.remove(product_id);
  }
}
