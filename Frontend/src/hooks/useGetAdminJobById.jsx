import { setSingleJob } from "@/redux/jobSlice";
import { JOB_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const useGetAdminJobById = (jobId) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(true);

  useEffect(() => {
    const fetchAdminJob = async () => {
      if (!jobId) {
        dispatch(setSingleJob(null));
        return;
      }
      
      try {
        setIsLoading(true);
        const res = await axios.get(`${JOB_API_END_POINT}/admin/get/${jobId}`, {
          withCredentials: true,
        });
        
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsAuthorized(true);
        } else {
          dispatch(setSingleJob(null));
          setIsAuthorized(false);
          toast.error("Failed to load job details");
        }
      } catch (error) {
        console.log(error);
        dispatch(setSingleJob(null));
        
        if (error.response?.status === 403) {
          setIsAuthorized(false);
          toast.error("You are not authorized to access this job");
          navigate("/admin/jobs");
        } else {
          toast.error("Error loading job details");
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAdminJob();
  }, [jobId, dispatch, navigate]);

  return { isLoading, isAuthorized };
};

export default useGetAdminJobById; 