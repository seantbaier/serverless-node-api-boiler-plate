import httpStatus from 'http-status'
import * as tokenService from './token.service'
import * as userService from './user.service'
import Token from '../models/token.model'
import ApiError from '../utils/ApiError'
import tokenTypes from '../config/tokens'

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email)
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password')
  }
  return user
}

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async refreshToken => {
  const refreshTokenDoc = await Token.findOne({
    token: refreshToken,
    type: tokenTypes.REFRESH,
    blacklisted: false,
  })
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found')
  }
  await refreshTokenDoc.remove()
}

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async refreshToken => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(
      refreshToken,
      tokenTypes.REFRESH
    )
    const user = await userService.getUserById(refreshTokenDoc.user)
    if (!user) {
      throw new Error()
    }
    await refreshTokenDoc.remove()
    return tokenService.generateAuthTokens(user)
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate')
  }
}

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(
      resetPasswordToken,
      tokenTypes.RESET_PASSWORD
    )
    const user = await userService.getUserById(resetPasswordTokenDoc.user)
    if (!user) {
      throw new Error()
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD })
    await userService.updateUserById(user.id, { password: newPassword })
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed')
  }
}

export { loginUserWithEmailAndPassword, logout, refreshAuth, resetPassword }
