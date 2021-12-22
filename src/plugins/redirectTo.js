export default (context, inject) => {
  const redirectTo = (href, callback = null) => {
    if (typeof callback === 'function') {
      callback(href)
    }

    return context.app.router.push(href)
  }
  inject('redirectTo', redirectTo)
  context.$redirectTo = redirectTo
}
