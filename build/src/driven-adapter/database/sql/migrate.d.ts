import { Pool } from 'mysql2/promise';
type Migrate = ({ mysqlPool }: {
    mysqlPool: Pool;
}) => Promise<void>;
declare const migrate: Migrate;
export { migrate };
