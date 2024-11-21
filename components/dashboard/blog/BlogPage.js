import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  PlusCircle, 
  Search,
  LayoutGrid,
  List,
  ArrowUpCircle,
  Archive,
  Loader2,
  ImageIcon
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ServiceDialog from './blog/ServiceDialog';
import {
  GET_BLOGS,
  GET_BLOG_DETAILS,
  UPDATE_BLOG_STATUS,
  DELETE_BLOG
} from './graphql/blogOperationsContent';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

const ServiceCard = ({ service, onEdit, onDelete, onStatusChange, isLoading }) => (
  <Card className="p-4 hover:shadow-lg transition-shadow relative">
    {isLoading && (
      <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    )}
    <div className="flex gap-4">
      <div className="w-24 h-24 bg-gray-200 rounded-lg">
        {service.thumbnail_url ? (
          <img 
            src={service.thumbnail_url} 
            alt={service.title}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
            <ImageIcon className="w-8 h-8 text-gray-400" />
          </div>
        )}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{service.description}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs ${
            service.status === 'PUBLISHED' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {service.status}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {service.category && (
            <span className="text-sm text-gray-600">📂 {service.category}</span>
          )}
        </div>
      </div>
    </div>
    <div className="mt-4 flex justify-end gap-2 border-t pt-4">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onEdit(service)}
        disabled={isLoading}
      >
        Edit
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onStatusChange(service)}
        disabled={isLoading}
      >
        {service.status === 'PUBLISHED' ? (
          <Archive className="w-4 h-4 mr-2" />
        ) : (
          <ArrowUpCircle className="w-4 h-4 mr-2" />
        )}
        {service.status === 'PUBLISHED' ? 'Move to Draft' : 'Publish'}
      </Button>
      <Button 
        variant="destructive" 
        size="sm"
        onClick={() => onDelete(service)}
        disabled={isLoading}
      >
        Delete
      </Button>
    </div>
  </Card>
);

const ServiceHeader = ({ onAdd }) => (
  <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl p-6 mb-6">
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">Blogs</h1>
        <p className="mt-2 text-blue-100">Manage your blogs</p>
      </div>
      <Button 
        onClick={onAdd}
        className="bg-white text-blue-600 hover:bg-blue-50"
      >
        <PlusCircle className="w-4 h-4 mr-2" />
        Add Blog
      </Button>
    </div>
  </div>
);

const ServiceFilters = ({ view, onViewChange, onSearch, onFilter, isLoading }) => (
  <div className="mb-6 flex gap-4 items-center">
    <div className="flex-1 relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <Input
        placeholder="Search blogs..."
        onChange={(e) => onSearch(e.target.value)}
        className="max-w-sm pl-9"
        disabled={isLoading}
      />
    </div>
    <Select 
      defaultValue="all" 
      onValueChange={onFilter}
      disabled={isLoading}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter by status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Blogs</SelectItem>
        <SelectItem value="PUBLISHED">Published</SelectItem>
        <SelectItem value="DRAFT">Drafts</SelectItem>
      </SelectContent>
    </Select>
    <div className="flex gap-1 border rounded-lg p-1">
      <Button
        variant={view === 'grid' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('grid')}
        disabled={isLoading}
      >
        <LayoutGrid className="w-4 h-4" />
      </Button>
      <Button
        variant={view === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('list')}
        disabled={isLoading}
      >
        <List className="w-4 h-4" />
      </Button>
    </div>
  </div>
);

const ServiceContent = () => {
  const [view, setView] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const { toast } = useToast();

  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data, loading, error, refetch } = useQuery(GET_BLOGS, {
    variables: {
      where: {
        _and: [
          debouncedSearch ? {
            _or: [
              { title: { _ilike: `%${debouncedSearch}%` } },
              { description: { _ilike: `%${debouncedSearch}%` } }
            ]
          } : {},
          statusFilter !== 'all' ? { status: { _eq: statusFilter } } : {}
        ]
      },
      limit: 50
    },
    fetchPolicy: 'cache-and-network'
  });

  const { data: serviceDetails, loading: detailsLoading } = useQuery(GET_BLOG_DETAILS, {
    variables: { id: currentService?.id },
    skip: !currentService?.id
  });

  const [updateServiceStatus] = useMutation(UPDATE_BLOG_STATUS);
  const [deleteService] = useMutation(DELETE_BLOG);

  const handleAdd = useCallback(() => {
    setCurrentService(null);
    setIsEditing(true);
  }, []);

  const handleEdit = useCallback((service) => {
    setCurrentService(service);
    setIsEditing(true);
  }, []);

  const handleDelete = useCallback((service) => {
    setServiceToDelete(service);
    setDeleteDialogOpen(true);
  }, []);

  const handleStatusChange = useCallback(async (service) => {
    const newStatus = service.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    const published_at = newStatus === 'PUBLISHED' ? new Date().toISOString() : null;

    try {
      await updateServiceStatus({
        variables: { 
          id: service.id,
          status: newStatus,
          published_at
        }
      });

      toast({
        title: "Status updated",
        description: `Blog is now ${newStatus.toLowerCase()}.`
      });

      refetch();
    } catch (error) {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive"
      });
    }
  }, [updateServiceStatus, toast, refetch]);

  const confirmDelete = useCallback(async () => {
    if (!serviceToDelete) return;
    
    try {
      await deleteService({
        variables: { id: serviceToDelete.id }
      });
      
      toast({
        title: "Blog deleted",
        description: `${serviceToDelete.title} has been deleted successfully.`
      });
      
      refetch();
    } catch (error) {
      toast({
        title: "Error deleting blog",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setDeleteDialogOpen(false);
      setServiceToDelete(null);
    }
  }, [deleteService, serviceToDelete, toast, refetch]);

  const handleSave = useCallback(() => {
    setIsEditing(false);
    setCurrentService(null);
    refetch();
  }, [refetch]);

  const handleClose = useCallback(() => {
    setIsEditing(false);
    setCurrentService(null);
  }, []);

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Error loading blogs</p>
        <p className="text-sm text-gray-500 mt-2">{error.message}</p>
        <Button 
          variant="outline"
          className="mt-4"
          onClick={() => refetch()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <ServiceHeader onAdd={handleAdd} />
      
      <ServiceFilters
        view={view}
        onViewChange={setView}
        onSearch={setSearchQuery}
        onFilter={setStatusFilter}
        isLoading={loading}
      />

      {loading && !data ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className={`grid gap-4 ${
          view === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {data?.blogs.map(blog => (
            <ServiceCard
              key={blog.id}
              service={blog}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
              isLoading={loading}
            />
          ))}

          {data?.blogs.length === 0 && (
            <div className="text-center py-12 col-span-full">
              <p className="text-gray-500">No blogs found</p>
            </div>
          )}
        </div>
      )}

      {isEditing && (
        <ServiceDialog
          service={currentService || serviceDetails?.blogs_by_pk}
          onClose={handleClose}
          onSave={handleSave}
          isLoading={detailsLoading}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the blog 
              "{serviceToDelete?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster />
    </div>
  );
};

export default ServiceContent;