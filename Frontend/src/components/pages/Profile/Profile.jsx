import Navbar from "@/components/shared/Navbar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Contact, Mail, Pen, FileText, Award, Briefcase, User, GraduationCap, Star, Code } from "lucide-react";
import React, { useState } from "react";
import AppliedJobTable from "./AppliedJobTable";
import UpdateProfile from "./UpdateProfile";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";
import { motion } from "framer-motion";

// Background animation components
const FloatingIcon = ({ icon: Icon, delay, duration, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ 
      opacity: [0.4, 0.8, 0.4],
      y: [0, -30, 0],
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration: duration || 5,
      delay: delay || 0,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    className={`absolute text-[#6A38C2]/30 ${className}`}
  >
    <Icon size={32} />
  </motion.div>
);

const BackgroundAnimation = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    {/* Left side floating icons */}
    <div className="absolute left-0 top-0 w-1/4 h-full">
      <FloatingIcon icon={User} delay={0} className="top-1/4 left-1/2" />
      <FloatingIcon icon={GraduationCap} delay={1} className="top-1/2 left-1/3" />
      <FloatingIcon icon={Star} delay={2} className="bottom-1/4 left-1/2" />
    </div>

    {/* Right side floating icons */}
    <div className="absolute right-0 top-0 w-1/4 h-full">
      <FloatingIcon icon={Code} delay={1.5} className="top-1/3 right-1/2" />
      <FloatingIcon icon={Award} delay={2.5} className="top-1/2 right-1/3" />
      <FloatingIcon icon={Briefcase} delay={3} className="bottom-1/3 right-1/2" />
    </div>
    
    {/* Left side decorative circle */}
    <motion.div
      className="absolute left-0 top-1/4 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-purple-200/40 to-purple-300/40"
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.2, 0.4, 0.2],
        rotate: [0, 180, 0],
      }}
      transition={{
        duration: 15,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />

    {/* Right side decorative circle */}
    <motion.div
      className="absolute right-0 top-1/2 translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-purple-300/40 to-purple-400/40"
      animate={{
        scale: [1.2, 1, 1.2],
        opacity: [0.2, 0.4, 0.2],
        rotate: [180, 0, 180],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />

    {/* Animated dots pattern - positioned on sides */}
    <div className="absolute inset-0">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-purple-300/40"
          style={{
            left: i % 2 === 0 ? `${Math.random() * 20}%` : `${80 + Math.random() * 20}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  </div>
);

// const skills = ["JavaScript", "Reactjs", "Nodejs", "MongoDB"];
const isResume = true;

const Profile = () => {
  useGetAppliedJobs()
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 relative overflow-hidden">
        <BackgroundAnimation />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          {/* Profile Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden"
          >
            {/* Profile Header with Gradient */}
            <div className="relative h-40 bg-gradient-to-r from-[#6A38C2] to-[#8355d7]">
              <div className="absolute -bottom-16 left-8">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="relative"
                >
                  <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                    <AvatarImage
                      src={user?.profile?.profilePhoto}
                      alt="profile"
                      className="object-cover"
                    />
                  </Avatar>
                </motion.div>
              </div>
              <Button
                onClick={() => setOpen(true)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full"
                size="icon"
                variant="ghost"
              >
                <Pen className="h-4 w-4 text-white" />
              </Button>
            </div>
            
            {/* Profile Content */}
            <div className="pt-20 px-8 pb-8">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="space-y-6"
              >
                {/* Basic Info */}
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{user?.fullname}</h1>
                  <p className="text-gray-600 mt-1">{user?.profile?.bio || "No bio added yet"}</p>
                </div>
                
                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#f8f4ff] p-4 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="bg-[#6A38C2] bg-opacity-10 p-2 rounded-full">
                      <Mail className="h-5 w-5 text-[#6A38C2]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-700">{user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-[#6A38C2] bg-opacity-10 p-2 rounded-full">
                      <Contact className="h-5 w-5 text-[#6A38C2]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-gray-700">{user?.phoneNumber || "Not added"}</p>
                    </div>
                  </div>
                </div>
                
                {/* Skills Section */}
                <div className="border border-gray-100 rounded-xl p-5 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-[#6A38C2]" />
                    <h2 className="text-lg font-semibold text-gray-800">Skills</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {user?.profile?.skills && user?.profile?.skills.length > 0 ? (
                      user?.profile?.skills.map((item, index) => (
                        <Badge 
                          key={index} 
                          className="bg-[#6A38C2] bg-opacity-10 hover:bg-opacity-20 text-[#6A38C2] px-3 py-1 rounded-full"
                        >
                          {item}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-400">No skills added yet</span>
                    )}
                  </div>
                </div>
                
                {/* Resume Section */}
                <div className="border border-gray-100 rounded-xl p-5 space-y-3">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-[#6A38C2]" />
                    <h2 className="text-lg font-semibold text-gray-800">Resume</h2>
                  </div>
                  {user?.profile?.resume ? (
                    <a
                      href={user?.profile?.resume}
                      target="_blank"
                      className="inline-flex items-center space-x-2 text-[#6A38C2] hover:text-[#8355d7] font-medium"
                    >
                      <FileText className="h-4 w-4" />
                      <span>{user?.profile?.resumeOriginalName}</span>
                    </a>
                  ) : (
                    <span className="text-gray-400">No resume uploaded yet</span>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Applied Jobs Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8"
          >
            <div className="flex items-center space-x-2 mb-6 border-b border-gray-100 pb-4">
              <Briefcase className="h-6 w-6 text-[#6A38C2]" />
              <h2 className="text-xl font-bold text-gray-800">Applied Jobs</h2>
            </div>
            <AppliedJobTable />
          </motion.div>
        </div>
      </div>
      <UpdateProfile open={open} setOpen={setOpen} />
    </>
  );
};

export default Profile;
