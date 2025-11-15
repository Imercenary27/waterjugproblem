import { RmqService } from '@app/common';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { STOCK_TAGINVDETAIL_RMQ } from 'apps/micro-services';
import { TaginvdetailModule } from './taginvdetail.module';
import { STOCK_TAGINVDETAIL_PORT } from 'apps/port-config';
import { SwaggerDocumentOptions, DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const options: SwaggerDocumentOptions = {
    operationIdFactory: (_controllerKey: string, methodKey: string) => methodKey,
};
const config = new DocumentBuilder()
    .setTitle('SATHI-Seed Inventory-Tag Inventory Details Service')
    .setDescription('SATHI-Seed Inventory-Tag Inventory Details Service in SATHI Eco-system')
    .setVersion('1.0')
    .addTag('Tag-Inventory-Details')
    .build();

async function bootstrap() {
    const app = await NestFactory.create(TaginvdetailModule);
    app.useGlobalPipes(new ValidationPipe());


    const rmqService = app.get<RmqService>(RmqService);
    app.connectMicroservice(
        rmqService.getOptions(STOCK_TAGINVDETAIL_RMQ),
    );
    await app.startAllMicroservices();

    const document = SwaggerModule.createDocument(app, config, options);
    SwaggerModule.setup('api-docs', app, document);

    await app.listen(STOCK_TAGINVDETAIL_PORT);
    console.log(`stock place sale order service running on PORT ${STOCK_TAGINVDETAIL_PORT}`);
}
bootstrap();
