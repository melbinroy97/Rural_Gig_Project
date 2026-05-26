const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');

const sendTokenResponse = (res, tokens, statusCode, userData) => {
  res.cookie('accessToken', tokens.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000, // 15 mins
  });

  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(statusCode).json({
    success: true,
    _id: userData._id,
    name: userData.name,
    email: userData.email,
    role: userData.role,
    avatar: userData.avatar,
    location: userData.location
  });
};

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { user, tokens } = await authService.register(req.body);
  sendTokenResponse(res, tokens, 201, user);
});

// @desc    Auth user & get token
// @route   POST /api/v1/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, tokens } = await authService.login(email, password);
  sendTokenResponse(res, tokens, 200, user);
});

// @desc    Logout user / clear cookie
// @route   POST /api/v1/auth/logout
// @access  Public
const logoutUser = (req, res) => {
  res.cookie('accessToken', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.cookie('refreshToken', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/v1/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.json(req.user);
});

// @desc    Refresh access token
// @route   POST /api/v1/auth/refresh-token
// @access  Public
const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  const tokens = await authService.refresh(token);

  res.cookie('accessToken', tokens.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000,
  });

  res.json({ success: true, message: "Token refreshed successfully" });
});

// @desc    Resolve pincode details proxying external India Post API to avoid CORS/SSL browser issues
// @route   GET /api/v1/auth/pincode/:pincode
// @access  Public
const resolvePincode = asyncHandler(async (req, res) => {
  const { pincode } = req.params;
  const https = require('https');

  try {
    const data = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.postalpincode.in',
        port: 443,
        path: `/pincode/${pincode}`,
        method: 'GET',
        rejectUnauthorized: false // Bypasses government server expired SSL certificates completely
      };

      const reqGet = https.request(options, (apiRes) => {
        let rawData = '';
        apiRes.on('data', (chunk) => { rawData += chunk; });
        apiRes.on('end', () => {
          try {
            resolve(JSON.parse(rawData));
          } catch (e) {
            reject(e);
          }
        });
      });

      reqGet.on('error', (e) => {
        reject(e);
      });
      reqGet.end();
    });

    res.json(data);
  } catch (err) {
    console.error('Pincode SSL-bypass proxy error:', err);
    res.status(200).json([{ Status: 'Error', Message: 'System connection error' }]);
  }
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  refreshToken,
  resolvePincode
};
