import { Test, TestingModule } from '@nestjs/testing';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { BillRepository } from './billing.repository';
import { ViewBillDto } from './dto/view-bill.dto';
import { response } from 'express';
import { ConfigService } from '@nestjs/config';
import { GetBillDto } from './dto/getBill.dto';
import { ApiResponse } from './models/api.response';

const STOCK_MOVEMENT_LOG_RMQ = 'STOCK_MOVEMENT_LOG_STAGING';


describe('BillingController', () => {
    let controller: BillingController;
    let billingService: BillingService;
    const billRepositoryMock = {
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
        const configService = ConfigService;
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
        billingService = app.get<BillingService>(BillingService);
    });

    it('Should be defined"', () => {
        expect(controller).toBeDefined;
    });

    describe('viewBill', () => {
        const request: ViewBillDto = {
            billNumber: 'xyz123',
            sellerCode: 'ABC',
        };
        const expectedResult :any= {billNumber: 'xyz123', billDetails: 'xyz123 details' };

         const response:any = { 
            status: jest.fn().mockReturnThis(), 
            send: jest.fn() 
        }
     
        
          
        it('should call billingService.viewBill with the request payload', async () => {
            const spy = jest.spyOn(billingService,'viewBill');

            /*
            const spy = jest.spyOn(billingService, 'viewBill');
            const spyonRepo = jest.spyOn(billRepositoryMock, 'findOne');
            const data = await controller.viewBill(request,response);
            expect(spyonRepo).toHaveBeenCalledWith(request);
           // expect(billingService.viewBill).toHaveBeenCalledWith(request);
            expect(spy).toHaveBeenCalledWith(request);
            expect(data).toEqual(expectedResult);*/
        });

        it('should return the bill details for given bill number', async () => {
            const spy = jest.spyOn(billingService, 'viewBill').mockResolvedValueOnce(expectedResult);
            const spyonRepo = jest.spyOn(billRepositoryMock, 'findOne');
            const resp = await controller.viewBill(request, response);
            expect(spyonRepo).toHaveBeenCalledWith(request);
            expect(spy).toHaveBeenCalledWith({ billNumber: 'xyz123' });
            expect(resp).toEqual(expectedResult);
        });

        it('should return error if bill not found', async () => {
            const resp = await controller.viewBill(
                {
                    billNumber: '123',
                    sellerCode: 'ABC',
                },
                response,
            );
            expect(resp).toEqual(undefined);
        });
    });

    describe('getBillDataByOrderNumber', () => {
        
        const request: GetBillDto = { orderNumber: 'abc123' };
        const expectedResult:any = { orderNumber: 'abc123', orderDetails: 'xyz123 details' };
        const res: any = {
            status: jest.fn().mockReturnThis(), 
            send: jest.fn() 
        };

        it('should call billingService.getBillDataByOrderNumber with the request payload', async () => {
            const spy = jest.spyOn(billingService, 'getBillDataByOrderNumber').mockResolvedValueOnce(expectedResult);
            const spyonRepo = jest.spyOn(billRepositoryMock, 'findOne');
            const data = await controller.getBillDataByOrderNumber(request, res);
            expect(spyonRepo).toHaveBeenCalledWith(request);
            expect(spy).toHaveBeenCalledWith(request);
            

            expect(billingService.getBillDataByOrderNumber).toHaveBeenLastCalledWith(request);
            expect(res.send).toHaveBeenCalledWith(expectedResult);
            expect(data).toBe(expectedResult);
        });

        it('should return the bill details for given Order number', async () => {
            const resp = await controller.getBillDataByOrderNumber(request, response);
            expect(resp).toEqual(expectedResult);
        });

        it('should return error if order number not found', async () => {
            const resp = await controller.getBillDataByOrderNumber(
                { orderNumber: '1236' },
                response,
            );
            expect(resp).toEqual(undefined);
        });
    });

    describe('getHealth', () => {
        it('should return the health response', () => {
            const responseMock: any = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };
            const healthResponse: any = {
                statusCode: 200,
                status: 'Success',
                message: 'API Server is Healthy',
                data: {
                    name: ' Server Name',
                    version: '1.0.0',
                    updatedOn: '2023-05-18',
                    description: 'server description',
                    message: 'Server URL: hostname:port',
                },
            };
            jest.spyOn(billingService, 'getHealth').mockReturnValueOnce(healthResponse);

            const result = controller.getHealth(responseMock);

            // needed to add in service @Res


            expect(responseMock.status).toHaveBeenCalledWith(200);
            expect(responseMock.send).toHaveBeenCalledWith(healthResponse);
            expect(result).toEqual(healthResponse);
        });
    });
});
