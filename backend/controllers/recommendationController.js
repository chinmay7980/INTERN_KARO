const Internship = require('../models/Internship');
const User = require('../models/User');


const getRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const userSkills = user.skills || [];

    if (userSkills.length === 0) {

      const internships = await Internship.find({}).sort({ createdAt: -1 }).limit(10);
      return res.json(internships);
    }


    const recommendations = await Internship.find({
      skillsRequired: { $in: userSkills },
    });

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRecommendations };
