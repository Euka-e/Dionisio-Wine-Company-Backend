import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryRepository } from './categories.repository';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoryRepository: CategoryRepository) { }

  findAll(page: number = 1, limit: number = 10) {
    return this.categoryRepository.findAll(page, limit);
  }

  findOne(category_id: string) {
    return this.categoryRepository.findOne(category_id);
  }
  
  create(createCategoryDto: CreateCategoryDto) {
    return this.categoryRepository.create(createCategoryDto);
  }

  remove(category_id: string) {
    return this.categoryRepository.delete(category_id);
  }

}
