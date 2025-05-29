import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { MoreHorizontal, Mail, Phone, Calendar, User, File, UserX, Briefcase } from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
  const { applicants } = useSelector((store) => store.application);
  const [isProcessing, setIsProcessing] = useState({});

  // Debug logs
  useEffect(() => {
    console.log("Applicants data:", applicants);
  }, [applicants]);

  // Track selected status per applicant
  const [selectedStatuses, setSelectedStatuses] = useState({});

  // Initialize selectedStatuses from database values when component loads
  useEffect(() => {
    if (applicants?.applications) {
      const initialStatuses = {};
      applicants.applications.forEach(item => {
        if (item.status && item.status !== "pending") {
          // Capitalize first letter for display
          initialStatuses[item._id] = item.status.charAt(0).toUpperCase() + item.status.slice(1);
        }
      });
      setSelectedStatuses(initialStatuses);
    }
  }, [applicants]);

  const statusHandler = async (status, id) => {
    // Set processing state for this applicant
    setIsProcessing(prev => ({...prev, [id]: true}));
    
    // Immediately update local UI state
    setSelectedStatuses((prev) => ({
      ...prev,
      [id]: status,
    }));

    try {
      // Update application status
      axios.defaults.withCredentials = true;
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/status/${id}/update`,
        { status }
      );
      
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      // Revert the status on error
      setSelectedStatuses((prev) => {
        const newState = {...prev};
        delete newState[id];
        return newState;
      });
    } finally {
      // Clear processing state
      setIsProcessing(prev => {
        const newState = {...prev};
        delete newState[id];
        return newState;
      });
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get current status for an application
  const getCurrentStatus = (item) => {
    // First check if we have a local state status
    if (selectedStatuses[item._id]) {
      return selectedStatuses[item._id];
    }
    // Otherwise check if the item has a status from the database
    if (item.status && item.status !== "pending") {
      return item.status.charAt(0).toUpperCase() + item.status.slice(1);
    }
    // Default to Pending
    return "Pending";
  };

  return (
    <div className="rounded-lg overflow-hidden">
      <Table className="border-collapse">
        <TableCaption className="text-gray-500 my-4">
          List of applicants for this job position
        </TableCaption>
        <TableHeader className="bg-[#f8f4ff]">
          <TableRow className="border-b border-purple-100">
            <TableHead className="text-[#6A38C2] font-medium">Applicant</TableHead>
            <TableHead className="text-[#6A38C2] font-medium">Contact</TableHead>
            <TableHead className="text-[#6A38C2] font-medium">Job Role</TableHead>
            <TableHead className="text-[#6A38C2] font-medium">Resume</TableHead>
            <TableHead className="text-[#6A38C2] font-medium">Applied Date</TableHead>
            <TableHead className="text-[#6A38C2] font-medium">Status</TableHead>
            <TableHead className="text-[#6A38C2] font-medium text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!applicants?.applications || applicants.applications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#f0e9ff] flex items-center justify-center">
                    <UserX size={28} className="text-[#6A38C2]" />
                  </div>
                  <p className="text-lg font-medium">No applicants yet</p>
                  <p className="text-gray-500 max-w-sm text-center">No one has applied for this position yet.</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            applicants.applications.map((item) => (
              <TableRow key={item._id} className="border-b border-gray-100 hover:bg-[#f8f4ff] transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#f0e9ff] flex items-center justify-center">
                      <User className="h-5 w-5 text-[#6A38C2]" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{item?.applicant?.fullname}</p>
                      <p className="text-xs text-gray-500">Applicant ID: {item._id.substring(0, 8)}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-gray-400" />
                      <span className="text-gray-600 text-sm">{item?.applicant?.email}</span>
                    </div>
                    {item?.applicant?.phoneNumber && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-gray-600 text-sm">{item?.applicant?.phoneNumber}</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-[#6A38C2]" />
                    <span className="text-gray-700">{item?.job?.title || applicants?.title || "Not specified"}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {item.applicant?.profile?.resume ? (
                    <a
                      className="text-[#6A38C2] hover:text-[#5930a5] hover:underline flex items-center gap-2"
                      href={item?.applicant?.profile?.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <File className="h-4 w-4" />
                      <span>{item?.applicant?.profile?.resumeOriginalName || 'Download'}</span>
                    </a>
                  ) : (
                    <span className="text-gray-500 text-sm italic">Not provided</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {new Date(item?.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={`${getStatusColor(getCurrentStatus(item))} font-normal`}>
                    {getCurrentStatus(item)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-full hover:bg-[#f8f4ff]"
                        disabled={isProcessing[item._id]}
                      >
                        <MoreHorizontal className="h-5 w-5 text-gray-600" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-2 border border-gray-100 shadow-lg">
                      <div className="text-xs text-gray-500 px-2 pb-2 mb-1 border-b">
                        Change Application Status
                      </div>
                      {shortlistingStatus.map((status, index) => {
                        const isActive = getCurrentStatus(item) === status;
                        return (
                          <Button 
                            key={index}
                            variant="ghost" 
                            className={`w-full justify-start text-sm font-normal h-9 px-2 py-1 ${
                              isActive 
                                ? 'bg-[#f8f4ff] text-[#6A38C2] font-medium' 
                                : 'hover:bg-[#f8f4ff] hover:text-[#6A38C2]'
                            }`}
                            disabled={isProcessing[item._id]}
                            onClick={() => statusHandler(status, item._id)}
                          >
                            {isProcessing[item._id] ? (
                              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-[#6A38C2] border-t-transparent"></span>
                            ) : (
                              <span className={`h-2 w-2 rounded-full mr-2 ${status === 'Accepted' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            )}
                            {status}
                          </Button>
                        );
                      })}
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicantsTable;
