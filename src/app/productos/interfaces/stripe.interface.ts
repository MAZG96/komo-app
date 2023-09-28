export interface RespuestaStripe {
    id:                              string;
    object:                          string;
    amount:                          number;
    amount_captured:                 number;
    amount_refunded:                 number;
    application:                     null;
    application_fee:                 null;
    application_fee_amount:          null;
    balance_transaction:             string;
    billing_details:                 BillingDetails;
    calculated_statement_descriptor: null;
    captured:                        boolean;
    created:                         number;
    currency:                        string;
    customer:                        null;
    description:                     string;
    disputed:                        boolean;
    failure_balance_transaction:     null;
    failure_code:                    null;
    failure_message:                 null;
    fraud_details:                   FraudDetails;
    invoice:                         null;
    livemode:                        boolean;
    metadata:                        FraudDetails;
    on_behalf_of:                    null;
    outcome:                         null;
    paid:                            boolean;
    payment_intent:                  null;
    payment_method:                  string;
    payment_method_details:          PaymentMethodDetails;
    receipt_email:                   null;
    receipt_number:                  null;
    receipt_url:                     string;
    refunded:                        boolean;
    refunds:                         Refunds;
    review:                          null;
    shipping:                        null;
    source_transfer:                 null;
    statement_descriptor:            null;
    statement_descriptor_suffix:     null;
    status:                          string;
    transfer_data:                   null;
    transfer_group:                  null;
}

export interface BillingDetails {
    address: Address;
    email:   null;
    name:    string;
    phone:   null;
}

export interface Address {
    city:        null;
    country:     null;
    line1:       null;
    line2:       null;
    postal_code: null;
    state:       null;
}

export interface FraudDetails {
}

export interface PaymentMethodDetails {
    card: Card;
    type: string;
}

export interface Card {
    brand:          string;
    checks:         Checks;
    country:        string;
    exp_month:      number;
    exp_year:       number;
    fingerprint:    string;
    funding:        string;
    installments:   null;
    last4:          string;
    mandate:        null;
    network:        string;
    three_d_secure: null;
    wallet:         null;
}

export interface Checks {
    address_line1_check:       null;
    address_postal_code_check: null;
    cvc_check:                 string;
}

export interface Refunds {
    object:   string;
    data:     any[];
    has_more: boolean;
    url:      string;
}
