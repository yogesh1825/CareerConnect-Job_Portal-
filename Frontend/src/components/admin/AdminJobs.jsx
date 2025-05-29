import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import AdminJobsTable from './AdminJobsTable'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setSearchJobByText } from '@/redux/jobSlice'
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs'
import { Search, Plus } from 'lucide-react'

const AdminJobs = () => {
  useGetAllAdminJobs()
  const [input, setInput] = useState()
  const navigate = useNavigate()
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input]);

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#f8f4ff] via-[#f0e9ff] to-white">
        <div className='max-w-6xl mx-auto py-10 px-4'>
          <div className='flex flex-col md:flex-row items-center justify-between gap-4 mb-8'>
            <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Manage Jobs</h1>
            <div className='flex flex-col sm:flex-row gap-4 w-full md:w-auto'>
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  className="pl-10 border-gray-200 focus:border-[#6A38C2] focus:ring-[#6A38C2] w-full"
                  placeholder="Search Jobs"
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>
              <Button 
                onClick={() => navigate("/admin/jobs/create")}
                className="bg-[#6A38C2] hover:bg-[#5930a5] flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Post New Job
              </Button>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <AdminJobsTable />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminJobs