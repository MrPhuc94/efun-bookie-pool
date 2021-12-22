// import * as gasInfo from './support/getGasInformation'
// import stakeAbi from './contracts/stake.abi.json'
import erc20Abi from './contracts/erc20.abi.json'
import { initWeb3 } from './support/initWeb3'
const WalletError = require('~/blockchain/utils/error')

const BigNumber = require('bignumber.js')
// #need_config

const network = process.env.NODE_ENV === 'development' ? process.env.BLOCKCHAIN_NETWORK : process.env.BLOCKCHAIN_NETWORK_MAINNET
// const network = 'MAINNET'
const supportSymbol = process.env.NODE_ENV === 'development' ? require('./tokens/supportSymbolTest') : require('./tokens/supportSymbol')

const p2pABI = network === 'TESTNET' ? require('./contracts/p2p.abi.json') : require('./contracts/p2p.abi.json')
const p2pContractAddress = process.env.NODE_ENV === 'development' ? process.env.P2P_CONTRACT : process.env.P2P_CONTRACT_MAINNET
const MAX_INT = process.env.VUE_APP_MAX_INT_STAKING ? process.env.VUE_APP_MAX_INT_STAKING : '115792089237316195423570985008687907853269984665640564039457584007913129639935'
// not required connect wallet
export const getMatchInfo = async (matchId) => {
  const web3 = await initWeb3()
  const p2pContract = await new web3.eth.Contract(
    p2pABI,
    p2pContractAddress
  )
  const txData = await p2pContract.methods.getMatchInfo(
    matchId
  ).call()
  const tx = {
    to: p2pContractAddress,
    // value: 0,
    data: txData
  }

  return {
    tx
  }
}

// createPrediction(uint256 _matchId, uint256 _minBet, Handicap memory _handicap, uint256 _chosenTeam)
export const createPrediction = async (
  matchId,
  _token,
  _hardCap,
  minBet,
  handicap,
  chosenTeam,
  from
) => {
  const web3 = await initWeb3()
  const p2pContract = await new web3.eth.Contract(
    p2pABI,
    p2pContractAddress
  )
  console.log(matchId, _token, _hardCap, handicap, chosenTeam)
  let receipt2 = ''
  const param = {
    from: from
  }
  if (_token === process.env.BNB_TOKEN) {
    param.value = new BigNumber(
      _hardCap
    ).multipliedBy(10 ** 18).toFixed()
  }
  console.log(_token, 'token')
  const txData = await p2pContract.methods.createPrediction(
    matchId,
    _token,
    new BigNumber(
      _hardCap
    ).multipliedBy(10 ** 18).toFixed(),
    new BigNumber(
      minBet
    ).multipliedBy(10 ** 18).toFixed(),
    handicap,
    chosenTeam
  )
    .send(param)
    .on('error', (error) => {
      console.log('error', error)
      throw new WalletError.NewNetworkError('cannot predict now')
    })
    .then((receipt) => {
      console.log('receipt', receipt)
      receipt2 = receipt
    })
    .catch((err) => {
      console.log(err)
      throw new WalletError.NewNetworkError('cannot predict now')
    })
  const tx = {
    from,
    to: p2pContractAddress,
    hash: receipt2,
    data: txData
  }

  return {
    tx
  }
}

