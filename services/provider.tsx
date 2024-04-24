'use client'

import * as React from 'react'
import {
  GetSiweMessageOptions,
  RainbowKitSiweNextAuthProvider,
} from '@rainbow-me/rainbowkit-siwe-next-auth'
import { WagmiConfig, configureChains, createConfig } from 'wagmi'
import { Chain, RainbowKitProvider, connectorsForWallets, darkTheme } from '@rainbow-me/rainbowkit'
import {
  metaMaskWallet,
  trustWallet,
  coinbaseWallet,
  rainbowWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { mainnet, hardhat } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'

const bitfinity: Chain = {
  id: 355113,
  name: 'Bitfinity',
  network: 'bitfinity',
  iconUrl: 'https://bitfinity.network/logo.png',
  iconBackground: '#000000',
  nativeCurrency: {
    decimals: 18,
    name: 'Bitfinity',
    symbol: 'BFT',
  },
  rpcUrls: {
    public: { http: ['https://testnet.bitfinity.network'] },
    default: { http: ['https://testnet.bitfinity.network'] },
  },
  blockExplorers: {
    default: { name: 'Bitfinity Block Explorer', url: 'https://explorer.bitfinity.network/' },
    etherscan: { name: 'Bitfinity Block Explorer', url: 'https://explorer.bitfinity.network/' },
  },
  testnet: true,
}

const c4ei: Chain = {
  id: 21004,
  name: 'c4ei',
  network: 'c4ei',
  iconUrl: 'https://i.ibb.co/9ZgYSnP/c4ei.png',
  iconBackground: '#000000',
  nativeCurrency: {
    decimals: 18,
    name: 'c4ei',
    symbol: 'C4EI',
  },
  rpcUrls: {
    public: { http: ['https://rpc.c4ei.net'] },
    default: { http: ['https://rpc.c4ei.net'] },
  },
  blockExplorers: {
    default: { name: 'C4ei Explorer', url: 'https://exp.c4ei.net/' },
    etherscan: { name: 'C4ei Explorer', url: 'https://exp.c4ei.net/' },
  },
  testnet: false,
}

const aah: Chain = {
  id: 21133,
  name: 'AAH',
  network: 'AAH',
  iconUrl: 'https://i.ibb.co/VLXwBY3/AAH-256.png',
  iconBackground: '#000000',
  nativeCurrency: {
    decimals: 18,
    name: 'AAH',
    symbol: 'AAH',
  },
  rpcUrls: {
    public: { http: ['https://rpc.c4ex.net'] },
    default: { http: ['https://rpc.c4ex.net'] },
  },
  blockExplorers: {
    default: { name: 'AAH Explorer', url: 'https://exp.c4ex.net/' },
    etherscan: { name: 'AAH Explorer', url: 'https://exp.c4ex.net/' },
  },
  testnet: false,
}

const { chains, publicClient } = configureChains(
  [mainnet, bitfinity, c4ei, aah, hardhat],
  [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID as string }), publicProvider()]
)

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID as string

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      metaMaskWallet({ projectId, chains }),
      trustWallet({ projectId, chains }),
      coinbaseWallet({ appName: 'Coinbase', chains }),
      rainbowWallet({ projectId, chains }),
    ],
  },
])

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
})

const demoAppInfo = {
  appName: 'Dapp Funds dApp',
}

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: `
  Once you're signed in, you'll be able to access all of our dApp's features.
  Thank you for partnering with CrowdFunding!`,
})

export function Providers({
  children,
  pageProps,
}: {
  children: React.ReactNode
  pageProps: {
    session: Session
  }
}) {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  return (
    <WagmiConfig config={wagmiConfig}>
      <SessionProvider refetchInterval={0} session={pageProps.session}>
        <RainbowKitSiweNextAuthProvider getSiweMessageOptions={getSiweMessageOptions}>
          <RainbowKitProvider theme={darkTheme()} chains={chains} appInfo={demoAppInfo}>
            {mounted && children}
          </RainbowKitProvider>
        </RainbowKitSiweNextAuthProvider>
      </SessionProvider>
    </WagmiConfig>
  )
}
