
// require('dotenv').config({ path: "__test__/.test.env" })

process.env.MYSQL_HOST = "localhost"
process.env.MYSQL_DATABASE = "eazytask_test"
process.env.MYSQL_USERNAME = "root"
process.env.MYSQL_PASSWORD = "gjergji.123"
process.env.DROP_TABLES = true
process.env.FORCE_SYNC_DB = true
process.env.CUSTOM_ENV_PATH = true

module.exports = {
    setupFilesAfterEnv: ['./jest.setup.js'],
    collectCoverage: true,
    collectCoverageFrom: ["src/*.js", "src/*/*.js", "src/*/*/*.js"]
};