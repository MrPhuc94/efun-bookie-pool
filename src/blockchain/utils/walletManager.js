/* eslint-disable no-useless-catch */

import {
  REACT_APP_BLOCKCHAIN_RPC_NETWORK,
  REACT_APP_BLOCKCHAIN_RPC_NETWORK_MAINNET,
  REACT_APP_NODE_ENV,
  REACT_APP_BLOCKCHAIN_NETWORK_MAINNET,
  REACT_APP_BLOCKCHAIN_NETWORK,
} from "src/common/Environment";
import ModalErrorWallet from "src/components/Modal/ErrorWallet/ErrorWallet";
import { showAppPopup } from "src/redux/reducers/appSlice";

// import _get from 'lodash/get'
const Web3 = require("web3");
const BigNumber = require("bignumber.js");
const WalletError = require("./error");
const { supportWallet } = require("./contants");
// const { getWeb3walletConnect } = require('./walletconnect')
const erc20Abi = require("./contracts/erc20.abi.json");
// const betAbi = require('./contracts/ftm.abi.json')
const { getWeb3walletConnect } = require("./walletconnect");
const { store } = require("src/redux/store");
const {
  changeCurrentAddress,
  changeListToken,
} = require("src/redux/reducers/walletSlice");
// #need_config
const network =
  REACT_APP_NODE_ENV === "development"
    ? REACT_APP_BLOCKCHAIN_NETWORK
    : REACT_APP_BLOCKCHAIN_NETWORK_MAINNET;
// const network = 'MAINNET'

const supportSymbol =
  network === "TESTNET"
    ? require("./tokens/supportSymbolTest.json")
    : require("./tokens/supportSymbol.json");
// const supportSymbolFantom = network === 'TESTNET' ? require('./tokens/supportSymbolFantomTest') : require('./tokens/supportSymbolFantomTest')
let currentAddress = localStorage.getItem("currentAddress") || "";
const supportedWalletsType = Object.values(supportWallet);

// const REACT_APP_API_URL_WEB3 = 'https://rpc.testnet.fantom.network/'
// let web3Provider = new Web3(new Web3.providers.HttpProvider(REACT_APP_API_URL_WEB3 || ''))

// let keystore = null
let isConnected = false;
let currentWalletType = null;
let tokens = [];

function checkSupportedWalletsType() {
  const result = [supportWallet.dfyWallet, supportWallet.walletConnect];
  if (window.ethereum && window.ethereum.isMetaMask) {
    result.push(supportWallet.metamask);
  }
  if (window.BinanceChain) {
    result.push(supportWallet.binanceChain);
  }
  if (window.ethereum && window.ethereum.isTrust) {
    result.push(supportWallet.trustWallet);
  }
  if (window.ethereum && window.ethereum.isSafePal) {
    result.push(supportWallet.safePal);
  }
  // if (!!(localStorage.getItem('walletConnect'))) result.push(supportWallet.connectWallet)

  return result;
}

let web3 = null;

/**
 *
 * @param {string} walletType d???a theo lo???i v?? n??o ????? k???t n???i
 * @param {number} timeout th???i gian h???t h???n khi k???t n???i v??, nh?? b??nh th?????ng call l?? 1000000
 */
async function connectWallet(walletType, timeout) {
  try {
    // const prov = new Web3.providers.HttpProvider(REACT_APP_API_URL_WEB3 || '')
    // if (!web3Provider) {
    //   web3Provider = new Web3(prov)
    // } else {
    //   web3Provider.setProvider(prov)
    // }
    // TODO Env check
    if (
      walletType === supportWallet.metamask ||
      walletType === supportWallet.trustWallet ||
      walletType === supportWallet.safePal
    ) {
      await window.ethereum.enable();
      web3 = new Web3(window.ethereum);

      if (walletType === supportWallet.metamask) {
        currentWalletType = supportWallet.metamask;
      } else if (walletType === supportWallet.safePal) {
        currentWalletType = supportWallet.safePal;
      } else {
        currentWalletType = supportWallet.trustWallet;
      }
    } else if (walletType === supportWallet.binanceChain) {
      await window.BinanceChain.enable();
      web3 = new Web3(window.BinanceChain);
      currentWalletType = supportWallet.binanceChain;
    } else if (walletType === supportWallet.walletConnect) {
      web3 = await getWeb3walletConnect();
      currentWalletType = supportWallet.walletConnect;
    }
    const accounts = await web3.eth.getAccounts();
    // const accounts = await web3.eth.getAccounts()
    currentAddress = accounts[0];
    // set currentAddress to store
    // get balance
    await getBalance();
    isConnected = true;
    return currentAddress;
  } catch (error) {
    // console.log(error);
    store.dispatch(
      showAppPopup(<ModalErrorWallet messageError={error.toString()} />)
    );
  }
}

