import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { setSingleJob, toggleSavedJob } from "@/redux/jobSlice";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT, USER_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "@/components/shared/Navbar";
import { Bookmark, Briefcase, Calendar, MapPin, Users, Clock, IndianRupee } from "lucide-react";
import { motion } from "framer-motion";

// Background animation components
const FloatingIcon = ({ icon: Icon, delay, duration, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ 
      opacity: [0.4, 0.8, 0.4],
      y: [0, -30, 0],
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration: duration || 5,
      delay: delay || 0,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    className={`absolute text-[#6A38C2]/30 ${className}`}
  >
    <Icon size={32} />
  </motion.div>
);

const BackgroundAnimation = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    {/* Left side floating icons */}
    <div className="absolute left-0 top-0 w-1/4 h-full">
      <FloatingIcon icon={Briefcase} delay={0} className="top-1/4 left-1/2" />
      <FloatingIcon icon={Calendar} delay={1} className="top-1/2 left-1/3" />
      <FloatingIcon icon={MapPin} delay={2} className="bottom-1/4 left-1/2" />
    </div>

    {/* Right side floating icons */}
    <div className="absolute right-0 top-0 w-1/4 h-full">
      <FloatingIcon icon={IndianRupee} delay={1.5} className="top-1/3 right-1/2" />
      <FloatingIcon icon={Users} delay={2.5} className="top-1/2 right-1/3" />
      <FloatingIcon icon={Clock} delay={3} className="bottom-1/3 right-1/2" />
    </div>
    
    {/* Left side decorative circle */}
    <motion.div
      className="absolute left-0 top-1/4 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-purple-200/40 to-purple-300/40"
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.2, 0.4, 0.2],
        rotate: [0, 180, 0],
      }}
      transition={{
        duration: 15,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />

    {/* Right side decorative circle */}
    <motion.div
      className="absolute right-0 top-1/2 translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-purple-300/40 to-purple-400/40"
      animate={{
        scale: [1.2, 1, 1.2],
        opacity: [0.2, 0.4, 0.2],
        rotate: [180, 0, 180],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />

    {/* Animated dots pattern */}
    <div className="absolute inset-0">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-purple-300/40"
          style={{
            left: i % 2 === 0 ? `${Math.random() * 20}%` : `${80 + Math.random() * 20}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  </div>
);

const JobsDescription = () => {
  const params = useParams();
  const jobId = params.id;
  const { singleJob, savedJobs = [] } = useSelector((store) => store.job || {});
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Check if this job is saved
  const isSaved = savedJobs?.some?.(savedJob => 
    savedJob?._id === jobId || 
    String(savedJob) === String(jobId)
  ) || false;

  const isIntiallyApplied =
    singleJob?.applications?.some?.(
      (application) => application?.applicant === user?._id
    ) || false;
  const [isApplied, setIsApplied] = useState(isIntiallyApplied);

  // Handle saving job
  const handleSaveJob = async () => {
    if (!user) {
      toast.error("Please login to save jobs");
      navigate("/login");
      return;
    }
    
    if (!singleJob) return;
    
    try {
      setIsSaving(true);
      
      // First update the UI for better UX
      dispatch(toggleSavedJob(singleJob));
      
      // Then call the backend
      const res = await axios.get(`${USER_API_END_POINT}/toggle-saved-job/${jobId}`, {
        withCredentials: true,
      });
      
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      // Revert the UI change if the API call fails
      dispatch(toggleSavedJob(singleJob));
      toast.error("Failed to save this job");
    } finally {
      setIsSaving(false);
    }
  };

  const applyJobHandler = async () => {
    if (!user) {
      toast.error("Please login to apply for this job");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { withCredentials: true }
      );
      
      if (res.data.success) {
        setIsApplied(true); // Update the local state
        
        // Only update if singleJob exists
        if (singleJob) {
          const applications = singleJob.applications || [];
          const updatedSingleJob = {
            ...singleJob,
            applications: [...applications, { applicant: user?._id }],
          };
          dispatch(setSingleJob(updatedSingleJob)); // helps us to real time UI update
        }
        
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to apply for job");
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          
          // Update isApplied state safely
          const applications = res.data.job?.applications || [];
          setIsApplied(
            applications.some?.(
              (application) => application?.applicant === user?._id
            ) || false
          );
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };
    
    if (jobId) {
      fetchSingleJob();
    }
  }, [jobId, dispatch, user?._id]);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    try {
      return dateString.split("T")[0];
    } catch (error) {
      return "N/A";
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 relative overflow-hidden">
        <BackgroundAnimation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-10">
          {loading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10"
            >
              <div className="animate-spin h-10 w-10 border-4 border-[#6A38C2] border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading job details...</p>
            </motion.div>
          ) : !singleJob ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-10"
            >
              <h2 className="text-xl font-medium text-gray-600">Job not found</h2>
              <p className="text-gray-500 mt-2">The job you're looking for doesn't exist or has been removed</p>
              <Button 
                onClick={() => navigate('/jobs')} 
                className="mt-4 bg-[#6A38C2] hover:bg-[#5b30a6]"
              >
                Browse Jobs
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="font-bold text-2xl md:text-3xl text-gray-800">{singleJob?.title || "Job Title"}</h1>
                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <Badge className="bg-purple-50 hover:bg-purple-100 text-[#6A38C2] border-0">
                      {singleJob?.position || "0"} Positions
                    </Badge>
                    <Badge className="bg-purple-50 hover:bg-purple-100 text-[#6A38C2] border-0">
                      {singleJob?.jobType || "Full-time"}
                    </Badge>
                    <Badge className="bg-[#6A38C2] hover:bg-[#5b30a6] text-white border-0">
                      {singleJob?.salary || "0"} {singleJob?.salaryType === "monthly" ? "per month" : "LPA"}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveJob}
                    disabled={isSaving}
                    className={`rounded-full transition-all duration-300 ${
                      isSaved
                      ? "bg-green-600 hover:bg-green-700" 
                      : "bg-white text-[#6A38C2] hover:bg-purple-50 border border-purple-200"
                    } ${isSaving ? 'opacity-70 cursor-wait' : ''}`}
                  >
                    {isSaving ? (
                      <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block mr-2"></span>
                    ) : (
                      <Bookmark className={`mr-2 h-4 w-4 ${isSaved ? 'fill-white' : ''}`} />
                    )}
                    {isSaved ? "Saved" : "Save Job"}
                  </Button>
                  <Button
                    onClick={isApplied ? null : applyJobHandler}
                    disabled={isApplied}
                    className={`rounded-full transition-all duration-300 ${
                      isApplied
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-[#6A38C2] cursor-pointer hover:bg-[#5b30a6]"
                    }`}
                  >
                    {isApplied ? "Already Applied" : "Apply Now"}
                  </Button>
                </div>
              </div>

              <div className="mt-8 space-y-6">
                <div className="border-b-2 border-purple-100 pb-4">
                  <h2 className="text-xl font-semibold text-[#6A38C2]">Job Description</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-50 p-2 rounded-full">
                        <Briefcase className="h-5 w-5 text-[#6A38C2]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Role</p>
                        <p className="font-medium text-gray-800">{singleJob?.title || "N/A"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-purple-50 p-2 rounded-full">
                        <MapPin className="h-5 w-5 text-[#6A38C2]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium text-gray-800">{singleJob?.location || "Remote"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-purple-50 p-2 rounded-full">
                        <IndianRupee className="h-5 w-5 text-[#6A38C2]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Salary</p>
                        <p className="font-medium text-gray-800">
                          {singleJob?.salary || "Competitive"} {singleJob?.salaryType === "monthly" ? "per month" : "LPA"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-50 p-2 rounded-full">
                        <Users className="h-5 w-5 text-[#6A38C2]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Applicants</p>
                        <p className="font-medium text-gray-800">{singleJob?.applications?.length || 0}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-purple-50 p-2 rounded-full">
                        <Clock className="h-5 w-5 text-[#6A38C2]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Posted Date</p>
                        <p className="font-medium text-gray-800">{formatDate(singleJob?.createdAt)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-purple-50 p-2 rounded-full">
                        <Briefcase className="h-5 w-5 text-[#6A38C2]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Experience</p>
                        <p className="font-medium text-gray-800">
                          {singleJob?.experienceLevel || "0"} Year / Fresher
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Description</h3>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <p className="text-gray-700 leading-relaxed">
                      {singleJob?.description || "No description available"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default JobsDescription;
