import { SecretStore } from './secret-store';
type GetSecretsEnv = () => SecretStore;
declare const getSecretStoreEnv: GetSecretsEnv;
export { getSecretStoreEnv };
