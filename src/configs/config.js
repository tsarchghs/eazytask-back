require('dotenv').config()

const databaseUrl = process.env.DATABASE_URL || process.env.database_url || process.env.CLEARDB_DATABASE_URL

module.exports = {
  "development": {
    "username": process.env.MYSQL_USERNAME,
    "password": process.env.MYSQL_PASSWORD,
    "database": process.env.MYSQL_DATABASE,
    "host": process.env.MYSQL_HOST,
    "dialect": "mysql",
  },
  "staging": {
    "url": databaseUrl,
    "dialect": process.env.DATABASE_URL || process.env.database_url ? "postgres" : "mysql",
  },
}
