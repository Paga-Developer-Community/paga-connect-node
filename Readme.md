# PagaConnect Nodejs API Library v1.0.3

## Connect Services exposed by the library

- getAccessToken
- merchantPayment
- moneyTransfer
- getUserDetails

For more information on the services listed above, visit the [Paga DEV website](https://mypaga.readme.io/docs/node-library)

## How to use

`npm install paga-connect`

 
```
const PagaConnect = require('paga-connect')

var pagaConnectClient = PagaConnect.Builder()
    .setClientId("<Paga_Client_ID>")
    .setSecret("<Paga_Client_Secret>")
    .setRedirectUri("<Your_Callback_URL>")
    .setScope("USER_DEPOSIT_FROM_CARD MERCHANT_PAYMENT USER_DETAILS_REQUEST")
    .setUserData("FIRST_NAME+LAST_NAME+USERNAME+EMAIL+ACCOUNT_BALANCE")
    .setIsTest(true)
    .build();
```

As shown above, you set the principal and credential given to you by Paga, If you pass true as the value for setIsTest(), the library will use the test url as the base for all calls. Otherwise setting it to false will use the live url value you **pass** as the base. 

### Connect Service Functions

**Merchant Payments**

This is the operation executed to make a payment to you on behalf of the customer. To make use of this function, call the getAccessToken inside the ConnectClient which will return a JSONObject with the access token which will be used to complete payment.

To get Access tokens, Use the authorization code gotten from the call to the backend :

```
pagaConnectClient.getAccessToken(authorization_code).then(response => {
    console.log("Response: " + JSON.stringify(response))
})
```
Access Token is used in making merchant payment like this:

```
pagaConnectClient.merchantPayment(response['access_token'], 1, 500, 1, '1wxew', 'NGN').then(resp => {
    console.log("Payment made with response data: " + JSON.stringify(resp))
})
```

**Money Transfer**

This operation allows you to credit a user's paga account. To make use of this function, call the moneyTransfer inside the ConnectClient which will return a JSONObject.


```
pagaConnectClient.moneyTransfer(response['access_token'], 'reference_number', amount, skipMessaging, recipientCredential).then(response => {
    console.log("Response: " + JSON.stringify(response))
})
```
**Get User Details**

This Operation allows the client to get the user's personal details. The data requested is included in the authentication and authorization request in the data parameter. Additionally, the scope parameter must contain the USER_DETAILS_REQUEST option. To make use of this function, call the getUserDetails inside the ConnectClient which will return a JSONObject with user details.


```
pagaConnectClient.getUserDetails(response['access_token'],'reference_number').then(response => {
    console.log("User Details Response: " + JSON.stringify(response))
})
```
![GitHub package.json version](https://img.shields.io/github/package-json/v/pagadevcomm/paga-connect-node?style=plastic)
![npm](https://img.shields.io/npm/v/paga-connect?style=plastic)
![npm](https://img.shields.io/npm/dm/paga-connect?style=plastic)
![NPM](https://img.shields.io/npm/l/paga-connect?style=plastic)