// import WalletError from '../utils/error'
// import { initWeb3 } from './initWeb3'

export const signAndSendTx = async (data) => {
  // try {
  const tx = data.tx
  tx.gasLimit = data.gasLimit
  tx.gasPrice = data.gasPrice
  console.log(data, tx)

  // const web3 = await initWeb3()

  console.log(tx, 'before sendTransaction')
  // const receipt = await web3.eth.sendTransaction(tx)
  const receipt = await window.ethereum.request({
    method: 'eth_sendTransaction',
    params: [tx]
  })
  console.log(receipt, 'after sendTransaction')
  return receipt
  // } catch (error) {
  //   throw WalletError.NewUnknowError('can not send transaction now')
  // }
}
