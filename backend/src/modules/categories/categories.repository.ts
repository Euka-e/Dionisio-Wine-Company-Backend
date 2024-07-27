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
    createCategoryDto.name = createCategoryDto.name.charAt(0).toUpperCase() + createCategoryDto.name.slice(1).toLowerCase();

    const existingCategory = await this.categoryRepository.findOne({ where: { name: createCategoryDto.name } });
    if (existingCategory) {
      throw new ConflictException('Category already exists');
    }

    const category = this.categoryRepository.create({ name: createCategoryDto.name });
    await this.categoryRepository.save(category);

    return 'Category successfully added';
  }
}
