import { Express } from 'express';
import { App } from '@core/domain/entities/app.js';
import { Config } from '@core/driven-port/config/config.js';
import { getExpressOpenApiServer } from './server.js';
type GetHttpExpress = ({ app, config }: {
    app: App;
    config: Config['http'];
}) => {
    app: Express;
    server: ReturnType<typeof getExpressOpenApiServer>;
};
declare const getHttpExpress: GetHttpExpress;
export { getHttpExpress };
