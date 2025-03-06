import { Router } from 'express';
import { App } from '@core/domain/entities/app.js';
declare const getHttpAppExpress: ({ app }: {
    app: App;
}) => Router;
export { getHttpAppExpress };