export const predict = async (
  _predictionId,
  value,
  token,
  from
) => {
  const web3 = await initWeb3()
  const p2pContract = await new web3.eth.Contract(
    p2pABI,
    p2pContractAddress
  )
  let receipt2 = ''
  // const calculateBalanceSend = (balance) => {
  //   return BigNumber(balance)
  //     .multipliedBy(10 ** 18)
  //     .integerValue()
  // }
  const param = {
    from: from
  }
  if (token === 'BNB') {
    param.value = new BigNumber(
      value
    ).multipliedBy(10 ** 18).toFixed()
  }
  const txData = await p2pContract.methods.predict(
    _predictionId,
    new BigNumber(
      value
    ).multipliedBy(10 ** 18).toFixed()
  )
    // const amountFormat = calculateBalanceSend(value)
    // const amountInHex = '0x' + amountFormat.toString(16)
    // .send({ from: from,
    //   value: new BigNumber(
    //     value
    //   ).multipliedBy(10 ** 18).toFixed() })
    .send(param)
    .on('error', (error) => {
      receipt2 = error
      console.log('error', error)
      throw new WalletError.NewNetworkError('cannot predict now')
    })
    .then((receipt) => {
      console.log('receipt', receipt)
      receipt2 = receipt
    })
    .catch((err) => {
      receipt2 = err
      console.log(err, 'hey waht ????')
      throw new WalletError.NewNetworkError('cannot predict now')
    })
  const tx = {
    from,
    to: p2pContractAddress,
    // value: amountInHex,
    hash: receipt2,
    data: txData
  }

  return {
    tx
  }
}
export const getPredictions = async (idx) => {
  const web3 = await initWeb3()
  const p2pContract = new web3.eth.Contract(
    p2pABI,
    p2pContractAddress
  )
  const data = await p2pContract.methods.predictions(
    idx
  ).call()
  return data
}
export const dealerWithdraw = async (
  _predictionId,
  from
) => {
  const web3 = await initWeb3()
  const p2pContract = new web3.eth.Contract(
    p2pABI,
    p2pContractAddress
  )
  let receipt2 = ''
  console.log(_predictionId, from)
  const txData = await p2pContract.methods.dealerWithdraw(
    _predictionId
  )
    .send({ from: from })
    .on('error', (error) => {
      receipt2 = error
      console.log(error)
    })
    .then((receipt) => {
      receipt2 = receipt
      console.log(receipt)
    })
    .catch((err) => {
      receipt2 = err
      console.log(err)
    })
  // const nonce = await web3.eth.getTransactionCount(from, 'pending')
  const tx = {
    from,
    hash: receipt2,
    // to: p2pContractAddress,
    // value: 0
    // nonce,
    data: txData
  }
  return {
    tx
  }
}
export const cancelPrediction = async (
  _predictionId,
  from
) => {
  const web3 = await initWeb3()
  const p2pContract = new web3.eth.Contract(
    p2pABI,
    p2pContractAddress
  )
  let receipt2 = ''
  console.log(_predictionId, from)
  // const accounts = await web3.eth.getAccounts()
  const txData = await p2pContract.methods.cancelPrediction(
    _predictionId
  )
    .send({ from: from })
    .on('error', (error) => {
      receipt2 = error
      console.log('error', error)
    })
    .then((receipt) => {
      console.log('receipt', receipt)
      receipt2 = receipt
    })
    .catch((err) => {
      receipt2 = err
      console.log(err, 'hey waht ????')
    })
  // const nonce = await web3.eth.getTransactionCount(from, 'pending')
  const tx = {
    from,
    hash: receipt2,
    // to: p2pContractAddress,
    // value: 0
    // nonce,
    data: txData
  }
  return {
    tx
  }
}

export const predictionStats = async (
  _predictionId,
  from
) => {
  const web3 = await initWeb3()
  const p2pContract = new web3.eth.Contract(
    p2pABI,
    p2pContractAddress
  )
  console.log(_predictionId, from)
  // const accounts = await web3.eth.getAccounts()
  const txData = await p2pContract.methods.predictionStats(
    from,
    _predictionId
  ).call()
  // const nonce = await web3.eth.getTransactionCount(from, 'pending')
  const tx = {
    from,
    // to: p2pContractAddress,
    // value: 0
    // nonce,
    data: txData
  }
  return {
    tx
  }
}

