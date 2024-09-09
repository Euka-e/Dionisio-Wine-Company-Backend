import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  Delete,
  Patch,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Role } from '../users/dto/roles.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from '../auth/guards/authorization.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
@ApiTags('Categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({
    summary: 'Retrieve all categories',
    description: `This endpoint retrieves a list of all categories in the system.
      - No authentication is required for this endpoint.
      - The response will be a list of all categories with their details.
      - Use this endpoint to get an overview of all existing categories.`,
  })
  @Get()
  async findAll() {
    return this.categoriesService.findAll();
  }

  @ApiOperation({
    summary: 'Retrieve a specific category',
    description: `This endpoint retrieves the details of a specific category identified by its ID.
      - No authentication is required for this endpoint.
      - The ID of the category is provided as a URL parameter.
      - Use this endpoint to fetch details of a particular category by its unique ID.`,
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the category to retrieve',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) category_id: string) {
    return this.categoriesService.findOne(category_id);
  }

  @ApiBearerAuth()
  @ApiOperation({
  summary: 'Create a new category',
  description: `This endpoint creates a new category in the system.
    - It requires authentication and authorization with either Admin or SuperAdmin role.
    - The request body should include the details of the category to be created.
    - Use this endpoint to add new categories to the system.`,
})
  @ApiBody({
  description: 'Details of the category to be created',
  type: CreateCategoryDto,
})
  @Post()
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @ApiBearerAuth()
@ApiOperation({
  summary: 'Update an existing category',
  description: `This endpoint updates an existing category identified by its ID.
    - It requires authentication and authorization with either Admin or SuperAdmin role.
    - The ID of the category is provided as a URL parameter.
    - The request body should include the details to update the category.
    - Use this endpoint to modify existing category details.`,
})
@ApiParam({
  name: 'id',
  description: 'The unique identifier of the category to update',
  example: '123e4567-e89b-12d3-a456-426614174000',
})
@ApiBody({
  description: 'Details of the category to be updated',
  type: UpdateCategoryDto,
})
  @Patch('update/:id')
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  update(
    @Param('id', ParseUUIDPipe) category_id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(category_id, updateCategoryDto);
  }

  @ApiBearerAuth()
@ApiOperation({
  summary: 'Delete a category',
  description: `This endpoint deletes a specific category identified by its ID.
    - It requires authentication and authorization with either Admin or SuperAdmin role.
    - The ID of the category to be deleted is provided as a URL parameter.
    - Use this endpoint to remove a category from the system.`,
})
@ApiParam({
  name: 'id',
  description: 'The unique identifier of the category to delete',
  example: '123e4567-e89b-12d3-a456-426614174000',
})
  @Delete(':id')
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id', ParseUUIDPipe) category_id: string) {
    return this.categoriesService.remove(category_id);
  }
}
