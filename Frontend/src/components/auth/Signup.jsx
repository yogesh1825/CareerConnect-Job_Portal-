import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import { AtSign, KeyRound, Loader2, Phone, Upload, UserRound } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const { loading, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: "",
  });

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);
    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
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
        <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-8">
          {/* Left side - Illustration */}
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
                        <path className="st3" d="M550,200h-60c-5.5,0-10,4.5-10,10v60c0,5.5,4.5,10,10,10h60c5.5,0,10-4.5,10-10v-60C560,204.5,555.5,200,550,200z"/>
                        <path className="st5" d="M524,220c6.6,0,12,5.4,12,12s-5.4,12-12,12s-12-5.4-12-12S517.4,220,524,220z"/>
                        <path className="st5" d="M538,260h-28c0-7.7,6.3-14,14-14S538,252.3,538,260z"/>
                        <path className="st2" d="M684,360H516c-4.4,0-8,3.6-8,8v64c0,4.4,3.6,8,8,8h168c4.4,0,8-3.6,8-8v-64C692,363.6,688.4,360,684,360z"/>
                        <rect x="528" y="380" className="st5" width="144" height="12" rx="6" />
                        <rect x="528" y="408" className="st5" width="144" height="12" rx="6" />
                        <path className="st5" d="M750,300H650c-5.5,0-10,4.5-10,10v180c0,5.5,4.5,10,10,10h100c5.5,0,10-4.5,10-10V310C760,304.5,755.5,300,750,300z"/>
                        <rect x="660" y="320" className="st2" width="80" height="160" rx="8" />
                        <circle className="st5" cx="700" cy="500" r="10" />
                        <path className="st1" d="M380,300h-70c-5.5,0-10,4.5-10,10v180c0,5.5,4.5,10,10,10h70c5.5,0,10-4.5,10-10V310C390,304.5,385.5,300,380,300z"/>
                        <rect x="320" y="320" className="st3" width="50" height="160" rx="6" />
                        <circle className="st4" cx="345" cy="340" r="10" />
                        <circle className="st5" cx="345" cy="370" r="10" />
                        <circle className="st4" cx="345" cy="400" r="10" />
                        <circle className="st5" cx="345" cy="430" r="10" />
                        <circle className="st4" cx="345" cy="460" r="10" />
                        <path className="st5" d="M500,480H180c-5.5,0-10-4.5-10-10V280c0-5.5,4.5-10,10-10h320c5.5,0,10,4.5,10,10v190C510,475.5,505.5,480,500,480z"/>
                        <path className="st6" d="M480,460H200c-5.5,0-10-4.5-10-10V300c0-5.5,4.5-10,10-10h280c5.5,0,10,4.5,10,10v150C490,455.5,485.5,460,480,460z"/>
                        <rect x="210" y="310" className="st1" width="260" height="12" rx="6" />
                        <rect x="210" y="340" className="st1" width="260" height="12" rx="6" />
                        <rect x="210" y="370" className="st1" width="260" height="12" rx="6" />
                        <rect x="210" y="400" className="st1" width="180" height="12" rx="6" />
                        <rect x="210" y="430" className="st4" width="80" height="20" rx="6" />
                      </g>
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mt-6">Start Your Career Journey</h2>
                <p className="text-gray-600 mt-2 max-w-lg mx-auto">
                  Create your account and unlock access to thousands of job opportunities
                </p>
              </div>
            </div>
          </div>
          
          {/* Right side - Form */}
          <div className="w-full md:w-1/2 lg:w-5/12">
            <div className="bg-white p-8 rounded-2xl shadow-md border border-purple-100">
              <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Create an Account</h1>
                <p className="text-gray-500">Join our community and explore opportunities</p>
              </div>
              
              <form onSubmit={submitHandler} className="space-y-4">
                <div>
                  <Label className="text-gray-700">Full Name</Label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserRound size={18} className="text-gray-400" />
                    </div>
                    <Input
                      type="text"
                      value={input.fullname}
                      name="fullname"
                      placeholder="Your full name"
                      onChange={changeEventHandler}
                      className="pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-[#6A38C2]"
                    />
                  </div>
                </div>
                
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
                  <Label className="text-gray-700">Phone Number</Label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone size={18} className="text-gray-400" />
                    </div>
                    <Input
                      type="text"
                      value={input.phoneNumber}
                      name="phoneNumber"
                      placeholder="Your phone number"
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
                      placeholder="Create a strong password"
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
                
                <div>
                  <Label className="text-gray-700 block mb-2">Profile Photo</Label>
                  <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-[#6A38C2] transition-colors cursor-pointer bg-gray-50">
                    <input
                      accept="image/*"
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={changeFileHandler}
                    />
                    <div className="flex items-center justify-center flex-col">
                      <Upload className="h-10 w-10 text-gray-400" />
                      <p className="mt-2 text-sm font-medium text-gray-500">
                        {input.file ? input.file.name : "Click to upload your profile photo"}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        PNG, JPG or JPEG up to 5MB
                      </p>
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
                      Creating your account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <span className="text-gray-500">
                  Already have an account?{" "}
                  <Link to="/login" className="text-[#6A38C2] hover:text-[#5b30a6] font-medium">
                    Sign in
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
