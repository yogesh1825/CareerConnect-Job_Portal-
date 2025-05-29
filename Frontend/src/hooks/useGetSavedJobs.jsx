import { setSavedJobs } from "@/redux/jobSlice";
import { USER_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetSavedJobs = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);

  useEffect(() => {
    // Only fetch saved jobs if user is logged in
    if (!user) return;
    
    const fetchSavedJobs = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${USER_API_END_POINT}/saved-jobs`, {
          withCredentials: true,
        });
        
        if (res.data.success) {
          dispatch(setSavedJobs(res.data.savedJobs));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSavedJobs();
  }, [dispatch, user]);

  return { isLoading };
};

export default useGetSavedJobs; 