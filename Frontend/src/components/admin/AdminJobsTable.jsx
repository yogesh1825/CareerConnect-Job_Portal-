import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, Eye, MoreHorizontal, Trash, Briefcase, Clock, Building, AlertCircle, Users } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '../ui/alert-dialog'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'

const AdminJobsTable = () => {
  const { allAdminJobs, searchJobByText } = useSelector(store => store.job);
  const [filterJobs, setFilterJobs] = useState(allAdminJobs);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [applicantCounts, setApplicantCounts] = useState({});
  const navigate = useNavigate();

  // Fetch applicant counts for all jobs
  useEffect(() => {
    const fetchApplicantCounts = async () => {
      try {
        const counts = {};
        for (const job of allAdminJobs) {
          try {
            const response = await axios.get(`${JOB_API_END_POINT}/admin/get/${job._id}`, {
              withCredentials: true
            });
            // Check if response has job data with applications array
            if (response.data && response.data.job && response.data.job.applications) {
              counts[job._id] = response.data.job.applications.length;
            } else {
              counts[job._id] = 0;
            }
          } catch (error) {
            console.error(`Error fetching applicants for job ${job._id}:`, error);
            counts[job._id] = 0;
          }
        }
        setApplicantCounts(counts);
      } catch (error) {
        console.error('Error fetching applicant counts:', error);
        toast.error('Failed to fetch applicant counts');
      }
    };

    if (allAdminJobs?.length > 0) {
      fetchApplicantCounts();
    }
  }, [allAdminJobs]);

  useEffect(() => {
    const filteredJobs = allAdminJobs.filter((job) => {
      if (!searchJobByText) {
        return true;
      };
      return job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) || 
             job?.company?.name?.toLowerCase().includes(searchJobByText.toLowerCase());
    });
    setFilterJobs(filteredJobs);
  }, [allAdminJobs, searchJobByText]);
  
  // Function to open delete confirmation dialog
  const openDeleteDialog = (job) => {
    setJobToDelete(job);
    setIsDeleteDialogOpen(true);
  };

  // Function to handle job deletion
  const handleDeleteJob = async () => {
    if (!jobToDelete) return;
    
    try {
      setIsDeleting(true);
      const response = await axios.delete(`${JOB_API_END_POINT}/delete/${jobToDelete._id}`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        toast.success('Job deleted successfully');
        // Refresh the jobs list
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error(error.response?.data?.message || 'Failed to delete job');
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  // Function to get random status for demo purposes - replace with actual status
  const getJobStatus = (job) => {
    const statuses = ['Active', 'Closed', 'Draft'];
    const randomIndex = (job._id?.charCodeAt(0) || 0) % statuses.length;
    return statuses[randomIndex];
  };

  // Get appropriate status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'Closed':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      case 'Draft':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      default:
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <>
      <Table className="border-collapse">
        <TableCaption className="text-gray-500 my-4">
          A list of your recently posted jobs
        </TableCaption>
        <TableHeader className="bg-[#f8f4ff]">
          <TableRow className="border-b border-purple-100">
            <TableHead className="text-[#6A38C2] font-medium">Company</TableHead>
            <TableHead className="text-[#6A38C2] font-medium">Position</TableHead>
            <TableHead className="text-[#6A38C2] font-medium">Status</TableHead>
            <TableHead className="text-[#6A38C2] font-medium">Applicants</TableHead>
            <TableHead className="text-[#6A38C2] font-medium">Posted Date</TableHead>
            <TableHead className="text-[#6A38C2] font-medium text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            !filterJobs || filterJobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[#f0e9ff] flex items-center justify-center">
                      <Briefcase size={28} className="text-[#6A38C2]" />
                    </div>
                    <p className="text-lg font-medium">No jobs found</p>
                    <p className="text-gray-500 max-w-sm text-center">You haven't posted any jobs yet or no jobs match your search criteria.</p>
                    <Button 
                      onClick={() => navigate("/admin/jobs/create")}
                      className="bg-[#6A38C2] hover:bg-[#5930a5] mt-2"
                    >
                      Post New Job
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filterJobs?.map((job, index) => (
                <TableRow key={job._id || index} className="border-b border-gray-100 hover:bg-[#f8f4ff] transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-md bg-[#f0e9ff] flex items-center justify-center">
                        <Building className="h-5 w-5 text-[#6A38C2]" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{job?.company?.name}</p>
                        <p className="text-xs text-gray-500">{job?.location || 'Remote'}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-800">{job?.title}</p>
                      <p className="text-xs text-gray-500">{job?.jobType || 'Full-time'}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(getJobStatus(job))} font-normal`}>
                      {getJobStatus(job)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-[#6A38C2]" />
                      <span className="text-sm font-medium text-gray-700">
                        {applicantCounts[job._id] || 0}
                      </span>
                      <span className="text-xs text-gray-500">
                        {applicantCounts[job._id] === 1 ? 'applicant' : 'applicants'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {formatDate(job?.createdAt)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-[#f8f4ff]">
                          <MoreHorizontal className="h-5 w-5 text-gray-600" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56 p-2 border border-gray-100 shadow-lg">
                        <div className="text-xs text-gray-500 px-2 pb-2 mb-1 border-b">
                          Manage Job
                        </div>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-sm font-normal h-9 px-2 py-1 hover:bg-[#f8f4ff] hover:text-[#6A38C2]"
                          onClick={() => navigate(`/admin/jobs/${job._id}`)}
                        >
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit Job
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-sm font-normal h-9 px-2 py-1 hover:bg-[#f8f4ff] hover:text-[#6A38C2]"
                          onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Applicants ({applicantCounts[job._id] || 0})
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-sm font-normal h-9 px-2 py-1 hover:bg-red-50 hover:text-red-600"
                          onClick={() => openDeleteDialog(job)}
                        >
                          <Trash className="h-4 w-4 mr-2 text-red-500" />
                          Delete
                        </Button>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))
            )
          }
        </TableBody>
      </Table>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Delete Job
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-semibold">{jobToDelete?.title}</span>? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteJob}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white focus-visible:ring-red-500"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default AdminJobsTable