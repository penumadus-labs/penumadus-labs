const jwt = require('jsonwebtoken')

const userSecret =
  'V}Dk,62m"TmIB*5Q~%2w}+p-bE_%!V4gd!SA%:Fq3xoZw2@^6^W_b}8Tr..pS"5'
const adminSecret =
  'X-f`cKADmAN9L3W/cbaDYGMa-X*-pveIhlmv/.;1lRD,db^q]O+)oZNz5ZIyR%S'

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

  if (verify(token, userSecret) || verify(token, adminSecret)) {
    next()
  } else {
    res.status(403)
  }
}

const verifyAdmin = async (ctx, next) => {
  const token = ctx.get('Authorization')

  if (!token) res.status(401)

  if (verify(token, adminSecret)) {
    next()
  } else {
    res.status(403)
  }
}

const signUser = (payload) => {
  return jwt.sign(payload, userSecret)
}

const signAdmin = (payload) => {
  return jwt.sign(payload, adminSecret)
}

module.exports = {
  signUser,
  signAdmin,
  verifyUser,
  verifyAdmin,
}
