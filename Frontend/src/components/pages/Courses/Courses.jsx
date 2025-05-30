import React, { useState } from "react";
import Navbar from "../../shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, FileVideo, Star, Play, Lock, ChevronDown, BookOpen, GraduationCap, Laptop, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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
      <FloatingIcon icon={Code} delay={0} className="top-1/4 left-1/2" />
      <FloatingIcon icon={BookOpen} delay={1} className="top-1/2 left-1/3" />
      <FloatingIcon icon={GraduationCap} delay={2} className="bottom-1/4 left-1/2" />
      <FloatingIcon icon={Laptop} delay={1.5} className="bottom-1/3 left-1/3" />
    </div>

    {/* Right side floating icons */}
    <div className="absolute right-0 top-0 w-1/4 h-full">
      <FloatingIcon icon={Code} delay={2.5} className="top-1/3 right-1/2" />
      <FloatingIcon icon={BookOpen} delay={3} className="top-1/2 right-1/3" />
      <FloatingIcon icon={Laptop} delay={2} className="bottom-1/4 right-1/3" />
    </div>
    
    {/* Left side decorative circle */}
    <motion.div
      className="absolute left-0 top-1/4 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-purple-200/30 to-purple-300/30"
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
      className="absolute right-0 top-1/2 translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-purple-300/30 to-purple-400/30"
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
          className="absolute w-2 h-2 rounded-full bg-purple-300/30"
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

