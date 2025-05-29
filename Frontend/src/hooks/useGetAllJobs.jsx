import { setAllJobs } from "@/redux/jobSlice";
import { JOB_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllJobs = () => {
  const dispatch = useDispatch();
  const { searchedQuery } = useSelector((store) => store.job);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching jobs from backend...");
        
        // Make sure the endpoint is called correctly
        const endpoint = `${JOB_API_END_POINT}/get${
          searchedQuery ? `?keyword=${searchedQuery}` : ""
        }`;
        console.log("Calling endpoint:", endpoint);
        
        const res = await axios.get(endpoint, {
          withCredentials: false, // Try without credentials for public endpoint
          timeout: 15000 // Add a reasonable timeout
        });
        
        console.log("API Response:", res.data);
        
        if (res.data.success) {
          const jobs = res.data.jobs || [];
          console.log(`Successfully fetched ${jobs.length} jobs from backend`);
          
          if (jobs.length > 0) {
            console.log("First job sample:", jobs[0]);
          }
          
          dispatch(setAllJobs(jobs));
        } else {
          console.error("API returned success: false");
          dispatch(setAllJobs([]));
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        
        // Try backup direct fetch if the regular endpoint fails
        try {
          console.log("Attempting backup fetch...");
          const backupRes = await axios.get(`${JOB_API_END_POINT}/get`, { 
            timeout: 15000
          });
          
          if (backupRes.data.success && backupRes.data.jobs) {
            console.log(`Backup fetch successful: ${backupRes.data.jobs.length} jobs`);
            dispatch(setAllJobs(backupRes.data.jobs));
          } else {
            dispatch(setAllJobs([]));
          }
        } catch (backupError) {
          console.error("Backup fetch also failed:", backupError);
          setError(error.message);
          dispatch(setAllJobs([]));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [dispatch, searchedQuery]);
  
  return { isLoading, error };
};

export default useGetAllJobs;
