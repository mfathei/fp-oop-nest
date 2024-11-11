import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import * as A from 'fp-ts/Array';
import { Order, OrderItem } from './entities/order.entity';

// Pure domain functions
export const OrderOperations = {
  calculateTotal: (items: OrderItem[]): number =>
    pipe(
      items,
      A.reduce(0, (acc, item) => acc + item.quantity * item.price),
    ),

  validateOrder: (order: Order): E.Either<Error, Order> =>
    pipe(
      order,
      E.fromPredicate(
        (o) => o.items.length > 0,
        () => new Error('Order must have items'),
      ),
      E.chain((o) =>
        E.fromPredicate(
          (order: Order) =>
            order.total === OrderOperations.calculateTotal(order.items),
          () => new Error('Invalid order total'),
        )(o),
      ),
    ),

  applyDiscount:
    (discountPercent: number) =>
    (order: Order): Order => ({
      ...order,
      total: order.total * (1 - discountPercent / 100),
    }),
};
