import "./App.css";
import { useState } from "react";
import { chainNames } from "./chain-info";
import { particle } from "./particle";
import { ChainName, supportChains } from "@particle-network/auth";
import EVMDemo from "./evm-demo";
import SolanaDemo from "./solana-demo";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Switch } from "antd";

function App() {
  const [loginState, setLoginState] = useState(false);
  const [chainId, setChainId] = useState(42);
  const [loginFormMode, setLoginFormMode] = useState(!!localStorage.getItem("loginFormMode"));
  const [chainName, setChainName] = useState<ChainName>("ethereum");

  useEffect(() => {
    setLoginState(particle.auth.isLogin());
  }, []);

  const changeChainName = async (e) => {
    const name = e.target.value;

    const id = supportChains[name][0];
    try {
      await particle.auth.setChainInfo({
        name: name,
        id: id,
      });
      setChainName(name);
      setChainId(id);
    } catch (error) {
      console.log(error);
    }
  };

  const changeChainId = async (e) => {
    const id = e.target.value;
    try {
      await particle.auth.setChainInfo({
        name: chainName,
        id: Number(id),
      });
      setChainId(Number(id));
    } catch (error) {
      console.log(error);
    }
  };

  const onThemeChange = (checked: boolean) => {
    console.log("onThemeChange", checked);
    if (checked) {
      particle.setAuthTheme({ uiMode: "light" });
    } else {
      particle.setAuthTheme({ uiMode: "dark" });
    }
  };

  const onLoginFormChange = (checked: boolean) => {
    setLoginFormMode(checked);
    localStorage.setItem("loginFormMode", checked ? "checked" : "");
  };

  useEffect(() => {
    const classList = document.querySelector("body").classList;
    if (loginFormMode) {
      classList.add("mini-login-form");
    } else {
      classList.remove("mini-login-form");
    }
  }, [loginFormMode]);

  return (
    <div className="App">
      <header className="App-header">
        <a className="App-link" href="https://particle.network" target="_blank" rel="noopener noreferrer">
          Learn More About Particle Network
        </a>
        <a
          className="App-link"
          href="https://static.particle.network/sdks/web/index.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          Particle SDK Browser Sample
        </a>
        <Link className="App-link" to="/web3Modal">
          Web3Modal Sample
        </Link>

        <Switch
          className="App-theme"
          checkedChildren="light"
          unCheckedChildren="dark"
          onChange={onThemeChange}
          defaultChecked
        />

        <Switch
          className="Login-mode"
          checkedChildren="form"
          unCheckedChildren="full"
          checked={!!loginFormMode}
          onChange={onLoginFormChange}
        />
      </header>

      <div className="chain-config">
        <div className="chain-name">
          ChainName:
          <select
            className="selector-container"
            defaultValue={chainName}
            onChange={changeChainName}
            disabled={!loginState}
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
          <select className="selector-container" defaultValue={chainId} onChange={changeChainId} disabled={!loginState}>
            {supportChains[chainName].map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>
      {chainName === "solana" ? (
        <SolanaDemo chainName={chainName} loginFormMode={loginFormMode} setLoginState={setLoginState} />
      ) : (
        <EVMDemo chainName={chainName} loginFormMode={loginFormMode} setLoginState={setLoginState} />
      )}
    </div>
  );
}

export default App;
