import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { CartService } from "./cart.service";
import { ApiParam, ApiTags } from "@nestjs/swagger";
import { Roles } from "src/decorators/roles.decorator";
import { Role } from "../users/dto/roles.enum";
import { AuthGuard } from "../auth/guards/authorization.guard";
import { RolesGuard } from "../auth/guards/role.guard";

@Controller('cart')
@ApiTags('Cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Get()
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  async findAll() {
    return this.cartService.findAll();
  }

  @Get(':id')
  @Roles(Role.User, Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  async findOne(@Param('id') id: string) {
    return this.cartService.findOne(id);
  }

  @Roles(Role.User, Role.Admin, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  @Post(':id/item')
  @ApiParam({ name: 'id', required: true, description: 'The ID of the user' })
  async addItem(
    @Param('userId') userId: string,
    @Body() products: { productId: string, quantity: number }[],
  ) {
    return this.cartService.updateCart(userId, products);
  }

  /* @Post(':id/checkout')
  @Roles(Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiParam({ name: 'id', required: true, description: 'The ID of the user' })
  async checkout(@Param('id') id: string) {
    return await this.cartService.checkout(id);
  } */

  /* @Delete(':userId')
  @Roles(Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  async deleteCart(@Param('id') id: string){
    return await this.cartService.delete(id);
  } */

}
