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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
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
  @ApiOperation({
    summary: 'Retrieve a paginated list of products',
    description: `This endpoint retrieves a list of products with pagination support.
      - The query parameters control pagination. Defaults are page 1 and limit 10.
      - The response will include the list of products along with their details such as name, price, and stock.`,
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number for pagination',
    example: '1',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Number of products per page',
    example: '10',
    required: false,
  })
  @Get()
  async findAll(
    /* @Query('page') page: string = '1',
    @Query('limit') limit: string = '10', */
  ) {
    /* const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10); */
    return this.productsService.findAll(/* pageNumber, limitNumber */);
  }

  @ApiOperation({
    summary: 'Retrieve a single product by ID',
    description: `This endpoint retrieves a product based on its unique ID.
      - The ID is passed as a URL parameter.
      - The response will include the product details such as name, price, stock, and description.`,
  })
  @ApiParam({
    name: 'productId',
    description: 'The unique ID of the product to retrieve',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Get(':productId')
  findOne(@Param('productId', ParseUUIDPipe) product_id: string) {
    return this.productsService.findOne(product_id);
  }

  @ApiBearerAuth()
@ApiOperation({
  summary: 'Create a new product',
  description: `This endpoint creates a new product in the system.
    - It requires authentication and authorization with either Admin or SuperAdmin role.
    - The request body should include all necessary product details such as name, price, and stock.`,
})
@ApiBody({
  description: 'Details for creating a new product',
  type: CreateProductDto,
})
  @Post()
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  create(@Body() product: CreateProductDto) {
    return this.productsService.create(product);
  }

  //!Modificado el tipo de dato a ANY momentaneamente
  @ApiBearerAuth()
@ApiOperation({
  summary: 'Update an existing product',
  description: `This endpoint updates the details of an existing product.
    - It requires authentication and authorization with either Admin or SuperAdmin role.
    - The request body should include the updated product details such as name, price, and stock.
    - The product ID is provided as a URL parameter.`,
})
@ApiParam({
  name: 'productId',
  description: 'The unique ID of the product to update',
  example: '123e4567-e89b-12d3-a456-426614174000',
})
@ApiBody({
  description: 'Details for updating an existing product',
  type: updateProductDto,
})
  @Patch(':productId/update')
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  update(
    @Param('productId', ParseUUIDPipe) product_id: string,
    @Body() updateProductDto: updateProductDto,
  ) {
    return this.productsService.update(product_id, updateProductDto);
  }

  
  @ApiBearerAuth()
@ApiOperation({
  summary: 'Update the stock of a product',
  description: `This endpoint updates the stock quantity of an existing product.
    - It requires authentication and authorization with either Admin or SuperAdmin role.
    - The stock quantity is provided in the request body, and the product ID is provided as a URL parameter.`,
})
@ApiParam({
  name: 'productId',
  description: 'The unique ID of the product to update stock for',
  example: '123e4567-e89b-12d3-a456-426614174000',
})
@ApiBody({
  description: 'Stock quantity to update',
  schema: {
    type: 'object',
    properties: {
      stock: {
        type: 'number',
        description: 'Quantity of stock to update',
        example: 50,
      },
    },
    required: ['stock'],
  },
})
  @Post(':productId/updateStock')
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        stock: {
          type: 'number',
          description: 'Cantidad de stock a actualizar',
          example: 50,
        },
      },
    },
  })
  restock(
    @Param('productId', ParseUUIDPipe) product_id: string,
    @Body('stock') stock?: number,
  ) {
    return this.productsService.restock(product_id, stock);
  }

  @ApiBearerAuth()
@ApiOperation({
  summary: 'Remove a product',
  description: `This endpoint removes an existing product from the system.
    - It requires authentication and authorization with either Admin or SuperAdmin role.
    - The product ID is provided as a URL parameter.`,
})
@ApiParam({
  name: 'id',
  description: 'The unique ID of the product to remove',
  example: '123e4567-e89b-12d3-a456-426614174000',
})
  @Delete(':id')
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id', ParseUUIDPipe) product_id: string) {
    return this.productsService.remove(product_id);
  }
}
