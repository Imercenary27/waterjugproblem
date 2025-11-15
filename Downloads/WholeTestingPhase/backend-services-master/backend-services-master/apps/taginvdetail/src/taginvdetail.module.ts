import { DatabaseModule, RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TaginvdetailController } from './taginvdetail.controller';
import { TaginvdetailService } from './taginvdetail.service';
import { STOCK_RMQ } from 'apps/micro-services';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: './apps/taginvdetail/.env',
            // validationSchema: configValidation,
        }),
        DatabaseModule,
        RmqModule.register({ name: STOCK_RMQ }),

        MongooseModule.forFeature([]),
    ],
    controllers: [TaginvdetailController],
    providers: [TaginvdetailService],
})
export class TaginvdetailModule {}
