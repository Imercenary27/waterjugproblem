import { Body, Controller, Get, Post, Res, UseInterceptors } from '@nestjs/common';
import { TaginvdetailService } from './taginvdetail.service';
import { MessagePattern } from '@nestjs/microservices';
import { ApiResponse } from './models/api-responce';
import { Response } from 'express';
import { LoggingInterceptor } from '@app/common';

@UseInterceptors(LoggingInterceptor)
@Controller('taginvdetail')
export class TaginvdetailController {
    constructor(private readonly taginvdetailService: TaginvdetailService) {}

    @Get('health')
    getHealth(@Res() res: Response): ApiResponse {
        const resp = this.taginvdetailService.getHealth();
        res.status(resp.statusCode).send(resp);
        return resp;
    }

    @Post('/getInvDetail')
    async getInvDetails(@Body() request: any, @Res() res: Response) {
        const resp = await this.taginvdetailService.getInvDetails(request);
        if (res) {
            return res.status(resp.statusCode).send(resp);
        } else {
            return resp;
        }
    }

    @Post('/TagInvDetail')
    @MessagePattern('TagInvDetails')
    async TagInvDetails(@Body() request: any, @Res() res: Response) {
        const resp = await this.taginvdetailService.TagInvDetails(request);
        if (res) {
            return res.status(resp.statusCode).send(resp);
        } else {
            return resp;
        }
    }
}
