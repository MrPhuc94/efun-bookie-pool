// import * as gasInfo from './support/getGasInformation'
// import stakeAbi from './contracts/stake.abi.json'
import erc20Abi from "./contracts/erc20.abi.json";
import { initWeb3 } from "./support/initWeb3";
import BigNumber from "bignumber.js";
import { WalletError } from "./error";

// #need_config

// const network = process.env.NODE_ENV === 'development' ? process.env.BLOCKCHAIN_NETWORK : process.env.BLOCKCHAIN_NETWORK_MAINNET
// const network = 'MAINNET'
// const supportSymbol = JSON.parse(localStorage.getItem('supportSymbol'))
const supportSymbol =
  process.env.NODE_ENV === "development"
    ? require("./tokens/supportSymbolTest.json")
    : require("./tokens/supportSymbol.json");
// const betAbi = network === 'TESTNET' ? require('./contracts/ftm.abi.json') : require('./contracts/ftm.abi.json')
// const betAbi = process.env.NODE_ENV === 'development' ? require('./contracts/bet.abi.json') : require('./contracts/bet.abi.json')
const groupAbi =
  process.env.NODE_ENV === "development"
    ? require("./contracts/group-test.abi.json")
    : require("./contracts/group.abi.json");
const createAbi =
  process.env.NODE_ENV === "development"
    ? require("./contracts/create.abi.json")
    : require("./contracts/create.abi.json");

// 0xAe748Ff6c41d94d57957B65114F953f3F160dEB2 contarct moi
// hard_code
// const groupContract = process.env.NODE_ENV === 'development' ? process.env.FTM_CONTRACT : process.env.FTM_CONTRACT
const groupContract =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_SPONSOR_PREDICT_DEV
    : process.env.REACT_APP_SPONSOR_PREDICT_DEV;
const createContract =
  process.env.NODE_ENV === "development"
    ? process.env.SPONSOR_MATCH_DEV
    : process.env.SPONSOR_MATCH_DEV;
const MAX_INT = process.env.VUE_APP_MAX_INT_STAKING
  ? process.env.VUE_APP_MAX_INT_STAKING
  : "115792089237316195423570985008687907853269984665640564039457584007913129639935";

// not required connect wallet
const getMatchInfo2 = async (matchId) => {
  const web3 = await initWeb3();
  const tokenContract = await new web3.eth.Contract(createAbi, groupContract);
  const txData = await tokenContract.methods.info(matchId).call();
  const tx = {
    to: groupContract,
    // value: 0,
    data: txData,
  };

  return {
    tx,
  };
};
const getBetInfo = async (matchId, token, account) => {
  const web3 = await initWeb3();
  const tokenContract = new web3.eth.Contract(
    // groupAbi,
    // createAbi,
    // createContract
    groupAbi,
    groupContract
    // groupContract
  );
  const txData = await tokenContract.methods
    .getPredictInfo(matchId, account, token)
    .call();
  const nonce = await web3.eth.getTransactionCount(account, "pending");
  const tx = {
    account,
    to: groupContract,
    // value: 0,
    nonce,
    // data: txData.encodeABI(),
    data: txData,
  };
  return {
    tx,
  };
};
const getMatchInfo = async (matchId, token) => {
  const web3 = await initWeb3();
  const tokenContract = await new web3.eth.Contract(groupAbi, groupContract);
  const tokenContract2 = await new web3.eth.Contract(createAbi, createContract);
  const txData = await tokenContract.methods
    .getMatchInfo(matchId, token)
    .call();
  const txData2 = await tokenContract2.methods.info(matchId).call();
  const dataCombine = {
    predictionAmount: txData.predictionAmount,
    score: txData2.score,
    status: txData2.status,
  };
  const tx = {
    to: groupContract,
    // value: 0,
    data: dataCombine,
  };

  return {
    tx,
  };
};
const createMatches = async (
  _descriptions,
  _startTimes,
  _endTimes,
  _sToken,
  from
) => {
  const web3 = await initWeb3();
  const tokenContract = await new web3.eth.Contract(createAbi, createContract);
  const x = _descriptions.map((item) => {
    return web3.utils.asciiToHex(item);
  });
  const accounts = await web3.eth.getAccounts();
  const txData = await tokenContract.methods
    .createMatches(x, _startTimes, _endTimes, _sToken)
    .send({ from: accounts[0] })
    .on("error", (error) => {
      console.log(error);
    });
  const tx = {
    from,
    to: createContract,
    data: txData,
  };
  return {
    tx,
  };
};
const createMatchs = async (
  matchIds,
  minBet,
  startTime,
  endTime,
  erc20,
  from
) => {
  const web3 = await initWeb3();
  const tokenContract = await new web3.eth.Contract(groupAbi, groupContract);
  const accounts = await web3.eth.getAccounts();
  const txData = await tokenContract.methods
    .createMatchs(matchIds, minBet, startTime, endTime, erc20)
    .send({ from: accounts[0] })
    .on("error", (error) => {
      console.log(error);
    })
    .then((receipt) => {
      console.log(receipt);
    })
    .catch((err) => {
      console.log(err);
    });
  const tx = {
    from,
    to: groupContract,
    data: txData,
  };
  return {
    tx,
  };
};
const predict = async (matchId, betContent, token, amount, from) => {
  const web3 = await initWeb3();
  const tokenContract = new web3.eth.Contract(
    groupAbi,
    // createContract
    groupContract
  );
  // const accounts = await web3.eth.getAccounts()
  const calculateBalanceSend = (balance) => {
    return BigNumber(balance)
      .multipliedBy(10 ** 18)
      .integerValue();
  };
  let receipt2 = "";
  const param = {
    from,
  };
  if (token === process.env.BNB_TOKEN) {
    param.value = new BigNumber(amount).multipliedBy(10 ** 18).toFixed();
  }

  console.log("calculateBalanceSend", calculateBalanceSend);
  const txData = await tokenContract.methods
    .predict(
      matchId,
      betContent,
      token,
      new BigNumber(amount).multipliedBy(10 ** 18).toFixed()
    )
    .send(param)
    .on("error", (error) => {
      receipt2 = error;
      console.log("error", error);
      throw new WalletError.NewNetworkError("cannot predict now");
    })
    .then((receipt) => {
      console.log("receipt", receipt);
      receipt2 = receipt;
    })
    .catch((err) => {
      receipt2 = err;
      console.log(err, "hey waht ????");
      throw new WalletError.NewNetworkError("cannot predict now");
    });
  console.log("txData======", txData);
  // const nonce = await web3.eth.getTransactionCount(from, 'pending')
  const amountFormat = calculateBalanceSend(amount);
  const amountInHex = "0x" + amountFormat.toString(16);
  const tx = {
    from,
    to: groupContract,
    // value: 0,
    value: amountInHex,
    hash: receipt2,
    // nonce,
    data: txData,
  };
  return {
    tx,
  };
};

