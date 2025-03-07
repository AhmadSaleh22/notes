interface HttpConfig {
    port: number;
}
interface DataStoreConfig {
    host: string;
    port: number;
    database: string;
}
interface Config {
    http: HttpConfig;
    dataStore: DataStoreConfig;
}
export type { Config };
