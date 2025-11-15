import { NestFactory } from '@nestjs/core';
import { BillingModule } from './billing.module';
import { ValidationPipe } from '@nestjs/common';
import { RmqService } from '@app/common';
import { STOCK_BILL_RMQ } from 'apps/micro-services';
import { STOCK_BILL_PORT } from 'apps/port-config';
import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';
import * as express from 'express';
const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
};
const config = new DocumentBuilder()
    .setTitle('SATHI-Seed Inventory-Billing Service')
    .setDescription(
        'SATHI-Seed Inventory-Billing Service to serve the bill generation requests from SATHI Eco-system',
    )
    .setVersion('1.0')
    .addTag('Billing')
    .build();

async function bootstrap() {
    const app = await NestFactory.create(BillingModule);
    app.use(express.json({ limit: '2mb' }));
    app.use(express.urlencoded({ limit: '2mb', extended: true }));
    app.useGlobalPipes(new ValidationPipe());
    const rmqService = app.get<RmqService>(RmqService);
    app.connectMicroservice(rmqService.getOptions(STOCK_BILL_RMQ));
    await app.startAllMicroservices();

    const document = SwaggerModule.createDocument(app, config, options);
    SwaggerModule.setup('api-docs', app, document);

    await app.listen(STOCK_BILL_PORT);
    console.log(`stock billing service running on PORT ${STOCK_BILL_PORT}`);
}
bootstrap();
