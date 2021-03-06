import { ParticleNetwork } from "@particle-network/auth";
import { ParticleProvider } from "@particle-network/provider";
import { SolanaWallet } from "@particle-network/solana-wallet";

import Web3 from "web3";

const particle = new ParticleNetwork({
  projectId: process.env.REACT_APP_PROJECT_ID as string,
  clientKey: process.env.REACT_APP_CLIENT_KEY as string,
  appId: process.env.REACT_APP_APP_ID as string,
  chainName: "ethereum",
  chainId: 42,
  authUrl: process.env.REACT_APP_AUTH_URL as string,
});

//set rpcUrl for internal test
//@ts-ignore
const evmProvider = new ParticleProvider(
  particle.auth,
  process.env.REACT_APP_BASE_URL as string
);

//set rpcUrl for internal test
const solanaWallet = new SolanaWallet(
  particle.auth,
  process.env.REACT_APP_BASE_URL as string
);

//@ts-ignore
window.web3 = new Web3(evmProvider);

export { particle, evmProvider, solanaWallet };
