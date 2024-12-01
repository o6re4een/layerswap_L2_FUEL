import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";
import * as stream from "stream";
import { once } from "events";

const __dirpath = path.resolve();
// const __dirname = path.resolve();

export const importPrivatesKeys = async (): Promise<string[]> => {
  const privateKeys: string[] = [];

  const instream = fs.createReadStream(path.join(__dirpath, "./wallets.txt"));
  const outstream = new stream.Stream();

  // @ts-ignore
  const rl = readline.createInterface(instream, outstream);

  rl.on("line", (line) => {
    privateKeys.push(line);
  });

  await once(rl, "close");

  return privateKeys;
};

export const importFuelAddresses = async (): Promise<string[]> => {
  const fuelAddresses: string[] = [];

  const instream = fs.createReadStream(
    path.join(__dirpath, "./destinations.txt")
  );
  const outstream = new stream.Stream();

  // @ts-ignore
  const rl = readline.createInterface(instream, outstream);

  rl.on("line", (line) => {
    fuelAddresses.push(line);
  });
  await once(rl, "close");
  return fuelAddresses;
};
