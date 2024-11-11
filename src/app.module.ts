import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderController } from './order/order.controller';
import { OrderModule } from './order/order.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [OrderModule, EventEmitterModule.forRoot()],
  controllers: [AppController, OrderController],
  providers: [AppService],
})
export class AppModule {}
