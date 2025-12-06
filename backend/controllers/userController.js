const User = require('../models/User');
const Internship = require('../models/Internship');


const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateUserProfile = async (req, res, next) => {
  try {
    console.log('updateUserProfile called with user:', req.user?._id);
    console.log('Request body:', req.body);
    
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.githubUsername = req.body.githubUsername || user.githubUsername;
    user.skills = req.body.skills || user.skills;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    console.log('User updated successfully:', updatedUser._id);

    return res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      githubUsername: updatedUser.githubUsername,
      skills: updatedUser.skills,
    });
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    return res.status(500).json({ message: error.message });
  }
};


const getSavedInternships = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('savedInternships');
    res.json(user.savedInternships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const toggleSavedInternship = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const internshipId = req.params.id;

    const internship = await Internship.findById(internshipId);
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    if (user.savedInternships.includes(internshipId)) {
      // Unsave
      user.savedInternships = user.savedInternships.filter(
        (id) => id.toString() !== internshipId
      );
      await user.save();
      res.json({ message: 'Internship removed from saved list', isSaved: false });
    } else {
      // Save
      user.savedInternships.push(internshipId);
      await user.save();
      res.json({ message: 'Internship saved successfully', isSaved: true });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const removeSavedInternship = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const internshipId = req.params.id;

    if (user.savedInternships.includes(internshipId)) {
      user.savedInternships = user.savedInternships.filter(
        (id) => id.toString() !== internshipId
      );
      await user.save();
      res.json({ message: 'Internship removed from saved list' });
    } else {
      res.status(404).json({ message: 'Internship not in saved list' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteUserAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = false;
    await user.save();

    res.json({ message: 'Account deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getSavedInternships,
  toggleSavedInternship,
  removeSavedInternship,
  deleteUserAccount,
};
