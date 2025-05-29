import Navbar from "@/components/shared/Navbar";
import React, { useEffect } from "react";
import SingleJob from "../Jobs/SingleJob";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Browse = () => {
  const { isLoading, error } = useGetAllJobs();
  const { allJobs = [], searchedQuery } = useSelector((store) => store.job || {});
  const dispatch = useDispatch();
  
  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(""));
    };
  }, [dispatch]);
  
  // Handle retry when errors occur
  const handleRetry = () => {
    dispatch(setSearchedQuery(searchedQuery));
  };
  
  // Safely get the length of allJobs
  const jobsCount = allJobs?.length || 0;

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto my-10 px-4 sm:px-6 lg:px-8">
        <h1 className="font-bold text-xl md:text-2xl my-10 text-purple-500">
          {searchedQuery ? `Search Results for "${searchedQuery}" (${jobsCount})` : `All Jobs (${jobsCount})`}
        </h1>
        
        {isLoading ? (
          <div className="bg-white p-10 rounded-xl shadow-lg text-center border border-purple-100">
            <div className="flex flex-col items-center justify-center py-6">
              <div className="relative w-16 h-16 mb-6">
                <Loader2 className="h-16 w-16 text-[#6A38C2] animate-spin absolute" />
                <div className="h-16 w-16 rounded-full bg-purple-100 animate-pulse"></div>
              </div>
              <h3 className="text-2xl font-semibold text-[#6A38C2] mb-3">Loading job opportunities...</h3>
              <p className="text-gray-500 max-w-md mx-auto">Please wait while we find the perfect opportunities for your career journey.</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-white p-10 rounded-xl shadow-lg text-center border border-red-100">
            <div className="flex flex-col items-center py-6">
              <div className="bg-red-100 p-4 rounded-full mb-4">
                <AlertCircle className="h-12 w-12 text-red-500" />
              </div>
              <h3 className="text-2xl font-semibold text-red-600 mb-3">Unable to load jobs</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">There was a problem loading the job listings. Please try again.</p>
              <Button 
                onClick={handleRetry} 
                className="bg-[#6A38C2] text-white hover:bg-[#5b30a6]"
              >
                Try Again
              </Button>
            </div>
          </div>
        ) : jobsCount === 0 ? (
          <div className="bg-white p-10 rounded-xl shadow-lg text-center border border-purple-100">
            <div className="flex flex-col items-center py-6">
              <h2 className="text-xl font-medium text-gray-600 mb-2">No jobs found</h2>
              <p className="text-gray-500 mb-6">Try searching with different keywords</p>
              {searchedQuery && (
                <Button 
                  onClick={() => dispatch(setSearchedQuery(""))} 
                  className="bg-[#6A38C2] text-white hover:bg-[#5b30a6]"
                >
                  View All Jobs
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allJobs.map((job, index) => (
              <SingleJob key={job?._id || `job-${index}`} job={job} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Browse;
