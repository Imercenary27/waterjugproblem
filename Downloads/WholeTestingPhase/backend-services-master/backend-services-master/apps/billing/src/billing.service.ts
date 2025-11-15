import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { BillRepository } from './billing.repository';
import { ClientProxy } from '@nestjs/microservices';
//import { STOCK_MOVEMENT_LOG_RMQ } from 'apps/micro-services';
import { ViewBillDto } from './dto/view-bill.dto';
import { ConfigService } from '@nestjs/config';
import { GenerateBillDto } from './dto/generate-bill-dto';
import { GetBillDto } from './dto/getBill.dto';
import * as properties from 'package.json';
import { ApiResponse, ResponseStatus } from './models/api.response';
import { STOCK_BILL_PORT } from 'apps/port-config';
import { GetStockSaleDataByDate } from './dto/get-stock-sell-data';
import { STOCK_MOVEMENT_LOG_RMQ } from 'apps/micro-services';

@Injectable()
export class BillingService {
    billDetails: any;
    billData: any;
    buyerDetailsPayload: any;
    dbResponce: any = {};
    tagData;
    data;
    tagsInfo: any[] = [];
    orderPrice;

    constructor(
        private readonly billRepository: BillRepository,
        private configService: ConfigService,
        @Inject(STOCK_MOVEMENT_LOG_RMQ) private stockMovementClient: ClientProxy,
    ) {}

    getHealth(): ApiResponse {
        const ServerInfo = {
            name: properties.name,
            version: properties.version,
            updatedOn: properties.LastUpdatedOn,
            description: properties.description,
            message: `Server URL: ${this.configService.get('HOST')}:${STOCK_BILL_PORT}`,
        };
        let apiResponse: ApiResponse = {
            statusCode: HttpStatus.OK,
            status: ResponseStatus.Success,
            message: 'API Server is Healthy',
            data: ServerInfo,
        };
        return apiResponse;
    }

    async generateBill(request: GenerateBillDto) {
        let resp: ApiResponse;
        let dbResponce: any;
        try {
            if (request != undefined && request != null) {
                let orderPrice: any;
                let tagList: string[] = [];
                let tagDetailsCopy: any[] = [...request.tagDetails];
                orderPrice = tagDetailsCopy.reduce(
                    (currentItem: any, item: any) =>
                        parseInt(currentItem) + parseInt(item.price.unitPrice),
                    0,
                );

                let createBillPayload = {
                    billNumber: this.generateBillId(),
                    orderNumber: request.buyer.orderNumber,
                    orderPrice: orderPrice,
                    totalBillPrice: orderPrice,
                    printedOn: new Date(),
                    createdOn: new Date(),
                    billDate: new Date(),
                    remark: 'Bill Issued',
                    createdBy: request.buyer.name,
                    sellerCode: request.seller.code,
                    buyerCode: request.buyer.code,
                    sellerAddress: request.seller.address,
                    buyerAddress: request.buyer.address,
                    buyerName: request.buyer.name,
                    sellerName: request.seller.name,
                    tagData: request.tagDetails,
                    gstNumber: request.seller.gstNumber,
                    panNumber: request.seller.panNumber,
                    phoneNumber: request.buyer.phoneNumber,
                };

                dbResponce = await this.billRepository.create(createBillPayload);
                if (dbResponce == 0) {
                    resp = {
                        statusCode: HttpStatus.CONFLICT,
                        status: ResponseStatus.Error,
                        message: 'unable to get bill details',
                        data: [],
                    };
                    return resp;
                }

                resp = {
                    statusCode: HttpStatus.OK,
                    status: ResponseStatus.Success,
                    message: 'Bill deatils fetch successfully',
                    data: dbResponce,
                };
                request.tagDetails.forEach((element) => {
                    tagList.push(element.tagNum);
                });

                let movementData = {
                    tagNums: tagList,
                    actionCode: 'Bill Generate',
                    currentOwner: request.seller.name,
                    currentLocation: '',
                    newLocation: '',
                    newOwner: request.buyer.name,
                    remark: 'Bill Issued',
                    createdBy: request.seller.name,
                    createdOn: new Date(),
                };
                this.billStockLogEvent(movementData);
                return resp;
            }
        } catch {
            resp = {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                status: ResponseStatus.Error,
                message: 'something went wrong',
                data: [],
            };
            return resp;
        }
        return resp;
    }

