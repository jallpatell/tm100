// Run this in browser console to check if contracts exist
// Copy and paste this entire code block

const checkContracts = async () => {
  const USDC_ADDRESS = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238';
  const VAULT_ADDRESS = '0x41FF192bC04DC850bf361b2Ad7e2a4F4B97a9E98';
  const SEPOLIA_RPC = 'https://rpc.sepolia.org';

  console.log('🔍 Checking contracts on Sepolia...\n');

  // Check USDC
  try {
    const usdcResponse = await fetch(SEPOLIA_RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getCode',
        params: [USDC_ADDRESS, 'latest'],
        id: 1
      })
    });
    const usdcData = await usdcResponse.json();
    const usdcExists = usdcData.result && usdcData.result !== '0x';
    
    console.log(`USDC (${USDC_ADDRESS}):`);
    console.log(usdcExists ? '✅ Contract exists' : '❌ Contract NOT found');
    console.log(`View: https://sepolia.etherscan.io/address/${USDC_ADDRESS}\n`);
  } catch (error) {
    console.error('❌ Error checking USDC:', error);
  }

  // Check Vault
  try {
    const vaultResponse = await fetch(SEPOLIA_RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getCode',
        params: [VAULT_ADDRESS, 'latest'],
        id: 2
      })
    });
    const vaultData = await vaultResponse.json();
    const vaultExists = vaultData.result && vaultData.result !== '0x';
    
    console.log(`Vault (${VAULT_ADDRESS}):`);
    console.log(vaultExists ? '✅ Contract exists' : '❌ Contract NOT found');
    console.log(`View: https://sepolia.etherscan.io/address/${VAULT_ADDRESS}\n`);
  } catch (error) {
    console.error('❌ Error checking Vault:', error);
  }

  console.log('\n📝 Next steps:');
  console.log('1. If contracts exist: Make sure you have Sepolia ETH and USDC');
  console.log('2. If contracts DON\'T exist: You need to deploy test contracts');
  console.log('3. Check your wallet is connected to Sepolia network');
};

checkContracts();
