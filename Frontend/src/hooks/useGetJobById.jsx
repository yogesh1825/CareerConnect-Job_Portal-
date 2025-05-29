import { setSingleJob } from "@/redux/jobSlice";
import { JOB_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const useGetJobById = (jobId) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSingleJob = async () => {
      if (!jobId) {
        dispatch(setSingleJob(null));
        return;
      }
      
      try {
        setIsLoading(true);
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
        } else {
          dispatch(setSingleJob(null));
        }
      } catch (error) {
        console.log(error);
        dispatch(setSingleJob(null));
      } finally {
        setIsLoading(false);
      }
    };
    fetchSingleJob();
  }, [jobId, dispatch]);

  return { isLoading };
};

export default useGetJobById; 