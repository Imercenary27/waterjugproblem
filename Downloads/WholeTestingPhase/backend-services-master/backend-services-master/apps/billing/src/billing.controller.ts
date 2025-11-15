import { Body, Controller, Get, Post, Res, UseInterceptors } from '@nestjs/common';
import { BillingService } from './billing.service';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { ViewBillDto } from './dto/view-bill.dto';
import { GenerateBillDto } from './dto/generate-bill-dto';
import { GetBillDto } from './dto/getBill.dto';
import { ApiResponse } from './models/api.response';
import { Response } from 'express';
import { GetStockSaleDataByDate } from './dto/get-stock-sell-data';
import { LoggingInterceptor } from '@app/common';

@UseInterceptors(LoggingInterceptor)
@Controller('billing')
export class BillingController {
    constructor(private readonly billingService: BillingService) {}

    @Get('health')
    getHealth(@Res() res: Response): ApiResponse {
        const resp=  this.billingService.getHealth();
        res.status(resp.statusCode).send(resp);
        return resp;
    }

    @Post('generateBill')
    @EventPattern('GenerateBill')
    async generateBill(@Body() request: GenerateBillDto, @Res() res: Response) {
        const resp = await this.billingService.generateBill(request);
        if (res) return res.status(resp.statusCode).send(resp);
        else return resp;
    }

    @Post('getBillDataByOrderNumber')
    async getBillDataByOrderNumber(@Body() request: GetBillDto, @Res() res: Response) {
        const resp = await this.billingService.getBillDataByOrderNumber(request);
        if (res) return res.status(resp.statusCode).send(resp);
        else return resp;
    }

    @Post('viewBill')
    async viewBill(@Body() request: ViewBillDto, @Res() res: Response) {
        const resp = await this.billingService.viewBill(request);
        if (res) return res.status(resp.statusCode).send(resp);
        else return resp;
    }

    @MessagePattern('GetStockSaleDataByDate')
    @Post('GetStockSaleDataByDate')
    async getStockSaleDataByDate(@Body() request: GetStockSaleDataByDate, @Res() res: Response) {
        let resp = await this.billingService.getStockSaleDataByDate(request);
        if (res) return res.status(resp.statusCode).send(resp);
        else return resp;
    }
}
