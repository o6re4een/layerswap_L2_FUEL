import {
  importFuelAddresses,
  importPrivatesKeys,
} from "./src/heplers/accHelper";

import {
  LAYERSWAP_API,
  decryptAccounts,
  decryptPass,
  sourceChain,
  shuffleWallets,
} from "./const/config.const";

import { logger } from "./src/heplers/loggerHelper";
import { decryptPrivateKey } from "./src/heplers/decryptionHelper";
import { LayerSwapAuto } from "./src/LayerSwapAuto";
import { AutoAccount, Chains } from "./src/types";
import { shuffleArray } from "./src/heplers/general";
import { getWalletByPk } from "./src/heplers/web3Helper";

const wallets: AutoAccount[] = [];

async function main() {
  const privatesKeys = await importPrivatesKeys();
  const fuelAddresses = await importFuelAddresses();

  if (!LAYERSWAP_API) {
    logger.warn("LAYERSWAP | LAYERSWAP_API is not defined!");
    process.exit(0);
  }

  if (!(Array.isArray(privatesKeys) && privatesKeys.length)) {
    logger.warn(`LAYERSWAP | No wallets found.`);
    process.exit(0);
  }

  if (decryptAccounts) {
    if (decryptPass) {
      privatesKeys.forEach((privateKey, i) => {
        try {
          privatesKeys[i] = decryptPrivateKey(privateKey, decryptPass.trim());
          if (privateKey === "") throw new Error();
          logger.info(`PrivateKey[${i}] is decrypted successfull!`);
        } catch (e) {
          logger.warn(`PrivateKey[${i}] is can not decrypted!`);
          console.log(e);
        }
      });
    }
  }

  privatesKeys.forEach((privateKey, i) => {
    wallets.push({
      privateKey,
      destinationAddress: fuelAddresses[i],
      sourceAddress: getWalletByPk(privateKey).address,
    });
  });

  if (shuffleWallets) {
    shuffleArray(wallets);
  }

  const layerSwapAuto = new LayerSwapAuto(
    Chains[sourceChain],
    LAYERSWAP_API.trim(),
    wallets
  );
  await layerSwapAuto.auto();
}

main();
