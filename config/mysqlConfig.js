const mysql = require('mysql2')

const dbConnection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true,
})

dbConnection.connect((err) => {
  if (!err) {
    console.log(`Connected to MySQL database ${process.env.DB_NAME}`)
  } else {
    console.warn('Failed to connect to database', err)
  }
})

module.exports = { connection: dbConnection }
