// To parse this data:
//
//   import { Convert, Welcome } from "./file";
//
//   const welcome = Convert.toWelcome(json);

export interface Welcome {
    Envelope: Envelope;
}

export interface Envelope {
    Header: string;
    Body:   Body;
}

export interface Body {
    ShippingOptionsRequestResponse: ShippingOptionsRequestResponse;
}

export interface ShippingOptionsRequestResponse {
    RequestContainer: RequestContainer;
}

export interface RequestContainer {
    InternalReferenceID: string;
    Status:              string;
    ShippingOptions:     ShippingOptions;
    CanSeePrices:        boolean;
}

export interface ShippingOptions {
    ShippingOption: ShippingOption[];
}

export interface ShippingOption {
    Service:                 string;
    ServiceDesc:             string;
    CourierAccount:          number | string;
    Courier:                 string;
    CourierDesc:             string;
    CourierService:          string;
    CourierServiceDesc:      string;
    NetShipmentPrice:        number;
    NetShipmentTotalPrice:   number;
    CODAvailable:            boolean;
    InsuranceAvailable:      boolean;
    IdSubzone:               number;
    CustomDuties:            boolean;
    SubzoneDesc:             string;
    MBESafeValueAvailable:   boolean;
    GrossShipmentPrice:      number;
    GrossShipmentTotalPrice: number;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toWelcome(json: string): Welcome {
        return JSON.parse(json);
    }

    public static welcomeToJson(value: Welcome): string {
        return JSON.stringify(value);
    }
}
