import { NETWORKS_CONFIG } from '~/configs/network.js'
export const setupNetwork = async (switchChainId) => {
  const provider = window.ethereum
  if (provider) {
    const chainId = parseInt(
      switchChainId?.toString(),
      10
    )
    const network = NETWORKS_CONFIG[chainId]
    if (!network) {
      return false
    }
    try {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${chainId.toString(16)}`,
            chainName: network.chainName || network.name,
            nativeCurrency: network.nativeCurrency,
            rpcUrls: network.rpcUrls,
            blockExplorerUrls: [network.blockExplorer.url]
          }
        ]
      })
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  } else {
    console.error(
      "Can't setup the BSC network on metamask because window.ethereum is undefined"
    )
    return false
  }
}
