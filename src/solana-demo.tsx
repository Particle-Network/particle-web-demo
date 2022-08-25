import { ChainInfo } from "@particle-network/auth";
import { message } from "antd";
import { useEffect, useState } from "react";
import "./App.css";
import { chainSymbols } from "./chain-info";
import { particle, solanaWallet } from "./particle";

function SolanaDemo(props: any) {
  const { chainName, chainId, setLoginState } = props;

  const [connect, setConnect] = useState(false);
  const [address, setAddress] = useState("");
  const [nativeBalance, setNativeBalance] = useState("0");
  const [signTransactionResult, setSignTransactionResult] = useState("");
  const [signMessageResult, setSignMessageResult] = useState("");

  useEffect(() => {
    const c = particle.auth.isLogin() && particle.auth.walletExist();
    setConnect(c);
    if (c) {
      getBalance();
    }

    particle.auth.on("chainChanged", (info: ChainInfo) => {
      if (info.name === "solana") {
        getBalance();
      }
    });
  }, []);

  const nftMarketUrl = "https://web-nft-demo.particle.network";

  const connectWallet = () => {
    particle.auth
      .login()
      .then((accounts) => {
        setConnect(true);
        getBalance();
        setLoginState(true);
      })
      .catch((error: any) => {
        if (error.code !== 4011) {
          message.error(JSON.stringify(error));
        }
      });
  };

  const getBalance = () => {
    solanaWallet
      .getConnection()
      .getBalance(solanaWallet.publicKey)
      .then((result) => {
        console.log("getBalance", result);
        setNativeBalance((result / 1000000000).toFixed(4));
      });
  };

  const logout = () => {
    particle.auth
      .logout()
      .then(() => {
        console.log("logout success");
        setConnect(false);
        setNativeBalance("0");
        setLoginState(false);
      })
      .catch((err) => {
        console.log("logout error", err);
      });
  };

  const getAccounts = () => {
    if (solanaWallet.publicKey) {
      setAddress(solanaWallet.publicKey.toBase58());
    }
  };

  const signAndSendTransaction = () => {};
  const signTransaction = () => {};
  const signMessage = () => {};
  return (
    <div>
      <div className="native-balance">
        Balance: {nativeBalance} {chainSymbols[chainName]}
      </div>

      <div className="App-header">
        <a className="App-link" href={nftMarketUrl} target="_blank" rel="noopener noreferrer">
          Solana NFT Market Demo
        </a>
      </div>

      <div className="body-content">
        <div className="card-zero">
          <div className="title">Basic Actions</div>
          <div>
            <button className="blue-btn" onClick={connectWallet} disabled={connect}>
              CONNECT
            </button>
            <button className="blue-btn mgt" onClick={logout} disabled={!connect}>
              DISCONNECT
            </button>
          </div>
          <div>
            <button className="blue-btn" onClick={getAccounts} disabled={!connect}>
              ACCOUNTS
            </button>
          </div>
          <div className="content">public key: {address}</div>
        </div>

        {/* <div className="card-zero">
          <div className="title">Sign Transaction</div>
          <div>
            <button className="blue-btn" onClick={signAndSendTransaction} disabled={!connect}>
              Sign And Send Transaction
            </button>
            <button className="blue-btn mgt" onClick={signTransaction} disabled={!connect}>
              Sign Transaction
            </button>
            <div className="sign">Result: {signTransactionResult}</div>
          </div>
        </div>

        <div className="card-zero">
          <div className="title">Sign Message</div>
          <div>
            <button className="blue-btn" onClick={signMessage} disabled={!connect}>
              Sign Message
            </button>
          </div>
          <div className="sign">Result: {signMessageResult}</div>
        </div> */}
      </div>
    </div>
  );
}

export default SolanaDemo;
