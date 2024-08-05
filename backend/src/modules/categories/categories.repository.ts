import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) { }

  async findAll(page: number = 1, limit: number = 10) {
    const [categories, total] = await this.categoryRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit
    })
    return {
      data: categories,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    }
  }

  async findOne(category_id: string) {
    const category = await this.categoryRepository.findOne({
      where: { categoryId: category_id },
    });
    return category;
  }

  async create(createCategoryDto: CreateCategoryDto) {
    createCategoryDto.name = createCategoryDto.name.charAt(0).toUpperCase() + createCategoryDto.name.slice(1).toLowerCase();

    const existingCategory = await this.categoryRepository.findOne({ where: { name: createCategoryDto.name } });
    if (existingCategory) {
      throw new ConflictException('Category already exists');
    }

    const category = this.categoryRepository.create({ name: createCategoryDto.name });
    await this.categoryRepository.save(category);

    return 'Category successfully added';
  }

  async delete(category_id: string) {
    return await this.categoryRepository.delete({ categoryId: category_id });
  }
}
