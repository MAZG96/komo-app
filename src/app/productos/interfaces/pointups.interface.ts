export interface UPSPoint {
    DropLocation: DropLocation[];
}

export interface DropLocation {
    LocationID:                  Comments;
    IVR:                         Ivr;
    Geocode:                     Geocode;
    AddressKeyFormat:            AddressKeyFormat;
    LocationAttribute:           LocationAttribute;
    Distance:                    Distance;
    SpecialInstructions:         SpecialInstructions;
    AdditionalChargeIndicator:   Indicator;
    StandardHoursOfOperation:    Comments;
    OperatingHours:              OperatingHours;
    Comments:                    Comments;
    SLIC:                        Comments;
    ServiceOfferingList:         ServiceOfferingList;
    DisplayPhoneNumberIndicator: Comments;
    AccessPointInformation:      AccessPointInformation;
    LocationNewIndicator:        Comments;
    WillCallLocationIndicator:   Comments;
    PromotionInformation?:       PromotionInformation[];
}

export interface AccessPointInformation {
    PublicAccessPointID:        Comments;
    ImageURL:                   Comments;
    BusinessClassificationList: BusinessClassificationList;
    AccessPointStatus:          AccessPointStatus;
}

export interface AccessPointStatus {
    Code:        Comments;
    Description: Comments;
}

export interface Comments {
    text: string;
}

export interface BusinessClassificationList {
    BusinessClassification: AccessPointStatus;
}

export interface Indicator {
}

export interface AddressKeyFormat {
    ConsigneeName:      Comments;
    AddressLine:        Comments;
    PoliticalDivision2: Comments;
    PostcodePrimaryLow: Comments;
    CountryCode:        Comments;
}

export interface Distance {
    Value:             Comments;
    UnitOfMeasurement: AccessPointStatus;
}

export interface Geocode {
    Latitude:  Comments;
    Longitude: Comments;
}

export interface Ivr {
    PhraseID: Comments;
}

export interface LocationAttribute {
    OptionType: AccessPointStatus;
    OptionCode: AccessPointStatus;
}

export interface OperatingHours {
    StandardHours: StandardHours;
}

export interface StandardHours {
    HoursType: Comments;
    DayOfWeek: Array<Array<Array<Array<Array<PurpleDayOfWeek[] | PurpleDayOfWeek> | PurpleDayOfWeek> | PurpleDayOfWeek> | PurpleDayOfWeek> | FluffyDayOfWeek>;
}

export interface PurpleDayOfWeek {
    Day:              Comments;
    OpenHours?:       Comments[] | Comments;
    CloseHours?:      Comments[] | Comments;
    ClosedIndicator?: Indicator;
}

export interface FluffyDayOfWeek {
    Day:              Comments;
    OpenHours?:       Comments;
    CloseHours?:      Comments;
    ClosedIndicator?: Indicator;
}

export interface PromotionInformation {
    Locale:    Comments;
    Promotion: Comments;
}

export interface ServiceOfferingList {
    ServiceOffering: Array<Array<Array<Array<Array<Array<AccessPointStatus[] | AccessPointStatus> | AccessPointStatus> | AccessPointStatus> | AccessPointStatus> | AccessPointStatus> | AccessPointStatus>;
}

export interface SpecialInstructions {
    Segment: Comments;
}
