import { setSingleCompany } from "@/redux/companySlice";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const useGetAdminCompanyById = (companyId) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(true);

  useEffect(() => {
    const fetchAdminCompany = async () => {
      if (!companyId) {
        dispatch(setSingleCompany(null));
        return;
      }
      
      try {
        setIsLoading(true);
        const res = await axios.get(`${COMPANY_API_END_POINT}/get/${companyId}`, {
          withCredentials: true,
        });
        
        if (res.data.success) {
          dispatch(setSingleCompany(res.data.company));
          setIsAuthorized(true);
        } else {
          dispatch(setSingleCompany(null));
          setIsAuthorized(false);
          toast.error("Failed to load company details");
        }
      } catch (error) {
        console.log(error);
        dispatch(setSingleCompany(null));
        
        if (error.response?.status === 403) {
          setIsAuthorized(false);
          toast.error("You are not authorized to access this company");
          navigate("/admin/companies");
        } else {
          toast.error("Error loading company details");
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAdminCompany();
  }, [companyId, dispatch, navigate]);

  return { isLoading, isAuthorized };
};

export default useGetAdminCompanyById; 