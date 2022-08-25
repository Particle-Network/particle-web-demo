import Web3 from "web3";
import web3Modal from "./web3Modal";
import "./App.css";
import { useState } from "react";

function Web3ModalDemo(props: any) {
  const [account, setAccount] = useState<string>();

  const connectParticle = async () => {
    const provider = await web3Modal.connect();
    const web3 = new Web3(provider);
    const account = await web3.eth.requestAccounts();
    console.log("web3Modal particle provider requestAccounts", account);
    setAccount(account[0]);
  };

  return (
    <div className="connect-content">
      <button className="blue-btn connect-btn" onClick={connectParticle}>
        Connect With Web3Modal
      </button>
      {account && (
        <div className="mgt">
          <div className="mgt">Connect Success:</div>
          <div className="mgt">{account}</div>
        </div>
      )}
    </div>
  );
}

export default Web3ModalDemo;
