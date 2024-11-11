// Repository interface
import * as O from 'fp-ts/Option';
import { OrderId, Order } from './entities/order.entity';
import { InjectionToken } from '@nestjs/common';

export interface OrderRepository {
  findAll(): Promise<Order[]>;
  findById(id: OrderId): Promise<O.Option<Order>>;
  save(order: Order): Promise<Order>;
}

export const ORDER_REPOSITORY: InjectionToken<OrderRepository> =
  'OrderRepositoryInterface';
