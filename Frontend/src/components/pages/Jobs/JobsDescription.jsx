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
import { Bookmark } from "lucide-react";

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
      <div className="max-w-7xl mx-auto my-10 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin h-10 w-10 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading job details...</p>
          </div>
        ) : !singleJob ? (
          <div className="text-center py-10">
            <h2 className="text-xl font-medium text-gray-600">Job not found</h2>
            <p className="text-gray-500 mt-2">The job you're looking for doesn't exist or has been removed</p>
            <Button 
              onClick={() => navigate('/jobs')} 
              className="mt-4 bg-[#6A38C2]"
            >
              Browse Jobs
            </Button>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="font-bold text-xl md:text-2xl">{singleJob?.title || "Job Title"}</h1>
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
                  className={`rounded-full ${
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
                  className={`rounded-full ${
                    isApplied
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-[#6A38C2] cursor-pointer hover:bg-[#5b30a6]"
                  }`}
                >
                  {isApplied ? "Already Applied" : "Apply Now"}
                </Button>
              </div>
            </div>
            <h1 className="border-b-2 border-b-gray-300 font-medium py-4 mt-6">
              Job Description
            </h1>
            <div className="my-4 space-y-3">
              <h1 className="font-bold my-1">
                Role:
                <span className="pl-4 font-normal text-gray-800">
                  {singleJob?.title || "N/A"}
                </span>
              </h1>
              <h1 className="font-bold my-1">
                Location:{" "}
                <span className="pl-4 font-normal text-gray-800">
                  {singleJob?.location || "Remote"}
                </span>
              </h1>
              <h1 className="font-bold my-1">
                Description:{" "}
                <span className="pl-4 font-normal text-gray-800">
                  {singleJob?.description || "No description available"}
                </span>
              </h1>
              <h1 className="font-bold my-1">
                Experience:{" "}
                <span className="pl-4 font-normal text-gray-800">
                  {singleJob?.experienceLevel || "0"} Year / Fresher 
                </span>
              </h1>
              <h1 className="font-bold my-1">
                Salary:{" "}
                <span className="pl-4 font-normal text-gray-800">
                  {singleJob?.salary || "Competitive"} {singleJob?.salaryType === "monthly" ? "per month" : "LPA"}
                </span>
              </h1>
              <h1 className="font-bold my-1">
                Total Applicants:{" "}
                <span className="pl-4 font-normal text-gray-800">
                  {singleJob?.applications?.length || 0}
                </span>
              </h1>
              <h1 className="font-bold my-1">
                Posted Date:{" "}
                <span className="pl-4 font-normal text-gray-800">
                  {formatDate(singleJob?.createdAt)}
                </span>
              </h1>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default JobsDescription;
