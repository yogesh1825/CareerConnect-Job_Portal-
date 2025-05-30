import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { BookmarkIcon, ChevronDown, LogOut, Menu, Search, User2, X, Code } from "lucide-react";
import Logo from "../../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { resetSavedJobs } from "@/redux/jobSlice";
import { motion } from "framer-motion";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const { savedJobs = [] } = useSelector((store) => store.job || {});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(null));
        dispatch(resetSavedJobs());
        navigate("/")
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  // Check if link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Safely get the length of savedJobs
  const savedJobsCount = savedJobs?.length || 0;

  return (
    <div 
      className={`${
        isScrolled 
          ? "bg-white shadow-md" 
          : "bg-gradient-to-r from-[#f9f8ff] to-[#efe8ff]"
      } sticky top-0 z-50 transition-all duration-300`}
    >
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src={Logo} alt="Career Connect Logo" className="w-48" />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <nav>
            <ul className="flex font-medium items-center gap-5">
              {user && user.role === "recruiter" ? (
                <>
                  <li>
                    <Link 
                      to="/admin/companies" 
                      className={`py-1 px-2 rounded-md ${isActive('/admin/companies') 
                        ? 'text-[#6A38C2] font-semibold bg-purple-50' 
                        : 'text-gray-700 hover:text-[#6A38C2]'}`}
                    >
                      Companies
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/admin/jobs" 
                      className={`py-1 px-2 rounded-md ${isActive('/admin/jobs') 
                        ? 'text-[#6A38C2] font-semibold bg-purple-50' 
                        : 'text-gray-700 hover:text-[#6A38C2]'}`}
                    >
                      Jobs
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link 
                      to="/" 
                      className={`py-1 px-2 rounded-md ${isActive('/') 
                        ? 'text-[#6A38C2] font-semibold bg-purple-50' 
                        : 'text-gray-700 hover:text-[#6A38C2]'}`}
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/jobs" 
                      className={`py-1 px-2 rounded-md ${isActive('/jobs') 
                        ? 'text-[#6A38C2] font-semibold bg-purple-50' 
                        : 'text-gray-700 hover:text-[#6A38C2]'}`}
                    >
                      Jobs
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/browse" 
                      className={`py-1 px-2 rounded-md ${isActive('/browse') 
                        ? 'text-[#6A38C2] font-semibold bg-purple-50' 
                        : 'text-gray-700 hover:text-[#6A38C2]'}`}
                    >
                      Browse
                    </Link>
                  </li>
                  {/* Only show Courses link for student users */}
                  {user && user.role === "student" && (
                    <li>
                      <Link 
                        to="/courses" 
                        className={`py-1 px-2 rounded-md ${
                          isActive('/courses') 
                            ? 'text-[#6A38C2] font-semibold bg-purple-50' 
                            : 'text-gray-700 hover:text-[#6A38C2]'
                        }`}
                      >
                        Courses
                      </Link>
                    </li>
                  )}
                  {/* Only show SavedJobs link when user is logged in */}
                  {user && (
                    <li>
                      <Link 
                        to="/saved-jobs" 
                        className={`relative flex items-center py-1 px-2 rounded-md ${
                          isActive('/saved-jobs') 
                            ? 'text-[#6A38C2] font-semibold bg-purple-50' 
                            : 'text-gray-700 hover:text-[#6A38C2]'
                        }`}
                        title="Saved Jobs"
                      >
                        <BookmarkIcon size={18} />
                        {savedJobsCount > 0 && (
                          <span className="absolute -top-2 -right-2 bg-[#7209b7] text-white rounded-full text-xs px-1.5 py-0.5 min-w-5 h-5 flex items-center justify-center">
                            {savedJobsCount}
                          </span>
                        )}
                      </Link>
                    </li>
                  )}
                </>
              )}
            </ul>
          </nav>

          {!user ? (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" className="text-[#6A38C2] border-[#6A38C2] hover:bg-[#6A38C2] hover:text-white">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">
                  Signup
                </Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 cursor-pointer rounded-full px-2 py-1 transition-colors hover:bg-purple-50"
                >
                  <div className="relative">
                    <Avatar className="h-9 w-9 border-2 border-purple-200 ring-2 ring-purple-100">
                      <AvatarImage 
                        src={user?.profile?.profilePhoto} 
                        className="object-cover"
                      />
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <span className="text-sm font-medium mr-1 hidden sm:block text-gray-700">{user?.fullname?.split(' ')[0]}</span>
                  <ChevronDown size={16} className="text-gray-500" />
                </motion.div>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="p-2">
                  <div className="flex gap-3 items-center p-3 bg-purple-50 rounded-lg">
                    <Avatar className="h-14 w-14 border-2 border-purple-200 ring-2 ring-purple-100">
                      <AvatarImage
                        src={user?.profile?.profilePhoto}
                        alt={user?.fullname}
                        className="object-cover"
                      />
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-gray-800">{user?.fullname}</h4>
                      <p className="text-sm text-gray-600">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col my-4 text-gray-600">
                    {user && user.role === "student" && (
                      <motion.div 
                        whileHover={{ x: 5 }}
                        className="flex w-full items-center gap-2 cursor-pointer hover:text-[#6A38C2] p-2 rounded hover:bg-purple-50"
                      >
                        <User2 size={18} />
                        <Link to="/profile" className="flex-1 hover:text-[#6A38C2]">
                          View Profile
                        </Link>
                      </motion.div>
                    )}
                    {user && user.role === "student" && (
                      <motion.div 
                        whileHover={{ x: 5 }}
                        className="flex w-full items-center gap-2 cursor-pointer hover:text-[#6A38C2] p-2 rounded hover:bg-purple-50"
                      >
                        <Code size={18} />
                        <Link to="/courses" className="flex-1 hover:text-[#6A38C2]">
                          Courses
                        </Link>
                      </motion.div>
                    )}
                    {user && user.role === "student" && (
                      <motion.div 
                        whileHover={{ x: 5 }}
                        className="flex w-full items-center gap-2 cursor-pointer hover:text-[#6A38C2] p-2 rounded hover:bg-purple-50"
                      >
                        <BookmarkIcon size={18} />
                        <Link to="/saved-jobs" className="flex-1 hover:text-[#6A38C2]">
                          Saved Jobs {savedJobsCount > 0 && `(${savedJobsCount})`}
                        </Link>
                      </motion.div>
                    )}
                    <motion.div 
                      whileHover={{ x: 5 }}
                      className="flex w-full items-center gap-2 cursor-pointer hover:text-[#6A38C2] p-2 rounded hover:bg-purple-50"
                    >
                      <LogOut size={18} />
                      <button onClick={logoutHandler} className="flex-1 text-left hover:text-[#6A38C2]">
                        Logout
                      </button>
                    </motion.div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          {user && (
            <Link 
              to="/saved-jobs" 
              className="relative mr-4"
              title="Saved Jobs"
            >
              <BookmarkIcon size={20} className="text-gray-700" />
              {savedJobsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#7209b7] text-white rounded-full text-xs px-1.5 py-0.5 min-w-5 h-5 flex items-center justify-center">
                  {savedJobsCount}
                </span>
              )}
            </Link>
          )}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-700 p-2 rounded-md hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg py-4 px-6 absolute w-full z-50">
          <nav className="flex flex-col space-y-4">
            {user && user.role === "recruiter" ? (
              <>
                <Link 
                  to="/admin/companies" 
                  className={`py-2 px-3 rounded-md ${isActive('/admin/companies') 
                    ? 'text-[#6A38C2] font-semibold bg-purple-50' 
                    : 'text-gray-700'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Companies
                </Link>
                <Link 
                  to="/admin/jobs" 
                  className={`py-2 px-3 rounded-md ${isActive('/admin/jobs') 
                    ? 'text-[#6A38C2] font-semibold bg-purple-50' 
                    : 'text-gray-700'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Jobs
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/" 
                  className={`py-2 px-3 rounded-md ${isActive('/') 
                    ? 'text-[#6A38C2] font-semibold bg-purple-50' 
                    : 'text-gray-700'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/jobs" 
                  className={`py-2 px-3 rounded-md ${isActive('/jobs') 
                    ? 'text-[#6A38C2] font-semibold bg-purple-50' 
                    : 'text-gray-700'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Jobs
                </Link>
                <Link 
                  to="/browse" 
                  className={`py-2 px-3 rounded-md ${isActive('/browse') 
                    ? 'text-[#6A38C2] font-semibold bg-purple-50' 
                    : 'text-gray-700'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Browse
                </Link>
                
                {/* Courses link for student users */}
                {user && user.role === "student" && (
                  <Link 
                    to="/courses" 
                    className={`py-2 px-3 rounded-md ${isActive('/courses') 
                      ? 'text-[#6A38C2] font-semibold bg-purple-50' 
                      : 'text-gray-700'}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Courses
                  </Link>
                )}
              </>
            )}

            {!user ? (
              <div className="flex flex-col space-y-2 pt-2 border-t border-gray-100">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full text-[#6A38C2] border-[#6A38C2]">Login</Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-[#6A38C2]">Signup</Button>
                </Link>
              </div>
            ) : (
              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="border-2 border-purple-200">
                    <AvatarImage src={user?.profile?.profilePhoto} />
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{user?.fullname}</h4>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
                
                {user.role === "student" && (
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-2 py-2 text-gray-700 hover:text-[#6A38C2]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User2 size={18} />
                    <span>View Profile</span>
                  </Link>
                )}
                
                <button 
                  onClick={() => {
                    logoutHandler();
                    setMobileMenuOpen(false);
                  }} 
                  className="flex items-center gap-2 py-2 text-gray-700 hover:text-[#6A38C2]"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </div>
  );
};

export default Navbar;
