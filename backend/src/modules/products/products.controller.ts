import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
@ApiTags('Products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    if (page && limit) return this.productsService.findAll(page, limit);
    return this.productsService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') product_id: string) {
    return this.productsService.findOne(product_id);
  }
  @Post()
  create(@Body() product: CreateProductDto) {
    return this.productsService.create(product);
  }

  @Patch(':id')
  update(
    @Param('id') product_id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(product_id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') product_id: string) {
    return this.productsService.remove(product_id);
  }
}
