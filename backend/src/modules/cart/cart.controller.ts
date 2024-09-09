import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { CartService } from "./cart.service";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { Roles } from "src/decorators/roles.decorator";
import { Role } from "../users/dto/roles.enum";
import { AuthGuard } from "../auth/guards/authorization.guard";
import { RolesGuard } from "../auth/guards/role.guard";

@Controller('cart')
@ApiTags('Cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retrieve all carts',
    description: `This endpoint retrieves a list of all carts in the system.
      - It requires authentication and authorization with either the Admin or SuperAdmin role.
      - The response will be a list of carts, where each cart contains its associated details.
      - Use this endpoint to get a comprehensive view of all existing carts.`,
  })
  @Get()
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  async findAll() {
    return this.cartService.findAll();
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retrieve a specific cart',
    description: `This endpoint retrieves the details of a specific cart identified by its ID.
      - It requires authentication and authorization with either the User, Admin, or SuperAdmin role.
      - The ID of the cart is provided as a URL parameter.
      - Use this endpoint to fetch details of a particular cart by its unique ID.`,
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the cart to retrieve',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Get(':id')
  @Roles(Role.User, Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  async findOne(@Param('id') id: string) {
    return this.cartService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Add items to a user\'s cart',
    description: `This endpoint allows adding items to a user's cart.
      - It requires authentication and authorization with roles User, Admin, or SuperAdmin.
      - The user's ID is provided as a URL parameter.
      - The request body should include a list of products to add, where each product is defined by its ID and quantity.
      - Use this endpoint to update a user's cart by adding new items or modifying quantities.`,
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the user whose cart is being updated',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Roles(Role.User, Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  @Post(':id/item')
  @ApiParam({ name: 'id', required: true, description: 'The ID of the user' })
  @ApiBody({
    description: 'List of products to add to the cart',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          productId: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          quantity: {
            type: 'number',
            example: 2,
          },
        },
        required: ['productId', 'quantity'],
      },
    },
  })
  async addItem(
    @Param('id') userId: string,
    @Body() products: { productId: string, quantity: number }[],
  ) {
    return this.cartService.updateCart(userId, products);
  }
  


/*   @ApiBearerAuth()
  @Roles(Role.User, Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  @Post(':id/item')
  @ApiParam({ name: 'id', required: true, description: 'The ID of the user' })
  async addItem(
    @Param('userId') userId: string,
    @Body() products: { productId: string, quantity: number }[],
  ) {
    return this.cartService.updateCart(userId, products);
  } */

  /* 
  @ApiBearerAuth()
  @Post(':id/checkout')
  @Roles(Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiParam({ name: 'id', required: true, description: 'The ID of the user' })
  async checkout(@Param('id') id: string) {
    return await this.cartService.checkout(id);
  } */

  /*
  @ApiBearerAuth()
  @Delete(':userId')
  @Roles(Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  async deleteCart(@Param('id') id: string){
    return await this.cartService.delete(id);
  } */

}
