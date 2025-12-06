const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const githubLogin = (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = `${process.env.VITE_BACKEND_URL || 'http://localhost:5001'}/api/auth/callback`;
  const scope = 'read:user user:email';
  
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
  
  res.redirect(githubAuthUrl);
};

const githubCallback = async (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    return res.redirect(`${process.env.VITE_FRONTEND_URL || 'http://localhost:5173'}/login?error=no_code`);
  }

  try {
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    if (!accessToken) {
      return res.redirect(`${process.env.VITE_FRONTEND_URL || 'http://localhost:5173'}/login?error=no_token`);
    }

    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const githubUser = userResponse.data;

    const emailResponse = await axios.get('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const primaryEmail = emailResponse.data.find((email) => email.primary)?.email || githubUser.email;

    if (!primaryEmail) {
      return res.redirect(`${process.env.VITE_FRONTEND_URL || 'http://localhost:5173'}/login?error=no_email`);
    }

    let user = await User.findOne({ email: primaryEmail });

    if (!user) {
      user = await User.create({
        name: githubUser.name || githubUser.login,
        email: primaryEmail,
        password: Math.random().toString(36).slice(-8), // Random password for OAuth users
        githubUsername: githubUser.login,
        role: 'student',
      });
    } else {
      if (!user.githubUsername) {
        user.githubUsername = githubUser.login;
        await user.save();
      }
    }

    const token = generateToken(user._id);

    res.redirect(`${process.env.VITE_FRONTEND_URL || 'http://localhost:5173'}/auth/success?token=${token}&userId=${user._id}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}&role=${user.role}&githubUsername=${encodeURIComponent(user.githubUsername || '')}`);
  } catch (error) {
    console.error('GitHub OAuth Error:', error.response?.data || error.message);
    res.redirect(`${process.env.VITE_FRONTEND_URL || 'http://localhost:5173'}/login?error=oauth_failed`);
  }
};

module.exports = { githubLogin, githubCallback };
