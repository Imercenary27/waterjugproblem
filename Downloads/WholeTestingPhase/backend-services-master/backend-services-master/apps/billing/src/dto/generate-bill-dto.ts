export class Crop {
    code: string;
    name: string;
}

export class Variety {
    code: string;
    name: string;
}

export class Price {
    unitPrice: string;
}
export class TagDetails {
    tagNum: string;
    variety: Variety;
    crop: Crop;
    packingSize: string;
    packingUnit: string;
    price: Price;
    lotNum: string;
}

export class BuyerAddress {
    stateName: string;
    districtName: string;
    blockName: string;
    pin: string;
    plotNo: string;
    villageName: string;
}

export class SellerAddress {
    stateName: string;
    districtName: string;
    blockName: string;
    pin: string;
    plotNo: string;
    villageName: string;
}

export class Seller {
    address: SellerAddress;
    name: string;
    code: string;
    panNumber: string;
    gstNumber: string;
    phoneNumber: string;
}

export class Buyer {
    address: BuyerAddress;
    name: string;
    code: string;
    phoneNumber: string;
    orderNumber: string;
}

export class GenerateBillDto {
    tagDetails: TagDetails[];
    seller: Seller;
    buyer: Buyer;
}
