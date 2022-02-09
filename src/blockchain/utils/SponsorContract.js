import erc20Abi from "./contracts/erc20.abi.json";
import { initWeb3 } from "./support/initWeb3";
// const BigNumber = require('bignumber.js')
const WalletError = require("~/blockchain/utils/error");
const supportSymbol =
  process.env.NODE_ENV === "development"
    ? require("./tokens/supportSymbolTest")
    : require("./tokens/supportSymbol");
const airdropABI =
  process.env.NODE_ENV === "development"
    ? require("./contracts/airdrop.abi.json")
    : require("./contracts/airdrop.abi.json");
const airdropContract =
  process.env.NODE_ENV === "development"
    ? process.env.AIR_DROP
    : process.env.AIR_DROP;
const MAX_INT =
  "115792089237316195423570985008687907853269984665640564039457584007913129639935";

export const claimAirdrop = async (string, from) => {
  const web3 = await initWeb3();
  const tokenContract = new web3.eth.Contract(airdropABI, airdropContract);
  // const stringAsci = web3.utils.asciiToHex(string)
  // console.log(string, 'string not asci')
  // console.log(stringAsci, 'stringAsci')
  const txData = await tokenContract.methods
    .claimAirdrop(string)
    .send({ from })
    .on("error", (error) => {
      //  console.log(error);
    })
    .then((receipt) => {
      // console.log(receipt);
    })
    .catch((err) => {
      // console.log(err);
      throw new WalletError.NewNetworkError("cannot predict now");
    });
  const tx = {
    from,
    to: airdropContract,
    data: txData,
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
export const checkApproveTx = async (
  from,
  tokenSymbol,
  spender = airdropContract
) => {
  const web3 = await initWeb3();
  const tokenContract = new web3.eth.Contract(
    erc20Abi,
    supportSymbol[tokenSymbol]
  );
  const allowance = await tokenContract.methods.allowance(from, spender).call();
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
export const createApproveTx = async (
  from,
  tokenSymbol,
  amount = MAX_INT,
  spender = airdropContract
) => {
  const web3 = await initWeb3();
  const tokenContract = new web3.eth.Contract(
    erc20Abi,
    supportSymbol[tokenSymbol]
  );

  const txData = tokenContract.methods.approve(spender, amount);

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
