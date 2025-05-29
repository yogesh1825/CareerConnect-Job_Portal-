import { Badge } from "@/components/ui/badge";
import { Bookmark, Building, Clock, MapPin } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleSavedJob } from "@/redux/jobSlice";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";

const LatestJobsCards = ({ job }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { savedJobs = [] } = useSelector((store) => store.job || {});
  const { user } = useSelector((store) => store.auth);
  const [isSaving, setIsSaving] = useState(false);
  
  // Check if this job is saved
  const isSaved = savedJobs?.some?.(savedJob => 
    savedJob?._id === job?._id || 
    String(savedJob) === String(job?._id)
  ) || false;

  // Get days ago
  const daysAgo = (mongodbTime) => {
    if (!mongodbTime) return 0;
    
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
  };

  // Handle saving job
  const handleSaveJob = async (e) => {
    e.stopPropagation(); // Prevent card click event
    
    if (!user) {
      toast.error("Please login to save jobs");
      navigate("/login");
      return;
    }
    
    try {
      setIsSaving(true);
      
      // First update the UI for better UX
      dispatch(toggleSavedJob(job));
      
      // Then call the backend
      const res = await axios.get(`${USER_API_END_POINT}/toggle-saved-job/${job._id}`, {
        withCredentials: true,
      });
      
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      // Revert the UI change if the API call fails
      dispatch(toggleSavedJob(job));
      toast.error("Failed to save this job");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      onClick={() => navigate(`/description/${job?._id}`)}
      className="p-6 rounded-xl shadow-md hover:shadow-xl bg-white border border-purple-100 cursor-pointer transition-all duration-300 hover:-translate-y-2 relative group overflow-hidden h-full flex flex-col w-full"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-8 -mt-8 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-50 rounded-tr-full -ml-16 -mb-16 opacity-30"></div>
      
      {/* Save button */}
      <button 
        onClick={handleSaveJob}
        disabled={isSaving}
        className={`absolute top-4 right-4 h-9 w-9 rounded-full flex items-center justify-center transition-all z-10 shadow-sm
          ${isSaved ? 'bg-purple-100 text-[#6A38C2]' : 'bg-gray-50 text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-purple-50 hover:text-[#6A38C2]'}
          ${isSaving ? 'opacity-70 cursor-wait group-hover:opacity-70' : ''}`}
      >
        {isSaving ? (
          <span className="h-4 w-4 border-2 border-[#6A38C2] border-t-transparent rounded-full animate-spin inline-block"></span>
        ) : (
          <Bookmark size={18} className={isSaved ? 'fill-[#6A38C2]' : ''} />
        )}
      </button>

      {/* Company info */}
      <div className="flex items-start gap-3 z-10">
        <div className="flex-shrink-0 h-14 w-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center text-[#6A38C2] font-bold text-xl shadow-sm">
          {job?.company?.name?.charAt(0) || "C"}
        </div>
        <div className="min-w-0">
          <h3 className="font-medium text-gray-900 truncate">{job?.company?.name || "Company"}</h3>
          <div className="flex items-center text-gray-500 text-sm mt-1">
            <MapPin size={14} className="mr-1 text-[#6A38C2] flex-shrink-0" />
            <span className="truncate">{job?.location || "India"}</span>
          </div>
        </div>
      </div>

      {/* Job details */}
      <div className="mt-4 z-10 flex-grow">
        <h2 className="font-bold text-lg text-gray-900 group-hover:text-[#6A38C2] transition-colors line-clamp-2">
          {job?.title || "Job Title"}
        </h2>
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
          {job?.description || "No description available"}
        </p>
      </div>

      {/* Time posted */}
      <div className="flex items-center mt-3 text-xs bg-purple-50 text-gray-600 px-2.5 py-1.5 rounded-full w-fit z-10">
        <Clock size={14} className="mr-1.5 text-[#6A38C2]" />
        <span>{daysAgo(job?.createdAt) === 0 ? "Posted today" : `Posted ${daysAgo(job?.createdAt)} days ago`}</span>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2 mt-4 z-10">
        <Badge className="bg-purple-50 hover:bg-purple-100 text-[#6A38C2] border-0 font-medium">
          {job?.position || "0"} Positions
        </Badge>
        <Badge className="bg-purple-50 hover:bg-purple-100 text-[#6A38C2] border-0 font-medium">
          {job?.jobType || "Full-time"}
        </Badge>
        <Badge className="bg-[#6A38C2] hover:bg-[#5b30a6] text-white border-0 font-medium">
          {job?.salary || "0"} {job?.salaryType === "monthly" ? "per month" : "LPA"}
        </Badge>
      </div>
    </div>
  );
};

export default LatestJobsCards;
