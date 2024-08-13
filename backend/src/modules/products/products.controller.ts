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
  ParseUUIDPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { updateProductDto } from './dto/update-product.dto';
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
  findOne(@Param('productId', ParseUUIDPipe) product_id: string) {
    return this.productsService.findOne(product_id);
  }
  @Post()
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  create(@Body() product: CreateProductDto) {
    return this.productsService.create(product);
  }

  //!Modificado el tipo de dato a ANY momentaneamente
  @Patch(':productId/update')
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  update(
    @Param('productId', ParseUUIDPipe) product_id: string,
    @Body() updateProductDto: any,
  ) {
    return this.productsService.update(product_id, updateProductDto);
  }

  @Post(':productId/updateStock')
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  restock(
    @Param('productId', ParseUUIDPipe) product_id: string,
    @Body('stock') stock?: number,
  ) {
    return this.productsService.restock(product_id, stock);
  }

  @Delete(':id')
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('productId', ParseUUIDPipe) product_id: string) {
    return this.productsService.remove(product_id);
  }
}
