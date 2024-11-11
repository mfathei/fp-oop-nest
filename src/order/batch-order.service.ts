import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import * as A from 'fp-ts/lib/Array';
import { OrderService } from './order.service';

// Example of combining multiple operations
@Injectable()
export class BatchOrderService {
  constructor(private readonly orderService: OrderService) {}

  async processOrders(
    orders: CreateOrderDto[],
  ): Promise<E.Either<Error, Order[]>> {
    return pipe(
      orders,
      // Convert array of orders to array of TaskEither
      A.traverse(TE.ApplicativePar)((dto) =>
        TE.tryCatch(
          () => this.orderService.processOrder(dto.userId, dto.items),
          (error) => error as Error,
        ),
      ),
      // Execute all operations in parallel
      TE.chain((results) =>
        pipe(
          results,
          // Combine all Either results
          A.sequence(E.Applicative),
          // Convert to TaskEither
          TE.fromEither,
        ),
      ),
    )();
  }
}
