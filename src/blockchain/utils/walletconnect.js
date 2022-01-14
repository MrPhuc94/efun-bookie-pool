import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import {
  BLOCKCHAIN_NETWORK_WALLETCONNECT,
  REACT_APP_BLOCKCHAIN_RPC_NETWORK_MAINNET,
  REACT_APP_BLOCKCHAIN_RPC_NETWORK,
} from "src/common/Environment";

export const getWeb3walletConnect = async () => {
  try {
    const rpc =
      BLOCKCHAIN_NETWORK_WALLETCONNECT === "MAINNET"
        ? { 56: REACT_APP_BLOCKCHAIN_RPC_NETWORK_MAINNET }
        : { 97: REACT_APP_BLOCKCHAIN_RPC_NETWORK };
    const provider = new WalletConnectProvider({
      chainId: BLOCKCHAIN_NETWORK_WALLETCONNECT === "MAINNET" ? 56 : 97,
      rpc,
      // infuraId: "27e484dcd9e3efcfd25a83a78777cdf1",
      qrcodeModalOptions: {
        mobileLinks: [
          "rainbow",
          "metamask",
          "argent",
          "trust",
          "imtoken",
          "pillar",
          "safepal",
        ],
      },
    });
    // await provider.disconnect();

    await provider.enable();

    const web3 = new Web3(provider);

    return web3;
  } catch (e) {
    localStorage.removeItem("extensionName");
    localStorage.removeItem("walletconnect");
  }
};
