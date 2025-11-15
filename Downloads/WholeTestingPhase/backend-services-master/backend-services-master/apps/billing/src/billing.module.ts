import { Module } from '@nestjs/common';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { DatabaseModule, RmqModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { STOCK_MOVEMENT_LOG_RMQ } from 'apps/micro-services';
import { Bill, BillSchema } from './schemas/bill.schema';
import { BillRepository } from './billing.repository';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: './apps/billing/.env',
            // validationSchema: configValidation,
        }),
        DatabaseModule,
        RmqModule.register({ name: STOCK_MOVEMENT_LOG_RMQ }),

        MongooseModule.forFeature([{ name: Bill.name, schema: BillSchema }]),
    ],
    controllers: [BillingController],
    providers: [BillingService, BillRepository],
})
export class BillingModule {}
