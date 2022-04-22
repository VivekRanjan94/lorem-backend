const passport = require('passport')
const passportLocal = require('passport-local')
const { connection } = require('./mysqlConfig')
const bcrypt = require('bcrypt')

const localStrategy = passportLocal.Strategy

const findUserByUsername = (username) => {
  return new Promise((resolve, reject) => {
    try {
      connection.query(
        'SELECT * FROM users WHERE username = ? ',
        username,
        (err, rows) => {
          if (err) {
            reject(err)
          }

          resolve(rows[0])
        }
      )
    } catch (e) {
      console.error(e)
      reject(e)
    }
  })
}

const comparePassword = (user, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isMatch = await bcrypt.compare(password, user.password)
      if (isMatch) {
        resolve(true)
      } else {
        reject('Incorrect password')
      }
    } catch (e) {
      reject(e)
    }
  })
}

const findUserById = (id) => {
  return new Promise((resolve, reject) => {
    try {
      connection.query('SELECT * FROM users where id = ?', id, (err, rows) => {
        if (err) {
          reject(err)
        }
        resolve(rows[0])
      })
    } catch (e) {
      reject(e)
    }
  })
}

const initPassport = () => {
  passport.use(
    new localStrategy(
      {
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        try {
          const user = await findUserByUsername(username)

          if (!user) {
            done(null, false)
          } else {
            const isCorrectPassword = await comparePassword(user, password)

            if (isCorrectPassword) {
              return done(null, user, null)
            } else {
              return done(null, false)
            }
          }
        } catch (e) {
          return done(null, false, e)
        }
      }
    )
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    findUserById(id)
      .then((user) => {
        return done(null, user)
      })
      .catch((error) => {
        return done(error, null)
      })
  })
}

module.exports = {
  comparePassword,
  findUserByUsername,
  findUserById,
  initPassport,
}
