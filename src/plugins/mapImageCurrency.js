export default (context, inject) => {
  const mapImageCurrency = (name) => {
    if (name) {
      return require(`~/assets/image/coin/${name}.png`)
    } else {
      return require('~/assets/image/coin/BNB.png')
    }
  }

  // Inject $mapImageCurrency(item) in Vue, context, and store
  inject('mapImageCurrency', mapImageCurrency)
  context.$mapImageCurrency = mapImageCurrency
}
