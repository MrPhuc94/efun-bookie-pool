/* eslint-disable no-useless-catch */
// import _get from 'lodash/get'
const Web3 = require('web3')
const BigNumber = require('bignumber.js')
const WalletError = require('./error')
const { supportWallet } = require('./contants')
// const { getWeb3walletConnect } = require('./walletconnect')
const erc20Abi = require('./contracts/erc20.abi.json')
// const betAbi = require('./contracts/ftm.abi.json')
const { getWeb3walletConnect } = require('./walletconnect')
// #need_config
const network = process.env.NODE_ENV === 'development' ? process.env.BLOCKCHAIN_NETWORK : process.env.BLOCKCHAIN_NETWORK_MAINNET
// const network = 'MAINNET'

const supportSymbol = network === 'TESTNET' ? require('./tokens/supportSymbolTest') : require('./tokens/supportSymbol')
// const supportSymbolFantom = network === 'TESTNET' ? require('./tokens/supportSymbolFantomTest') : require('./tokens/supportSymbolFantomTest')
let currentAddress = ''
const supportedWalletsType = Object.values(supportWallet)

// const REACT_APP_API_URL_WEB3 = 'https://rpc.testnet.fantom.network/'
// let web3Provider = new Web3(new Web3.providers.HttpProvider(REACT_APP_API_URL_WEB3 || ''))

// let keystore = null
let isConnected = false
let currentWalletType = null
let tokens = []

function checkSupportedWalletsType () {
  const result = [supportWallet.dfyWallet, supportWallet.walletConnect]
  if (window.ethereum && window.ethereum.isMetaMask) { result.push(supportWallet.metamask) }
  if (window.BinanceChain) { result.push(supportWallet.binanceChain) }
  if (window.ethereum && window.ethereum.isTrust) { result.push(supportWallet.trustWallet) }
  if (window.ethereum && window.ethereum.isSafePal) { result.push(supportWallet.safePal) }
  // if (!!(localStorage.getItem('walletConnect'))) result.push(supportWallet.connectWallet)

  return result
}

let web3 = null

/**
 *
 * @param {string} walletType dựa theo loại ví nào để kết nối
 * @param {number} timeout thời gian hết hạn khi kết nối ví, như bình thường call là 1000000
 */
async function connectWallet (walletType, timeout) {
  try {
    // const prov = new Web3.providers.HttpProvider(REACT_APP_API_URL_WEB3 || '')
    // if (!web3Provider) {
    //   web3Provider = new Web3(prov)
    // } else {
    //   web3Provider.setProvider(prov)
    // }
    // TODO Env check
    if (walletType === supportWallet.metamask || walletType === supportWallet.trustWallet || walletType === supportWallet.safePal) {
      await window.ethereum.enable()
      web3 = new Web3(window.ethereum)

      if (walletType === supportWallet.metamask) {
        currentWalletType = supportWallet.metamask
      } else if (walletType === supportWallet.safePal) {
        currentWalletType = supportWallet.safePal
      } else {
        currentWalletType = supportWallet.trustWallet
      }
    } else if (walletType === supportWallet.binanceChain) {
      await window.BinanceChain.enable()
      web3 = new Web3(window.BinanceChain)
      currentWalletType = supportWallet.binanceChain
    } else if (walletType === supportWallet.walletConnect) {
      web3 = await getWeb3walletConnect()
      currentWalletType = supportWallet.walletConnect
    }
    const accounts = await web3.eth.getAccounts()
    // const accounts = await web3.eth.getAccounts()
    currentAddress = accounts[0]
    isConnected = true
  } catch (error) {
    console.log(error)
    throw new WalletError.NewUnknowError('user rejected permission or don\'t install wallet extension')
  }

  try {
    await getBalances()
  } catch (error) {
    throw error
  }
}
/**
 * Gửi tiền
 *
 * @param {string} password
 * @param {string} to địa chỉ người nhận
 * @param {number} amount số lượng gửi
 * @param {string} tokenSymbol loại tiền
 * @param {number} gasPrice gasPrice có sẵn
 * @param {number} gasLimit gasLimit được tính toán từ trước truyền vào (giả dụ có người muốn giao dịch nhanh hơn thì cần trả phí cao hơn custom đc)
 * @param {function} callback custom lại function
 * @returns { receipt } trả về hóa đơn được kí
 */
