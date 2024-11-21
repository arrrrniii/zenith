// components/dashboard/attractions/AttractionForm.js
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { 
  MapPin, 
  Globe, 
  Clock, 
  Upload,
  Plus,
  X,
  ArrowLeft
} from 'lucide-react';
import Image from 'next/image';

const FormSection = ({ title, children }) => (
  <div className="border rounded-lg bg-white p-6 space-y-4">
    <h3 className="text-lg font-medium text-gray-900">{title}</h3>
    {children}
  </div>
);

const ImageUpload = ({ images, onImagesChange }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
 {images.map((image, index) => (
      <div key={index} className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden group">
        <Image
          src={image}
          alt={`Attraction image ${index + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        <button 
          onClick={() => {
            const newImages = [...images];
            newImages.splice(index, 1);
            onImagesChange(newImages);
          }}
          className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    ))}
    
    <button 
      onClick={() => onImagesChange([...images, '/api/placeholder/400/300'])}
      className="flex flex-col items-center justify-center aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <Upload className="w-6 h-6 text-gray-400" />
      <span className="mt-2 text-sm text-gray-500">Add Image</span>
    </button>
  </div>
);

const AttractionForm = ({ initialData = {} }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    directions: '',
    hours: '',
    website: '',
    categories: [''],
    images: ['/api/placeholder/400/300'],
    ...initialData
  });

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Handle form submission
      console.log('Form data:', formData);
      router.push('/dashboard/attractions');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button 
        onClick={() => router.back()}
        className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Attractions
      </button>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <FormSection title="Basic Information">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </FormSection>

        {/* Images */}
        <FormSection title="Images">
          <ImageUpload 
            images={formData.images}
            onImagesChange={(images) => updateFormData('images', images)}
          />
        </FormSection>

        {/* Location */}
        <FormSection title="Location">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => updateFormData('address', e.target.value)}
                  className="block w-full pl-10 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Getting There</label>
              <textarea
                value={formData.directions}
                onChange={(e) => updateFormData('directions', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={2}
              />
            </div>
          </div>
        </FormSection>

        {/* Details */}
        <FormSection title="Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Operating Hours</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.hours}
                  onChange={(e) => updateFormData('hours', e.target.value)}
                  className="block w-full pl-10 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., 9:00 AM - 5:00 PM"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Website</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => updateFormData('website', e.target.value)}
                  className="block w-full pl-10 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>
        </FormSection>

        {/* Categories */}
        <FormSection title="Categories">
          <div className="space-y-2">
            {formData.categories.map((category, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={category}
                  onChange={(e) => {
                    const newCategories = [...formData.categories];
                    newCategories[index] = e.target.value;
                    updateFormData('categories', newCategories);
                  }}
                  className="flex-1 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter a category"
                />
                <button 
                  type="button"
                  onClick={() => {
                    const newCategories = formData.categories.filter((_, i) => i !== index);
                    updateFormData('categories', newCategories);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => updateFormData('categories', [...formData.categories, ''])}
              className="flex items-center text-sm text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Category
            </button>
          </div>
        </FormSection>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save Attraction
          </button>
        </div>
      </form>
    </div>
  );
};

export default AttractionForm;