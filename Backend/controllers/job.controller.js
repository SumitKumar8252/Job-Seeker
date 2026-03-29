import Job from "../models/job.model.js";

// ✅ Create Job (ADMIN ONLY)
export const createJob = async (req, res) => {
  try {
    const { company, role, salary } = req.body;

    if (!company || !role) {
      return res.status(400).json({ message: "Company and role are required" });
    }

    const job = await Job.create({
      company,
      role,
      salary,
      createdBy: req.user.id, // admin id
    });

    res.status(201).json({
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Get All Jobs (USERS)
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("createdBy", "name email");

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
