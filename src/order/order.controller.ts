import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { BadRequestException, Get } from '@nestjs/common';
import { Controller, Post, Body, Param } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Post()
  async createOrder(@Body() dto: CreateOrderDto) {
    const result = await this.orderService.processOrder(dto.userId, dto.items);

    return pipe(
      result,
      E.fold(
        (error) => {
          throw new BadRequestException(error.message);
        },
        (order) => order,
      ),
    );
  }

  @Post(':id/discount')
  async applyDiscount(
    @Param('id') id: string,
    @Body('discountPercent') discountPercent: number,
  ) {
    const result = await this.orderService.applyDiscountToOrder(
      id,
      discountPercent,
    );

    return pipe(
      result,
      E.fold(
        (error) => {
          throw new BadRequestException(error.message);
        },
        (order) => order,
      ),
    );
  }
}
