import React, { useEffect } from 'react'
import Navbar from '../shared/Navbar'
import ApplicantsTable from './ApplicantsTable'
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '@/redux/aplicationSlice';
import { ArrowLeft, Users } from 'lucide-react';
import { Button } from '../ui/button';

const Applicants = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { applicants } = useSelector(store => store.application);

    useEffect(() => {
        const fetchAllApplicants = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, { withCredentials: true });
                console.log("API response data:", res.data);
                dispatch(setAllApplicants(res.data.job));
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllApplicants();
    }, [params.id, dispatch]);

    return (
        <div>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-[#f8f4ff] via-[#f0e9ff] to-white">
                <div className="max-w-6xl mx-auto py-10 px-4">
                    <Button 
                        variant="outline" 
                        onClick={() => navigate('/admin/jobs')}
                        className="mb-6 text-[#6A38C2] border-[#6A38C2] hover:bg-[#6A38C2] hover:text-white"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Jobs
                    </Button>

                    <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="mb-4 md:mb-0">
                            <h1 className="text-2xl font-bold text-gray-800 mb-1">
                                {applicants?.title ? applicants.title : 'Job Applicants'}
                            </h1>
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-[#6A38C2]" />
                                <span className="text-gray-600">
                                    {applicants?.applications?.length || 0} Applicant{applicants?.applications?.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>
                        
                        {applicants?.company && (
                            <div className="bg-white px-4 py-2 rounded-md shadow-sm border border-gray-100">
                                <p className="text-sm text-gray-500">Company</p>
                                <p className="font-medium text-gray-800">{applicants.company.name}</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <ApplicantsTable />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Applicants