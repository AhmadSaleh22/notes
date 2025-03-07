import express from 'express';
import http from 'http';
type GetExpressOpenApiServer = ({ app, port }: {
    app: express.Express;
    port: number;
}) => http.Server;
declare const getExpressOpenApiServer: GetExpressOpenApiServer;
export { getExpressOpenApiServer };
