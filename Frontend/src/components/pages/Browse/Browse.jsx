import Navbar from "@/components/shared/Navbar";
import React, { useEffect } from "react";
import SingleJob from "../Jobs/SingleJob";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import useGetAllJobs from "@/hooks/useGetAllJobs";

const Browse = () => {
  useGetAllJobs();
  const { allJobs } = useSelector((store) => store.job);
  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(""));
    };
  }, []);
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto my-10">
        <h1 className="font-bold text-xl my-10 text-purple-500">
          Search Results({allJobs.length})
        </h1>
        <div className="grid grid-cols-3 gap-4">
          {allJobs.map((job) => {
            return <SingleJob key={job._id} job={job} />;
          })}
        </div>
      </div>
    </>
  );
};

export default Browse;
