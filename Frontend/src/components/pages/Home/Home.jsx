import React, { useEffect } from "react";
import Navbar from "../../shared/Navbar";
import HeroSection from "./HeroSection";
import LatestJobs from "./LatestJobs";
import Footer from "@/components/shared/Footer";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ChatBot from "@/components/shared/ChatBot";

const Home = () => {
  const {user} = useSelector(store => store.auth)
  const navigate = useNavigate()
  useEffect(()=>{
    if (user?.role === "recruiter"){
      navigate("/admin/companies")
    }
  },[])

  return (
    <div>
      <Navbar />
      <HeroSection />
      <LatestJobs />
      <Footer />
      {user?.role === "student" && <ChatBot />}
    </div>
  );
};

export default Home;
