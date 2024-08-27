const express = require('express');
const axios = require('axios');
const moment = require('moment');
const theblockchainapi = require('theblockchainapi');
const { ClassNames } = require('@emotion/react');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

let defaultClient = theblockchainapi.ApiClient.instance;
let APIKeyID = defaultClient.authentications['APIKeyID'];
let APISecretKey = defaultClient.authentications['APISecretKey'];

// API Key for blockhainapi
APIKeyID.apiKey = 'rLZUEyjmAKoGxkn';
APISecretKey.apiKey = 'rOXXy829EQfKFgD';

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/wallet-balance', async (req, res) => {
  const walletAddress = req.body.walletAddress;
  const mint_address = req.body.mint_address;
  try {
    const balanceData = await fetchWalletBalance(walletAddress, mint_address);
    res.json(balanceData);
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    res.status(500).json({ error: 'Error fetching wallet balance' });
  }
});

app.get('/wallet-summary/:walletAddress', async (req, res) => {
    const walletAddress = req.params.walletAddress;
  const startTime = moment().subtract(1, 'day').format('DD-MM-YYYY');
  const endTime = moment().format('DD-MM-YYYY');

  try {
    const [usdcResponse, usdtResponse, ethResponse] = await Promise.all([
      axios.get(`https://api.coingecko.com/api/v3/coins/usd-coin/market_chart?vs_currency=usd&address=${walletAddress}&from=${startTime}&to=${endTime}`),
      axios.get(`https://api.coingecko.com/api/v3/coins/tether/market_chart?vs_currency=usd&address=${walletAddress}&from=${startTime}&to=${endTime}`),
      axios.get(`https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&address=${walletAddress}&from=${startTime}&to=${endTime}`)
    ]);

    let totalUSDC = 0;
    let totalUSDT = 0;
    let totalETH = 0;

    usdcResponse.data.total_volume.forEach(volume => {
      totalUSDC += volume;
    });

    usdtResponse.data.total_volume.forEach(volume => {
      totalUSDT += volume;
    });

    ethResponse.data.total_volume.forEach(volume => {
      totalETH += volume;
    });

    res.json({
      walletAddress,
      totalUSDC,
      totalUSDT,
      totalETH
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the data.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// ----------------------------------------------------------------------------
// --------------------------- Fetch wallet balance ---------------------------
// ----------------------------------------------------------------------------

async function fetchWalletBalance(walletAddress, mint_address) {
    const my_balance_request = new theblockchainapi.BalanceRequest(); // BalanceRequest |
    my_balance_request.public_key = walletAddress;
    my_balance_request.mint_address = mint_address;
    my_balance_request.network = 'mainnet-beta';
    const opts = {
      'balanceRequest': my_balance_request
    };

    let my_balance_result = await new theblockchainapi.SolanaWalletApi().solanaGetBalance(opts).then((data) => {
      console.log('API called successfully in app.js.');
      return data;
    }, (error) => {
      console.error(error);
      return error;
    });

    return my_balance_result;
}