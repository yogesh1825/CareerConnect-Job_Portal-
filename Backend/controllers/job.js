import { Job } from "../models/job.model.js";

// Post Job By Admin
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      salaryType,
      location,
      jobType,
      experience,
      position,
      companyId,
    } = req.body;
    const userId = req.id;

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !salaryType ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    ) {
      return res.status(400).json({
        message: "Somethin is missing.",
        success: false,
      });
    }
    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      salaryType,
      location,
      jobType,
      experienceLevel: experience,
      position,
      company: companyId,
      created_by: userId,
    });
    return res.status(201).json({
      message: "New job created successfully.",
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// Get all jobs
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    
    // Create a robust query
    const query = keyword ? {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { location: { $regex: keyword, $options: "i" } }
      ],
    } : {}; // If no keyword, return all jobs
    
    // Ensure we have proper error handling and timeout protection
    const jobs = await Promise.race([
      Job.find(query)
        .populate({
          path: "company",
        })
        .sort({ createdAt: -1 }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database query timeout')), 5000)
      )
    ]);
    
    // Always return success true with jobs (even if empty array)
    return res.status(200).json({
      jobs: Array.isArray(jobs) ? jobs : [], // Ensure we return an array
      success: true,
    });
  } catch (error) {
    console.error("Error in getAllJobs:", error);
    return res.status(500).json({
      message: "Error fetching jobs",
      success: false,
      error: error.message
    });
  }
};

// get job by id for User
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
    });
    if (!job) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false,
      });
    }
    return res.status(200).json({ job, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error fetching job details",
      success: false,
    });
  }
};

// Get job by ID for admins (with ownership check)
export const getAdminJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const adminId = req.id;
    
    const job = await Job.findById(jobId).populate({
      path: "applications",
    }).populate({
      path: "company",
    });
    
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }
    
    // Verify the admin owns the job
    if (String(job.created_by) !== String(adminId)) {
      return res.status(403).json({
        message: "You are not authorized to access this job",
        success: false,
      });
    }
    
    return res.status(200).json({ job, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error fetching job details",
      success: false,
    });
  }
};

// Admin's created jobs
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;
    const jobs = await Job.find({ created_by: adminId }).populate({ path: "company",createdAt: -1 });
    if (!jobs) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false,
      });
    }
    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// Update job by Admin
export const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const adminId = req.id;
    const {
      title,
      description,
      requirements,
      salary,
      salaryType,
      location,
      jobType,
      experience,
      position,
      companyId,
    } = req.body;

    // Validate required fields
    if (!title || !description || !salary || !location) {
      return res.status(400).json({
        message: "Required fields are missing",
        success: false,
      });
    }

    // Find job and check if admin owns it
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    if (String(job.created_by) !== String(adminId)) {
      return res.status(403).json({
        message: "You are not authorized to update this job",
        success: false,
      });
    }

    // Prepare update data
    const updateData = {
      title,
      description,
      requirements: requirements?.includes(',') ? requirements.split(',') : requirements,
      salary: Number(salary),
      salaryType,
      location,
      jobType,
      experienceLevel: experience,
      position: Number(position),
    };

    // Only update company if provided
    if (companyId) {
      updateData.company = companyId;
    }

    // Update job
    const updatedJob = await Job.findByIdAndUpdate(jobId, updateData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      message: "Job updated successfully",
      job: updatedJob,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error updating job",
      error: error.message,
      success: false,
    });
  }
};

// Delete job with ownership check
export const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const adminId = req.id;
    
    // Find job and check if admin owns it
    const job = await Job.findById(jobId);
    
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    // Verify the admin owns the job
    if (String(job.created_by) !== String(adminId)) {
      return res.status(403).json({
        message: "You are not authorized to delete this job",
        success: false,
      });
    }

    // Delete the job
    await Job.findByIdAndDelete(jobId);

    return res.status(200).json({
      message: "Job deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error deleting job",
      success: false,
    });
  }
};
