export interface PrecioUPS {
    RateRequest: RateRequest;
}

export interface RateRequest {
    Request:  Request;
    Shipment: Shipment;
}

export interface Request {
    SubVersion:           string;
    TransactionReference: TransactionReference;
}

export interface TransactionReference {
    CustomerContext: string;
}

export interface Shipment {
    TaxInformationIndicator: string;
    ShipmentRatingOptions:   ShipmentRatingOptions;
    Shipper:                 Shipper;
    ShipTo:                  Ship;
    ShipFrom:                Ship;
    Service:                 Service;
    ShipmentTotalWeight:     ShipmentTotalWeight;
    Package:                 Package[];
}

export interface Package {
    PackagingType: Service;
    PackageWeight: PackageWeight;
}

export interface PackageWeight {
    UnitOfMeasurement: UnitOfMeasurement;
    Weight:            string;
}

export interface UnitOfMeasurement {
    Code: string;
}

export interface Service {
    Code:        string;
    Description: string;
}

export interface Ship {
    Name:    string;
    Address: Address;
}

export interface Address {
    AddressLine: string;
    City:        string;
    PostalCode:  string;
    CountryCode: string;
}

export interface ShipmentRatingOptions {
    NegotiatedRatesIndicator: string;
}

export interface ShipmentTotalWeight {
    UnitOfMeasurement: Service;
    Weight:            string;
}

export interface Shipper {
    Name:          string;
    ShipperNumber: string;
    Address:       Address;
}
