import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

import * as fakeProd from '../../utils/fakeProducts.json';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async findAll(page: number, limit: number) {
    let categories = await this.categoryRepository.find();

    const start = (page - 1) * limit;
    const end = start + limit;
    categories = categories.slice(start, end);

    return categories;
  }

  async findOne(category_id: string) {
    const category = await this.categoryRepository.findOne({
      where: { categoryId: category_id },
    });
    return category;
  }

  async create(createCategoryDto: CreateCategoryDto) {
    await this.categoryRepository

      .createQueryBuilder()
      .insert()
      .into(Category)
      .values({ name: createCategoryDto.name })
      .orIgnore()
      .execute();

    return 'Categorias agregadas exitosamente';
  }

  //? Posiblemente este endpoint sea redundante/inutil
  update(category_id: string, updateCategoryDto: UpdateCategoryDto) {
    this.categoryRepository.update(category_id, updateCategoryDto);
    return 'Categoria Actualizado';
  }

  //? verificar si no causa problema el metodo DELETE en vez de REMOVE
  remove(category_id: string) {
    this.categoryRepository.delete(category_id);
    return 'Categoria Eliminada';
  }
}
