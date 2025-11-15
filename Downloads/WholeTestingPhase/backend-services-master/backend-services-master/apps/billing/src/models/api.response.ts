export enum ResponseStatus {
    'Success' = 'Success',
    'Error' = 'Error',
}

export class ApiResponse {
    statusCode: number;
    status: ResponseStatus;
    message: string;
    data: any;
}
