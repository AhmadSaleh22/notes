import { Config } from '@core/driven-port/config/config';
import { DataStorage } from '@core/driven-port/store/storage';
import { SecretStore } from '@core/driven-port/SecretStore/secret-store';
type GetDataStorage = ({ config, secretStore }: {
    config: Config['dataStore'];
    secretStore: SecretStore;
}) => Promise<DataStorage>;
declare const getDataStorage: GetDataStorage;
export { getDataStorage };
