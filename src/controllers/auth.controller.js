import httpStatus from 'http-status'
import catchAsync from '../utils/catchAsync'
import {
  authService,
  userService,
  tokenService,
  emailService,
} from '../services'
import ApiError from '../utils/ApiError'

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body)
  const tokens = await tokenService.generateAuthTokens(user)
  res.status(httpStatus.CREATED).send({ user, tokens })
})

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body
  const user = await authService.loginUserWithEmailAndPassword(email, password)
  const tokens = await tokenService.generateAuthTokens(user)
  res.send({ user, tokens })
})

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken)
  res.status(httpStatus.NO_CONTENT).send()
})

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken)
  res.send({ ...tokens })
})

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(
    req.body.email
  )
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken)
  res.status(httpStatus.NO_CONTENT).send()
})

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password)
  res.status(httpStatus.NO_CONTENT).send()
})

const getCurrentUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId)
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
  }
  res.send(user)
})

export {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  getCurrentUser,
}
