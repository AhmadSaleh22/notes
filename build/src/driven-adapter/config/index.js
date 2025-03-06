'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.getConfigs = void 0
const getConfigs = () => {
  let _a, _b, _c, _d
  return {
    http: {
      port: (_a = Number(process.env.PORT)) !== null && _a !== void 0 ? _a : 3000
    },
    dataStore: {
      host: (_b = process.env.DB_HOST) !== null && _b !== void 0 ? _b : 'localhost',
      port: (_c = Number(process.env.DB_PORT)) !== null && _c !== void 0 ? _c : 5432,
      database: (_d = process.env.DATA_BASE) !== null && _d !== void 0 ? _d : 'postgress'
    }
  }
}
exports.getConfigs = getConfigs
