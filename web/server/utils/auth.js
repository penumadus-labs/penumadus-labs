const { sign, verify } = require('jsonwebtoken')

const authDisabled =
  process.env.NODE_ENV === 'development' ||
  process.env.AUTH_DISABLED === 'disabled'

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
  } catch (_) {
    return false
  }
}

const verifyToken = (admin) => (req, res, next) => {
  if (authDisabled) return next()
  const token = req.cookies.token

  if (!token) return res.sendStatus(401)

  if (check(token, adminSecret) || (!admin && check(token, userSecret))) next()
  else return res.sendStatus(403)
}

const verifyUserSocket = (token) =>
  check(token, userSecret) || check(token, adminSecret) || authDisabled

module.exports = {
  signToken,
  verifyToken,
  verifyUserSocket,
}