// async function send (password, to, amount, tokenSymbol, gasPrice, gasLimit, callback) {
//   let receipt = null
//   try {
//     // trường hợp BNB ko cần Abi
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
//       // Check ví hiện tại là ví DFY thì sẽ giải mã keystore và ký giao dịch + gửi
//       // Còn nếu là các ví ngoài thì sẽ gửi luôn
//       if (currentWalletType === supportWallet.dfyWallet) {
//         const account = web3.eth.accounts.decrypt(keystore, password)
//         const signed = await account.signTransaction(tx)
//         receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction)
//       } else {
//         receipt = await web3.eth.sendTransaction(tx)
//       }
//     } else {
//       // trường hợp khác ko phải BNB cần dựa theo erc20Abi
//       const tokenContract = new web3.eth.Contract(
//         erc20Abi,
//         supportSymbol[tokenSymbol]
//       )
//       // data bao gồm địa chỉ ví người nhận và số lượng gửi
//       // đối với staking thì sẽ có hàm staking chỉ truyền vào số lượng gửi
//       const txData = tokenContract.methods.transfer(
//         to,
//         '0x' + new BigNumber(
//           amount
//         ).multipliedBy(10 ** 18).toString(16)
//       )
//       // data đầy đủ
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
//       // Check ví hiện tại là ví DFY thì sẽ giải mã keystore và ký giao dịch + gửi
//       // Còn nếu là các ví ngoài thì sẽ gửi luôn
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
//     // trả về hóa đơn
//     // eslint-disable-next-line no-unsafe-finally
//     return receipt
//   }
// }

/**
 * logout loại bỏ các key lẫn token
 */
function logout () {
  // keystore = null
  isConnected = false
  currentWalletType = null
  tokens = []
}

/**
 * Lấy thông tin được dùng để sync balance, hay gọi trực tiếp
 *
 * lấy data trên binance
 *
 * @returns { symbol, balance } trả về thông tin các loại tiền và số lượng amount đang có được xài ở store/walletStore/supportTokenAndBalance
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
async function getBalances () {
  try {
    // #need_config
    const node = process.env.NODE_ENV === 'development' ? process.env.BLOCKCHAIN_RPC_NETWORK : process.env.BLOCKCHAIN_RPC_NETWORK_MAINNET
    const web3 = new Web3(node)
    tokens = await Promise.all(Object.keys(supportSymbol).map(async (symbol) => {
      if (symbol === 'BNB') {
        const userBalance = await web3.eth.getBalance(currentAddress)
        return {
          symbol,
          balance: BigNumber(userBalance).dividedBy(10 ** 18).toString()
        }
      } else {
        const address = supportSymbol[symbol]
        const tokenContract = new web3.eth.Contract(
          erc20Abi,
          address
        )
        const userBalance = await tokenContract.methods
          .balanceOf(currentAddress)
          .call()

        return {
          symbol,
          balance: BigNumber(userBalance).dividedBy(10 ** 18).toString()
        }
      }
    }))
  } catch (error) {
    throw new WalletError.NewUnknowError('can not get balances now')
  }
}

module.exports = {
  getBalances,
  currentAddress () {
    return currentAddress
  },
  currentWalletType () {
    return currentWalletType
  },
  supportedWalletsType () {
    return supportedWalletsType
  },
  tokens () {
    return tokens
  },
  isConnected () {
    return isConnected
  },
  web3 () {
    return web3
  },
  checkSupportedWalletsType,
  connectWallet,
  // send,
  logout

}
