import { ParticleNetwork } from '@particle-network/auth';
import { ParticleProvider } from '@particle-network/provider';
import WalletConnect from '@walletconnect/legacy-provider';
import Web3Modal from 'web3modal';
import { facebookIcon, googleIcon, particleIcon, twitterIcon } from './icons';

const createWeb3Modal = (particle: ParticleNetwork) => {
    const particleProvider = new ParticleProvider(particle.auth);
    const web3Modal = new Web3Modal({
        cacheProvider: true, // optional
        providerOptions: {
            'custom-particle': {
                display: {
                    logo: particleIcon,
                    name: 'Social Media',
                    description: 'Connect to TSS Wallet by Social Accounts',
                },
                package: 'ParticleProvider',
                connector: async () => {
                    if (!particle.auth.isLogin()) {
                        // custom particle login params
                        await particle.auth.login({
                            preferredAuthType: 'email',
                            supportAuthTypes: 'all',
                        });
                    }

                    return particleProvider;
                },
            },
            'custom-particle-google': {
                display: {
                    logo: googleIcon,
                    name: 'Google',
                    description: 'Connect to TSS Wallet by Google',
                },
                package: ParticleProvider,
                connector: async () => {
                    if (!particle.auth.isLogin()) {
                        await particle.auth.login({
                            preferredAuthType: 'google',
                        });
                    }
                    return particleProvider;
                },
            },
            'custom-particle-facebook': {
                display: {
                    logo: facebookIcon,
                    name: 'Facebook',
                    description: 'Connect to TSS Wallet by Facebook',
                },
                package: ParticleProvider,
                connector: async () => {
                    if (!particle.auth.isLogin()) {
                        await particle.auth.login({
                            preferredAuthType: 'facebook',
                        });
                    }
                    return particleProvider;
                },
            },
            'custom-particle-twitter': {
                display: {
                    logo: twitterIcon,
                    name: 'Twitter',
                    description: 'Connect to TSS Wallet by Twitter',
                },
                package: ParticleProvider,
                connector: async () => {
                    if (!particle.auth.isLogin()) {
                        await particle.auth.login({
                            preferredAuthType: 'twitter',
                        });
                    }
                    return particleProvider;
                },
            },
            walletconnect: {
                package: WalletConnect,
                options: {
                    infuraId: process.env.REACT_APP_INFURA_ID as string,
                },
            },
        }, // required
    });
    return web3Modal;
};

export default createWeb3Modal;
