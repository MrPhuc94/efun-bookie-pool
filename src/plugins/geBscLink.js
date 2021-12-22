export default (context, inject) => {
  const geBscLink = (link, type) => {
    const network = process.env.NODE_ENV === 'development' ? process.env.BLOCKCHAIN_NETWORK : process.env.BLOCKCHAIN_NETWORK_MAINNET
    if (type === 'address') {
      return network === 'TESTNET'
        ? `https://testnet.bscscan.com/address/${link}`
        : `https://bscscan.com/address/${link}`
    } else {
      return network === 'TESTNET'
        ? `https://testnet.bscscan.com/tx/${link}`
        : `https://bscscan.com/tx/${link}`
    }
  }

  // Inject $convertTime(item) in Vue, context, and store
  inject('geBscLink', geBscLink)
  context.$geBscLink = geBscLink
}
