import { setPublicCompanies } from "@/redux/companySlice";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const useGetAllPublicCompanies = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPublicCompanies = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${COMPANY_API_END_POINT}/getall`);
        if (res.data.success) {
          dispatch(setPublicCompanies(res.data.companies));
        } else {
          dispatch(setPublicCompanies([]));
        }
      } catch (error) {
        console.log(error);
        dispatch(setPublicCompanies([]));
      } finally {
        setIsLoading(false);
      }
    };
    fetchPublicCompanies();
  }, [dispatch]);

  return { isLoading };
};

export default useGetAllPublicCompanies; 