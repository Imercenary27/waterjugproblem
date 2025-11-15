import { Test,TestingModule } from "@nestjs/testing";
import { BillingService } from "./billing.service";
import { BillingController } from "./billing.controller";
import { BillRepository } from "./billing.repository";
import { STOCK_MOVEMENT_LOG_RMQ } from "apps/micro-services";
import { ConfigService } from "@nestjs/config";


const STOCK_RMQ = 'STOCK';
const configService = ConfigService;

describe('BillingService',()=>{
    let service:BillingService;
    let controller:BillingController;
    const billRepositoryMock={
        findOne: jest.fn((query) => {
            if (query.billNumber === 'xyz123')
                return { billNumber: 'xyz123', billDetails: 'xyz123 details' };
            if (query.billNumber === 'abc123')
                return { billNumber: 'abc123', billDetails: 'abc123 details' };
            if (query.orderNumber === 'abc123')
                return { orderNumber: 'abc123', orderDetails: 'abc123 details' };
        }),
    };
    const stockMovementClientMock = {
        send: jest.fn().mockReturnThis(),
        emit: jest.fn().mockReturnThis(),
        publish: jest.fn().mockReturnThis(),
    };

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [BillingController],
            providers: [
                BillingService,
                { provide: BillRepository, useValue: billRepositoryMock },
                { provide: STOCK_MOVEMENT_LOG_RMQ, useValue: stockMovementClientMock },
                { provide: configService, useValue: ConfigService },
            ],
        }).compile();
        controller = app.get<BillingController>(BillingController);
        service = app.get<BillingService>(BillingService);
    });

    it('Should be defined"', () => {
        expect(controller).toBeDefined;
    });
})