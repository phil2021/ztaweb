const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, tokenService, emailService, userService } = require('../services');

/**
 * @desc      Sign Up Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } req.body - Body data
 * @returns   { JSON } - A JSON object representing the user data, and tokens
 */
const register = catchAsync(async (req, res) => {
  // 1) Create new user account
  const user = await userService.createUser(req.body);
  // 2) Generate tokens (access token & refresh token)
  const tokens = await tokenService.generateAuthTokens(user);

  res.status(httpStatus.CREATED).json({ user, tokens });
});

/**
 * @desc      Sign In Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } req.body.email - User email address
 * @property  { Object } req.body.password - User password
 * @returns   { JSON } - A JSON object representing the user data, and tokens
 */
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.OK).json({ user, tokens });
});

/**
 * @desc      Logout Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } req.body.refreshToken - User refresh token
 * @returns   { JSON } - An empty JSON object
 */
const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.OK).json({ status: 'Ok', message: 'Logged out successfully' });
});

/**
 * @desc      Generate Refresh Token Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } req.body.refreshToken - User refresh token
 * @returns   { JSON } - A JSON object representing the status and tokens
 */
const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

/**
 * @desc      Forgot Password Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } req.body.email - User email address
 * @returns   { JSON } - A JSON object representing the st
 */
const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * @desc      Reset Password Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { String } req.query.token - Token from request query
 * @property  { String } req.body.password - The new user password
 * @returns   { JSON } - A JSON object representing the status and message
 */
const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.OK).json({ status: 'Ok', message: 'Password reset successfully' });
});

/**
 * @desc      Send Verification Email Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } req.user - An object contains logged in user data
 * @returns   { JSON } - A JSON object representing the type and message
 */
const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.OK).json({ status: 'Ok', message: 'Verification email sent successfully' });
});

/**
 * @desc      Verify Email Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } req.query.token - Verification token from request query
 * @returns   { JSON } - A JSON object representing the type and message
 */
const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.OK).json({ status: 'Ok', message: 'Email Verification completed successfully' });
});

/**
 * @desc      Change Password Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { String } req.body.currentPassword - The user current password
 * @property  { String } req.body.password - The new user password
 * @property  { String } req.user.id - User ID
 * @returns   { JSON } - A JSON object representing the type and message
 */
const changePassword = catchAsync(async (req, res) => {
  const { currentPassword, password } = req.body;
  // 1) Calling reset password service
  await authService.passwordChange(currentPassword, password, req.user.id);

  // 2) If everything is OK, send data
  res.status(httpStatus.OK).json({ status: 'Ok', message: 'Password changed successfully' });
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  changePassword,
};
