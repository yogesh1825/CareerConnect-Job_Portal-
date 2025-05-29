import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { setSavedJobs } from "@/redux/jobSlice";
import { AtSign, KeyRound, Loader2, UserRound } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, user } = useSelector((store) => store.auth);
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    // Validate input fields
    if (!input.email) {
      toast.error("Please enter your email");
      return;
    }
    
    if (!input.password) {
      toast.error("Please enter your password");
      return;
    }
    
    if (!input.role) {
      toast.error("Please select your role");
      return;
    }
    
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      
      if (res.data && res.data.success) {
        dispatch(setUser(res.data.user));
        
        // Fetch saved jobs immediately after login
        if (res.data.user.role === "student") {
          try {
            const savedRes = await axios.get(`${USER_API_END_POINT}/saved-jobs`, {
              withCredentials: true,
            });
            if (savedRes.data.success) {
              dispatch(setSavedJobs(savedRes.data.savedJobs));
            }
          } catch (error) {
            console.log("Failed to fetch saved jobs", error);
          }
        }
        
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      
      // Improved error handling
      if (error.response && error.response.data) {
        // Server responded with an error
        toast.error(error.response.data.message || "Login failed");
      } else if (error.request) {
        // No response received from the server
        toast.error("No response from server. Please verify the backend is running at http://localhost:8000");
      } else {
        // Error in setting up the request
        toast.error("Something went wrong. Please try again later.");
      }
    } finally {
      dispatch(setLoading(false));
    }
  };
  
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-purple-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Left side - Form */}
          <div className="w-full md:w-1/2 lg:w-5/12">
            <div className="bg-white p-8 rounded-2xl shadow-md border border-purple-100">
              <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                <p className="text-gray-500">Sign in to access your account</p>
              </div>
              
              <form onSubmit={submitHandler}>
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-700">Email</Label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <AtSign size={18} className="text-gray-400" />
                      </div>
                      <Input
                        type="email"
                        value={input.email}
                        name="email"
                        placeholder="name@example.com"
                        onChange={changeEventHandler}
                        className="pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-[#6A38C2]"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-gray-700">Password</Label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <KeyRound size={18} className="text-gray-400" />
                      </div>
                      <Input
                        type="password"
                        value={input.password}
                        name="password"
                        placeholder="••••••••"
                        onChange={changeEventHandler}
                        className="pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-[#6A38C2]"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-gray-700 block mb-2">I am a</Label>
                    <div className="flex gap-4">
                      <div 
                        className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          input.role === "student" 
                            ? "border-[#6A38C2] bg-purple-50 text-[#6A38C2]" 
                            : "border-gray-200 hover:border-purple-200 hover:bg-purple-50"
                        }`}
                        onClick={() => setInput({...input, role: "student"})}
                      >
                        <UserRound size={18} />
                        <span className="font-medium">Student</span>
                        <input
                          type="radio"
                          name="role"
                          value="student"
                          checked={input.role === "student"}
                          onChange={changeEventHandler}
                          className="sr-only"
                        />
                      </div>
                      
                      <div 
                        className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          input.role === "recruiter" 
                            ? "border-[#6A38C2] bg-purple-50 text-[#6A38C2]" 
                            : "border-gray-200 hover:border-purple-200 hover:bg-purple-50"
                        }`}
                        onClick={() => setInput({...input, role: "recruiter"})}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">Recruiter</span>
                        <input
                          type="radio"
                          name="role"
                          value="recruiter"
                          checked={input.role === "recruiter"}
                          onChange={changeEventHandler}
                          className="sr-only"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full mt-6 bg-gradient-to-r from-[#6A38C2] to-[#8355d7] hover:from-[#5b30a6] hover:to-[#7248c9] text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <span className="text-gray-500">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-[#6A38C2] hover:text-[#5b30a6] font-medium">
                    Create an account
                  </Link>
                </span>
              </div>
            </div>
          </div>
          
          {/* Right side - Illustration */}
          <div className="hidden md:block w-full md:w-1/2 lg:w-7/12">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="relative w-full max-w-md mx-auto">
                  <div className="absolute top-0 left-0 w-40 h-40 bg-purple-200 rounded-full blur-3xl opacity-30 -ml-10 -mt-10"></div>
                  <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-300 rounded-full blur-3xl opacity-30 -mr-10 -mb-10"></div>
                  <div className="relative z-10 w-full h-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 800" className="w-full">
                      <style>
                        {`.st0{fill:#F4F1FB;}
                           .st1{fill:#E9E3F5;}
                           .st2{fill:#D5CAF1;}
                           .st3{fill:#6A38C2;}
                           .st4{fill:#8355D7;}
                           .st5{fill:#FFFFFF;}
                           .st6{fill:#F9F9F9;}`}
                      </style>
                      <g>
                        <ellipse className="st0" cx="500" cy="650" rx="400" ry="30" />
                        <path className="st1" d="M661.9,241.7H321.5c-8.3,0-15-6.7-15-15v-58.3c0-8.3,6.7-15,15-15h340.4c8.3,0,15,6.7,15,15v58.3 C676.9,235,670.2,241.7,661.9,241.7z" />
                        <path className="st2" d="M624.2,208.8H359.3c-3.7,0-6.8-3-6.8-6.8v-15.4c0-3.7,3-6.8,6.8-6.8h264.9c3.7,0,6.8,3,6.8,6.8V202 C631,205.8,628,208.8,624.2,208.8z" />
                        <path className="st3" d="M624.2,403.2H359.3c-3.7,0-6.8-3-6.8-6.8V381c0-3.7,3-6.8,6.8-6.8h264.9c3.7,0,6.8,3,6.8,6.8v15.4 C631,400.2,628,403.2,624.2,403.2z" />
                        <path className="st1" d="M661.9,436.1H321.5c-8.3,0-15-6.7-15-15v-58.3c0-8.3,6.7-15,15-15h340.4c8.3,0,15,6.7,15,15v58.3 C676.9,429.4,670.2,436.1,661.9,436.1z" />
                        <path className="st1" d="M661.9,533.3H321.5c-8.3,0-15-6.7-15-15V460c0-8.3,6.7-15,15-15h340.4c8.3,0,15,6.7,15,15v58.3 C676.9,526.6,670.2,533.3,661.9,533.3z" />
                        <path className="st4" d="M624.2,500.1H359.3c-3.7,0-6.8-3-6.8-6.8v-15.4c0-3.7,3-6.8,6.8-6.8h264.9c3.7,0,6.8,3,6.8,6.8v15.4 C631,497.1,628,500.1,624.2,500.1z" />
                        <path className="st5" d="M740.4,350.9H243c-6.6,0-12-5.4-12-12V162.3c0-6.6,5.4-12,12-12h497.4c6.6,0,12,5.4,12,12v176.6 C752.4,345.5,747,350.9,740.4,350.9z" />
                        <path className="st6" d="M740.4,647.3H243c-6.6,0-12-5.4-12-12v-277c0-6.6,5.4-12,12-12h497.4c6.6,0,12,5.4,12,12v277 C752.4,641.9,747,647.3,740.4,647.3z" />
                        <circle className="st3" cx="492" cy="268" r="58" />
                        <path className="st5" d="M518,251.9c3.1,5.2,4.9,11.2,4.9,17.6c0,19-15.4,34.5-34.5,34.5c-6.9,0-13.3-2.1-18.7-5.6 c5.6,9.3,15.8,15.6,27.4,15.6c17.7,0,32-14.3,32-32C529.2,269.8,525,259.6,518,251.9z" />
                        <rect x="290" y="390" className="st1" width="171" height="12" rx="6" />
                        <rect x="290" y="420" className="st1" width="171" height="12" rx="6" />
                        <rect x="290" y="450" className="st1" width="171" height="12" rx="6" />
                        <rect x="290" y="479" className="st1" width="120" height="12" rx="6" />
                        <circle className="st4" cx="356" cy="557" r="20" />
                        <circle className="st3" cx="419" cy="557" r="20" />
                        <circle className="st2" cx="482" cy="557" r="20" />
                      </g>
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mt-6">Find Your Dream Job</h2>
                <p className="text-gray-600 mt-2 max-w-lg mx-auto">
                  Connect with top employers and take the next step in your career journey
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
