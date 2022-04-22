const { connection } = require('../config/mysqlConfig')

const getCartQuery = (id) => {
  return new Promise((resolve, reject) => {
    try {
      connection.query(
        'SELECT * FROM cart WHERE user_id = ? ',
        id,
        (err, rows) => {
          if (err) {
            reject(err)
          }

          resolve(rows)
        }
      )
    } catch (e) {
      reject(e)
    }
  })
}

const getCart = async (req, res) => {
  const { user_id } = req.body

  try {
    const cart = await getCartQuery(user_id)

    return res.status(200).json({ success: true, cart })
  } catch (e) {
    return res.status(503).json({ success: false })
  }
}

const getWishlistQuery = (id) => {
  return new Promise((resolve, reject) => {
    try {
      connection.query(
        'SELECT * FROM wishlist WHERE user_id = ? ',
        id,
        (err, rows) => {
          if (err) {
            reject(err)
          }

          resolve(rows)
        }
      )
    } catch (e) {
      reject(e)
    }
  })
}

const getWishlist = async (req, res) => {
  const { user_id } = req.body

  try {
    const wishlist = await getWishlistQuery(user_id)

    return res.status(200).json({ success: true, wishlist })
  } catch (e) {
    return res.status(503).json({ success: false })
  }
}

const moveToCart = async (req, res) => {}
const moveToWishlist = async (req, res) => {}

module.exports = {
  getCart,
  getWishlist,
  moveToCart,
  moveToWishlist,
}
