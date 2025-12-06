const Internship = require('../models/Internship');


const getInternships = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;



    let query = {};

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { title: searchRegex },
        { company: searchRegex },
        { description: searchRegex },
      ];
    }

    if (req.query.location) {
      query.location = new RegExp(req.query.location, 'i');
    }

    if (req.query.skills) {
      const skillsArray = req.query.skills.split(',').map(skill => skill.trim());
      query.skillsRequired = { $in: skillsArray };
    }

    if (req.query.minStipend || req.query.maxStipend) {
    }

    let sortOptions = {};
    if (req.query.sortBy) {
      const sortOrder = req.query.order === 'asc' ? 1 : -1;
      sortOptions[req.query.sortBy] = sortOrder;
    } else {
      sortOptions.createdAt = -1;
    }

    const internships = await Internship.find(query)
      .sort(sortOptions)
      .limit(limit)
      .skip(skip);

    const totalInternships = await Internship.countDocuments(query);
    const totalPages = Math.ceil(totalInternships / limit);

    res.json({
      internships,
      pagination: {
        currentPage: page,
        totalPages,
        totalInternships,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getInternshipById = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);

    if (internship) {
      res.json(internship);
    } else {
      res.status(404).json({ message: 'Internship not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const createInternship = async (req, res) => {
  const {
    title,
    company,
    location,
    duration,
    stipend,
    skillsRequired,
    description,
    applyLink,
    deadline,
  } = req.body;

  try {
    const internship = new Internship({
      title,
      company,
      location,
      duration,
      stipend,
      skillsRequired,
      description,
      applyLink,
      deadline,
      postedBy: req.user._id,
    });

    const createdInternship = await internship.save();
    res.status(201).json(createdInternship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateInternship = async (req, res) => {
  const {
    title,
    company,
    location,
    duration,
    stipend,
    skillsRequired,
    description,
    applyLink,
    deadline,
  } = req.body;

  try {
    const internship = await Internship.findById(req.params.id);

    if (internship) {
      internship.title = title || internship.title;
      internship.company = company || internship.company;
      internship.location = location || internship.location;
      internship.duration = duration || internship.duration;
      internship.stipend = stipend || internship.stipend;
      internship.skillsRequired = skillsRequired || internship.skillsRequired;
      internship.description = description || internship.description;
      internship.applyLink = applyLink || internship.applyLink;
      internship.deadline = deadline || internship.deadline;

      const updatedInternship = await internship.save();
      res.json(updatedInternship);
    } else {
      res.status(404).json({ message: 'Internship not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);

    if (internship) {
      await internship.deleteOne();
      res.json({ message: 'Internship removed' });
    } else {
      res.status(404).json({ message: 'Internship not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getInternships,
  getInternshipById,
  createInternship,
  updateInternship,
  deleteInternship,
};
