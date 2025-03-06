'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.getSecretStoreEnv = void 0
const getSecretStoreEnv = () => {
  const secrets = process.env
  return {
    get: ({ key }) => secrets[key],
    _set: ({ key, value }) => {
      process.env[key] = value
    }
  }
}
exports.getSecretStoreEnv = getSecretStoreEnv
