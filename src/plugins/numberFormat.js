import { numberFormat as libNumberFormat } from '~/utils/helper'

export default (context, inject) => {
  const numberFormat = (item, number = 5, callback = null) => {
    if (typeof callback === 'function') {
      callback(item)
    }

    return libNumberFormat(item, number)
  }

  // Inject $numberFormat(item) in Vue, context, and store
  inject('numberFormat', numberFormat)
  context.$numberFormat = numberFormat
}
