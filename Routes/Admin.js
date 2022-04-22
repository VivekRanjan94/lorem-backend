const { connection } = require('../config/mysqlConfig')

const getAllOrdersQuery = () => {
  return new Promise((resolve, reject) => {
    try {
      connection.query('SELECT * FROM orders', (err, rows) => {
        if (err) {
          reject(err)
        } else {
          resolve(rows)
        }
      })
    } catch (e) {
      console.error(e)
      reject(e)
    }
  })
}

const getUsersQuery = () => {
  return new Promise((resolve, reject) => {
    try {
      connection.query('SELECT * FROM users', (err, rows) => {
        if (err) {
          reject(err)
        } else {
          resolve(rows)
        }
      })
    } catch (e) {
      console.error(e)
      reject(e)
    }
  })
}

const getAllOrders = async (req, res) => {
  try {
    const orders = await getAllOrdersQuery()

    return res.status(200).json({ success: true, orders })
  } catch (e) {
    console.error(e)
    return res.status(503).json({ success: false })
  }
}

const getUsers = async (req, res) => {
  try {
    const users = await getUsersQuery()

    return res.status(200).json({ success: true, users })
  } catch (e) {
    console.error(e)
    return res.status(503).json({ success: false })
  }
}

module.exports = { getAllOrders, getUsers }
