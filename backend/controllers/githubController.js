const axios = require('axios');
const User = require('../models/User');


const getGithubProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user.githubUsername) {
    return res.status(400).json({ message: 'GitHub username not found in profile' });
  }

  try {
    const headers = {
      'User-Agent': 'InternKaro',
    };

    console.log(`Fetching GitHub profile for user: ${user.githubUsername}`);
    
    if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
      console.log('Using GitHub Client ID/Secret for authentication');
      headers['Authorization'] = `Basic ${Buffer.from(
        process.env.GITHUB_CLIENT_ID + ':' + process.env.GITHUB_CLIENT_SECRET
      ).toString('base64')}`;
    } else {
      console.log('No GitHub Client ID/Secret found, making unauthenticated request');
    }


    const reposRes = await axios.get(
      `https://api.github.com/users/${user.githubUsername}/repos?sort=updated&per_page=10`,
      { headers }
    );

    const repos = reposRes.data;


    const skills = new Set();
    for (const repo of repos) {
      if (repo.language) {
        skills.add(repo.language);
      }
    }


    user.skills = Array.from(skills);
    await user.save();

    res.json({
      username: user.githubUsername,
      repos: repos.map((repo) => ({
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        language: repo.language,
        stars: repo.stargazers_count,
      })),
      skills: Array.from(skills),
    });
  } catch (error) {
    console.error('GitHub API Error:', error.response?.data || error.message);
    const statusCode = error.response?.status || 500;
    let message = error.response?.data?.message || 'Error fetching GitHub data';
    
    if (statusCode === 404) {
      message = `GitHub user '${user.githubUsername}' not found`;
    }

    res.status(statusCode).json({ message });
  }
};

module.exports = { getGithubProfile };
