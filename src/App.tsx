import "./App.css";
import Web3 from "web3";
import { Buffer } from "buffer";
import { bufferToHex, toChecksumAddress } from "ethereumjs-util";
import {
  recoverPersonalSignature,
  recoverTypedSignature,
  recoverTypedSignatureLegacy,
  recoverTypedSignature_v4,
} from "eth-sig-util";
import { useEffect, useState } from "react";
import { chainIds, chainNames, chainSymbols } from "./chain-info";
import { ParticleNetwork } from "@particle-network/provider";

const pn = new ParticleNetwork({
  projectId: process.env.REACT_APP_PROJECT_ID as string,
  clientKey: process.env.REACT_APP_CLIENT_KEY as string,
  appId: process.env.REACT_APP_APP_ID as string,
  chainName: "ethereum",
  chainId: 42,
  rpcUrl: process.env.REACT_APP_BASE_URL as string,
  authUrl: process.env.REACT_APP_AUTH_URL as string,
});

//@ts-ignore
window.web3 = new Web3(pn.getProvider());

function App() {
  const [connect, setConnect] = useState(false);
  const [address, setAddress] = useState("");
  const [personalSignResult, setPersonalSignResult] = useState("");
  const [signTypedDataV1Result, setSignTypedDataV1Result] = useState("");
  const [signTypedDataV3Result, setSignTypedDataV3Result] = useState("");
  const [signTypedDataV4Result, setSignTypedDataV4Result] = useState("");

  const [personalSignRecoveryResult, setPersonalSignRecoveryResult] =
    useState("");
  const [signTypedDataV1RecoveryResult, setSignTypedDataV1RecoveryResult] =
    useState("");
  const [signTypedDataV3RecoveryResult, setSignTypedDataV3RecoveryResult] =
    useState("");
  const [signTypedDataV4RecoveryResult, setSignTypedDataV4RecoveryResult] =
    useState("");

  const [chainId, setChainId] = useState(42);
  const [chainName, setChainName] = useState("ethereum");
  const [nativeBalance, setNativeBalance] = useState("");

  useEffect(() => {
    setConnect(pn.auth.isLogin());

    pn.getProvider().on("chainChanged", (chainId: string) => {
      console.log("chainChanged", chainId);
    });
    if (pn.auth.isLogin()) {
      getBalance();
    }
  }, []);

  const connectWallet = () => {
    pn.auth
      .login()
      .then((accounts) => {
        setConnect(pn.auth.isLogin());
        getBalance();
      })
      .catch((error: any) => {
        if (error.code !== 4011) {
          alert(JSON.stringify(error));
        }
      });
  };

  const getAccounts = () => {
    window.web3.eth.getAccounts((error, accounts) => {
      if (error) throw error;
      console.log(accounts);
      setAddress(accounts[0]);
    });
  };

  const getChainId = () => {
    window.web3.eth.getChainId((error, chainId) => {
      if (error) throw error;
      console.log("chainId", chainId);
    });
  };

  const getBalance = async () => {
    const accounts = await window.web3.eth.getAccounts();
    window.web3.eth.getBalance(accounts[0]).then((value) => {
      console.log("getBalance", window.web3.utils.fromWei(value, "ether"));
      setNativeBalance(window.web3.utils.fromWei(value, "ether"));
    });
  };

  const sendTransaction = async () => {
    const accounts = await window.web3.eth.getAccounts();
    const txnParams = {
      from: accounts[0],
      to: "0x16380a03F21E5a5E339c15BA8eBE581d194e0DB3",
      value: window.web3.utils.toWei("0.001", "ether"),
      gasLimit: 21000,
    };
    window.web3.eth.sendTransaction(txnParams, (error: any, hash) => {
      if (error) {
        if (error.code !== 4011) {
          alert(JSON.stringify(error));
        }
      } else {
        alert("send tx success: " + hash);
      }
    });
  };

  const sendLegacyTransaction = async () => {
    const accounts = await window.web3.eth.getAccounts();
    const txnParams = {
      from: accounts[0],
      to: "0x16380a03F21E5a5E339c15BA8eBE581d194e0DB3",
      value: window.web3.utils.toWei("0.001", "ether"),
      type: "0x0",
      gasLimit: 21000,
    };
    window.web3.eth.sendTransaction(txnParams, (error: any, hash) => {
      console.log("sendLegacyTransaction", error, hash);
      if (error) {
        if (error.code !== 4011) {
          alert(JSON.stringify(error));
        }
      } else {
        alert("send tx success: " + hash);
      }
    });
  };

  const sendERC20Transaction = async () => {
    const accounts = await window.web3.eth.getAccounts();
    const from = accounts[0];
    const method = "particle_abi_encodeFunctionCall";
    const params = [
      "0xFab46E002BbF0b4509813474841E0716E6730136",
      "erc20_transfer",
      ["0x16380a03F21E5a5E339c15BA8eBE581d194e0DB3", 100000],
    ];
    //@ts-ignore
    const result = await window.web3.currentProvider.request({
      method,
      params,
      from,
    });

    const estimate = await window.web3.eth.estimateGas({
      from: from,
      to: "0xFab46E002BbF0b4509813474841E0716E6730136",
      value: "0x0",
      data: result,
    });

    const txnParams = {
      from: accounts[0],
      to: "0x16380a03F21E5a5E339c15BA8eBE581d194e0DB3",
      value: "0x0",
      data: result,
      gasLimit: estimate,
    };
    window.web3.eth.sendTransaction(txnParams, (error: any, hash) => {
      if (error) {
        if (error.code !== 4011) {
          alert(JSON.stringify(error));
        }
      } else {
        alert("sendERC20Transaction success: " + hash);
      }
    });
  };

  const sendERC721Transaction = async () => {
    const accounts = await window.web3.eth.getAccounts();
    const from = accounts[0];
    const method = "particle_abi_encodeFunctionCall";

    const params = [
      "0xDF27A250c425Ba6721d399bf09259e6a089D6157",
      "erc721_safeTransferFrom",
      [from, "0x329a7f8b91Ce7479035cb1B5D62AB41845830Ce8", 1],
    ];
    //@ts-ignore
    const result = await window.web3.currentProvider.request({
      method,
      params,
      from,
    });

    const estimate = await window.web3.eth.estimateGas({
      from: from,
      to: "0xDF27A250c425Ba6721d399bf09259e6a089D6157",
      value: "0x0",
      data: result,
    });

    const txnParams = {
      from: from,
      to: "0x329a7f8b91Ce7479035cb1B5D62AB41845830Ce8",
      value: "0x0",
      data: result,
      gasLimit: estimate,
    };
    window.web3.eth.sendTransaction(txnParams, (error: any, hash) => {
      if (error) {
        if (error.code !== 4011) {
          alert(JSON.stringify(error));
        }
      } else {
        alert("sendERC721Transaction success: " + hash);
      }
    });
  };

  const sendERC1155Transaction = async () => {
    const accounts = await window.web3.eth.getAccounts();
    const from = accounts[0];
    const method = "particle_abi_encodeFunctionCall";

    const params = [
      "0xcCe924184139a75d312BD8CCE9df55d5f66F08e3",
      "erc1155_safeTransferFrom",
      [from, "0x329a7f8b91Ce7479035cb1B5D62AB41845830Ce8", 4, 1, "0x0"],
    ];
    //@ts-ignore
    const result = await window.web3.currentProvider.request({
      method,
      params,
      from,
    });

    const estimate = await window.web3.eth.estimateGas({
      from: from,
      to: "0xcCe924184139a75d312BD8CCE9df55d5f66F08e3",
      value: "0x0",
      data: result,
    });

    const txnParams = {
      from: from,
      to: "0x329a7f8b91Ce7479035cb1B5D62AB41845830Ce8",
      value: "0x0",
      data: result,
      gasLimit: estimate,
    };
    window.web3.eth.sendTransaction(txnParams, (error: any, hash) => {
      if (error) {
        if (error.code !== 4011) {
          alert(JSON.stringify(error));
        }
      } else {
        alert("sendERC1155Transaction success: " + hash);
      }
    });
  };

  const logout = () => {
    pn.auth
      .logout()
      .then(() => {
        console.log("logout success");
        setConnect(pn.auth.isLogin());
        setNativeBalance("");
      })
      .catch((err) => {
        console.log("logout error", err);
      });
  };

  const msgV1 = [
    {
      type: "string",
      name: "fullName",
      value: "John Doe",
    },
    {
      type: "uint32",
      name: "userId",
      value: "1234",
    },
  ];
  const signTypedDataV1 = async () => {
    const accounts = await window.web3.eth.getAccounts();
    const from = accounts[0];

    const params = [msgV1, from];
    const method = "eth_signTypedData_v1";

    window.web3.currentProvider //@ts-ignore
      .request({
        method,
        params,
        from,
      })
      .then((result) => {
        console.log("signTypedData result", result);
        setSignTypedDataV1Result(result);
      })
      .catch((err) => {
        console.log("signTypedData error", err);
      });
  };

  const signTypedDataV1Recovery = () => {
    if (!signTypedDataV1Result) {
      return;
    }

    const data = recoverTypedSignatureLegacy({
      data: msgV1,
      sig: signTypedDataV1Result,
    });
    setSignTypedDataV1RecoveryResult(toChecksumAddress(data));
  };

  const payloadV3 = {
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "verifyingContract", type: "address" },
      ],
      Person: [
        { name: "name", type: "string" },
        { name: "wallet", type: "address" },
      ],
      Mail: [
        { name: "from", type: "Person" },
        { name: "to", type: "Person" },
        { name: "contents", type: "string" },
      ],
    },
    primaryType: "Mail",
    domain: {
      name: "Ether Mail",
      version: "1",
      verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
    },
    message: {
      from: {
        name: "Cow",
        wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
      },
      to: {
        name: "Bob",
        wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
      },
      contents: "Hello, Bob!",
    },
  };

  const signTypedDataV3 = async () => {
    const accounts = await window.web3.eth.getAccounts();
    const from = accounts[0];
    const params = [from, payloadV3];
    const method = "eth_signTypedData_v3";

    window.web3.currentProvider //@ts-ignore
      .request({
        method,
        params,
        from,
      })
      .then((result) => {
        console.log("signTypedData_v3 result", result);
        setSignTypedDataV3Result(result);
      })
      .catch((err) => {
        console.log("signTypedData_v3 error", err);
      });
  };

  const signTypedDataV3Recovery = () => {
    if (!signTypedDataV3Result) {
      return;
    }
    const data = recoverTypedSignature({
      //@ts-ignore
      data: payloadV3,
      sig: signTypedDataV3Result,
    });
    setSignTypedDataV3RecoveryResult(toChecksumAddress(data));
  };

  const payloadV4 = {
    domain: {
      name: "Ether Mail",
      verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
      version: "1",
    },
    message: {
      contents: "Hello, Bob!",
      from: {
        name: "Cow",
        wallets: [
          "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
          "0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF",
        ],
      },
      to: [
        {
          name: "Bob",
          wallets: [
            "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
            "0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57",
            "0xB0B0b0b0b0b0B000000000000000000000000000",
          ],
        },
      ],
    },
    primaryType: "Mail",
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "verifyingContract", type: "address" },
      ],
      Group: [
        { name: "name", type: "string" },
        { name: "members", type: "Person[]" },
      ],
      Mail: [
        { name: "from", type: "Person" },
        { name: "to", type: "Person[]" },
        { name: "contents", type: "string" },
      ],
      Person: [
        { name: "name", type: "string" },
        { name: "wallets", type: "address[]" },
      ],
    },
  };

  const signTypedDataV4 = async () => {
    const accounts = await window.web3.eth.getAccounts();
    const from = accounts[0];

    const params = [from, payloadV4];
    const method = "eth_signTypedData_v4";

    window.web3.currentProvider //@ts-ignore
      .request({
        method,
        params,
        from,
      })
      .then((result) => {
        console.log("signTypedData_v4 result", result);
        setSignTypedDataV4Result(result);
      })
      .catch((err) => {
        console.log("signTypedData_v4 error", err);
      });
  };

  const signTypedDataV4Recovery = () => {
    if (!signTypedDataV4Result) {
      return;
    }

    const data = recoverTypedSignature_v4({
      //@ts-ignore
      data: payloadV4,
      sig: signTypedDataV4Result,
    });
    setSignTypedDataV4RecoveryResult(toChecksumAddress(data));
  };

  const personalSign = async () => {
    // Personal Sign
    const text = "Hello Particle Network!";
    const accounts = await window.web3.eth.getAccounts();
    const from = accounts[0];
    const msg = bufferToHex(Buffer.from(text, "utf8"));
    const params = [msg, from];
    const method = "personal_sign";

    window.web3.currentProvider //@ts-ignore
      .request({
        method,
        params,
        from,
      })
      .then((result) => {
        console.log("personal_sign", result);
        setPersonalSignResult(result);
      })
      .catch((error) => {
        console.error("personal_sign", error);
      });
  };

  const personalSignRecovery = () => {
    if (!personalSignResult) {
      return;
    }

    const text = "Hello Particle Network!";
    const msg = bufferToHex(Buffer.from(text, "utf8"));
    const data = recoverPersonalSignature({
      data: msg,
      sig: personalSignResult,
    });
    setPersonalSignRecoveryResult(toChecksumAddress(data));
  };

  const changeChainName = (e) => {
    const name = e.target.value;
    setChainName(name);
    const id = chainIds[name][0];
    setChainId(id);
    pn.setBlockchain({
      name: name,
      id: id,
    });
    getBalance();
  };

  const changeChainId = (e) => {
    const id = e.target.value;
    setChainId(id);
    pn.setBlockchain({
      id: id,
    });
    getBalance();
  };

  return (
    <div className="App">
      <header className="App-header">
        <a
          className="App-link"
          href="https://particle.network"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn More About Particle Network
        </a>
      </header>

      <div className="chain-config">
        <div className="chain-name">
          ChainName:
          <select
            className="selector-container"
            defaultValue={chainName}
            onChange={changeChainName}
          >
            {chainNames.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="chain-id">
          ChainId:
          <select
            className="selector-container"
            defaultValue={chainId}
            onChange={changeChainId}
          >
            {chainIds[chainName].map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="native-balance">
        Balance: {nativeBalance} {chainSymbols[chainName]}
      </div>

      <div className="body-content">
        <div className="card-zero">
          <div className="title">Basic Actions</div>
          <div>
            <button
              className="blue-btn"
              onClick={connectWallet}
              disabled={connect}
            >
              CONNECT
            </button>
            <button
              className="blue-btn mgt"
              onClick={logout}
              disabled={!connect}
            >
              DISCONNECT
            </button>
          </div>
          <div>
            <button
              className="blue-btn"
              onClick={getAccounts}
              disabled={!connect}
            >
              ETH_ACCOUNTS
            </button>
          </div>
          <div className="content">eth_accounts result: {address}</div>
        </div>

        <div className="card-zero">
          <div className="title">Send Eth</div>
          <div>
            <button
              className="blue-btn"
              onClick={sendLegacyTransaction}
              disabled={!connect}
            >
              SEND LEGACY TRANSACTION
            </button>
            <button
              className="blue-btn mgt"
              onClick={sendTransaction}
              disabled={!connect}
            >
              SEND EIP 1559 TRANSACTION
            </button>
          </div>
        </div>

        <div className="card-zero">
          <div className="title">Send Tokens</div>
          <div>
            <button
              className="blue-btn"
              onClick={sendERC20Transaction}
              disabled={!connect}
            >
              TRANSFER ERC 20 TOKENS
            </button>
            <button
              className="blue-btn mgt"
              onClick={sendERC721Transaction}
              disabled={!connect}
            >
              TRANSFER ERC 721 TOKENS
            </button>
            <button
              className="blue-btn mgt"
              onClick={sendERC1155Transaction}
              disabled={!connect}
            >
              TRANSFER ERC 1155 TOKENS
            </button>
          </div>
        </div>

        <div className="card-zero">
          <div className="title">Person Sign</div>
          <div>
            <button
              className="blue-btn"
              onClick={personalSign}
              disabled={!connect}
            >
              SIGN
            </button>
          </div>
          <div className="sign">Result: {personalSignResult}</div>
          <div>
            <button className="blue-btn" onClick={personalSignRecovery}>
              VERIFY
            </button>
          </div>
          <div className="sign">
            recovery result: {personalSignRecoveryResult}
          </div>
        </div>

        <div className="card-zero">
          <div className="title">Sign Typed Data (V1)</div>
          <div>
            <button
              className="blue-btn"
              onClick={signTypedDataV1}
              disabled={!connect}
            >
              SIGN
            </button>
          </div>
          <div className="sign">Result: {signTypedDataV1Result}</div>
          <div>
            <button className="blue-btn" onClick={signTypedDataV1Recovery}>
              VERIFY
            </button>
          </div>
          <div className="sign">
            Recovery result: {signTypedDataV1RecoveryResult}
          </div>
        </div>

        <div className="card-zero">
          <div className="title">Sign Typed Data V3</div>
          <div>
            <button
              className="blue-btn"
              onClick={signTypedDataV3}
              disabled={!connect}
            >
              SIGN
            </button>
          </div>
          <div className="sign">Result: {signTypedDataV3Result}</div>
          <div>
            <button className="blue-btn" onClick={signTypedDataV3Recovery}>
              VERIFY
            </button>
          </div>
          <div className="sign">
            Recovery result: {signTypedDataV3RecoveryResult}
          </div>
        </div>

        <div className="card-zero">
          <div className="title">Sign Typed Data V4</div>
          <div>
            <button
              className="blue-btn"
              onClick={signTypedDataV4}
              disabled={!connect}
            >
              SIGN
            </button>
          </div>
          <div className="sign">Result: {signTypedDataV4Result}</div>
          <div>
            <button className="blue-btn" onClick={signTypedDataV4Recovery}>
              VERIFY
            </button>
          </div>
          <div className="sign">
            Recovery result: {signTypedDataV4RecoveryResult}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
