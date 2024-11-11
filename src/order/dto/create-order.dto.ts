import { OrderItem, UserId } from '../entities/order.entity';

export class CreateOrderDto {
  userId: UserId;
  items: OrderItem[];
}
