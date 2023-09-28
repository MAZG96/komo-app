

export interface PedidoUPS {
    ShipmentRequest: ShipmentRequest;
}

export interface ShipmentRequest {
    Shipment:           Shipment;
    LabelSpecification: LabelSpecification;
}

export interface LabelSpecification {
    LabelImageFormat: LabelImageFormat;
    LabelStockSize:   LabelStockSize;
}

export interface LabelImageFormat {
    Code:        string;
    Description: string;
}

export interface LabelStockSize {
    Height: string;
    Width:  string;
}

export interface Shipment {
    Description:        string;
    Shipper:            Shipper;
    ShipFrom:           Ship;
    ShipTo:             Ship;
    PaymentInformation: PaymentInformation;
    Service:            LabelImageFormat;
    Package:            Package[];
}

export interface Package {
    Packaging:     LabelImageFormat;
    PackageWeight: PackageWeight;
}

export interface PackageWeight {
    Weight:            string;
    UnitOfMeasurement: UnitOfMeasurement;
}

export interface UnitOfMeasurement {
    Code: string;
}

export interface PaymentInformation {
    ShipmentCharge: ShipmentCharge;
}

export interface ShipmentCharge {
    Type:        string;
    BillShipper: BillShipper;
}

export interface BillShipper {
    AccountNumber: string;
}

export interface Ship {
    Name:                    string;
    AttentionName:           string;
    Phone:                   Phone;
    FaxNumber:               string;
    TaxIdentificationNumber: string;
    Address:                 Address;
}

export interface Address {
    AddressLine: string;
    City:        string;
    PostalCode:  string;
    CountryCode: string;
}

export interface Phone {
    Number: string;
}

export interface Shipper {
    Name:          string;
    AttentionName: string;
    Phone:         Phone;
    ShipperNumber: string;
    Address:       Address;
}



export interface RespuestaEtiquetaUPS {
    LabelRecoveryResponse: LabelRecoveryResponse;
}

export interface LabelRecoveryResponse {
    Response:                     Response;
    ShipmentIdentificationNumber: string;
    LabelResults:                 LabelResults;
}

export interface LabelResults {
    TrackingNumber: string;
    LabelImage:     LabelImage;
    Receipt:        string;
}

export interface LabelImage {
    LabelImageFormat: LabelImageFormat;
    GraphicImage:     string;
    URL:              string;
}

export interface LabelImageFormat {
    Code: string;
}

export interface Response {
    ResponseStatus:       ResponseStatus;
    TransactionReference: TransactionReference;
}

export interface ResponseStatus {
    Code:        string;
    Description: string;
}

export interface TransactionReference {
    CustomerContext:       string;
    TransactionIdentifier: string;
}