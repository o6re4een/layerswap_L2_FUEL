import { ethers, Transaction, TransactionRequest, Wallet } from "ethers";

import { rpcs } from "../../const/config.const";
import { logger } from "./loggerHelper";
import { sleep } from "./general";

export const getWalletByPk = (privateKey: string): Wallet => {
  const wallet = new Wallet(privateKey);
  return wallet;
};

export const getEthBalance = async (
  walletAddress: string,
  rpc: string
): Promise<bigint | null> => {
  let balance: bigint | null = null;

  try {
    const provider = new ethers.JsonRpcProvider(rpc);
    balance = await provider.getBalance(walletAddress);
  } catch (error) {
    logger.warn(`LAYERSWAP | RPC ERROR BALANCE | SLEEP 10 SEC | RPC ${rpcs}`);
  }

  return balance;
};

export const transferEth = async (
  pk: string,
  amountEth: number,
  to: string,
  rpc: string
): Promise<boolean> => {
  const wallet = getWalletByPk(pk);

  try {
    const provider = new ethers.JsonRpcProvider(rpc);
    const cWallet = wallet.connect(provider);

    //   const fees = await provider.getFeeData();
    //   console.log(fees);

    const fees = await provider.getFeeData();

    const tx: TransactionRequest = {
      to: to,
      value: ethers.parseEther(amountEth.toString()),
      from: cWallet.address,
      maxFeePerGas: fees.maxFeePerGas,
      nonce: await cWallet.getNonce(),
      maxPriorityFeePerGas: fees.maxPriorityFeePerGas,
      chainId: (await provider.getNetwork()).chainId,
    };

    //   console.log(await provider.getBlockNumber());
    const gasEst = await provider.estimateGas(tx);
    //   console.log(gasEst);
    tx.gasLimit = gasEst;

    const txHash = await cWallet.sendTransaction(tx);

    logger.info(
      `LAYERSWAP | SUCCESFULL | FROM ${
        cWallet.address
      } | ${amountEth.toString()} ETH | FEE ${ethers.formatEther(
        fees.maxFeePerGas! * gasEst
      )} ETH | TX ${txHash.hash}`
    );
    return true;
  } catch (error) {
    logger.error(
      `LAYERSWAP RPC ERROR TX | ${wallet.address} | SLEEP 5 SECONDS | RPC ${rpc}`
    );
    return false;
  }
};
