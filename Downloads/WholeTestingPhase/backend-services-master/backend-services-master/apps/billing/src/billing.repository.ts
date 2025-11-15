import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Bill } from './schemas/bill.schema';

@Injectable()
export class BillRepository extends AbstractRepository<Bill> {
    protected readonly logger = new Logger(BillRepository.name);

    constructor(
        @InjectModel(Bill.name) billModel: Model<Bill>,
        @InjectConnection() connection: Connection,
    ) {
        super(billModel, connection);
    }
}
