import { Test, TestingModule } from '@nestjs/testing';
import { TaginvdetailController } from './taginvdetail.controller';
import { TaginvdetailService } from './taginvdetail.service';
import { ConfigService } from '@nestjs/config';
import { response } from 'express';

const configService = ConfigService;
const STOCK_RMQ = 'STOCK_STAGING';

describe('TaginvdetailServicee',()=>{
    let controller :TaginvdetailController;
    let taginvdetailService:TaginvdetailService;
    const tagInvRepositoryMock = {
        find: jest.fn((query) => {
            if (query.tagNum === 'xyz123')
                return { tagNumber: 'xyz123', tagDetails: 'xyz123 details' };
        }),
    };

    const stockMock = {
        send: jest.fn().mockReturnThis(),
        emit: jest.fn().mockReturnThis(),
        publish: jest.fn().mockReturnThis(),
    };
    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [TaginvdetailController],
            providers: [
                TaginvdetailService,
                { provide: STOCK_RMQ, useValue: stockMock },
                { provide: configService, useValue: ConfigService},
            ],
        }).compile();
        
        controller = app.get<TaginvdetailController>(TaginvdetailController);
        taginvdetailService = app.get<TaginvdetailService>(TaginvdetailService);
    });

    describe('getHealth',()=>{
        it('should return health response',()=>{
            const responseMock:any ={
                status:jest.fn().mockReturnThis(),
                send :jest.fn(),
            };
            const healthResponse:any ={
                statusCode:200,
                status: 'Success',
                message: 'API Server is Healthy',
                data: {
                    name: ' Server Name',
                    version: '1.0.0',
                    updatedOn: '2023-05-18',
                    description: 'server description',
                    message: 'Server URL: hostname:port',
                }
            
            }
            
            const properties = {
                name: 'Your Server Name',
                version: '1.0.0',
                LastUpdatedOn: '2023-06-21',
                description: 'Your server description',
              };
              const hostValue = 'your-host-value';
              jest.spyOn(taginvdetailService, 'getHealth').mockReturnValueOnce(healthResponse);
              const result = controller.getHealth(responseMock);
              console.log(result)
              console.log(responseMock.send)
              expect(responseMock.status).toHaveBeenCalledWith(200);
              expect(responseMock.send).toHaveBeenCalledWith(healthResponse);
              expect(result).toEqual(healthResponse);
            // const result = controller.getHealth(responsemock);

            // expect(responsemock.status).toHaveBeenCalledWith(200);
            // expect(responsemock.send).toHaveBeenCalledWith(healthResponse);
            // expect(result).toEqual(healthResponse);
            // const actualApiResponse = taginvdetailService.getHealth();
            // expect(actualApiResponse).toEqual(healthResponse);


        })
    })
})