const { connection } = require('../config/mysqlConfig')

const getAllProductsQuery = () => {
  return new Promise((resolve, reject) => {
    try {
      connection.query(
        'SELECT products.name as name,products.brand as brand, products.image as image, products.price as price, products.id as id, users.id as seller_id FROM products INNER JOIN users ON products.seller_id = users.id',
        (err, rows) => {
          if (err) {
            console.error(err)
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
const getAllProducts = async (req, res) => {
  try {
    const products = await getAllProductsQuery()

    return res.status(200).json({ success: true, products })
  } catch (e) {
    return res.status(503).json({ success: false })
  }
}

module.exports = {
  getAllProducts,
}
