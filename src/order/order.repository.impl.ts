import { Order, OrderId } from './entities/order.entity';
import { OrderRepository } from './order.repository';
import * as O from 'fp-ts/Option';

export class OrderRepositoryImpl implements OrderRepository {
  private readonly orders: Order[] = [];

  async findAll(): Promise<Order[]> {
    return this.orders;
  }

  async findById(id: OrderId): Promise<O.Option<Order>> {
    const order = this.orders.find((o) => o.id === id);
    if (order) {
      return O.some(order);
    }
    return O.none;
  }

  async save(order: Order): Promise<Order> {
    this.orders.push(order);
    return order;
  }
}
