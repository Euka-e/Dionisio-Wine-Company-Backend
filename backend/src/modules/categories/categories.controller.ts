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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    if (page && limit) this.categoriesService.findAll(page, limit);
    return this.categoriesService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') category_id: string) {
    return this.categoriesService.findOne(category_id);
  }
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Patch(':id') //? Posiblemente este endpoint sea redundante/inutil
  update(
    @Param('id') category_id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(category_id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') category_id: string) {
    return this.categoriesService.remove(category_id);
  }
}
