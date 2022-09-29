import { ethers } from "ethers";
import { ParticleNetwork } from "@particle-network/auth";
import { ParticleProvider } from "@particle-network/provider";
import { EVMProvider } from "@particle-network/local-provider";
import { SolanaWallet } from "@particle-network/solana-wallet";

import Web3 from "web3";

const particle = new ParticleNetwork({
  projectId: process.env.REACT_APP_PROJECT_ID as string,
  clientKey: process.env.REACT_APP_CLIENT_KEY as string,
  appId: process.env.REACT_APP_APP_ID as string,
  chainName: "Ethereum",
  chainId: 1,
  authUrl: process.env.REACT_APP_AUTH_URL as string, // use for demo internal test, developer can delete it.
});

particle.setAuthTheme({
  displayWallet: true,
  uiMode: "light",
});

//rpcUrl used fot demo internal test, developer can delete it.
//set rpcUrl for internal test
const particleProvider = new ParticleProvider(
  particle.auth,
  process.env.REACT_APP_BASE_URL ? process.env.REACT_APP_BASE_URL + "/evm-chain" : undefined
);

//set rpcUrl for internal test
const evmProvider = new EVMProvider(
  particle.auth,
  process.env.REACT_APP_BASE_URL ? process.env.REACT_APP_BASE_URL + "/evm-chain" : undefined
);

//set rpcUrl for internal test
const solanaWallet = new SolanaWallet(
  particle.auth,
  process.env.REACT_APP_BASE_URL ? process.env.REACT_APP_BASE_URL + "/solana" : undefined
);

window.web3 = new Web3(particleProvider as any);

const ethersProvider = new ethers.providers.Web3Provider(particleProvider, "any");

// The provider also allows signing transactions to
// send ether and pay to change state within the blockchain.
// For this, we need the account signer...
const ethersSigner = ethersProvider.getSigner();

// set debug for internal test, developer can remove it.
if (process.env.REACT_APP_PARTICLE_ENV === "development") {
  window.particle.debug = true;
}

export { particle, particleProvider, evmProvider, ethersProvider, ethersSigner, solanaWallet };
