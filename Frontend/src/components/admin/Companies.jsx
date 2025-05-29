import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import CompaniesTable from './CompaniesTable';
import { useNavigate } from 'react-router-dom';
import useGetAllCompanies from '@/hooks/useGetAllCompanies';
import { useDispatch } from 'react-redux';
import { setSearchCompanyByText } from '@/redux/companySlice';
import { Building, Plus, Search } from 'lucide-react';

const Companies = () => {
  useGetAllCompanies()
  const navigate = useNavigate()
  const [input, setInput] = useState("");
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setSearchCompanyByText(input))
  }, [input, dispatch])

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#f8f4ff] via-[#f0e9ff] to-white pb-16">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#6A38C2] to-[#8355d7] py-12 px-4 shadow-md mb-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center">
                  <Building className="mr-2 h-8 w-8" />
                  Companies Management
                </h1>
                <p className="text-purple-200 mt-2">
                  Manage all company accounts from one place
                </p>
              </div>
              <Button 
                onClick={() => navigate("/admin/companies/create")}
                className="bg-white text-[#6A38C2] hover:bg-purple-100 shadow-md flex items-center"
                size="lg"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add New Company
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                All Companies
              </h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  className="pl-10 pr-4 py-2 w-full sm:w-80 border border-gray-200 rounded-lg focus:ring-[#6A38C2] focus:border-[#6A38C2]"
                  placeholder="Search by company name..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>
            </div>
            
            {/* Table Card */}
            <div className="border border-gray-100 rounded-lg overflow-hidden">
              <CompaniesTable />
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-1/3 right-10 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 -z-10"></div>
          <div className="absolute bottom-1/3 left-10 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 -z-10"></div>
        </div>
      </div>
    </>
  )
}

export default Companies