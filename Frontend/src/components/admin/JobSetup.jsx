import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { ArrowLeft, Loader2, AlertTriangle } from 'lucide-react'
import { Button } from '../ui/button'
import { useNavigate, useParams } from 'react-router-dom'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import useGetAdminJobById from '@/hooks/useGetAdminJobById'

const JobSetup = () => {
  const params = useParams()
  const { isLoading: isFetchingJob, isAuthorized } = useGetAdminJobById(params.id)
  
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    salaryType: "lpa",
    location: "",
    jobType: "",
    experience: "",
    position: 0,
    companyId: ""
  });
  
  const { singleJob } = useSelector(store => store.job)
  const { companies } = useSelector(store => store.company)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  }

  const selectCompanyHandler = (value) => {
    const selectedCompany = companies.find((company) => company.name.toLowerCase() === value);
    if (selectedCompany) {
      setInput({ ...input, companyId: selectedCompany._id });
    }
  };

  const selectSalaryTypeHandler = (value) => {
    setInput({ ...input, salaryType: value });
  };

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      setLoading(true);
      const res = await axios.put(`${JOB_API_END_POINT}/update/${params.id}`, input, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      })
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/jobs");
      }
    } catch (error) {
      console.log(error);
      if (error.response?.status === 403) {
        toast.error("You are not authorized to edit this job");
        navigate("/admin/jobs");
      } else {
        toast.error(error.response?.data?.message || "Error updating job");
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!singleJob) {
      return;
    }
    
    setInput({
      title: singleJob.title || "",
      description: singleJob.description || "",
      requirements: Array.isArray(singleJob.requirements) ? singleJob.requirements.join(", ") : singleJob.requirements || "",
      salary: singleJob.salary?.toString() || "",
      salaryType: singleJob.salaryType || "lpa",
      location: singleJob.location || "",
      jobType: singleJob.jobType || "",
      experience: singleJob.experienceLevel || "",
      position: singleJob.position?.toString() || "0",
      companyId: singleJob.company?._id || ""
    })
  }, [singleJob]);

  if (!isAuthorized && !isFetchingJob) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-[#f8f4ff] via-[#f0e9ff] to-white pb-16">
          <div className='max-w-5xl mx-auto my-10 px-4'>
            <Button 
              onClick={() => navigate("/admin/jobs")} 
              variant="outline" 
              className="mb-6 text-[#6A38C2] border-[#6A38C2] hover:bg-[#6A38C2] hover:text-white flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Jobs</span>
            </Button>
            
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
              <h1 className='text-2xl font-bold text-gray-800 mb-3'>Unauthorized Access</h1>
              <p className="text-gray-600 mb-6">You don't have permission to edit this job. You can only edit jobs that you have created.</p>
              <Button 
                onClick={() => navigate("/admin/jobs")} 
                className="bg-[#6A38C2] hover:bg-[#5930a5]"
              >
                Return to Jobs List
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#f8f4ff] via-[#f0e9ff] to-white pb-16">
        <div className='max-w-5xl mx-auto my-10 px-4'>
          <Button 
            onClick={() => navigate("/admin/jobs")} 
            variant="outline" 
            className="mb-6 text-[#6A38C2] border-[#6A38C2] hover:bg-[#6A38C2] hover:text-white flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Jobs</span>
          </Button>
          
          <div className="bg-white rounded-xl shadow-md p-8">
            <h1 className='text-2xl font-bold text-gray-800 mb-6'>Edit Job</h1>
            
            {isFetchingJob ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[#6A38C2]" />
              </div>
            ) : (
              <form onSubmit={submitHandler}>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <Label className="text-gray-700">Job Title</Label>
                    <Input
                      type="text"
                      name="title"
                      placeholder="Frontend Developer, Backend Engineer, etc."
                      value={input.title}
                      onChange={changeEventHandler}
                      className="mt-1 focus-visible:ring-[#6A38C2]"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700">Job Description</Label>
                    <Input
                      type="text"
                      name="description"
                      placeholder="Brief description of the role"
                      value={input.description}
                      onChange={changeEventHandler}
                      className="mt-1 focus-visible:ring-[#6A38C2]"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700">Requirements (comma separated)</Label>
                    <Input
                      type="text"
                      name="requirements"
                      placeholder="JavaScript, React, Node.js"
                      value={input.requirements}
                      onChange={changeEventHandler}
                      className="mt-1 focus-visible:ring-[#6A38C2]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-gray-700">Salary</Label>
                      <Input
                        type="text"
                        name="salary"
                        placeholder="e.g. 12"
                        value={input.salary}
                        onChange={changeEventHandler}
                        className="mt-1 focus-visible:ring-[#6A38C2]"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700">Salary Type</Label>
                      <Select 
                        defaultValue={input.salaryType} 
                        value={input.salaryType}
                        onValueChange={selectSalaryTypeHandler}
                      >
                        <SelectTrigger className="mt-1 focus-visible:ring-[#6A38C2]">
                          <SelectValue placeholder="Select Salary Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="lpa">LPA (Lakhs Per Annum)</SelectItem>
                            <SelectItem value="monthly">Per Month</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-700">Location</Label>
                    <Input
                      type="text"
                      name="location"
                      placeholder="City, Country or Remote"
                      value={input.location}
                      onChange={changeEventHandler}
                      className="mt-1 focus-visible:ring-[#6A38C2]"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700">Job Type</Label>
                    <Input
                      type="text"
                      name="jobType"
                      placeholder="Full-time, Part-time, Contract"
                      value={input.jobType}
                      onChange={changeEventHandler}
                      className="mt-1 focus-visible:ring-[#6A38C2]"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700">Experience Level</Label>
                    <Input
                      type="text"
                      name="experience"
                      placeholder="Entry, Mid, Senior"
                      value={input.experience}
                      onChange={changeEventHandler}
                      className="mt-1 focus-visible:ring-[#6A38C2]"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700">Number of Positions</Label>
                    <Input
                      type="number"
                      name="position"
                      min="1"
                      value={input.position}
                      onChange={changeEventHandler}
                      className="mt-1 focus-visible:ring-[#6A38C2]"
                    />
                  </div>
                  {companies && companies.length > 0 && (
                    <div>
                      <Label className="text-gray-700">Company</Label>
                      <Select 
                        onValueChange={selectCompanyHandler}
                        defaultValue={companies.find(c => c._id === input.companyId)?.name?.toLowerCase()}
                      >
                        <SelectTrigger className="mt-1 focus-visible:ring-[#6A38C2]">
                          <SelectValue placeholder="Select a Company" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {companies.map((company, index) => (
                              <SelectItem 
                                key={company._id || index} 
                                value={company?.name?.toLowerCase()}
                              >
                                {company.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                
                <div className="mt-8">
                  {loading ? (
                    <Button className="w-full bg-[#6A38C2] hover:bg-[#5930a5] py-6" disabled>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Updating...
                    </Button>
                  ) : (
                    <Button 
                      type="submit" 
                      className="w-full bg-[#6A38C2] hover:bg-[#5930a5] py-6"
                    >
                      Update Job
                    </Button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobSetup 