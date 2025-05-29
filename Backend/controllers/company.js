import { Company } from "../models/company.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";

// Company Registration
export const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;
    if (!companyName) {
      return res.status(400).json({
        message: "Company not found",
        success: false,
      });
    }
    let company = await Company.findOne({ name: companyName });
    if (company) {
      return res.status(400).json({
        message:
          "Company already registered you can't register same company twice",
        success: false,
      });
    }
    company = await Company.create({
      name: companyName,
      userId: req.id,
    });
    return res.status(201).json({
      message: "Company registered successfully",
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error registering company",
      success: false,
    });
  }
};

// Get companies (only returns the authenticated user's companies)
export const getCompany = async (req, res) => {
  try {
    const userId = req.id;
    
    // Only show companies created by this user
    if (userId) {
      const companies = await Company.find({ userId });
      return res.status(200).json({
        companies,
        success: true,
      });
    } 
    // For unauthenticated requests (public), return empty array
    else {
      return res.status(401).json({
        message: "Authentication required",
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error fetching companies",
      success: false,
    });
  }
};

// Get all companies (for public pages/statistics)
export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find({});
    return res.status(200).json({
      companies,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error fetching companies",
      success: false,
    });
  }
};

// Get company by ID with ownership check
export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    const userId = req.id;
    
    const company = await Company.findById(companyId);
    
    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }
    
    // Check ownership - only the creator can view their company details
    if (String(company.userId) !== String(userId)) {
      return res.status(403).json({
        message: "You are not authorized to access this company",
        success: false,
      });
    }
    
    return res.status(200).json({
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error fetching company",
      success: false,
    });
  }
};

// Update company with ownership check
export const updateCompany = async (req, res) => {
  try {
    const companyId = req.params.id;
    const userId = req.id;
    const { name, description, website, location } = req.body;
    
    // First check if company exists and user owns it
    const company = await Company.findById(companyId);
    
    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }
    
    // Check ownership
    if (String(company.userId) !== String(userId)) {
      return res.status(403).json({
        message: "You are not authorized to update this company",
        success: false,
      });
    }
    
    // Process file if present
    let logo = company.logo;
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      logo = cloudResponse.secure_url;
    }

    const updateData = { name, description, website, location, logo };

    const updatedCompany = await Company.findByIdAndUpdate(companyId, updateData, {
      new: true,
    });

    return res.status(200).json({
      message: "Company Information updated",
      company: updatedCompany,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error updating company",
      success: false,
    });
  }
};

// Delete company with ownership check
export const deleteCompany = async (req, res) => {
  try {
    const companyId = req.params.id;
    const userId = req.id;
    
    // First check if company exists and user owns it
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }
    
    // Check ownership
    if (String(company.userId) !== String(userId)) {
      return res.status(403).json({
        message: "You are not authorized to delete this company",
        success: false,
      });
    }

    // Delete the company
    await Company.findByIdAndDelete(companyId);

    return res.status(200).json({
      message: "Company deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error deleting company",
      success: false,
    });
  }
};
