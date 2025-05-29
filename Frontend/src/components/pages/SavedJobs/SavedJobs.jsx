import Navbar from "@/components/shared/Navbar";
import React, { useEffect } from "react";
import SingleJob from "../Jobs/SingleJob";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useGetSavedJobs from "@/hooks/useGetSavedJobs";

const SavedJobs = () => {
  const { savedJobs = [] } = useSelector((store) => store.job || {});
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const { isLoading } = useGetSavedJobs();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      toast.error("Please login to view saved jobs");
      navigate("/login");
    }
  }, [user, navigate]);

  // If not logged in, don't render the page content
  if (!user) {
    return null;
  }

  // Safely get the length of savedJobs
  const savedJobsCount = savedJobs?.length || 0;

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto my-10 px-4">
        <h1 className="font-bold text-2xl my-10 text-purple-500">
          Saved Jobs ({savedJobsCount})
        </h1>
        {isLoading ? (
          <div className="text-center py-10">
            <div className="animate-spin h-10 w-10 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading your saved jobs...</p>
          </div>
        ) : savedJobsCount === 0 ? (
          <div className="text-center py-10">
            <h2 className="text-xl font-medium text-gray-600">You haven't saved any jobs yet!</h2>
            <p className="text-gray-500 mt-2">Browse jobs and click "Save For Later" to add them here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedJobs.map((job, index) => (
              <SingleJob key={job?._id || `saved-job-${index}`} job={job} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SavedJobs; 