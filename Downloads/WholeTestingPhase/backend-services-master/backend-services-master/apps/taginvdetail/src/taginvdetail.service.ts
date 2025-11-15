import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ApiResponse, ResponseStatus } from './models/api-responce';
import { ClientProxy } from '@nestjs/microservices';

import { lastValueFrom } from 'rxjs';
import * as properties from 'package.json';
import { ConfigService } from '@nestjs/config';
import { STOCK_TAGINVDETAIL_PORT } from 'apps/port-config';
import { STOCK_RMQ } from 'apps/micro-services';

@Injectable()
export class TaginvdetailService {
    constructor(
        @Inject(STOCK_RMQ) private stockClient: ClientProxy,
        private configService: ConfigService,
    ) {}

    getHealth(): ApiResponse {
        const ServerInfo = {
            name: properties.name,
            version: properties.version,
            updatedOn: properties.LastUpdatedOn,
            description: properties.description,
            message: `Server URL: ${this.configService.get('HOST')}:${STOCK_TAGINVDETAIL_PORT}`,
        };
        let apiResponse: ApiResponse = {
            statusCode: HttpStatus.OK,
            status: ResponseStatus.Success,
            message: 'API Server is Healthy',
            data: ServerInfo,
        };
        return apiResponse;
    }

    async getInvDetails(request: any) {
        let resp: ApiResponse;
        let dbResponce: any;
        let payload = {
            tagNum: request.tagNum,
        };
        try {
            dbResponce = await lastValueFrom(this.stockClient.send('GetInvDetails', payload));
            return dbResponce;
        } catch {
            resp = {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                status: ResponseStatus.Error,
                message: `something went wrong`,
                data: [],
            };
            return resp;
        }
    }

    async TagInvDetails(request: any) {
        let resp: ApiResponse;
        let dbResponce: any;
        let payload = {
            tagNum: request.tagNum,
        };
        try {
            dbResponce = await lastValueFrom(this.stockClient.send('TagInvDetails', payload));
            return dbResponce;
        } catch {
            resp = {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                status: ResponseStatus.Error,
                message: 'unable to get tag details',
                data: [],
            };
            return resp;
        }
    }
}
