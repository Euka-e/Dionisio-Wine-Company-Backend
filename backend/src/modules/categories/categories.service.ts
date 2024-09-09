import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryRepository } from './categories.repository';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  findAll() {
    return this.categoryRepository.findAll();
  }

  findOne(category_id: string) {
    return this.categoryRepository.findOne(category_id);
  }

  create(createCategoryDto: CreateCategoryDto) {
    return this.categoryRepository.create(createCategoryDto);
  }

  update(category_id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.categoryRepository.update(category_id, updateCategoryDto);
  }

  remove(category_id: string) {
    return this.categoryRepository.delete(category_id);
  }
}
