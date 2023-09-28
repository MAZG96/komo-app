// To parse this data:
//
//   import { Convert, Welcome } from "./file";
//
//   const welcome = Convert.toWelcome(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.



export interface LocatorResponse {
    Response:      Response;
    SearchResults: SearchResults;
}

export interface Response {
    TransactionReference:      TransactionReference;
    ResponseStatusCode:        number;
    ResponseStatusDescription: string;
}

export interface TransactionReference {
    CustomerContext: string;
}

export interface SearchResults {
    DropLocation: DropLocation;
}

export interface DropLocation {
    LocationID:                  number;
    IVR:                         Ivr;
    Geocode:                     Geocode;
    AddressKeyFormat:            AddressKeyFormat;
    LocationAttribute:           LocationAttribute;
    Distance:                    Distance;
    SpecialInstructions:         SpecialInstructions;
    AdditionalChargeIndicator:   string;
    StandardHoursOfOperation:    string;
    OperatingHours:              OperatingHours;
    Comments:                    string;
    SLIC:                        number;
    PromotionInformation:        PromotionInformation[];
    ServiceOfferingList:         ServiceOfferingList;
    DisplayPhoneNumberIndicator: number;
    AccessPointInformation:      AccessPointInformation;
    LocationNewIndicator:        string;
    WillCallLocationIndicator:   string;
}

export interface AccessPointInformation {
    PublicAccessPointID:        string;
    ImageURL:                   string;
    BusinessClassificationList: BusinessClassificationList;
    AccessPointStatus:          AccessPointStatus;
}

export interface AccessPointStatus {
    Code:        number;
    Description: string;
}

export interface BusinessClassificationList {
    BusinessClassification: AccessPointStatus;
}

export interface AddressKeyFormat {
    ConsigneeName:      string;
    AddressLine:        string;
    PoliticalDivision2: string;
    PostcodePrimaryLow: number;
    CountryCode:        string;
}

export interface Distance {
    Value:             number;
    UnitOfMeasurement: UnitOfMeasurement;
}

export interface UnitOfMeasurement {
    Code:        string;
    Description: string;
}

export interface Geocode {
    Latitude:  number;
    Longitude: number;
}

export interface Ivr {
    PhraseID: number;
}

export interface LocationAttribute {
    OptionType: AccessPointStatus;
    OptionCode: AccessPointStatus;
}

export interface OperatingHours {
    StandardHours: StandardHours;
}

export interface StandardHours {
    HoursType: number;
    DayOfWeek: DayOfWeek[];
}

export interface DayOfWeek {
    Day:              number;
    ClosedIndicator?: string;
    OpenHours?:       number[];
    CloseHours?:      number[];
}

export interface PromotionInformation {
    Locale:    string;
    Promotion: string;
}

export interface ServiceOfferingList {
    ServiceOffering: AccessPointStatus[];
}

export interface SpecialInstructions {
    Segment: string;
}
