import { setCompanies } from "@/redux/companySlice";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const useGetAllCompanies = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${COMPANY_API_END_POINT}/get`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setCompanies(res.data.companies));
        } else {
          dispatch(setCompanies([]));
        }
      } catch (error) {
        console.log(error);
        dispatch(setCompanies([]));
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompanies();
  }, [dispatch]);

  return { isLoading };
};

export default useGetAllCompanies;
