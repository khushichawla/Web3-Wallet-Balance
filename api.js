// --------------------------------------------------------------------
// --------------------------- Testing File ---------------------------
// --------------------------------------------------------------------

const theblockchainapi = require('theblockchainapi');

let defaultClient = theblockchainapi.ApiClient.instance;
let APIKeyID = defaultClient.authentications['APIKeyID'];
let APISecretKey = defaultClient.authentications['APISecretKey'];

APIKeyID.apiKey = 'rLZUEyjmAKoGxkn';
APISecretKey.apiKey = 'rOXXy829EQfKFgD';

const get_balance = async (public_key, mint_address) => {
    const my_balance_request = new theblockchainapi.BalanceRequest(); // BalanceRequest |
    my_balance_request.public_key = public_key;
    my_balance_request.mint_address = mint_address;
    my_balance_request.network = 'mainnet-beta';

    const opts = {
      'balanceRequest': my_balance_request
    };

    let my_balance_result = await new theblockchainapi.SolanaWalletApi().solanaGetBalance(opts).then((data) => {
      console.log('API called successfully.');
      return data;
    }, (error) => {
      console.error(error);
      return error;
    });
    return my_balance_result;
}

const main = async () => {
    balance_result = await get_balance(
        'GKNcUmNacSJo4S2Kq3DuYRYRGw3sNUfJ4tyqd198t6vQ', 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
    );
    console.log("USDC Balance Retrieved: ", balance_result);
    // document.getElementById('usdc-balance').textContent = balanceData.USDC;
}
main();