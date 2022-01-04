const axios = require("axios");
const BigNumber = require("bignumber.js");
const Web3 = require("web3");
const WalletError = require("~/blockchain/utils/error");

// #need_config
// const network = 'TESTNET'
// const network = 'MAINNET'
const network =
  process.env.NODE_ENV === "development"
    ? process.env.BLOCKCHAIN_NETWORK
    : process.env.BLOCKCHAIN_NETWORK_MAINNET;
const supportToken =
  network === "TESTNET"
    ? require("./tokens/supportTokenTest.json")
    : require("./tokens/supportToken.json");

/**
 *
 * @param {string} address địa chỉ ví
 * @param {string} type loại gửi hay nhận (SEND OR RECEIVE)
 * @param {Date} fromDate gửi cái này lên để lọc date lấy history transactions
 * @param {Date} toDate gửi cái này lên để lọc date lấy history transactions
 * @param {number} limit giống limit bao nhiêu items trên 1 trang
 * @param {*} offset chưa rõ mò tiếp ở api-testnet
 * @returns 1 list danh sách history được xài bên trong store/walletStore/transactionHistory
 */
async function getTransactions(address, type, fromDate, toDate, limit, offset) {
  try {
    // https://api-testnet.bscscan.com cái này vất vào .env config docs để khi nào múc sang mainnet #need_config
    let endpoint = `https://api-testnet.bscscan.com/api?module=account&action=txlist&address=${address}`;
    if (limit) {
      endpoint += `&offset=${limit}`;
    }
    if (offset) {
      endpoint += `&page=${offset}`;
    }
    const result = await axios.get(endpoint);
    return result.data.result
      .map((e) => {
        const tokenSymbol =
          e.contractAddress === ""
            ? "BNB"
            : supportToken[Web3.utils.toChecksumAddress(e.contractAddress)];
        return {
          hash: e.hash,
          amount: BigNumber(e.value)
            .dividedBy(10 ** 18)
            .toString(),
          type:
            address.toLowerCase() === e.from.toLowerCase() ? "SEND" : "RECEIVE",
          tokenSymbol,
          status: !parseInt(e.isError),
          from: e.from,
          to: e.to,
          time: e.timeStamp,
        };
      })
      .reverse();
  } catch (error) {
    throw new WalletError.NewNetworkError("cannot get transaction now");
  }
}

export default getTransactions;
