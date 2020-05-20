const jwt = require('jsonwebtoken')

const verify = (token, secert) => {
  try {
    jwt.verify(token, secret)
    return true
  } catch (error) {
    return false
  }
}

const verifyUser = (req, res, next) => {
  const token = ctx.get('Authorization')

  if (!token) res.status(401)

  if (
    verify(token, process.env.USER_SECRET) ||
    verify(token, process.env.ADMIN_SECRET)
  ) {
    next()
  } else {
    res.status(403)
  }
}

const verifyAdmin = async (ctx, next) => {
  const token = ctx.get('Authorization')

  if (!token) res.status(401)

  if (verify(token, process.env.ADMIN_SECRET)) {
    next()
  } else {
    res.status(403)
  }
}

module.exports = {
  verifyUser,
  verifyAdmin,
  sign: jwt.sign,
}
