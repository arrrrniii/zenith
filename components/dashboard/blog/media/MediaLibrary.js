// components/dashboard/blog/media/MediaLibrary.js
import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Upload,
  Grid,
  List as ListIcon,
  Search,
  Filter,
  MoreVertical,
  Trash2,
  Edit,
  Download,
  Eye,
  Image as ImageIcon,
  File
} from 'lucide-react';

const MediaFilter = ({ onFilterChange, view, onViewChange }) => (
  <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg border border-gray-200">
    <div className="flex-1">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search media..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => onFilterChange?.({ search: e.target.value })}
        />
      </div>
    </div>
    
    <div className="flex gap-3">
      <select 
        className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => onFilterChange?.({ type: e.target.value })}
      >
        <option value="">All Types</option>
        <option value="image">Images</option>
        <option value="document">Documents</option>
        <option value="other">Other</option>
      </select>

      <div className="flex border rounded-lg overflow-hidden">
        <button
          onClick={() => onViewChange('grid')}
          className={`p-2 ${view === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
        >
          <Grid className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={() => onViewChange('list')}
          className={`p-2 ${view === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
        >
          <ListIcon className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  </div>
);

const MediaUploader = ({ onUpload }) => {
  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFiles = (files) => {
    // Handle file upload
    console.log('Uploading files:', files);
    onUpload?.(files);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
    >
      <input
        type="file"
        id="fileInput"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-4" />
      <label
        htmlFor="fileInput"
        className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer"
      >
        Click to upload or drag and drop
      </label>
      <p className="text-xs text-gray-500">
        PNG, JPG, GIF up to 10MB
      </p>
    </div>
  );
};

const MediaGrid = ({ items, onSelect, onDelete, onEdit }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
    {items.map((item) => (
      <div
        key={item.id}
        className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md"
      >
        <div className="aspect-square relative">
          {item.type === 'image' ? (
            <Image
              src={item.url}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <File className="w-8 h-8 text-gray-400" />
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity" />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
            <button
              onClick={() => onEdit(item)}
              className="p-1 bg-white rounded-full hover:bg-gray-100"
            >
              <Edit className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => onDelete(item)}
              className="p-1 bg-white rounded-full hover:bg-gray-100"
            >
              <Trash2 className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
        <div className="p-2">
          <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
          <p className="text-xs text-gray-500">{item.size}</p>
        </div>
      </div>
    ))}
  </div>
);

const MediaList = ({ items, onSelect, onDelete, onEdit }) => (
  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            File
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Type
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Size
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Uploaded
          </th>
          <th className="relative px-6 py-3">
            <span className="sr-only">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {items.map((item) => (
          <tr key={item.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="h-10 w-10 flex-shrink-0">
                  {item.type === 'image' ? (
                    <div className="relative h-10 w-10">
                      <Image
                        src={item.url}
                        alt={item.name}
                        fill
                        className="rounded object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center">
                      <File className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                  <div className="text-sm text-gray-500">{item.dimensions}</div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {item.type}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {item.size}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {item.uploadedAt}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => onEdit(item)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(item)}
                  className="text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const MediaLibraryPage = () => {
  const [view, setView] = useState('grid');
  const [filters, setFilters] = useState({
    search: '',
    type: ''
  });

  // Sample data
  const mediaItems = [
    {
      id: 1,
      name: 'hero-image.jpg',
      type: 'image',
      url: '/api/placeholder/400/400',
      size: '2.4 MB',
      dimensions: '1920x1080',
      uploadedAt: '2024-03-15'
    },
    {
      id: 2,
      name: 'document.pdf',
      type: 'document',
      url: '#',
      size: '1.2 MB',
      uploadedAt: '2024-03-14'
    },
    // Add more items as needed
  ];

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleUpload = (files) => {
    // Handle file upload
    console.log('Uploading files:', files);
  };

  const handleEdit = (item) => {
    // Handle edit
    console.log('Editing item:', item);
  };

  const handleDelete = (item) => {
    // Handle delete
    console.log('Deleting item:', item);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Media Library</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your images and media files
          </p>
        </div>
      </div>

      <MediaUploader onUpload={handleUpload} />

      <MediaFilter
        onFilterChange={handleFilterChange}
        view={view}
        onViewChange={setView}
      />

      {view === 'grid' ? (
        <MediaGrid
          items={mediaItems}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <MediaList
          items={mediaItems}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default MediaLibraryPage;

