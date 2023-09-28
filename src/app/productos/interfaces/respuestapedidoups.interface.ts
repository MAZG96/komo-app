export interface RespuestaPedidoUPS {
    ShipmentResponse: ShipmentResponse;
}

export interface ShipmentResponse {
    Response:        Response;
    ShipmentResults: ShipmentResults;
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

export interface ShipmentResults {
    ShipmentCharges:              ShipmentCharges;
    BillingWeight:                BillingWeight;
    ShipmentIdentificationNumber: string;
    PackageResults:               PackageResults;
}

export interface BillingWeight {
    UnitOfMeasurement: ResponseStatus;
    Weight:            string;
}

export interface PackageResults {
    TrackingNumber:        string;
    ServiceOptionsCharges: Charges;
    ShippingLabel:         ShippingLabel;
}

export interface Charges {
    CurrencyCode:  string;
    MonetaryValue: string;
}

export interface ShippingLabel {
    ImageFormat:  ResponseStatus;
    GraphicImage: string;
    HTMLImage:    string;
}

export interface ShipmentCharges {
    TransportationCharges: Charges;
    ServiceOptionsCharges: Charges;
    TotalCharges:          Charges;
}