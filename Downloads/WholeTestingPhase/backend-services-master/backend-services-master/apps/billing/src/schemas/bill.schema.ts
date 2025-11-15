import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';

export class Crop {
    @Prop()
    code: string;
    @Prop()
    name: string;
}

export class Variety {
    @Prop()
    code: string;
    @Prop()
    name: string;
}

export class Price {
    @Prop()
    unitPrice: string;
}
export class TagDetails {
    @Prop()
    lotNum: string;

    @Prop()
    tagNum: string;
    @Prop()
    variety: Variety;
    @Prop()
    crop: Crop;
    @Prop()
    packingSize: string;
    @Prop()
    packingUnit: string;
    @Prop()
    price: Price;
}

export class BuyerAddress {
    @Prop()
    stateName: string;
    @Prop()
    districtName: string;
    @Prop()
    blockName: string;
    @Prop()
    pin: string;
    @Prop()
    plotNo: string;
    @Prop()
    villageName: string;
}

export class SellerAddress {
    @Prop()
    stateName: string;
    @Prop()
    districtName: string;
    @Prop()
    blockName: string;
    @Prop()
    pin: string;
    @Prop()
    plotNo: string;
    @Prop()
    villageName: string;
}

@Schema({ versionKey: false })
export class Bill extends AbstractDocument {
    @Prop()
    billNumber: string;

    @Prop()
    orderNumber: string;

    @Prop()
    billDate: Date;

    @Prop()
    orderPrice: string;

    @Prop()
    totalBillPrice: string;

    @Prop()
    printedOn: Date;

    @Prop()
    remark: string;

    @Prop()
    createdBy: string;

    @Prop()
    createdOn: Date;

    @Prop()
    sellerCode: string;

    @Prop()
    buyerCode: string;

    @Prop()
    tagData: TagDetails[];

    @Prop()
    gstNumber: string;

    @Prop()
    panNumber: string;

    @Prop()
    buyerName: string;

    @Prop()
    sellerName: string;

    @Prop()
    phoneNumber: string;

    @Prop()
    buyerAddress: BuyerAddress;

    @Prop()
    sellerAddress: SellerAddress;
}
export const BillSchema = SchemaFactory.createForClass(Bill);
