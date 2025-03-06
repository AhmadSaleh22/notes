import { App } from './domain/entities/app';
import { DataStorage } from './driven-port/store/storage';
type GetApp = ({ dataStore }: {
    dataStore: DataStorage;
}) => App;
declare const getApp: GetApp;
export { getApp };
