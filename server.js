// Environment variables config
require('dotenv').config()

// Imports
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const session = require('express-session')

const { initPassport } = require('./config/passportConfig')
const passport = require('passport')

const {
  login,
  logout,
  register,
  returnUser,
  privateRoute,
  adminRoute,
  sellerRoute,
  customerRoute,
} = require('./Routes/Auth')
const { getAllOrders, getUsers } = require('./Routes/Admin')
const { getProducts, getOrders, addProduct } = require('./Routes/Seller')
const {
  getWishlist,
  getCart,
  moveToCart,
  moveToWishlist,
  addToCart,
  addToWishlist,
  deleteFromCart,
  deleteFromWishlist,
  checkout,
} = require('./Routes/Customer')
const { getAllProducts } = require('./Routes/Common')

// Express instance
const app = express()

const PORT = process.env.PORT || 5000

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser('secret'))
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  })
)

// Passport
app.use(passport.initialize())
app.use(passport.session())
initPassport()

// Auth Routes
app.get('/user', returnUser)
app.post('/login', login)
app.post('/logout', logout)
app.post('/register', register)

// Common Route
app.get('/get-all-products', privateRoute, getAllProducts)

// Admin Routes
app.get('/get-users', privateRoute, adminRoute, getUsers)
app.get('/get-all-orders', privateRoute, adminRoute, getAllOrders)

//Seller Routes
app.get('/get-products', privateRoute, sellerRoute, getProducts)
app.get('/get-orders', privateRoute, sellerRoute, getOrders)
app.post('/add-product', privateRoute, sellerRoute, addProduct)

//Customer Routes
app.get('/get-wishlist', privateRoute, customerRoute, getWishlist)
app.get('/get-cart', privateRoute, customerRoute, getCart)
app.post('/add-to-cart', privateRoute, customerRoute, addToCart)
app.post('/add-to-wishlist', privateRoute, customerRoute, addToWishlist)
app.post('/move-to-cart', privateRoute, customerRoute, moveToCart)
app.post('/move-to-wishlist', privateRoute, customerRoute, moveToWishlist)
app.post('/delete-from-cart', privateRoute, customerRoute, deleteFromCart)
app.post(
  '/delete-from-wishlist',
  privateRoute,
  customerRoute,
  deleteFromWishlist
)
app.post('/checkout', privateRoute, customerRoute, checkout)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
