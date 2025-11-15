import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { RmqOptions } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices/enums';

@Injectable()
export class RmqService {
    constructor(private readonly configService: ConfigService) {}

    getOptions(queue: string, noAck = true): RmqOptions {
        return {
            transport: Transport.RMQ,
            options: {
                urls: [this.configService.get<string>('RABBIT_MQ_URI')],
                queue: queue, //this.configService.get<string>(`RABBIT_MQ_${queue}_QUEUE`),
                noAck,
                persistent: true,
            },
        };
    }
}
