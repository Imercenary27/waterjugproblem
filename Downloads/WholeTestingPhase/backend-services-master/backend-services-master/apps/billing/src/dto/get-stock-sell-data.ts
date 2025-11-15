import { IsNotEmpty, IsString } from 'class-validator';

export class GetStockSaleDataByDate {
    @IsNotEmpty()
    @IsString()
    sellerCode: string;

    @IsNotEmpty()
    @IsString()
    dateType: string;
}
