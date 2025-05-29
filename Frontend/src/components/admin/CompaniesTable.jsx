import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Building, Edit, ExternalLink, MoreHorizontal, Edit2, Eye, Trash, AlertCircle } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
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
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'

const CompaniesTable = () => {
    const { companies, searchCompanyByText } = useSelector(store => store.company)
    const [filteredCompanies, setFilteredCompanies] = useState([])
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [companyToDelete, setCompanyToDelete] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const navigate = useNavigate()

    // Function to open delete confirmation dialog
    const openDeleteDialog = (company) => {
        setCompanyToDelete(company)
        setIsDeleteDialogOpen(true)
    }

    // Function to handle company deletion
    const handleDeleteCompany = async () => {
        if (!companyToDelete) return
        
        try {
            setIsDeleting(true)
            const response = await axios.delete(`${COMPANY_API_END_POINT}/delete/${companyToDelete._id}`, {
                withCredentials: true
            })
            
            if (response.data.success) {
                toast.success('Company deleted successfully')
                // Refresh the companies list - this will trigger a re-fetch via the hook
                setTimeout(() => {
                    window.location.reload()
                }, 1000)
            }
        } catch (error) {
            console.error('Error deleting company:', error)
            toast.error(error.response?.data?.message || 'Failed to delete company')
        } finally {
            setIsDeleting(false)
            setIsDeleteDialogOpen(false)
        }
    }

    useEffect(() => {
        const filteredCompany = Array.isArray(companies) && companies.length > 0 
            ? companies.filter((company) => {
                if (!company || !company.name) return false;
                if (!searchCompanyByText) {
                    return true;
                }
                return company.name.toLowerCase().includes(searchCompanyByText.toLowerCase())
            })
            : [];
        setFilteredCompanies(filteredCompany)
    }, [companies, searchCompanyByText])

    // Function to get initials from company name
    const getInitials = (name) => {
        if (!name) return "CO";
        return name.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2);
    }

    // Handle view company profile
    const handleViewProfile = (companyId) => {
        if (!companyId) return;
        // Navigate to the company profile page
        navigate(`/admin/companies/view/${companyId}`);
    }

    return (
        <>
            <Table className="border-collapse">
                <TableCaption className="text-gray-500 my-4">
                    A list of your recent registered companies
                </TableCaption>
                <TableHeader className="bg-[#f8f4ff]">
                    <TableRow className="border-b border-purple-100">
                        <TableHead className="text-[#6A38C2] font-medium">Company Logo</TableHead>
                        <TableHead className="text-[#6A38C2] font-medium">Company Name</TableHead>
                        <TableHead className="text-[#6A38C2] font-medium">Date</TableHead>
                        <TableHead className="text-[#6A38C2] font-medium text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        !filteredCompanies || filteredCompanies.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                    <div className="flex flex-col items-center justify-center space-y-3">
                                        <Building size={40} className="text-gray-300" />
                                        <p>No companies found</p>
                                        <Button 
                                            onClick={() => navigate("/admin/companies/create")}
                                            variant="outline" 
                                            className="text-[#6A38C2] border-[#6A38C2] hover:bg-[#6A38C2] hover:text-white"
                                        >
                                            Add New Company
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredCompanies.map((company, index) => {
                                if (!company) return null;
                                return (
                                    <TableRow 
                                        key={company._id || index} 
                                        className="border-b border-gray-100 hover:bg-[#f8f4ff] transition-colors"
                                    >
                                        <TableCell>
                                            <Avatar className="border-2">
                                                <AvatarImage 
                                                    src={company.logo} 
                                                    alt={company.name || 'Company'}
                                                />
                                                <AvatarFallback className="bg-[#6A38C2] text-white">
                                                    {getInitials(company.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell className="font-medium text-gray-800">
                                            {company.name || 'Unnamed Company'}
                                        </TableCell>
                                        <TableCell className="text-gray-600">
                                            {company.createdAt ? new Date(company.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            }) : 'N/A'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-[#f8f4ff]">
                                                        <MoreHorizontal className="h-5 w-5 text-gray-600" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-44 p-2">
                                                    <Button 
                                                        variant="ghost" 
                                                        className="w-full justify-start text-sm font-normal h-9 px-2 py-1 hover:bg-[#f8f4ff] hover:text-[#6A38C2]"
                                                        onClick={() => company._id && navigate(`/admin/companies/${company._id}`)}
                                                    >
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Edit Company
                                                    </Button>
                                                    <Button 
                                                        variant="ghost" 
                                                        className="w-full justify-start text-sm font-normal h-9 px-2 py-1 hover:bg-[#f8f4ff] hover:text-[#6A38C2]"
                                                        onClick={() => handleViewProfile(company._id)}
                                                    >
                                                        <ExternalLink className="h-4 w-4 mr-2" />
                                                        View Profile
                                                    </Button>
                                                    <Button 
                                                        variant="ghost" 
                                                        className="w-full justify-start text-sm font-normal h-9 px-2 py-1 hover:bg-red-50 hover:text-red-600"
                                                        onClick={() => openDeleteDialog(company)}
                                                    >
                                                        <Trash className="h-4 w-4 mr-2 text-red-500" />
                                                        Delete
                                                    </Button>
                                                </PopoverContent>
                                            </Popover>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
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
                            Delete Company
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete <span className="font-semibold">{companyToDelete?.name}</span>? 
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleDeleteCompany}
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

export default CompaniesTable