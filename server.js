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

// Routes
app.get('/user', returnUser)
app.post('/login', login)
app.post('/logout', logout)
app.post('/register', register)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
