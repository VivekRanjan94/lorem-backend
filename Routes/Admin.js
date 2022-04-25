const { connection } = require('../config/mysqlConfig')

const getAllOrdersQuery = () => {
  return new Promise((resolve, reject) => {
    try {
      connection.query(
        'SELECT orders.id as order_id, name as product_name, brand as product_brand, first_name as user_first_name, last_name as user_last_name, username as user_username FROM (orders LEFT JOIN products ON orders.product_id = products.id) LEFT JOIN users ON orders.user_id = users.id',
        (err, rows) => {
          if (err) {
            reject(err)
          } else {
            resolve(rows)
          }
        }
      )
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
