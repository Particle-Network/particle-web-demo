# Particle Web Demo

This repository is [Auth Service](https://docs.particle.network/auth-service/introduction) sample source. It supports EVM-compatiable chains, more chains and more features coming soon! Learn more visit [Particle Network](https://docs.particle.network/).

Currently hosted [here](https://web-demo.particle.network).


## Getting Started

* Install [Node.js](https://nodejs.org/).
* Install [Yarn](https://classic.yarnpkg.com/en/docs/install#mac-stable)
* Run `yarn start`

Replace below config with the new values created in the [Dashboard](https://dashboard.particle.network/#/login).

```
const pn = new ParticleNetwork({
  projectId: process.env.REACT_APP_PROJECT_ID as string,
  clientKey: process.env.REACT_APP_CLIENT_KEY as string,
  appId: process.env.REACT_APP_APP_ID as string,
  chainName: "ethereum",
  chainId: 42,
});
```

## Features

1. Auth login with email or phone.
2. Send Transaction.
3. Personal sign.
4. Sign typed data.
5. Check our official dev docs: https://docs.particle.network/

## Docs

1. https://docs.particle.network/auth-service/sdks/web

## Give Feedback

Please report bugs or issues to [particle-web-demo/issues](https://github.com/Particle-Network/particle-web-demo/issues)

You can also join our [Discord](https://discord.gg/2y44qr6CR2).
