'use strict'
const __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { default: mod }
}
Object.defineProperty(exports, '__esModule', { value: true })
exports.getSQLPool = void 0
const promise_1 = __importDefault(require('mysql2/promise')) // Use the promise-based version
const getSQLPool = ({ config, secretStore }) => {
  return promise_1.default.createPool({
    host: config.host,
    port: config.port,
    database: config.database,
    user: secretStore.get({ key: 'MYSQL_USER' }),
    password: secretStore.get({ key: 'host' }),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  })
}
exports.getSQLPool = getSQLPool
