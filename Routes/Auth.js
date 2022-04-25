const { connection } = require('../config/mysqlConfig')
const passport = require('passport')
const bcrypt = require('bcrypt')

const login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error(err)
      return res
        .status(503)
        .json({ success: false, message: 'Could not authenticate', error: err })
    }

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'Incorrect username' })
    }

    req.logIn(user, (err) => {
      if (err) throw err
      return res.status(200).json({ success: true, user })
    })
  })(req, res, next)
}

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(503).json({ success: false, message: err })
    }
    return res.status(200).json({ success: true })
  })
}

const addNewUser = (user) => {
  return new Promise(async (resolve, reject) => {
    const exists = await checkUsernameExists(user.username)
    if (exists) {
      reject('Username taken')
    } else {
      const hashedPassword = await bcrypt.hash(user.password, 10)
      const newUser = { ...user, password: hashedPassword }

      connection.query(' INSERT INTO users SET ? ', newUser, (err, rows) => {
        if (err) {
          reject('Could not execute query')
        }
        resolve('User created')
      })
    }
  })
}

const register = async (req, res) => {
  const { username, password, first_name, last_name, type } = req.body

  const newUser = { username, password, first_name, last_name, type }
  try {
    await addNewUser(newUser)
    return res.status(200).json({ success: true })
  } catch (e) {
    return res
      .status(503)
      .json({ success: false, message: 'failed to register' })
  }
}

const checkUsernameExists = (username) => {
  return new Promise((resolve, reject) => {
    try {
      connection.query(
        ' SELECT * FROM `users` WHERE `username` = ?  ',
        username,
        function (err, rows) {
          if (err) {
            reject(err)
          }
          if (rows.length > 0) {
            resolve(true)
          } else {
            resolve(false)
          }
        }
      )
    } catch (err) {
      reject(err)
    }
  })
}

const returnUser = (req, res) => {
  if (!req.user) {
    return res.status(404).json({ success: false, message: 'Not logged in' })
  }

  res.status(200).json({ success: true, user: req.user })
}

const privateRoute = (req, res, next) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ success: false, message: 'Access Denied' })
  }

  next()
}

const adminRoute = (req, res, next) => {
  if (req.user.type === 'admin') {
    next()
  } else {
    return res.status(401).json({ success: false, message: 'Access Denied' })
  }
}

const sellerRoute = (req, res, next) => {
  if (req.user.type === 'seller') {
    next()
  } else {
    return res.status(401).json({ success: false, message: 'Access Denied' })
  }
}

const customerRoute = (req, res, next) => {
  if (req.user.type === 'customer') {
    next()
  } else {
    return res.status(401).json({ success: false, message: 'Access Denied' })
  }
}

module.exports = {
  login,
  logout,
  register,
  returnUser,
  privateRoute,
  adminRoute,
  sellerRoute,
  customerRoute,
}
