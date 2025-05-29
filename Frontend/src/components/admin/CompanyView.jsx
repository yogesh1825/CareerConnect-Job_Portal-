import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Building, Globe, Mail, MapPin, Phone, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';

const CompanyView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(true);

    useEffect(() => {
        const fetchCompanyDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${COMPANY_API_END_POINT}/get/${id}`, {
                    withCredentials: true
                });
                
                if (response.data.success) {
                    setCompany(response.data.company);
                    setIsAuthorized(true);
                } else {
                    toast.error("Failed to load company details");
                    navigate('/admin/companies');
                }
            } catch (error) {
                console.error("Error fetching company details:", error);
                
                if (error.response?.status === 403) {
                    setIsAuthorized(false);
                    toast.error("You are not authorized to view this company");
                } else {
                    toast.error("Error loading company details");
                    navigate('/admin/companies');
                }
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCompanyDetails();
        }
    }, [id, navigate]);

    // Function to get initials for the avatar fallback
    const getInitials = (name) => {
        if (!name) return "CO";
        return name.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2);
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gradient-to-br from-[#f8f4ff] via-[#f0e9ff] to-white">
                    <div className="max-w-6xl mx-auto py-10 px-4">
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-pulse h-8 w-32 bg-purple-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // If unauthorized, show a message
    if (!isAuthorized && !loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gradient-to-br from-[#f8f4ff] via-[#f0e9ff] to-white">
                    <div className="max-w-6xl mx-auto py-10 px-4">
                        <div className="bg-white rounded-xl shadow-md p-10 text-center">
                            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Denied</h2>
                            <p className="text-gray-600 mb-6">You are not authorized to view this company. You can only view companies that you have created.</p>
                            <Button 
                                onClick={() => navigate('/admin/companies')}
                                className="bg-[#6A38C2] hover:bg-[#5930a5]"
                            >
                                Back to Companies
                            </Button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-[#f8f4ff] via-[#f0e9ff] to-white pb-16">
                <div className="max-w-6xl mx-auto py-10 px-4">
                    <Button 
                        variant="outline" 
                        onClick={() => navigate('/admin/companies')}
                        className="mb-6 text-[#6A38C2] border-[#6A38C2] hover:bg-[#6A38C2] hover:text-white"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Companies
                    </Button>

                    {company ? (
                        <div className="space-y-6">
                            {/* Company Header */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                                    <Avatar className="h-24 w-24 border-2 border-purple-100 rounded-md">
                                        <AvatarImage src={company?.logo} alt={company?.name || 'Company'} />
                                        <AvatarFallback className="bg-[#6A38C2] text-white text-xl">
                                            {getInitials(company?.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <h1 className="text-2xl font-bold text-gray-800">{company?.name || 'Unnamed Company'}</h1>
                                    </div>
                                    <Button 
                                        onClick={() => company?._id && navigate(`/admin/companies/${company._id}`)}
                                        className="bg-[#6A38C2] hover:bg-[#5930a5]"
                                    >
                                        Edit Company
                                    </Button>
                                </div>
                            </div>

                            {/* Company Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* About Section */}
                                <div className="bg-white rounded-xl shadow-md p-6">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4">About</h2>
                                    <p className="text-gray-700 whitespace-pre-line">
                                        {company?.description || 'No company description available.'}
                                    </p>
                                </div>

                                {/* Contact Information */}
                                <div className="bg-white rounded-xl shadow-md p-6">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h2>
                                    <div className="space-y-4">
                                        {company.website && (
                                            <div className="flex items-start gap-3">
                                                <Globe className="h-5 w-5 text-[#6A38C2] mt-0.5" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Website</p>
                                                    <a 
                                                        href={company.website} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-[#6A38C2] hover:underline"
                                                    >
                                                        {company.website}
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                        {company.email && (
                                            <div className="flex items-start gap-3">
                                                <Mail className="h-5 w-5 text-[#6A38C2] mt-0.5" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Email</p>
                                                    <a 
                                                        href={`mailto:${company.email}`}
                                                        className="text-[#6A38C2] hover:underline"
                                                    >
                                                        {company.email}
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                        {company.phone && (
                                            <div className="flex items-start gap-3">
                                                <Phone className="h-5 w-5 text-[#6A38C2] mt-0.5" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Phone</p>
                                                    <a 
                                                        href={`tel:${company.phone}`}
                                                        className="text-[#6A38C2] hover:underline"
                                                    >
                                                        {company.phone}
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                        {company.location && (
                                            <div className="flex items-start gap-3">
                                                <MapPin className="h-5 w-5 text-[#6A38C2] mt-0.5" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Location</p>
                                                    <p className="text-gray-700">{company.location}</p>
                                                </div>
                                            </div>
                                        )}
                                        {company.headquarter && (
                                            <div className="flex items-start gap-3">
                                                <Building className="h-5 w-5 text-[#6A38C2] mt-0.5" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Headquarters</p>
                                                    <p className="text-gray-700">{company.headquarter}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-md p-10 text-center">
                            <Building className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">Company Not Found</h2>
                            <p className="text-gray-600 mb-6">The company you're looking for doesn't exist or has been removed.</p>
                            <Button 
                                onClick={() => navigate('/admin/companies')}
                                className="bg-[#6A38C2] hover:bg-[#5930a5]"
                            >
                                Back to Companies
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CompanyView; 