const cancelMatchs = async (matchId, from) => {
  const web3 = await initWeb3();
  const tokenContract = new web3.eth.Contract(groupAbi, groupContract);
  // const accounts = await web3.eth.getAccounts()
  const txData = await tokenContract.methods.cancelMatchs(matchId).call();
  const nonce = await web3.eth.getTransactionCount(from, "pending");
  const tx = {
    from,
    to: groupContract,
    value: 0,
    nonce,
    data: txData,
  };
  return {
    tx,
  };
};

export const calculateReward = async (matchId, account, token) => {
  const web3 = await initWeb3();
  const tokenContract = new web3.eth.Contract(groupAbi, groupContract);
  const txData = await tokenContract.methods
    .calculateReward(matchId, account, token)
    .call();
  const tx = {
    account,
    to: groupContract,
    data: txData,
  };
  return {
    tx,
  };
};

const claimReward = async (matchId, _token, from) => {
  const web3 = await initWeb3();
  const tokenContract = new web3.eth.Contract(
    groupAbi,
    groupContract
    // createAbi,
    // createContract
  );
  // const accounts = await web3.eth.getAccounts()
  // console.log(matchId, 'matchId')
  // console.log(_token, '_token')

  const txData = await tokenContract.methods
    .claimReward(matchId, _token)
    // .call()
    .send({ from })
    .on("error", (error) => {
      console.log(error);
    })
    .then((receipt) => {
      console.log(receipt);
    })
    .catch((err) => {
      console.log(err);
      throw new WalletError.NewNetworkError("cannot predict now");
    });
  // const nonce = await web3.eth.getTransactionCount(groupContract, 'pending')
  const tx = {
    from,
    to: groupContract,
    // value: 0,
    // nonce,
    data: txData,
  };
  return {
    tx,
  };
};

const updateResult = async (matchId, result, account) => {
  const web3 = await initWeb3();
  const tokenContract = new web3.eth.Contract(groupAbi, groupContract);
  console.log(result, "result");
  // const accounts = await web3.eth.getAccounts()
  const txData = await tokenContract.methods.updateResult(matchId, result);
  // const nonce = await web3.eth.getTransactionCount(account, 'pending')
  const tx = {
    from: account,
    to: groupContract,
    // value: 0,
    // nonce,
    data: txData.encodeABI(),
  };
  return {
    tx,
  };
};

/**
 * check approve stake
 * @param {*} from
 * @param {*} tokenSymbol
 * @param {*} spender
 * @returns
 */
const checkApproveTx = async (from, tokenSymbol, spender = groupContract) => {
  //console.log("checkApproveTx======");
  const web3 = await initWeb3();
  const tokenContract = new web3.eth.Contract(
    erc20Abi,
    supportSymbol[tokenSymbol]
  );
  // console.log("tokenContract======", groupContract);
  // console.log("from======", from);

  const allowance = await tokenContract.methods.allowance(from, spender).call();

  //console.log("TODO==allowance======", allowance);

  return allowance;
};

/**
 * create approve stake
 * @param {*} from
 * @param {*} tokenSymbol
 * @param {*} amount
 * @param {*} spender
 * @returns
 */
const createApproveTx = async (
  from,
  tokenSymbol,
  amount = MAX_INT,
  spender = groupContract
) => {
  const web3 = await initWeb3();
  const tokenContract = new web3.eth.Contract(
    erc20Abi,
    supportSymbol[tokenSymbol]
  );

  const txData = await tokenContract.methods.approve(spender, amount);

  // const nonce = await web3.eth.getTransactionCount(from, 'pending')
  // data đầy đủ
  const tx = {
    from,
    to: supportSymbol[tokenSymbol],
    value: 0,
    // nonce,
    data: txData.encodeABI(),
  };

  // const gasData = await gasInfo.getGasInformation(tx)

  return {
    tx,
    // gasPrice: gasData.gasPrice,
    // gasLimit: gasData.gasLimit
  };
};

export const MatchesContract = {
  getMatchInfo2,
  getBetInfo,
  getMatchInfo,
  createMatches,
  createMatchs,
  predict,
  cancelMatchs,
  calculateReward,
  claimReward,
  updateResult,
  checkApproveTx,
  createApproveTx,
};