export async function getBalance() {
  try {
    const tokens = await getBalances();
    //console.log("balances====", tokens);
    if (tokens) {
      localStorage.setItem("tokens", JSON.stringify(tokens));
      store.dispatch(changeListToken(tokens));
    }
  } catch (error) {
    //console.log("Error get balances====", balances);
    throw error;
  }
}
/**
 * G???i ti???n
 *
 * @param {string} password
 * @param {string} to ?????a ch??? ng?????i nh???n
 * @param {number} amount s??? l?????ng g???i
 * @param {string} tokenSymbol lo???i ti???n
 * @param {number} gasPrice gasPrice c?? s???n
 * @param {number} gasLimit gasLimit ???????c t??nh to??n t??? tr?????c truy???n v??o (gi??? d??? c?? ng?????i mu???n giao d???ch nhanh h??n th?? c???n tr??? ph?? cao h??n custom ??c)
 * @param {function} callback custom l???i function
 * @returns { receipt } tr??? v??? h??a ????n ???????c k??
 */
// async function send (password, to, amount, tokenSymbol, gasPrice, gasLimit, callback) {
//   let receipt = null
//   try {
//     // tr?????ng h???p BNB ko c???n Abi
//     if (tokenSymbol === 'BNB') {
//       const tx = {
//         from: currentAddress,
//         to,
//         value: new BigNumber(
//           amount
//         ).multipliedBy(10 ** 18).toString(),
//         gas: gasLimit,
//         gasPrice: new BigNumber(
//           gasPrice
//         ).multipliedBy(10 ** 9).toString()
//       }
//       // Check v?? hi???n t???i l?? v?? DFY th?? s??? gi???i m?? keystore v?? k?? giao d???ch + g???i
//       // C??n n???u l?? c??c v?? ngo??i th?? s??? g???i lu??n
//       if (currentWalletType === supportWallet.dfyWallet) {
//         const account = web3.eth.accounts.decrypt(keystore, password)
//         const signed = await account.signTransaction(tx)
//         receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction)
//       } else {
//         receipt = await web3.eth.sendTransaction(tx)
//       }
//     } else {
//       // tr?????ng h???p kh??c ko ph???i BNB c???n d???a theo erc20Abi
//       const tokenContract = new web3.eth.Contract(
//         erc20Abi,
//         supportSymbol[tokenSymbol]
//       )
//       // data bao g???m ?????a ch??? v?? ng?????i nh???n v?? s??? l?????ng g???i
//       // ?????i v???i staking th?? s??? c?? h??m staking ch??? truy???n v??o s??? l?????ng g???i
//       const txData = tokenContract.methods.transfer(
//         to,
//         '0x' + new BigNumber(
//           amount
//         ).multipliedBy(10 ** 18).toString(16)
//       )
//       // data ?????y ?????
//       const tx = {
//         from: currentAddress,
//         to: supportSymbol[tokenSymbol],
//         value: 0,
//         gas: gasLimit,
//         gasPrice: new BigNumber(
//           gasPrice
//         ).multipliedBy(10 ** 9).toString(),
//         data: txData.encodeABI()
//       }
//       // Check v?? hi???n t???i l?? v?? DFY th?? s??? gi???i m?? keystore v?? k?? giao d???ch + g???i
//       // C??n n???u l?? c??c v?? ngo??i th?? s??? g???i lu??n
//       if (currentWalletType === supportWallet.dfyWallet) {
//         const account = web3.eth.accounts.decrypt(keystore, password)
//         const signed = await account.signTransaction(tx)
//         receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction)
//       } else {
//         receipt = await web3.eth.sendTransaction(tx)
//       }
//     }
//   } catch (error) {
//     throw new WalletError.NewUnknowError('can not send transaction now')
//   }

