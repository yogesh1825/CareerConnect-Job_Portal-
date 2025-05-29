import { setSingleCompany } from "@/redux/companySlice";
import { COMPANY_API_END_POINT} from "@/utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetCompanyById = (companyId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSingleCompany = async () => {
      if (!companyId) {
        dispatch(setSingleCompany(null));
        return;
      }
      
      try {
        const res = await axios.get(`${COMPANY_API_END_POINT}/get/${companyId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleCompany(res.data.company));
        } else {
          dispatch(setSingleCompany(null));
        }
      } catch (error) {
        console.log(error);
        dispatch(setSingleCompany(null));
      }
    };
    fetchSingleCompany();
  }, [companyId, dispatch]);
};

export default useGetCompanyById;
