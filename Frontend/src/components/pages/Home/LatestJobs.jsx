import React, { useState, useCallback, useEffect } from "react";
import LatestJobsCards from "./LatestJobsCards";
import { useSelector, useDispatch } from "react-redux";
import { Briefcase, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { JOB_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { setAllJobs } from "@/redux/jobSlice";

const LatestJobs = () => {
  const { allJobs = [] } = useSelector((store) => store.job);
  const { isLoading } = useGetAllJobs();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Ensure we have jobs to display
  useEffect(() => {
    // If there are no jobs after loading, try fetching directly
    if (!isLoading && allJobs.length === 0) {
      console.log("LatestJobs: No jobs found after loading, fetching directly");
      const fetchJobsDirectly = async () => {
        try {
          const res = await axios.get(`${JOB_API_END_POINT}/get`, {
            withCredentials: false,
            timeout: 8000
          });
          if (res.data.success && res.data.jobs) {
            console.log(`LatestJobs: Directly fetched ${res.data.jobs.length} jobs`);
            dispatch(setAllJobs(res.data.jobs));
          }
        } catch (error) {
          console.error("LatestJobs: Error fetching jobs directly:", error);
        }
      };
      fetchJobsDirectly();
    }
  }, [isLoading, allJobs.length, dispatch]);

  // Calculate jobs to show and ensure we only show up to 6
  const jobsToShow = allJobs.slice(0, 6);
  console.log(`LatestJobs: Displaying ${jobsToShow.length} jobs out of ${allJobs.length} total`);

  return (
    <div className="max-w-7xl mx-auto my-20">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-4xl font-bold">
          <span className="text-[#6A38C2]">Latest & Top </span> Job Openings
        </h1>
        <div className="flex gap-2">
          <Button 
            onClick={() => navigate('/jobs')} 
            className="bg-[#6A38C2] text-white"
          >
            <span className="flex items-center gap-1">
              View All <ChevronRight className="h-4 w-4" />
            </span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-5">
        {isLoading ? (
          // Loading state
          <p>Loading jobs...</p>
        ) : jobsToShow.length <= 0 ? (
          <span>No jobs Available</span>
        ) : (
          jobsToShow.map((job) => (
            <LatestJobsCards
              key={job._id || Math.random()}
              job={job}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default LatestJobs;