export const getBetInfo = async (
  matchId,
  account
) => {
  const web3 = await initWeb3()
  const p2pContract = new web3.eth.Contract(
    p2pABI,
    p2pContractAddress
  )
  const txData = await p2pContract.methods.getBetInfo(
    matchId,
    account
  ).call()
  const nonce = await web3.eth.getTransactionCount(account, 'pending')
  const tx = {
    account,
    to: p2pContractAddress,
    // value: 0,
    nonce,
    // data: txData.encodeABI(),
    data: txData
  }
  return {
    tx
  }
}
export const calculateReward = async (
  score,
  handicap,
  amount,
  option,
  account
) => {
  const web3 = await initWeb3()
  const p2pContract = new web3.eth.Contract(
    p2pABI,
    p2pContractAddress
  )
  console.log(score,
    handicap,
    amount,
    option,
    account, 'score,112')
  const txData = await p2pContract.methods.calculateReward(
    score,
    handicap,
    new BigNumber(amount).multipliedBy(10 ** 18).toFixed(),
    option
  ).call()
  // const nonce = await web3.eth.getTransactionCount(account, 'pending')
  const tx = {
    account,
    to: p2pContractAddress,
    // value: 0,
    // nonce,
    // data: txData.encodeABI(),
    data: txData
  }
  return {
    tx
  }
}

export const claimReward = async (
  _predictionId,
  from
) => {
  const web3 = await initWeb3()
  const p2pContract = new web3.eth.Contract(
    p2pABI,
    p2pContractAddress
  )
  let receipt2 = ''
  // const accounts = await web3.eth.getAccounts()
  const txData = await p2pContract.methods.claimReward(
    _predictionId
  )
    .send({ from: from })
    .on('error', (error) => {
      receipt2 = error
      console.log(error)
    })
    .then((receipt) => {
      receipt2 = receipt
      console.log(receipt)
    })
    .catch((err) => {
      receipt2 = err
      console.log(err)
    })
  // const nonce = await web3.eth.getTransactionCount(p2pContractAddress, 'pending')
  const tx = {
    from: from,
    to: p2pContractAddress,
    hash: receipt2,
    // value: 0,
    // nonce,
    data: txData
  }
  return {
    tx
  }
}

export const updateResult = async (
  matchId,
  result,
  account
) => {
  const web3 = await initWeb3()
  const p2pContract = new web3.eth.Contract(
    p2pABI,
    p2pContractAddress
  )
  console.log(result, 'result')
  // const accounts = await web3.eth.getAccounts()
  const txData = await p2pContract.methods.updateResult(
    matchId,
    result
  )
  // const nonce = await web3.eth.getTransactionCount(account, 'pending')
  const tx = {
    from: account,
    to: p2pContractAddress,
    // value: 0,
    // nonce,
    data: txData.encodeABI()
  }
  return {
    tx
  }
}

/**
 * check approve stake
 * @param {*} from
 * @param {*} tokenSymbol
 * @param {*} spender
 * @returns
 */
export const checkApproveTx = async (from, tokenSymbol, spender = p2pContractAddress) => {
  const web3 = await initWeb3()
  const tokenContract = new web3.eth.Contract(erc20Abi, supportSymbol[tokenSymbol])
  const allowance = await tokenContract.methods.allowance(from, spender).call()
  return allowance
}

/**
 * create approve stake
 * @param {*} from
 * @param {*} tokenSymbol
 * @param {*} amount
 * @param {*} spender
 * @returns
 */
export const createApproveTx = async (from, tokenSymbol, amount = MAX_INT, spender = p2pContractAddress) => {
  const web3 = await initWeb3()
  const tokenContract = new web3.eth.Contract(
    erc20Abi,
    supportSymbol[tokenSymbol]
  )

  const txData = tokenContract.methods.approve(
    spender,
    amount
  )

  // const nonce = await web3.eth.getTransactionCount(from, 'pending')
  // data đầy đủ
  const tx = {
    from,
    to: supportSymbol[tokenSymbol],
    value: 0,
    // nonce,
    data: txData.encodeABI()
  }

  // const gasData = await gasInfo.getGasInformation(tx)

  return {
    tx
    // gasPrice: gasData.gasPrice,
    // gasLimit: gasData.gasLimit
  }
}
