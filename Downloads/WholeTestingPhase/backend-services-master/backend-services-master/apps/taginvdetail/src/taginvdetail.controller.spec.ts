import { Test, TestingModule } from '@nestjs/testing';
import { TaginvdetailController } from './taginvdetail.controller';
import { TaginvdetailService } from './taginvdetail.service';
import { ConfigService } from '@nestjs/config';
import { response } from 'express';

const configService = ConfigService;
const STOCK_RMQ = 'STOCK_STAGING';

describe('TaginvdetailController', () => {
    let controller: TaginvdetailController;
    let taginvdetailService: TaginvdetailService;
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
                { provide: configService, useValue: ConfigService },
            ],
        }).compile();

        controller = app.get<TaginvdetailController>(TaginvdetailController);
        taginvdetailService = app.get<TaginvdetailService>(TaginvdetailService);
    });

    describe('getInvDetail', () => {
        const request: any = { tagNum: 'xyz123' };
        const expectedResult = { tagNum: 'xyz123', tagDetails: 'xyz123 details' };
        const response: any = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
       // jest.spyOn(service, 'getInvDetails').mockResolvedValueOnce(expectedResult);
        it('should call taginvdetailService.getInvDetail with the request payload', async () => {
            const spy = jest.spyOn(taginvdetailService, 'getInvDetails').mockResolvedValueOnce(expectedResult);
            const spyonRepo = jest.spyOn(tagInvRepositoryMock, 'find');
            const data = await controller.getInvDetails(request, response);
            // expect(spyonRepo).toHaveBeenCalledWith(request);
            // expect(spy).toHaveBeenCalledWith(request);
            // expect(data).toEqual(expectedResult);
            expect(taginvdetailService.getInvDetails).toHaveBeenCalledWith(request);
           // expect(response.status).toHaveBeenCalledWith(expectedResult.statusCode);
            expect(response.send).toHaveBeenCalledWith(expectedResult);
            expect(expectedResult).toBe(expectedResult);
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
            jest.spyOn(taginvdetailService, 'getHealth').mockReturnValueOnce(healthResponse);

            const result = controller.getHealth(responseMock);

            expect(responseMock.status).toHaveBeenCalledWith(200);
            expect(responseMock.send).toHaveBeenCalledWith(healthResponse);
            expect(result).toEqual(healthResponse);
        });
    });
});