const Courses = () => {
  const { user } = useSelector((store) => store.auth);
  const [expandedVideo, setExpandedVideo] = useState(null);

  // Redirect if not student
  if (!user || user.role !== "student") {
    return <Navigate to="/" />;
  }

  const htmlCourses = [
    {
      id: "html1",
      title: "HTML Fundamentals",
      description: "Learn the basics of HTML structure and elements",
      duration: "45 min",
      level: "Beginner",
      videoUrl: "https://www.youtube.com/embed/qz0aGYrrlhU",
      instructor: "Sarah Johnson"
    },
    {
      id: "html2",
      title: "HTML Forms & Input Elements",
      description: "Create interactive forms with various input types",
      duration: "1h 10min",
      level: "Intermediate",
      videoUrl: "https://www.youtube.com/embed/fNcJuPIZ2WE",
      instructor: "Mark Wilson"
    },
    {
      id: "html3",
      title: "Semantic HTML5",
      description: "Understanding semantic markup for better accessibility",
      duration: "55 min",
      level: "Intermediate",
      videoUrl: "https://www.youtube.com/embed/kUMe1FH4CHE",
      instructor: "Lisa Chang"
    }
  ];

  const cssCourses = [
    {
      id: "css1",
      title: "CSS Basics",
      description: "Learn the fundamentals of styling with CSS",
      duration: "1h",
      level: "Beginner",
      videoUrl: "https://www.youtube.com/embed/yfoY53QXEnI",
      instructor: "David Brown"
    },
    {
      id: "css2",
      title: "Flexbox Layouts",
      description: "Master the flexible box layout module",
      duration: "1h 20min",
      level: "Intermediate",
      videoUrl: "https://www.youtube.com/embed/JJSoEo8JSnc",
      instructor: "Emma Parker"
    },
    {
      id: "css3",
      title: "CSS Grid Systems",
      description: "Create responsive grid layouts with CSS Grid",
      duration: "1h 30min",
      level: "Advanced",
      videoUrl: "https://www.youtube.com/embed/jV8B24rSN5o",
      instructor: "Michael Rodriguez"
    }
  ];

  const jsCourses = [
    {
      id: "js1",
      title: "JavaScript Fundamentals",
      description: "Learn the basics of JavaScript programming",
      duration: "1h 15min",
      level: "Beginner",
      videoUrl: "https://www.youtube.com/embed/W6NZfCO5SIk",
      instructor: "John Smith"
    },
    {
      id: "js2",
      title: "DOM Manipulation",
      description: "Interact with HTML elements using JavaScript",
      duration: "1h 25min",
      level: "Intermediate",
      videoUrl: "https://www.youtube.com/embed/5fb2aPlgoys",
      instructor: "Jennifer Lee"
    },
    {
      id: "js3",
      title: "Async JavaScript",
      description: "Master promises, async/await and callbacks",
      duration: "1h 45min",
      level: "Advanced",
      videoUrl: "https://www.youtube.com/embed/DHvZLI7Db8E",
      instructor: "Robert Johnson"
    }
  ];

  const handleToggleVideo = (courseId) => {
    if (expandedVideo === courseId) {
      setExpandedVideo(null);
    } else {
      setExpandedVideo(courseId);
    }
  };

  const renderCourseCards = (courses) => {
    return courses.map((course, index) => (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        key={course.id}
      >
        <Card className="mb-4 overflow-hidden border border-purple-100 hover:border-purple-200 transition-all duration-300 hover:shadow-lg backdrop-blur-sm bg-white/80">
          <CardHeader className="pb-2 bg-gradient-to-r from-purple-50 to-white">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg font-bold text-[#6A38C2]">{course.title}</CardTitle>
                <CardDescription className="mt-1 text-gray-600">{course.description}</CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleToggleVideo(course.id)}
                className="text-[#6A38C2] hover:bg-purple-100 transition-colors duration-200"
              >
                {expandedVideo === course.id ? "Hide Video" : "Watch Video"}
                <Play size={16} className="ml-2" />
              </Button>
            </div>
          </CardHeader>

          <AnimatePresence>
            {expandedVideo === course.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-4 py-2">
                  <div className="w-full aspect-video rounded-md overflow-hidden shadow-md">
                    <iframe
                      src={course.videoUrl}
                      title={course.title}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <CardContent className="pb-4">
            <div className="flex flex-wrap gap-3 text-sm">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-1 bg-purple-50 text-[#6A38C2] px-3 py-1.5 rounded-full"
              >
                <FileVideo size={14} />
                <span>{course.duration}</span>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-1 bg-purple-50 text-[#6A38C2] px-3 py-1.5 rounded-full"
              >
                <Star size={14} />
                <span>{course.level}</span>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-1 bg-purple-50 text-[#6A38C2] px-3 py-1.5 rounded-full"
              >
                <Lock size={14} />
                <span>Student Only</span>
              </motion.div>
            </div>
            <p className="mt-3 text-sm text-gray-600">Instructor: <span className="text-[#6A38C2] font-medium">{course.instructor}</span></p>
          </CardContent>
        </Card>
      </motion.div>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 relative overflow-hidden">
      <BackgroundAnimation />
      <Navbar />
      <div className="max-w-6xl mx-auto py-12 px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center relative"
        >
          <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-60 h-60 bg-purple-200/40 rounded-full blur-3xl" />
          <h1 className="text-4xl font-bold text-[#6A38C2] mb-4 relative">Web Development Courses</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg relative">
            Enhance your skills with our curated video courses on HTML, CSS, and JavaScript. 
            These resources are specially selected to help you build better websites and improve your job prospects.
          </p>
        </motion.div>

        <Tabs defaultValue="html" className="w-full relative">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/80 backdrop-blur-md p-1 rounded-xl shadow-lg">
            <TabsTrigger 
              value="html" 
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-[#6A38C2] data-[state=active]:shadow-sm transition-all duration-200"
            >
              <Code size={18} />
              <span>HTML</span>
            </TabsTrigger>
            <TabsTrigger 
              value="css" 
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-[#6A38C2] data-[state=active]:shadow-sm transition-all duration-200"
            >
              <Code size={18} />
              <span>CSS</span>
            </TabsTrigger>
            <TabsTrigger 
              value="javascript" 
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-[#6A38C2] data-[state=active]:shadow-sm transition-all duration-200"
            >
              <Code size={18} />
              <span>JavaScript</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="html">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 gap-4"
            >
              {renderCourseCards(htmlCourses)}
            </motion.div>
          </TabsContent>

          <TabsContent value="css">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 gap-4"
            >
              {renderCourseCards(cssCourses)}
            </motion.div>
          </TabsContent>

          <TabsContent value="javascript">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 gap-4"
            >
              {renderCourseCards(jsCourses)}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default Courses; 