import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { ORDER_REPOSITORY } from './order.repository';
import { OrderRepositoryImpl } from './order.repository.impl';

@Module({
  controllers: [OrderController],
  exports: [OrderService],
  providers: [
    OrderService,
    { provide: ORDER_REPOSITORY, useClass: OrderRepositoryImpl },
  ],
})
export class OrderModule {}
