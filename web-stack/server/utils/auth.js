const { verify } = require('jsonwebtoken')

const userAuth = async (ctx, next) => {
  const token = ctx.get('Authorization')

  if (!token) ctx.throw(401)

  try {
    ctx.user = verify(token, process.env.USER_SECRET)
  } catch (error) {
    try {
      ctx.user = verify(token, process.env.ADMIN_SECRET)
    } catch (error) {
      ctx.throw(403)
    }
  }
  await next()
}

const adminAuth = async (ctx, next) => {
  const token = ctx.get('Authorization')

  if (!token) ctx.throw(401)

  try {
    ctx.user = verify(token, process.env.ADMIN_SECRET)
  } catch (error) {
    ctx.throw(403)
  }
  await next()
}

module.exports = {
  userAuth,
  adminAuth,
}
