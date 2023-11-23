import React from 'react';
import './index.scss';

const demos = [
  {
    name: 'Leveraging Smart WaaS with Pimlico',
    thumbnail: 'https://i.imgur.com/3w04ByD.jpg',
    thumbnailLink: 'https://particle-pimlico-demo.replit.app/',
    playLink: 'https://twitter.com/TABASCOweb3/status/1717549871811469450',
    githubLink: 'https://t.co/FWC4aphmE2',
  },
  {
    name: 'Account Kit Utilization with Particle WaaS',
    thumbnail: 'https://i.imgur.com/5pwg8vI.jpg',
    thumbnailLink: 'https://particle-account-kit.replit.app/',
    playLink: 'https://twitter.com/TABASCOweb3/status/1715034613184147721',
    githubLink: 'https://github.com/TABASCOatw/particle-account-kit-demo',
  },
  {
    name: 'Biconomy Paymasters with Particle WaaS',
    thumbnail: 'https://i.imgur.com/dlHEeQO.png',
    thumbnailLink: 'https://particle-account-kit.replit.app/',
    playLink: 'https://twitter.com/ParticleNtwrk/status/1712423989296214252',
    githubLink: 'https://github.com/TABASCOatw/particle-biconomy-example',
  },
  {
    name: 'Phantom & Particle Connection with Particle Connect',
    thumbnail: 'https://i.imgur.com/DcGjPTd.png',
    thumbnailLink: 'https://solana-particle-connect.replit.app/',
    playLink: 'https://twitter.com/TABASCOweb3/status/1715667302278918578',
    githubLink: 'https://github.com/TABASCOatw/particle-connect-boilerplate/blob/main/src/App-Solana.tsx',
  },
  {
    name: 'WaaS-enabled Avalanche DApp',
    thumbnail: 'https://i.imgur.com/6Eyisxj.png',
    thumbnailLink: 'https://particle-auth-avalanche-example.replit.app/',
    playLink: 'https://twitter.com/TABASCOweb3/status/1710546274435621330',
    githubLink: 'https://github.com/TABASCOatw/particle-auth-avalanche-example',
  },
  {
    name: 'Social Login with wallet-adapter & Particle Auth',
    thumbnail: 'https://i.imgur.com/NQlw1OT.png',
    thumbnailLink: 'https://particle-google-solana-demo.replit.app/',
    playLink: 'https://twitter.com/TABASCOweb3/status/1709900102494777414',
    githubLink: 'https://github.com/TABASCOatw/particle-solana-google-example',
  },
  {
    name: 'Gasless Transactions & Session Keys with Openfort',
    thumbnail: 'https://i.imgur.com/WcNFEfH.png',
    thumbnailLink: 'https://particle-openfort-demo.replit.app/',
    playLink: 'https://twitter.com/TABASCOweb3/status/1713146824511684855',
    githubLink: 'https://github.com/TABASCOatw/particle-openfort-demo',
  },
  {
    name: 'Using Particle WaaS with ZeroDev',
    thumbnail: 'https://i.imgur.com/244tUjY.png',
    thumbnailLink: 'https://particle-zerodev-demo.replit.app/',
    playLink: 'https://twitter.com/TABASCOweb3/status/1718184402969059421',
    githubLink: 'https://github.com/TABASCOatw/particle-zerodev-demo',
  },
  {
    name: 'Leveraging Smart WaaS on Fantom',
    thumbnail: 'https://i.imgur.com/VF3FMmh.png',
    thumbnailLink: 'https://particle-fantom-demo.replit.app/',
    playLink: 'https://twitter.com/TABASCOweb3/status/1727513542830526875',
    githubLink: 'https://github.com/TABASCOatw/particle-fantom-demo',
  },
];

const PageOther: React.FC = () => {
  return (
    <div className="page-container">
      <div className="header">
        <img src="https://i.imgur.com/R0Rv19y.png" alt="Particle Network Logo" className="logo-img" />
        <span className="demo-text">Particle Demo</span>
      </div>
      <div className="grid-container">
        {demos.map((demo, index) => (
          <div className="grid-item" key={index}>
            <div className="box">
              <a href={demo.thumbnailLink} target="_blank" rel="noopener noreferrer">
                <div className="thumbnail" style={{ backgroundImage: `url(${demo.thumbnail})` }}></div>
              </a>
              <div className="bottom-content">
                <div className="demo-name">{demo.name}</div>
                <div className="icon-container">
                  <a href={demo.playLink} target="_blank" rel="noopener noreferrer">
                    <button className="icon play-button"></button>
                  </a>
                  <a href={demo.githubLink} target="_blank" rel="noopener noreferrer">
                    <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub Logo" className="icon github-icon" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageOther;