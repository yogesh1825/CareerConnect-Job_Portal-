import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toggleSavedJob } from "@/redux/jobSlice";
import { Bookmark, Building, Clock, MapPin } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";

const SingleJob = ({ job }) => {
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

  const daysAgo = (mongodbTime) => {
    if (!mongodbTime) return 0;
    
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
  };

  // Handle saving job
  const handleSaveJob = async (e) => {
    if (e) e.stopPropagation();
    
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

  if (!job) {
    return null; // Don't render anything if job is undefined
  }

  return (
    <div 
      onClick={() => navigate(`/description/${job?._id}`)}
      className="p-6 rounded-xl shadow-md hover:shadow-xl bg-white border border-purple-100 cursor-pointer transition-all duration-300 relative group overflow-hidden h-full flex flex-col m-1 hover:z-10 hover:-translate-y-2"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-8 -mt-8 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-50 rounded-tr-full -ml-16 -mb-16 opacity-30"></div>
      
      <div className="flex items-center justify-between mb-3 z-10">
        <div className="flex items-center text-xs bg-purple-50 text-gray-600 px-2.5 py-1.5 rounded-full">
          <Clock size={14} className="mr-1.5 text-[#6A38C2]" />
          <span>{daysAgo(job?.createdAt) === 0 ? "Posted today" : `Posted ${daysAgo(job?.createdAt)} days ago`}</span>
        </div>
        
        <button 
          onClick={handleSaveJob}
          disabled={isSaving}
          className={`h-9 w-9 rounded-full flex items-center justify-center transition-all shadow-sm
            ${isSaved ? 'bg-purple-100 text-[#6A38C2]' : 'bg-gray-50 text-gray-400 hover:bg-purple-50 hover:text-[#6A38C2]'}
            ${isSaving ? 'opacity-70 cursor-wait' : ''}`}
          title={user ? (isSaved ? "Remove from saved" : "Save this job") : "Login to save jobs"}
        >
          {isSaving ? (
            <span className="h-4 w-4 border-2 border-[#6A38C2] border-t-transparent rounded-full animate-spin inline-block"></span>
          ) : (
            <Bookmark size={18} className={isSaved ? 'fill-[#6A38C2]' : ''} />
          )}
        </button>
      </div>
      
      <div className="flex items-center gap-3 my-3 z-10">
        <div className="h-14 w-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center text-[#6A38C2] font-bold text-xl shadow-sm">
          {job?.company?.name?.charAt(0) || "C"}
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{job?.company?.name || "Company"}</h3>
          <div className="flex items-center text-gray-500 text-sm mt-1">
            <MapPin size={14} className="mr-1 text-[#6A38C2]" />
            <span>{job?.location || "India"}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-3 mb-4 z-10 flex-grow">
        <h2 className="font-bold text-lg text-gray-900 group-hover:text-[#6A38C2] transition-colors mb-2">
          {job?.title || "Job Title"}
        </h2>
        <p className="text-sm text-gray-600 line-clamp-2">
          {job?.description || "No description available"}
        </p>
      </div>
      
      <div className="flex flex-wrap items-center gap-2 mt-auto mb-4 z-10">
        <Badge className="bg-purple-50 hover:bg-purple-100 text-[#6A38C2] border-0 font-medium">
          {job?.position || "0"} Positions
        </Badge>
        <Badge className="bg-purple-50 hover:bg-purple-100 text-[#6A38C2] border-0 font-medium">
          {job?.jobType || "Full-time"}
        </Badge>
        <Badge className="bg-[#6A38C2] hover:bg-[#5b30a6] text-white border-0 font-medium">
          ₹{job?.salary || "0"} {job?.salaryType === 'monthly' ? 'Per Month' : 'LPA'}
        </Badge>
      </div>
      
      <div className="flex items-center gap-3 mt-auto z-10">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/description/${job?._id}`);
          }}
          className="bg-white text-[#6A38C2] hover:bg-purple-50 border border-purple-200 flex-1 rounded-lg shadow-sm"
        >
          View Details
        </Button>
        <Button 
          onClick={handleSaveJob}
          disabled={isSaving}
          className={`flex-1 rounded-lg shadow-sm ${isSaved ? "bg-green-600 hover:bg-green-700" : "bg-gradient-to-r from-[#6A38C2] to-[#8355d7] hover:from-[#5b30a6] hover:to-[#7248c9]"} ${isSaving ? 'opacity-70 cursor-wait' : ''}`}
        >
          {isSaving ? (
            <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2"></span>
          ) : null}
          {user ? (isSaved ? "Saved" : "Save For Later") : "Login to Save"}
        </Button>
      </div>
    </div>
  );
};

export default SingleJob;