//   try {
//     // sync balance
//     getBalances()
//   } catch (error) {
//     throw error
//   } finally {
//     // tr??? v??? h??a ????n
//     // eslint-disable-next-line no-unsafe-finally
//     return receipt
//   }
// }

/**
 * logout lo???i b??? c??c key l???n token
 */
function logout() {
  // keystore = null
  isConnected = false;
  currentWalletType = null;
  tokens = [];
}

/**
 * L???y th??ng tin ???????c d??ng ????? sync balance, hay g???i tr???c ti???p
 *
 * l???y data tr??n binance
 *
 * @returns { symbol, balance } tr??? v??? th??ng tin c??c lo???i ti???n v?? s??? l?????ng amount ??ang c?? ???????c x??i ??? store/walletStore/supportTokenAndBalance
 */
// const getBalances = async () => {
//   const userBalance = await web3.eth.getBalance(currentAddress.toLowerCase())
//   const symbol = 'FTM'
//   tokens = [{
//     symbol,
//     balance: BigNumber(userBalance).dividedBy(10 ** 18).toString()
//   }]
// }
// async function getBalances () {
//   try {
//     // #need_config
//     const node = process.env.NODE_ENV === 'development' ? process.env.BLOCKCHAIN_RPC_NETWORK : process.env.BLOCKCHAIN_RPC_NETWORK_MAINNET
//     const web3 = new Web3(node)
//     tokens = await Promise.all(Object.keys(supportSymbolFantom).map(async (symbol) => {
//     // tokens = await Promise.all(Object.keys(supportSymbol).map(async (symbol) => {
//       if (symbol === 'FTM') {
//         const userBalance = await web3.eth.getBalance(currentAddress.toLowerCase())
//         return {
//           symbol,
//           balance: BigNumber(userBalance).dividedBy(10 ** 18).toString()
//         }
//       } else {
//         const address = supportSymbolFantom[symbol]
//         const tokenContract = new web3.eth.Contract(
//           erc20Abi,
//           address
//         )
//         const userBalance = await tokenContract.methods
//           .balanceOf(currentAddress.toLowerCase())
//           .call()
//         console.log(userBalance, 'userBalance')

//         return {
//           symbol,
//           balance: BigNumber(userBalance).dividedBy(10 ** 18).toString()
//         }
//       }
//     }))
//   } catch (error) {
//     throw new WalletError.NewUnknowError('can not get balances now')
//   }
// }
async function getBalances() {
  try {
    // #need_config
    const node =
      REACT_APP_NODE_ENV === "development"
        ? REACT_APP_BLOCKCHAIN_RPC_NETWORK
        : REACT_APP_BLOCKCHAIN_RPC_NETWORK_MAINNET;

    // console.log("node=====", node);
    const web3 = new Web3(node);
    // console.log("web3======", web3);
    // console.log("supportSymbol", supportSymbol);
    tokens = await Promise.all(
      Object.keys(supportSymbol).map(async (symbol) => {
        if (symbol === "BNB") {
          const userBalance = await web3.eth.getBalance(currentAddress);
          return {
            symbol,
            balance: BigNumber(userBalance)
              .dividedBy(10 ** 18)
              .toString(),
          };
        } else {
          const address = supportSymbol[symbol];
          const tokenContract = new web3.eth.Contract(erc20Abi, address);
          const userBalance = await tokenContract.methods
            .balanceOf(currentAddress)
            .call();

          return {
            symbol,
            balance: BigNumber(userBalance)
              .dividedBy(10 ** 18)
              .toString(),
          };
        }
      })
    );

    // return tokens getBalance?
    return tokens;
  } catch (error) {
    store.dispatch(
      showAppPopup(<ModalErrorWallet messageError="Can not get balances now" />)
    );
  }
}

export const walletManager = {
  getBalances,
  currentAddress() {
    return currentAddress;
  },
  currentWalletType() {
    return currentWalletType;
  },
  supportedWalletsType() {
    return supportedWalletsType;
  },
  tokens() {
    return tokens;
  },
  isConnected() {
    return isConnected;
  },
  web3() {
    return web3;
  },
  checkSupportedWalletsType,
  connectWallet,
  // send,
  logout,
};
