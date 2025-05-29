import React, { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import {
  BadgeCheck, Briefcase, Building, ChevronRight, Search,
  Sparkles, TrendingUp, Users, Code, LineChart, Palette,
  Database, Shield, Cpu, Clapperboard, Cloud
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useGetAllPublicCompanies from "@/hooks/useGetAllPublicCompanies";

const categoryData = [
  { name: "Frontend Developer", icon: <Code className="h-10 w-10 mb-3 text-[#6A38C2]" />, bgGradient: "from-purple-50 to-purple-100" },
  { name: "Backend Developer", icon: <Database className="h-10 w-10 mb-3 text-[#6A38C2]" />, bgGradient: "from-blue-50 to-blue-100" },
  { name: "Data Science", icon: <LineChart className="h-10 w-10 mb-3 text-[#6A38C2]" />, bgGradient: "from-green-50 to-green-100" },
  { name: "Graphic Designer", icon: <Palette className="h-10 w-10 mb-3 text-[#6A38C2]" />, bgGradient: "from-pink-50 to-pink-100" },
  { name: "FullStack Developer", icon: <Cpu className="h-10 w-10 mb-3 text-[#6A38C2]" />, bgGradient: "from-indigo-50 to-indigo-100" },
  { name: "QA Tester", icon: <Shield className="h-10 w-10 mb-3 text-[#6A38C2]" />, bgGradient: "from-yellow-50 to-yellow-100" },
  { name: "AWS Developer", icon: <Cloud className="h-10 w-10 mb-3 text-[#6A38C2]" />, bgGradient: "from-cyan-50 to-cyan-100" },
  { name: "Animation Developer", icon: <Clapperboard className="h-10 w-10 mb-3 text-[#6A38C2]" />, bgGradient: "from-rose-50 to-rose-100" }
];


const HeroSection = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { allJobs } = useSelector((store) => store.job);
  const { publicCompanies } = useSelector((store) => store.company);

  // Fetch all public companies
  useGetAllPublicCompanies();


  // Stats for the header section
  const stats = [
    {
      icon: <Briefcase className="h-8 w-8 text-purple-600" />,
      count: allJobs?.length || "500+",
      label: "Job Listings"
    },
    {
      icon: <Building className="h-8 w-8 text-purple-600" />,
      count: publicCompanies?.length || "250+",
      label: "Companies"
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      count: "10K+",
      label: "Job Seekers"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-purple-600" />,
      count: "90%",
      label: "Success Rate"
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };


  return (
    <>
      {/* Hero Section with Gradient Background */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#f9f8ff] via-[#f0e9ff] to-[#e5d8ff] py-20 pb-40">
        {/* Decorative Elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-200 rounded-full opacity-30"></div>
        <div className="absolute top-1/2 -left-12 w-40 h-40 bg-purple-300 rounded-full opacity-20"></div>
        <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-purple-400 rounded-full opacity-10"></div>

        {/* Animated Sparkles for Dream Jobs Section */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`dream-sparkle-${i}`}
              className="absolute w-2 h-2 bg-purple-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.2, 0.6, 0.2],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            />
          ))}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`dream-glow-${i}`}
              className="absolute w-3 h-3 bg-purple-500 rounded-full blur-sm"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 1.8, 1],
                opacity: [0.3, 0.7, 0.3],
                y: [0, -30, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeInOut"
              }}
            />
          ))}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`dream-star-${i}`}
              className="absolute w-4 h-4 bg-purple-600 rounded-full blur-md"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 2, 1],
                opacity: [0.2, 0.5, 0.2],
                y: [0, -40, 0],
                rotate: [0, 180, 0],
              }}
              transition={{
                duration: 5 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 4,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="flex flex-col gap-5 mb-14" variants={containerVariants}>
              <motion.span
                className="mx-auto px-4 py-2 rounded-full bg-[#6A38C2] bg-opacity-10 text-[#6A38C2] font-medium inline-flex items-center"
                variants={itemVariants}
              >
                <BadgeCheck className="mr-2 h-5 w-5" />
                No. 1 Career Connect Website for finding your Dream Job
              </motion.span>

              <motion.h1
                className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight"
                variants={itemVariants}
              >
                Search, Apply & <br /> Get {" "}
                <span className="text-[#6A38C2] relative inline-block">
                   Your Dream Jobs
                  <span className="absolute bottom-1 left-0 w-full h-2 bg-[#6A38C2] opacity-20 rounded"></span>
                </span>
              </motion.h1>

              <motion.p
                className="text-gray-600 max-w-2xl mx-auto text-lg"
                variants={itemVariants}
              >
                "Every great career starts with a single decision—to move forward.
                Explore endless job opportunities, connect with top employers, and
              <span className="text-[#6A38C2] relative inline-block">
                take control of your future with  confidence."
                <span className="absolute bottom-1 left-0 w-full h-2 bg-[#6A38C2] opacity-20 rounded"></span>
                </span>
              </motion.p>

            </motion.div>

            {/* Stats Section */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-16 max-w-5xl mx-auto"
              variants={containerVariants}
            >
              {stats?.map((stat, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-lg border border-purple-100 transform hover:-translate-y-2 transition-all duration-300 hover:shadow-xl overflow-hidden relative"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-purple-50 rounded-bl-full -mr-10 -mt-10 opacity-50"></div>
                  <div className="flex flex-col items-center relative z-10">
                    <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-3 rounded-xl mb-3 shadow-inner">
                      {stat?.icon}
                    </div>
                    <span className="text-3xl font-bold text-gray-900 mt-1 bg-clip-text text-transparent bg-gradient-to-r from-[#6A38C2] to-[#8355d7]">{stat.count}</span>
                    <span className="text-gray-500 mt-1 font-medium">{stat?.label}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Category Carousel Section*/}
      <div className="pt-20 pb-28 bg-white relative z-10">
        {/* Decorative Elements for Category Section */}
        <div className="absolute top-0 right-1/4 w-36 h-36 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full blur-2xl opacity-40"></div>
        <div className="absolute bottom-10 left-20 w-28 h-28 bg-gradient-to-br from-purple-200 to-purple-300 rounded-full blur-2xl opacity-30"></div>
        <div className="absolute right-20 top-1/3 w-20 h-20 bg-gradient-to-br from-purple-300 to-purple-400 rounded-full blur-2xl opacity-20"></div>

        {/* Animated floating sparkles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-purple-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.2, 0.6, 0.2],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            />
          ))}
          
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`glow-${i}`}
              className="absolute w-4 h-4 bg-purple-600 rounded-full blur-sm"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 2, 1],
                opacity: [0.2, 0.5, 0.2],
                y: [0, -40, 0],
              }}
              transition={{
                duration: 5 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 4,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="relative z-10"
        >
          <div className="mx-auto text-center mb-14">
            <motion.span
              className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-purple-200 text-[#6A38C2] font-medium mb-4 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              Discover Your Path
            </motion.span>
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-gray-800 mb-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              Popular Job <span className="text-[#6A38C2] relative inline-block">
                Categories
                <span className="absolute bottom-1 left-0 w-full h-2 bg-[#6A38C2] opacity-20 rounded"></span>
              </span>
            </motion.h2>
            <motion.p
              className="text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              Explore our most in-demand job categories and find the perfect role for your skills and experience
            </motion.p>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Carousel className="w-full max-w-6xl mx-auto">
              <CarouselContent>
                {categoryData.map((category, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4 p-3">
                    <motion.div
                      whileHover={{ y: -8, scale: 1.03 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      onClick={() => searchJobHandler(category?.name)}
                      className="cursor-pointer"
                    >
                      <div className={`bg-gradient-to-br ${category.bgGradient} rounded-xl p-6 flex flex-col items-center text-center shadow-md hover:shadow-lg transition-all duration-300 h-full`}>
                        <div className="p-3 rounded-full bg-white shadow-inner mb-2">
                          {category?.icon}
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-1">{category?.name}</h3>
                      </div>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="text-[#6A38C2] hover:bg-purple-100 left-0 lg:-left-10 shadow-md" />
              <CarouselNext className="text-[#6A38C2] hover:bg-purple-100 right-0 lg:-right-10 shadow-md" />
            </Carousel>
          </div>

          {/* Call to action button */}
          <motion.div
            className="flex justify-center mt-14"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Button
              onClick={() => navigate('/jobs')}
              className="bg-gradient-to-r from-[#6A38C2] to-[#8355d7] hover:from-[#5b30a6] hover:to-[#7248c9] text-white px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span className="flex items-center">
                Explore All Jobs <ChevronRight className="ml-2 h-5 w-5" />
              </span>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default HeroSection;
