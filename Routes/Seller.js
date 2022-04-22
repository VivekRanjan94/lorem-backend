const { connection } = require('../config/mysqlConfig')

const getOrdersQuery = (id) => {
  return new Promise((resolve, reject) => {
    try {
      connection.query(
        'SELECT * FROM (orders INNER JOIN products WHERE orders.product_id = products.id) Where seller_id = ? ',
        id,
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

const getProductsQuery = (id) => {
  return new Promise((resolve, reject) => {
    try {
      connection.query(
        'SELECT * FROM products WHERE seller_id = ?',
        id,
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

const getOrders = async (req, res) => {
  const { seller_id } = req.body
  try {
    const orders = await getOrdersQuery(seller_id)

    return res.status(200).json({ success: true, orders })
  } catch (e) {
    console.error(e)
    return res.status(503).json({ success: false })
  }
}

const getProducts = async (req, res) => {
  const { seller_id } = req.body
  try {
    const products = await getProductsQuery(seller_id)

    return res.status(200).json({ success: true, products })
  } catch (e) {
    console.error(e)
    return res.status(503).json({ success: false })
  }
}

// { name, brand, price, image, seller_id }
const addProductQuery = ({ name, brand, price, image, seller_id }) => {
  return new Promise((resolve, reject) => {
    try {
      connection.query(
        `INSERT INTO \`products\` (\`name\`, \`brand\`, \`price\`, \`image\`, \`seller_id\`) VALUES ('${name}', '${brand}', ${price}, '${image}', ${seller_id})`,
        (err, rows) => {
          if (err) {
            reject(err)
          } else {
            resolve(rows)
          }
        }
      )
    } catch (e) {
      reject(e)
    }
  })
}

const addProduct = async (req, res) => {
  const { product } = req.body
  try {
    await addProductQuery(product)

    return res.status(200).json({ success: true })
  } catch (e) {
    console.error(e)
    return res.status(503).json({ success: false })
  }
}

module.exports = { getOrders, getProducts, addProduct }
