const assert = require('assert')

module.exports = class Pluggable {
  constructor() {
    this._plugins = new Map()
  }

  plugin(event, handler) {
    assert.equal(typeof event, 'string')
    assert.equal(typeof handler, 'function')

    let handlers = this._plugins.get(event)

    if (!handlers) {
      handlers = new Set()
      this._plugins.set(event, handler)
    }

    handlers.add(handler)
  }

  async apply(event, ...args) {
    console.log(event)
    const handlers = this._plugins.get(event)
    if (handlers && handlers.size > 0) {
      for (let handler of handlers) {
        await Promise.resolve(handler.apply(this, args))
      }
    }
  }

  async applyImmediate(event, ...args) {
    const handlers = this._plugins.get(event)
    if (handlers && handlers.size > 0) {
      const promises = Array.from(handlers).map(handler => {
        return Promise(handler.apply(this, args))
      })
      await Promise.all(promises)
    }
  }
}
