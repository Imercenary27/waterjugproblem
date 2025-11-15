import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ViewBillDto {
    @ApiProperty()
    @IsNotEmpty()
    billNumber: string;

    @ApiProperty()
    @IsNotEmpty()
    sellerCode: string;
}
