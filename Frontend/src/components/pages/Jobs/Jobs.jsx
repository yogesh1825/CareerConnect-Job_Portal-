import Navbar from "@/components/shared/Navbar";
import React, { useEffect, useState } from "react";
import FilterCard from "./FilterCard";
import SingleJob from "./SingleJob";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";

const Jobs = () => {
  const { allJobs, searchedQuery, filterCriteria } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState(allJobs);

  useEffect(() => {
    let filteredJobs = [...allJobs];

    // Apply search query filter
    if (searchedQuery) {
      filteredJobs = filteredJobs.filter((job) => {
        return (
          job.title?.toLowerCase().includes(searchedQuery.toLowerCase()) ||
          job.description?.toLowerCase().includes(searchedQuery.toLowerCase()) ||
          job.location?.toLowerCase().includes(searchedQuery.toLowerCase())
        );
      });
    }

    // Apply location filter
    if (filterCriteria.location) {
      filteredJobs = filteredJobs.filter(job => {
        const jobLocation = (job.location || '').toLowerCase().trim();
        const selectedLocation = filterCriteria.location.toLowerCase().trim();
        return jobLocation === selectedLocation;
      });
    }

    // Apply industry filter
    if (filterCriteria.industry) {
      filteredJobs = filteredJobs.filter(job => {
        const jobTitle = (job.title || '').toLowerCase().trim();
        const selectedIndustry = filterCriteria.industry.toLowerCase().trim();
        return jobTitle.includes(selectedIndustry);
      });
    }

    setFilterJobs(filteredJobs);
  }, [allJobs, searchedQuery, filterCriteria]);

  const getNoJobsMessage = () => {
    if (filterCriteria.location && filterCriteria.industry) {
      return `No jobs found for ${filterCriteria.industry} positions in ${filterCriteria.location}`;
    } else if (filterCriteria.location) {
      return `No jobs found in ${filterCriteria.location}`;
    } else if (filterCriteria.industry) {
      return `No jobs found for ${filterCriteria.industry} positions`;
    } else if (searchedQuery) {
      return `No jobs found matching "${searchedQuery}"`;
    }
    return "No jobs found";
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto mt-5 px-4">
        <div className="flex flex-col md:flex-row gap-5">
          <div className="w-full md:w-1/4 lg:w-1/5">
            <FilterCard />
          </div>

          {/* Jobs content area */}
          <div className="flex-1 min-h-[70vh]">
            {filterJobs.length <= 0 ? (
              <div className="flex flex-col items-center justify-center h-[80vh] text-center">
                <div className="bg-purple-100 p-4 rounded-full mb-4">
                  <Briefcase className="h-12 w-12 text-purple-500" />
                </div>
                <h3 className="text-2xl font-semibold text-[#6A38C2] mb-3">No jobs found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {getNoJobsMessage()}
                </p>
              </div>
            ) : (
              <div className="h-[88vh] overflow-y-auto pb-5">
                {filterCriteria.location && (
                  <div className="mb-4 text-gray-600">
                    Showing jobs in: <span className="font-semibold text-[#6A38C2]">{filterCriteria.location}</span>
                  </div>
                )}
                {filterCriteria.industry && (
                  <div className="mb-4 text-gray-600">
                    Showing jobs for: <span className="font-semibold text-[#6A38C2]">{filterCriteria.industry}</span>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filterJobs.map((job) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      key={job?._id}
                    >
                      <SingleJob job={job} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Jobs;
