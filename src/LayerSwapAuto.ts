import {
  amountETH,
  amountPercent,
  rpcs,
  sleepFrom,
  sleepTo,
  usePercent,
} from "../const/config.const";
import { randomIntInRange, sleep } from "./heplers/general";
import { logger, newWallet } from "./heplers/loggerHelper";
import { getEthBalance, transferEth } from "./heplers/web3Helper";
import { AutoAccount, LayerSwapQuote, SwapData } from "./types";
import axios from "axios";

export class LayerSwapAuto {
  private source_chain: string | null;
  private destination_chain: string = "FUEL_MAINNET";
  private LAYERSWAP_API_KEY: string = "";
  private source_token: string = "ETH";
  private destination_token: string = "ETH";
  private selectedRpc = "";

  private accounts: AutoAccount[] = [];

  constructor(
    source_chain: string | null,
    LAYERSWAP_API_KEY: string,
    accounts: AutoAccount[]
  ) {
    this.source_chain = source_chain;
    this.LAYERSWAP_API_KEY = LAYERSWAP_API_KEY;
    this.selectedRpc = rpcs[0];
    this.accounts = accounts;
  }

  public async quote(
    amountETH: number,

    source_address: string
  ) {
    try {
      const { data } = await axios.get(
        `https://api.layerswap.io/api/v2/quote?source_network=${this.source_chain}&source_token=${this.source_token}&destination_network=${this.destination_chain}&destination_token=${this.destination_token}&source_address=${source_address}&use_deposit_address=false&amount=${amountETH}&refuel=false`,
        {
          headers: {
            "X-LS-APIKEY": this.LAYERSWAP_API_KEY,
            accept: "application/json",
          },
        }
      );
      // logger.info("data: ", data);
      const slippage = data.data.quote.slippage;
      return slippage;
    } catch (error) {
      console.log(error);
      process.exit(1);
      // logger.error(error);
    }
  }

  // public async proccessTransation() {
  //   await transferEth();
  // }

  public async createBridge(
    destinationAddress: string,
    sourceAddress: string,
    amountEth: number,
    slippage: number
  ): Promise<SwapData | null> {
    try {
      const { data } = await axios.post(
        "https://api.layerswap.io/api/v2/swaps",
        {
          destination_address: destinationAddress,
          source_network: "ARBITRUM_MAINNET",
          source_token: "ETH",
          destination_network: "FUEL_MAINNET",
          destination_token: "ETH",
          refuel: false,
          use_deposit_address: true,
          use_new_deposit_address: false,
          amount: amountEth,
          source_address: sourceAddress,
          slippage: slippage,
        },
        {
          headers: {
            "X-LS-APIKEY": this.LAYERSWAP_API_KEY,
            accept: "application/json",
            "content-type": "application/json",
          },
        }
      );

      const SwapData: LayerSwapQuote = data.data.deposit_actions[0];
      const res: SwapData = {
        amount: SwapData.amount,
        to_address: SwapData.to_address,
        chainId: SwapData.network.chain_id,
        amount_in_base_units: SwapData.amount_in_base_units,
      };
      return res;
    } catch (error) {
      logger.error(error);
      return null;
    }
  }
  public changeRpc() {
    logger.info(`Change RPC to ${this.selectedRpc}`);
    const selectedRpcIdx = randomIntInRange(0, rpcs.length);
    this.selectedRpc = rpcs[selectedRpcIdx];
  }

  async getAmount(walletAddress: string) {
    let amount = 0;
    if (usePercent) {
      const percent = randomIntInRange(amountPercent.min, amountPercent.max);
      let balance = await getEthBalance(walletAddress, this.selectedRpc);
      while (balance === null) {
        this.changeRpc();
        await sleep(5000);
        balance = await getEthBalance(walletAddress, this.selectedRpc);
      }
      // console.log(percent, balance);
      // @ts-ignore
      amount = Number((balance * BigInt(percent)) / BigInt(100)).toFixed(0);
      logger.info(
        `Use Amount | ${percent} % | ${(Number(amount) / 10 ** 18).toFixed(
          5
        )} ETH`
      );
    } else {
      amount = randomIntInRange(
        amountETH.min * 10 ** 18,
        amountETH.max * 10 ** 18
      );
      logger.info(`Use Amount | ${(Number(amount) / 10 ** 18).toFixed(5)} ETH`);
    }
    return Number(amount) / 10 ** 18;
  }

  public async auto() {
    for (const account of this.accounts) {
      await this.handleAccount(account);
    }
  }

  public async handleAccount(account: AutoAccount) {
    const timing = randomIntInRange(sleepFrom, sleepTo);

    let res = false;

    logger.info(newWallet);
    logger.info("LAYERSWAP | ACCOUNT | " + account.sourceAddress);
    const amount = await this.getAmount(account.sourceAddress);
    // console.log("amount", amount);
    const slippage = this.quote(amount, account.sourceAddress);

    let SwapData = await this.createBridge(
      account.destinationAddress,
      account.sourceAddress,
      amount,
      Number(slippage)
    );
    // console.log(SwapData);
    while (SwapData === null) {
      logger.error("LAYERSWAP | QUOTE ERROR | RETRY IN 5 SEC");
      await sleep(5000);
      SwapData = await this.createBridge(
        account.destinationAddress,
        account.sourceAddress,
        amount,
        Number(slippage)
      );
    }
    res = await transferEth(
      account.privateKey,
      amount,
      SwapData.to_address,
      this.selectedRpc
    );

    while (res === false) {
      logger.error("LAYERSWAP | TRANSFER ERROR | RETRY IN 5 SEC");
      this.changeRpc();
      await sleep(5000);

      res = await transferEth(
        account.privateKey,
        amount,
        SwapData.to_address,
        this.selectedRpc
      );
    }

    await sleep(timing);
  }
}
