import type { Config } from '@core/driven-port/config/config';
import type { SecretStore } from '@core/driven-port/SecretStore/secret-store';
import mysql from 'mysql2/promise';
type GetSQLPool = ({ config, secretStore }: {
    config: Config['dataStore'];
    secretStore: SecretStore;
}) => mysql.Pool;
declare const getSQLPool: GetSQLPool;
export { getSQLPool };
