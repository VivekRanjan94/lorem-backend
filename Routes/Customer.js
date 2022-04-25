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

const addToCartQuery = (user_id, product_id) => {
  return new Promise((resolve, reject) => {
    try {
      connection.query(
        `INSERT INTO cart (user_id, product_id) VALUES (${user_id}, ${product_id})`,
        (err, rows) => {
          if (err) {
            reject(err)
          } else {
            resolve(true)
          }
        }
      )
    } catch (e) {
      reject(e)
    }
  })
}

const addToCart = async (req, res) => {
  const { user_id, product_id } = req.body
  try {
    await addToCartQuery(user_id, product_id)

    return res.status(200).json({ success: true })
  } catch (e) {
    return res.status(503).json({ success: false, message: e })
  }
}

const addToWishlistQuery = (user_id, product_id) => {
  return new Promise((resolve, reject) => {
    try {
      connection.query(
        `INSERT INTO wishlist (user_id, product_id) VALUES (${user_id}, ${product_id})`,
        (err, rows) => {
          if (err) {
            reject(err)
          } else {
            resolve(true)
          }
        }
      )
    } catch (e) {
      reject(e)
    }
  })
}

const addToWishlist = async (req, res) => {
  const { user_id, product_id } = req.body
  try {
    await addToWishlistQuery(user_id, product_id)

    return res.status(200).json({ success: true })
  } catch (e) {
    return res.status(503).json({ success: false, message: e })
  }
}

const deleteFromCartQuery = (user_id, product_id) => {
  return new Promise((resolve, reject) => {
    try {
      connection.query(
        `DELETE FROM cart WHERE user_id = ${user_id} AND product_id = ${product_id})`,
        (err, rows) => {
          if (err) {
            reject(err)
          } else {
            resolve(true)
          }
        }
      )
    } catch (e) {
      reject(e)
    }
  })
}

const deleteFromCart = async (req, res) => {
  const { user_id, product_id } = req.body
  try {
    await deleteFromCartQuery(user_id, product_id)

    return res.status(200).json({ success: true })
  } catch (e) {
    return res.status(503).json({ success: false, message: e })
  }
}

const deleteFromWishlistQuery = (user_id, product_id) => {
  return new Promise((resolve, reject) => {
    try {
      connection.query(
        `DELETE FROM wishlist WHERE user_id = ${user_id} AND product_id = ${product_id})`,
        (err, rows) => {
          if (err) {
            reject(err)
          } else {
            resolve(true)
          }
        }
      )
    } catch (e) {
      reject(e)
    }
  })
}

const deleteFromWishlist = async (req, res) => {
  const { user_id, product_id } = req.body
  try {
    await deleteFromWishlistQuery(user_id, product_id)

    return res.status(200).json({ success: true })
  } catch (e) {
    return res.status(503).json({ success: false, message: e })
  }
}

const moveToCartQuery = (user_id, product_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      await addToCartQuery(user_id, product_id)
      await deleteFromWishlistQuery(user_id, product_id)
    } catch (e) {
      reject(e)
    }
  })
}

const moveToCart = async (req, res) => {
  const { user_id, product_id } = req.body

  try {
    await moveToCartQuery(user_id, product_id)

    return res.status(200).json({ success: true })
  } catch (e) {
    return res.status(503).json({ success: false })
  }
}

const moveToWishlistQuery = (user_id, product_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      await addToWishlistQuery(user_id, product_id)
      await deleteFromCartQuery(user_id, product_id)
    } catch (e) {
      reject(e)
    }
  })
}

const moveToWishlist = async (req, res) => {}

module.exports = {
  getCart,
  getWishlist,
  moveToCart,
  moveToWishlist,
  addToCart,
  addToWishlist,
  deleteFromCart,
  deleteFromWishlist,
}
