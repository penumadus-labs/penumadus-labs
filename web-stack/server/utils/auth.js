const { sign, verify } = require('jsonwebtoken')

const userSecret =
  'V}Dk,62m"TmIB*5Q~%2w}+p-bE_%!V4gd!SA%:Fq3xoZw2@^6^W_b}8Tr..pS"5'
const adminSecret =
  'X-f`cKADmAN9L3W/cbaDYGMa-X*-pveIhlmv/.;1lRD,db^q]O+)oZNz5ZIyR%S'

const signToken = (admin, payload) =>
  admin ? sign(payload, adminSecret) : sign(payload, userSecret)

const check = (token, secret) => {
  try {
    verify(token, secret)
    return true
  } catch (error) {
    return false
  }
}

const verifyToken = (admin) => (req, res, next) => {
  const token = req.cookies.token // req.get('token')

  if (!token) res.status(401)

  if (check(token, adminSecret) || (!admin && check(token, userSecret))) next()
  else res.status(403)
}

const verifyUserSocket = (token) =>
  check(token, userSecret) || check(token, adminSecret)

module.exports = {
  signToken,
  verifyToken,
  verifyUserSocket,
}
