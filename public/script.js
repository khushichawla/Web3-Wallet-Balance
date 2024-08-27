const walletInput = document.getElementById('wallet-input');
const searchBtn = document.getElementById('search-btn');

searchBtn.addEventListener('click', async () => {
  const walletAddress = walletInput.value;
  const mint_address_USDC = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
  const mint_address_ETH = '7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs';
  const mint_address_USDT = 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB';
  if (walletAddress) {
    try {
      const balanceDataUSDC = await fetchWalletBalance(walletAddress, mint_address_USDC);
      const balanceDataETH = await fetchWalletBalance(walletAddress, mint_address_ETH);
      const balanceDataUSDT = await fetchWalletBalance(walletAddress, mint_address_USDT);
      document.getElementById('usdc-balance').innerHTML = balanceDataUSDC.balance;
      document.getElementById('eth-balance').innerHTML = balanceDataETH.balance;
      document.getElementById('usdt-balance').innerHTML = balanceDataUSDT.balance;

      const transferSummary = await fetchTransferSummary(walletAddress);
      document.getElementById('usdc-transfer').innerHTML = transferSummary.totalUSDC.toFixed(2);
      document.getElementById('eth-transfer').innerHTML = transferSummary.totalETH.toFixed(2);
      document.getElementById('usdt-transfer').innerHTML = transferSummary.totalUSDT.toFixed(2);
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      alert('Error fetching wallet balance');
    }
  } else {
    alert('Please enter a wallet address');
  }
});

async function fetchWalletBalance(walletAddress, mint_address) {
  try {
    const response = await fetch('/wallet-balance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ walletAddress, mint_address })
    });

    if (!response.ok) {
      throw new Error('Error fetching wallet balance');
    }

    const balanceData = await response.json();
    return balanceData;
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    throw error;
  }
}

async function fetchTransferSummary(walletAddress) {
  try {
    const response = await fetch(`/wallet-summary/${walletAddress}`);

    if (!response.ok) {
      throw new Error('Error fetching transfer summary');
    }

    const transferSummary = await response.json();
    return transferSummary;
  } catch (error) {
    console.error('Error fetching transfer summary:', error);
    throw error;
  }
}