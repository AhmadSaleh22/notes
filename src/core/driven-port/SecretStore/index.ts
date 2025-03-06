import { SecretStore } from './secret-store'

type GetSecretsEnv = () => SecretStore

const getSecretStoreEnv: GetSecretsEnv = () => {
  const secrets = process.env

  return {
    get: ({ key }) => secrets[key],
    _set: ({ key, value }) => {
      process.env[key] = value
    }
  }
}

export { getSecretStoreEnv }
