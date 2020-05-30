'use strict';
const PagaConnectClient = require('../PagaConnectClient')
const expect  = require('chai').expect;

var pagaClient = PagaConnectClient.Builder()
    .setClientId("A3878DC1-F07D-48E7-AA59-8276C3C26647")
    .setSecret("yU9@j%ggnm2P846")
    .setRedirectUri("http://localhost:9000/video/pagaconnect")
    .setScope("USER_DEPOSIT_FROM_CARD MERCHANT_PAYMENT USER_DETAILS_REQUEST")
    .setUserData("FIRST_NAME+LAST_NAME+USERNAME+EMAIL+ACCOUNT_BALANCE")
    .setIsTest(true)
    .build();

describe('#ConnectFunctionsTest', function() {

    it("Should getaccesstoken", function (done) {
        pagaClient.getAccessToken('Jl6ISc').then(function(body){
            expect(body.data).to.have.property('access_token');
            expect(body.data).to.have.property('token_type');
            expect(body.data).to.have.property('refresh_token');
            expect(body.data).to.have.property('expires_in');
            expect(body.data).to.have.property('scope');
            expect(body.data).to.have.property('user_data');
            expect(body.data).to.have.property('authorities');
        done();
    })
})

    it("Should complete merchantPayment", function (done) {
        pagaClient.merchantPayment("25ec15a1-4d9b-4ef1-8ace-e34e0fc50f15", "43673583", 500, 13, "fw8y2fi2v", "NGN").then(function(body){
            expect(body.data).to.have.property('merchantPaymentResult');
            expect(body.data.merchantPaymentResult).to.have.property('errorCode');
            expect(body.data.merchantPaymentResult).to.have.property('errorMessage');
            expect(body.data.merchantPaymentResult).to.have.property('amount');
            expect(body.data.merchantPaymentResult).to.have.property('confirmationCode');
            expect(body.data.merchantPaymentResult).to.have.property('agentCommission');
            expect(body.data.merchantPaymentResult).to.have.property('fee');
            expect(body.data.merchantPaymentResult).to.have.property('currency');
            expect(body.data.merchantPaymentResult).to.have.property('exchangeRate');
        done();
    })
})

    it("Should complete moneyTransfer", function (done) {
        pagaClient.moneyTransfer("25ec15a1-4d9b-4ef1-8ace-e34e0fc50f15", "5462835", 200, false, "07030280000").then(function(body){
            expect(body.data).to.have.property('errorMessage');
            expect(body.data).to.have.property('errorCode');
            expect(body.data).to.have.property('transactionId');
            expect(body.data).to.have.property('amount');
            expect(body.data).to.have.property('fee');
            expect(body.data).to.have.property('currency');
            expect(body.data).to.have.property('exchangeRate');
            expect(body.data).to.have.property('externalReferenceNumber');
        done(); 
    })
})

    it("Should getUserDetails", function (done) {
        pagaClient.getUserDetails("25ec15a1-4d9b-4ef1-8ace-e34e0fc50f15", "0o5462835").then(function(body){
            expect(body.data).to.have.property('detailsResult');
            expect(body.data.detailsResult).to.have.property('errorCode');
            expect(body.data.detailsResult).to.have.property('errorMessage');
            expect(body.data.detailsResult).to.have.property('details');
        done();
    })
})
})

   