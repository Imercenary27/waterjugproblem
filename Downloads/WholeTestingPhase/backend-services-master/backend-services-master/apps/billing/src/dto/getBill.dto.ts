import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GetBillDto {
    @ApiProperty()
    @IsNotEmpty()
    orderNumber: string;
}
