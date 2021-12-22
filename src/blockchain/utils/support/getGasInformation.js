import Web3 from 'web3'

const rpcURL = process.env.NODE_ENV === 'development' ? process.env.BLOCKCHAIN_RPC_NETWORK : process.env.BLOCKCHAIN_RPC_NETWORK_MAINNET
const web3 = new Web3(rpcURL)

export const getGasInformation = async (txRaw) => {
  // try {
  // tính gasLimit dựa theo encodeABI
  // let web3 = await initWeb3()
  const gasPrice = await web3.eth.getGasPrice()
  let gasLimit = 0
  // hard_code
  try {
    gasLimit = await web3.eth.estimateGas(txRaw)
  } catch {
    gasLimit = 4000000
  }

  return {
    gasPrice,
    gasLimit
  }
  // } catch (error) {
  //   throw WalletError.NewUnknowError('can not send transaction now')
  // }
}