    generateBillId(): string {
        return 'xxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (Math.random() * 16) | 0,
                v = c == 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    billStockLogEvent(data) {
        let payload = {
            tagNums: data.tagNums,
            actionCode: data.actionCode,
            currentOwner: data.currentOwner,
            currentLocation: data.currentLocation,
            newLocation: data.newLocation,
            newOwner: data.newOwner,
            remark: `Bill generate by ${data.currentOwner}`,
            createdBy: data.createdBy,
            createdOn: data.createdOn,
        };
        this.stockMovementClient.emit('ChangeItemOwnership', payload);
    }

    async viewBill(request: ViewBillDto) {
        let resp: ApiResponse;
        let dbResponce: any;
        try {
            dbResponce = await this.billRepository.findOne({
                $and: [{ billNumber: request.billNumber }, { sellerCode: request.sellerCode }],
            });
            if (dbResponce == null || dbResponce == undefined) {
                resp = {
                    statusCode: HttpStatus.CONFLICT,
                    status: ResponseStatus.Error,
                    message: 'unable to fetch details',
                    data: [],
                };
                return resp;
            }
            resp = {
                statusCode: HttpStatus.OK,
                status: ResponseStatus.Success,
                message: 'Bill Data fetch successfully',
                data: dbResponce,
            };
            return resp;
        } catch {
            resp = {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                status: ResponseStatus.Error,
                message: 'Something went wrong',
                data: [],
            };
            return resp;
        }
    }

    async getBillDataByOrderNumber(request: GetBillDto) {
        let resp: ApiResponse;
        let dbResponce: any;
        try {
            dbResponce = await this.billRepository.findOne({ orderNumber: request.orderNumber });
            if (dbResponce == 0) {
                resp = {
                    statusCode: HttpStatus.CONFLICT,
                    status: ResponseStatus.Error,
                    message: 'unable to fetch details',
                    data: [],
                };
                return resp;
            }
            resp = {
                statusCode: HttpStatus.OK,
                status: ResponseStatus.Success,
                message: 'Bill Data fetch successfully',
                data: dbResponce,
            };
            return resp;
        } catch {
            resp = {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                status: ResponseStatus.Error,
                message: 'Something went wrong',
                data: [],
            };
            return resp;
        }
    }

    async getStockSaleDataByDate(request: GetStockSaleDataByDate) {
        let saleStock: any = [];
        let resp: ApiResponse;
        let qryExpression: any = {};
        if (request.dateType === 'day') {
            qryExpression = {
                $and: [
                    { $eq: [{ $dayOfMonth: '$billDate' }, { $dayOfMonth: new Date() }] },
                    { $eq: [{ $month: '$billDate' }, { $month: new Date() }] },
                    { $eq: [{ $year: '$billDate' }, { $year: new Date() }] },
                ],
            };
        } else if (request.dateType === 'month') {
            qryExpression = {
                $and: [
                    { $eq: [{ $month: '$billDate' }, { $month: new Date() }] },
                    { $eq: [{ $year: '$billDate' }, { $year: new Date() }] },
                ],
            };
        } else if (request.dateType === 'year') {
            qryExpression = {
                $and: [{ $eq: [{ $year: '$billDate' }, { $year: new Date() }] }],
            };
        }
        try {
            saleStock = await this.billRepository.aggregation([
                {
                    $match: {
                        sellerCode: request.sellerCode,
                        $expr: qryExpression,
                    },
                },
                {
                    $unwind: '$tagData',
                },
                {
                    $group: {
                        _id: '$tagData.variety.name',
                        totalSale: { $count: {} },
                    },
                },
                { $sort: { totalSale: -1 } },
                { $limit: 6 },
            ]);
            if (saleStock.length == 0) {
                resp = {
                    statusCode: HttpStatus.CONFLICT,
                    status: ResponseStatus.Error,
                    message: 'Sale stock to not avaialble',
                    data: [],
                };
                return resp;
            }
            resp = {
                statusCode: HttpStatus.OK,
                status: ResponseStatus.Success,
                message: 'Sale stock fetch fuccessfully',
                data: saleStock,
            };
            return resp;
        } catch (err) {
            resp = {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                status: ResponseStatus.Error,
                message: 'Something went wrong',
                data: [],
            };
            return resp;
        }
    }
}
