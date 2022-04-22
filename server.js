// Environment variables config
require('dotenv').config()

// Imports
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const session = require('express-session')

const { initPassport } = require('./config/passportConfig')
const passport = require('passport')

const { login, logout, register, returnUser } = require('./Routes/Auth')
const { getAllOrders, getUsers } = require('./Routes/Admin')
const { getProducts, getOrders, addProduct } = require('./Routes/Seller')
const {
  getWishlist,
  getCart,
  moveToCart,
  moveToWishlist,
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
app.get('/get-all-products', getAllProducts)

// Admin Routes
app.get('/get-users', getUsers)
app.get('/get-all-orders', getAllOrders)

//Seller Routes
app.get('/get-products', getProducts)
app.get('/get-orders', getOrders)
app.post('/add-product', addProduct)

//Customer Routes
app.get('/get-wishlist', getWishlist)
app.get('/get-cart', getCart)
app.post('/move-to-cart', moveToCart)
app.post('/move-to-wishlist', moveToWishlist)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
