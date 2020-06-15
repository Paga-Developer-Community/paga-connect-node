const axios = require('axios')

 /**
 * @param   {string}  clientId         Business public ID from paga.
 * @param   {string}  password         Business password from paga.
 * @param   {boolean} flag             flag to set testing or live(true for test,false for live).
 * 
 */
function PagaConnectClient (build) {
  this.client_id = build.clientId
  this.password = build.password
  this.redirectUri = build.redirectUri
  this.test = build.test != null ? build.test : false
  this.scope = build.scope
  this.userData = build.userData

  const test_server = 'https://beta.mypaga.com'; // "https://qa1.mypaga.com";
  const live_server = 'https://www.mypaga.com';


  /**
     * @param {string} url Authorization code url  
     *  @param {string} credential 64 Byte encoding of both public ID and password with ':' in between them
     */
  this.buildRequest = async (url, credential, body=null) => {
    try {
    let headers = null;
    if (credential != null) {
      headers = {'content-type': 'application/json',
      'Accept': 'application/json',
      "Authorization" : credential
      }
    }
    const data = await axios({
      method: 'post',
      url: url,
      headers: headers,
      data: body == null ? null : body,
      timeout: 120000,
    });
    const {data:result} =  data
    return {result,isError:false};
    } catch (error) {
      const {response:{status,data}} = error;
      return {status,
              data,
              access_token:null,
              isError:true}; 
    }
  }

  /**
 * @param   {string}  authorizationCode         The code gotten from user's approval of Merchant's access to their Paga account.
 * @param   {string}  redirectUri               Where Merchant would like the user to the redirected to after receiving the access token.
 * @param   {boolean} scope                     List of activities to be performed with the access token.
 * @param   {Array}   userData                  List of user data to be collected.
 * 
 * @return {Promise}                            A Promise Object thats receives the response
 */
  this.getAccessToken = async (authorizationCode) => {
    const server = (this.test) ? test_server : live_server
    const access_token_url = '/paga-webservices/oauth2/token?';
    const buffer = Buffer.from(this.client_id + ":" + this.password).toString('base64');
    const credential = 'Basic ' + buffer;
    const endPointUrl =`${server}${access_token_url}grant_type=authorization_code&redirect_uri=${this.redirectUri}&code=${authorizationCode}&scope=${this.scope}&user_data=${this.userData}`      
    let response;
    try {
       response = await this.buildRequest(endPointUrl, credential);
    } catch (error) {
            response = {
                "errorCode" : -1,
                "exception" : error,
            }
        } finally {
            return response;
        }

  }

  
  /**
 * @param   {string} access_token         User's access token.
 * @param   {string} reference_number     A unique reference number provided by the client to uniquely identify the transaction.
 * @param   {Number} amount               Amount to charge the user.
 * @param   {Number} user_id              A unique identifier for merchant's customer.
 * @param   {string} product_code         Optional identifier for the product to be bought.
 * @param   {string} currency             The currency code of the transaction, NGN is the only supported currency as of now (February 2016).
 * 
 * @return {Promise}                      A Promise Object thats receives the response
 */
this.merchantPayment = async (access_token = null, reference_number, amount, user_id, product_code, currency) => {
  let response;
  

  try {
    const server = (this.test) ? test_server : live_server
    merchantPaymentUrl = server + "/paga-webservices/oauth2/secure/merchantPayment/"
    const credential = "Bearer " + access_token
    let endPointUrl;

    if (currency == null){
        endPointUrl = merchantPaymentUrl + "/referenceNumber/" + reference_number + "/amount/" +
        amount + "/merchantCustomerReference/" + user_id + "/merchantProductCode/" + product_code
    } 
    else if(currency == null && product_code == null){
        endPointUrl = merchantPaymentUrl + "/referenceNumber/" + reference_number + "/amount/" +
        amount + "/merchantCustomerReference/" + user_id
    }
    else {
        endPointUrl = merchantPaymentUrl + "/referenceNumber/" + reference_number + "/amount/" +
        amount + "/merchantCustomerReference/" + user_id + "/merchantProductCode/" + product_code + "/currency/" + currency
    }

     response = await this.buildRequest(endPointUrl, credential);
    } catch (error) {
      response = {
          "errorCode" : -1,
          "exception" : error,
      }
  } finally {
      return response;
  }

}


  /**
 * @param   {string} access_token         User's access token.
 * @param   {string} reference_number     A unique reference number provided by the client to uniquely identify the transaction.
 * @param   {Number} amount               Amount to charge the user.
 * @param   {Boolean} skipMessaging       Turn off Notification of User about payment made to their account.
 * 
 * @return {Promise}                      A Promise Object thats receives the response
 */
  this.moneyTransfer = async (access_token, reference_number, amount, skipMessaging, recipientCredential) => {
    const server = (this.test) ? test_server : live_server
    const moneyTransferUrl = `${server}/paga-webservices/oauth2/secure/moneyTransfer/v2?`;
    const credential = "Bearer " + access_token
    const endPointUrl = `${moneyTransferUrl}amount=${amount}&referenceNumber=${reference_number}&skipMessaging=${skipMessaging}&recipientCredential=${recipientCredential}`; 
    let response;
    try {
      response = await this.buildRequest(endPointUrl, credential)
    } catch (error) {
      response = {
          "errorCode" : -1,
          "exception" : error,
      }
  } finally {
      return response;
  }

  }

  /**
 * @param   {string} reference_number     A unique reference number provided by the client to uniquely identify the transaction.
 * 
 * @return {Promise}                      A Promise Object thats receives the response
 */
  this.getUserDetails = async (accessToken) => {
    const server = (this.test) ? test_server : live_server
    const getUserDetailsUrl = `${server}/paga-webservices/oauth2/secure/getUserDetails`
    const credential = `Bearer ${accessToken}`
    const endPointUrl = getUserDetailsUrl
    let response;
    try {
      response = await this.buildRequest(endPointUrl, credential)
    } catch (error) {
      response = {
          "errorCode" : -1,
          "exception" : error,
      }
  } finally {
      return response;
  }

  }
}

PagaConnectClient.Builder = () => {
  class Builder {
     setClientId(clientId) {
        this.clientId = clientId;
        return this;
     }
     setSecret(password){
        this.password = password;
        return this;
     }
     setRedirectUri(redirect){
        this.redirectUri = redirect;
        return this;
     }
     setScope(scopeArr){
        this.scope = [scopeArr];
        return this;
     }
     setUserData(userDataArr){
        this.userData = [userDataArr]
        return this;
     }
     setIsTest(flag){
        this.test = flag
        return this
     }
     build() {
        return new PagaConnectClient(this);
     }
  }
  return new Builder();
}

module.exports = PagaConnectClient


