import {
    PaymentSDKBillingDetails, PaymentSDKConfiguration, RNPaymentSDKLibrary
 } from '@paytabs/react-native-paytabs';

export function payWithCard(detail) {
    console.log(detail, "payWithCarddetail");
    return new Promise((resolve, reject) => {
        let configuration = new PaymentSDKConfiguration();
        configuration.profileID = detail?.profileID || '56491'
        configuration.serverKey = detail?.serverKey || 'SMJN92NJRN-JDHZZB6LK9-TZZ2TNGZGL'
        configuration.clientKey = detail?.clientKey || 'C6KM2B-2HBV6D-H992GB-MTPKRB'
        configuration.cartID = "-"
        configuration.currency = detail?.currency || "SAR"
        configuration.cartDescription = "-"
        configuration.merchantCountryCode = "SA"
        configuration.merchantName = detail?.merchantname || "Flowers Store"
        configuration.amount = Number(detail?.total_payable_amount)
        configuration.screenTitle = "Pay with Card"
        configuration.hideCardScanner = false
        configuration.showBillingInfo = true
        configuration.showShippingInfo = false

        let billingDetails = new PaymentSDKBillingDetails(
            '',
            'sandy.das11@gmail.com',
            '9878654322',
            'asdasd' || "xyz",
            'dasdsad' || "xyz",
            'dasdasdasd' || "xyz",
            "SA",
            "1234"
        )
        // configuration.billingDetails = billingDetails

        console.log(configuration, "configuration");


        RNPaymentSDKLibrary.startCardPayment(JSON.stringify(configuration)).then(result => {
            if (result["PaymentDetails"] != null) {
                let paymentDetails = result["PaymentDetails"]
                resolve(paymentDetails);
            } else if (result["Event"] == "CancelPayment") {
                // console.log("Cancel Payment Event")
                resolve("Cancel Payment Event")
            }
        }, function (error) {
            // console.log("payment", error)
            reject(error);
        });
    });
}

export async function payWithApplePay(detail) {
    let configuration = new PaymentSDKConfiguration();
    configuration.profileID = '56491'
    configuration.serverKey = 'SMJN92NJRN-JDHZZB6LK9-TZZ2TNGZGL'
    configuration.clientKey = 'C6KM2B-2HBV6D-H992GB-MTPKRB'
    configuration.cartID = "5445454454"
    configuration.currency = "INR"
    configuration.cartDescription = "Flowers"
    configuration.merchantCountryCode = "IN"
    configuration.merchantName = 'Sand Box'
    configuration.amount = 1;
    configuration.merchantIdentifier = 'merchant.com.app.sponge'

    RNPaymentSDKLibrary.startApplePayPayment(JSON.stringify(configuration)).then(result => {
        console.log("payment result", result)
        if (result["PaymentDetails"] != null) { // Handle transaction details
            let paymentDetails = result["PaymentDetails"]
            // console.log(paymentDetails)
            return paymentDetails
        } else if (result["Event"] == "CancelPayment") { // Handle events
            // console.log("Cancel Payment Event")
            return "Cancel Payment Event"
        }
    }, function (error) { // handle errors
        // console.log(error)
        return error
    });
}
