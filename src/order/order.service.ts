import * as O from 'fp-ts/Option';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Inject, Injectable } from '@nestjs/common';
import { OrderRepository, ORDER_REPOSITORY } from './order.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserId, OrderItem, Order, OrderId } from './entities/order.entity';
import { OrderOperations } from './order.operations';

@Injectable()
export class OrderService {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async findAll(): Promise<Order[]> {
    return await this.orderRepository.findAll();
  }

  private createOrder(
    userId: UserId,
    items: OrderItem[],
  ): E.Either<Error, Order> {
    const order: Order = {
      id: Date.now().toString(),
      userId,
      items,
      total: OrderOperations.calculateTotal(items),
      status: 'pending',
    };

    return OrderOperations.validateOrder(order);
  }

  async processOrder(
    userId: UserId,
    items: OrderItem[],
  ): Promise<E.Either<Error, Order>> {
    return pipe(
      // Create and validate order
      this.createOrder(userId, items),
      // Convert to TaskEither for async operations
      TE.fromEither,
      // Save to repository
      TE.chain((order) =>
        this.fromRepository(this.orderRepository.save(order)),
      ),
      // Emit event
      TE.chain((order) =>
        pipe(
          TE.right(order),
          TE.map((order) => {
            this.eventEmitter.emit('order.created', order);
            return order;
          }),
        ),
      ),
    )();
  }

  async applyDiscountToOrder(
    orderId: OrderId,
    discountPercent: number,
  ): Promise<E.Either<Error, Order>> {
    return pipe(
      // Find order
      this.fromRepositoryFind(this.orderRepository.findById(orderId)),
      // Apply discount
      TE.map(OrderOperations.applyDiscount(discountPercent)),
      // Save updated order
      TE.chain((order) =>
        this.fromRepository(this.orderRepository.save(order)),
      ),
    )();
  }

  // Helper to convert Promise<Option<T>> to TaskEither
  private fromRepositoryFind = <T>(
    promise: Promise<O.Option<T>>,
  ): TE.TaskEither<Error, T> =>
    pipe(
      TE.tryCatch(
        () => promise,
        (error) => error as Error,
      ),
      TE.chain((option) =>
        pipe(
          option,
          O.fold(
            () => TE.left(new Error('Not found')),
            (value) => TE.right(value),
          ),
        ),
      ),
    );

  // Helper to convert Promise<T> to TaskEither
  private fromRepository = <T>(promise: Promise<T>): TE.TaskEither<Error, T> =>
    TE.tryCatch(
      () => promise,
      (error) => error as Error,
    );
}
