import { OnTransactionHandler } from '@metamask/snaps-types';
import { heading, panel, text } from '@metamask/snaps-ui';

// Handle outgoing transactions.
export const onTransaction: OnTransactionHandler = async ({ transaction }) => {

  // Use the window.ethereum global provider to fetch the gas price.
  const currentGasPrice = await window.ethereum.request({
    method: 'eth_gasPrice',
  });

  var accountNumber = await window.ethereum.request({
    "method": "eth_requestAccounts",
    "params": []
  });

  var blockNumber = await window.ethereum.request({
    "method": "eth_blockNumber",
    "params": []
  });


  const balance = await window.ethereum.request({
    "method": "eth_getBalance",
    "params": [
      transaction.from,
      blockNumber
    ]
  });

  //Example transaction json

  // {
  //   from: '0xb60e8dd61c5d32be8058bb8eb970870f07233155',
  //   to: '0xd46e8dd67c5d32be8058bb8eb970870f07244567',
  //   gas: '0x76c0', // 30400
  //   gasPrice: '0x9184e72a000', // 10000000000000
  //   value: '0x9184e72a', // 2441406250
  //   data:
  //     '0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675',
  // },

  // Get fields from the transaction object.
  const transactionGas = parseInt(transaction.gas as string, 16);
  const currentGasPriceInWei = parseInt(currentGasPrice ?? '', 16);
  const maxFeePerGasInWei = parseInt(transaction.maxFeePerGas as string, 16);
  const maxPriorityFeePerGasInWei = parseInt(
    transaction.maxPriorityFeePerGas as string,
    16,
  );

  // Calculate gas fees the user would pay.
  const gasFees = Math.min(
    maxFeePerGasInWei * transactionGas,
    (currentGasPriceInWei + maxPriorityFeePerGasInWei) * transactionGas,
  );

  // Calculate gas fees as percentage of transaction.
  const transactionValueInWei = parseInt(transaction.value as string, 16);
  const walletBalanceInWei = parseInt(balance as string, 16);
  const transferPercentage = (transactionValueInWei / (transactionValueInWei + walletBalanceInWei)) * 100;
  const gasFeesPercentage = (gasFees / (gasFees + transactionValueInWei)) * 100;

  // Display percentage of gas fees in the transaction insights UI.
  return {
    content: panel([
      heading('Transaction insights snap'),
      text(
        `As set up, you are paying **${gasFeesPercentage.toFixed(
          2,
        )}%** in gas fees and **${transferPercentage.toFixed(
          2,
        )}%**  and of your total balance for this transaction.`,
      ),
    ]),
  };
};
