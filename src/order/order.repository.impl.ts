// import { pipe } from 'fp-ts/function';
import { Order, OrderId } from './entities/order.entity';
import { OrderRepository } from './order.repository';
import * as O from 'fp-ts/Option';

export class OrderRepositoryImpl implements OrderRepository {
  private readonly orders: Order[] = [];

  // KEEP SIMPLE (Good for basic CRUD):
  async findAll(): Promise<Order[]> {
    return this.orders;
  }

  // USE Either WHEN (Examples of when it makes sense):
  //   async findAll(): Promise<E.Either<Error, Order[]>> {
  //     return pipe(
  //       TE.tryCatch(
  //         () =>
  //           this.orders.find({
  //             where: {
  //               // Complex conditions that might fail
  //               status: In(['ACTIVE', 'PENDING']),
  //               expiryDate: MoreThan(new Date()),
  //             },
  //             relations: ['items', 'user'],
  //           }),
  //         (error) => new DatabaseError('Failed to fetch orders'),
  //       ),
  //       // Additional business logic validation
  //       TE.chain((orders) =>
  //         orders.length === 0
  //           ? TE.left(new NoOrdersFoundError())
  //           : TE.right(orders),
  //       ),
  //     )();
  //   }

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
