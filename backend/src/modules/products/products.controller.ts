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

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    if (page && limit) return this.productsService.findAll(page, limit);
    return this.productsService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') products_id: string) {
    return this.productsService.findOne(products_id);
  }
  @Post()
  create(@Body() product) {
    return this.productsService.create(product);
  }

  @Patch(':id')
  update(
    @Param('id') products_id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(products_id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') products_id: string) {
    return this.productsService.remove(products_id);
  }
}
