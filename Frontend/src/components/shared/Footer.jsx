import React from "react";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import LogoWhite from "../../assets/LogoWhite.png"
import { motion } from "framer-motion";

const Footer = () => {
  // Define path data constants to avoid undefined values during animation
  const middleWavePath1 = "M0,64L40,58.7C80,53,160,43,240,53.3C320,64,400,96,480,106.7C560,117,640,107,720,90.7C800,75,880,53,960,69.3C1040,85,1120,139,1200,149.3C1280,160,1360,128,1400,112L1440,96L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z";
  const middleWavePath2 = "M0,32L40,37.3C80,43,160,53,240,69.3C320,85,400,107,480,117.3C560,128,640,128,720,117.3C800,107,880,85,960,74.7C1040,64,1120,64,1200,74.7C1280,85,1360,107,1400,117.3L1440,128L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z";
  
  const frontWavePath1 = "M0,32L40,48C80,64,160,96,240,106.7C320,117,400,107,480,90.7C560,75,640,53,720,48C800,43,880,53,960,64C1040,75,1120,85,1200,85.3C1280,85,1360,75,1400,69.3L1440,64L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z";
  const frontWavePath2 = "M0,32L40,26.7C80,21,160,11,240,16C320,21,400,43,480,42.7C560,43,640,21,720,21.3C800,21,880,43,960,42.7C1040,43,1120,21,1200,26.7C1280,32,1360,64,1400,80L1440,96L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z";

  return (
    <div className="mt-16">
      {/* Wave divider with animation */}
      <div className="h-32 bg-white overflow-hidden">
        <motion.svg 
          viewBox="0 0 1440 320" 
          className="w-full h-full"
          preserveAspectRatio="none"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <defs>
            <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6A38C2" />
              <stop offset="50%" stopColor="#5b30a6" />
              <stop offset="100%" stopColor="#4e2a8f" />
            </linearGradient>
            <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7642d1" />
              <stop offset="50%" stopColor="#6A38C2" />
              <stop offset="100%" stopColor="#5b30a6" />
            </linearGradient>
            <linearGradient id="waveGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8355d7" />
              <stop offset="50%" stopColor="#7642d1" />
              <stop offset="100%" stopColor="#6A38C2" />
            </linearGradient>
          </defs>
          
          {/* Middle wave - flipped */}
          <motion.path
            fillOpacity="0.5"
            fill="url(#waveGradient2)"
            d={middleWavePath1}
            animate={{
              d: [middleWavePath1, middleWavePath2],
              transition: {
                repeat: Infinity,
                repeatType: "reverse",
                duration: 8,
                ease: "easeInOut"
              }
            }}
          />
          
          {/* Front wave - flipped */}
          <motion.path
            fillOpacity="0.9"
            fill="url(#waveGradient3)"
            d={frontWavePath1}
            animate={{
              d: [frontWavePath1, frontWavePath2],
              transition: {
                repeat: Infinity,
                repeatType: "reverse",
                duration: 6,
                ease: "easeInOut"
              }
            }}
          />
        </motion.svg>
      </div>

      <footer className="bg-gradient-to-br from-[#6A38C2] via-[#5b30a6] to-[#4e2a8f] text-white py-16 px-5 relative overflow-hidden">
        {/* Animated background decorative elements */}
        <motion.div 
          className="absolute top-40 right-10 w-64 h-64 bg-[#8355d7] rounded-full blur-3xl opacity-10"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        ></motion.div>
        
        <motion.div 
          className="absolute bottom-20 left-10 w-48 h-48 bg-[#7642d1] rounded-full blur-3xl opacity-10"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.18, 0.1]
          }}
          transition={{ 
            duration: 7, 
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2
          }}
        ></motion.div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-10"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <motion.div 
                className="w-36"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img src={LogoWhite} alt="Career Connect Logo" className="" />
              </motion.div>
              <p className="mt-2 text-gray-200 leading-relaxed">
                Your dream job is just a click away. Explore, apply, and grow with
                us. We connect talented professionals with top employers worldwide.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold mb-5 text-white">Quick Links</h3>
              <ul className="space-y-3">
                <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Link to="/" className="text-gray-200 hover:text-white transition-colors flex items-center">
                    <span className="w-1.5 h-1.5 bg-white rounded-full mr-2 inline-block"></span>
                    Home
                  </Link>
                </motion.li>
                <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Link to="/jobs" className="text-gray-200 hover:text-white transition-colors flex items-center">
                    <span className="w-1.5 h-1.5 bg-white rounded-full mr-2 inline-block"></span>
                    Find Jobs
                  </Link>
                </motion.li>
                <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Link to="/browse" className="text-gray-200 hover:text-white transition-colors flex items-center">
                    <span className="w-1.5 h-1.5 bg-white rounded-full mr-2 inline-block"></span>
                    Browse
                  </Link>
                </motion.li>
                <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Link to="/saved-jobs" className="text-gray-200 hover:text-white transition-colors flex items-center">
                    <span className="w-1.5 h-1.5 bg-white rounded-full mr-2 inline-block"></span>
                    Saved Jobs
                  </Link>
                </motion.li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-5 text-white">Support</h3>
              <ul className="space-y-3">
                <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                  <a href="#" className="text-gray-200 hover:text-white transition-colors flex items-center">
                    <span className="w-1.5 h-1.5 bg-white rounded-full mr-2 inline-block"></span>
                    FAQ
                  </a>
                </motion.li>
                <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                  <a href="#" className="text-gray-200 hover:text-white transition-colors flex items-center">
                    <span className="w-1.5 h-1.5 bg-white rounded-full mr-2 inline-block"></span>
                    Privacy Policy
                  </a>
                </motion.li>
                <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                  <a href="#" className="text-gray-200 hover:text-white transition-colors flex items-center">
                    <span className="w-1.5 h-1.5 bg-white rounded-full mr-2 inline-block"></span>
                    Terms & Conditions
                  </a>
                </motion.li>
                <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                  <a href="#" className="text-gray-200 hover:text-white transition-colors flex items-center">
                    <span className="w-1.5 h-1.5 bg-white rounded-full mr-2 inline-block"></span>
                    Contact Us
                  </a>
                </motion.li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-xl font-semibold mb-5 text-white">Follow Us</h3>
              <div className="flex space-x-4">
                <motion.a
                  href="#"
                  className="bg-white bg-opacity-20 p-3 rounded-full text-white hover:bg-opacity-30 transition-colors"
                  whileHover={{ y: -5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Facebook size={18} />
                </motion.a>
                <motion.a
                  href="#"
                  className="bg-white bg-opacity-20 p-3 rounded-full text-white hover:bg-opacity-30 transition-colors"
                  whileHover={{ y: -5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Twitter size={18} />
                </motion.a>
                <motion.a
                  href="#"
                  className="bg-white bg-opacity-20 p-3 rounded-full text-white hover:bg-opacity-30 transition-colors"
                  whileHover={{ y: -5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Linkedin size={18} />
                </motion.a>
                <motion.a
                  href="#"
                  className="bg-white bg-opacity-20 p-3 rounded-full text-white hover:bg-opacity-30 transition-colors"
                  whileHover={{ y: -5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Instagram size={18} />
                </motion.a>
              </div>
              
              <div className="mt-8">
                <h4 className="text-lg font-medium mb-3 text-white">Subscribe to our Newsletter</h4>
                <motion.div 
                  className="flex"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="bg-white bg-opacity-10 text-white placeholder:text-gray-300 border-0 rounded-l-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-20 w-full"
                  />
                  <button className="bg-white text-[#6A38C2] font-medium rounded-r-full px-4 hover:bg-opacity-90 transition-colors">
                    Subscribe
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
          
          <div className="border-t border-white border-opacity-20 mt-12 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-300 mb-4 md:mb-0">© 2025 Career Connect. All rights reserved.</p>
              <div className="flex space-x-6">
                <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
