import React, { useState } from "react";
import { Button } from "../../ui/button";
import { Search } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";

const category = [
  "Frontend Developer",
  "Backend Developer",
  "Data Science",
  "Graphic Designer",
  "FullStack Developer",
  "QA Tester",
  "AWS Developer",
  "Animation Developer"
];
const HeroSection = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const searchJobHandler = () => {
    dispatch(setSearchedQuery(query))
    navigate("/browse")
  };

  return (
    <>
      {/* Hero Section Home Page */}
      <div className="text-center">
        <div className="flex flex-col gap-5 my-10">
          <span className=" mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#F83002] font-medium">
            No. 1 Carrier Connect Website for find a Dream jobs
          </span>
          <h1 className="text-5xl font-bold">
            Search, Apply & <br /> Get Your{" "}
            <span className="text-[#6A38C2]">Dream Jobs</span>
          </h1>
          <p className="">
            "Every great career starts with a single decision—to move forward.
            Explore endless job opportunities, connect with top employers, and
            take control of your future with confidence."
          </p>
          <div className="flex w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto">
            <input
              type="text"
              placeholder="Find your dream jobs"
              onChange={(e) => setQuery(e.target.value)}
              className="outline-none border-none w-full"
            />
            <Button onClick={searchJobHandler} className="rounded-r-full bg-[#6A38C2]">
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Catagory Carousel Section*/}

      <div>
        <Carousel className="w-full max-w-xl mx-auto my-20">
          <CarouselContent>
            {category.map((cat, index) => (
              <CarouselItem key={index} className="md:basis-1/3 lg-basis-1/3">
                <Button onClick={()=>searchJobHandler(cat)} variant="outline" className="rounded-full">
                  {cat}
                </Button>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </>
  );
};

export default HeroSection;
