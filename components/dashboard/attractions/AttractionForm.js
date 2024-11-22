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
  ArrowLeft,
  Loader2,
  Phone,
  DollarSign
} from 'lucide-react';
import Image from 'next/image';
import { useCreateAttraction, useUpdateAttraction } from './hooks/useAttractions';
import { useQuery } from '@apollo/client';
import { GET_CATEGORIES } from './graphql/operations';

const FormSection = ({ title, children }) => (
  <div className="border rounded-lg bg-white p-6 space-y-4">
    <h3 className="text-lg font-medium text-gray-900">{title}</h3>
    {children}
  </div>
);

const FormField = ({ label, error, required, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

const ImageUpload = ({ images, onImagesChange, loading }) => (
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
        {!loading && (
          <button 
            type="button"
            onClick={() => {
              const newImages = [...images];
              newImages.splice(index, 1);
              onImagesChange(newImages);
            }}
            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>
    ))}
    
    {!loading && (
      <button 
        type="button"
        onClick={() => onImagesChange([...images, '/api/placeholder/400/300'])}
        className="flex flex-col items-center justify-center aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Upload className="w-6 h-6 text-gray-400" />
        <span className="mt-2 text-sm text-gray-500">Add Image</span>
      </button>
    )}
  </div>
);

const AttractionForm = ({ initialData = {}, mode = 'create' }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    directions: '',
    hours: '',
    website: '',
    phone: '',
    price_range: '',
    status: 'open',
    rating: null,
    review_count: 0,
    monthly_visitors: 0,
    categories: [],
    images: ['/api/placeholder/400/300'],
    ...initialData
  });

  const [errors, setErrors] = useState({});
  
  // Get available categories
  const { data: categoriesData } = useQuery(GET_CATEGORIES);
  const categories = categoriesData?.categories || [];
  
  // Setup mutation hooks
  const { createAttraction, loading: createLoading } = useCreateAttraction();
  const { updateAttraction, loading: updateLoading } = useUpdateAttraction(initialData.id);
  
  const loading = createLoading || updateLoading;

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = 'Please enter a valid URL';
    }
    if (formData.categories.length === 0) {
      newErrors.categories = 'At least one category is required';
    }
    if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const attractionData = {
        name: formData.name,
        description: formData.description,
        address: formData.address,
        directions: formData.directions,
        hours: formData.hours,
        website: formData.website,
        phone: formData.phone,
        price_range: formData.price_range,
        status: formData.status,
        rating: parseFloat(formData.rating) || null,
        review_count: parseInt(formData.review_count) || 0,
        monthly_visitors: parseInt(formData.monthly_visitors) || 0,
        categories: formData.categories,
        images: formData.images.filter(img => img && img !== '/api/placeholder/400/300')
      };

      if (mode === 'create') {
        await createAttraction(attractionData);
      } else {
        await updateAttraction(attractionData);
      }

      router.push('/dashboard/attractions');
    } catch (error) {
      console.error('Error saving attraction:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to save attraction. Please try again.'
      }));
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button 
        type="button"
        onClick={() => router.back()}
        className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
        disabled={loading}
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Attractions
      </button>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <FormSection title="Basic Information">
          <div className="space-y-4">
            <FormField label="Name" error={errors.name} required>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : ''
                }`}
                disabled={loading}
                required
              />
            </FormField>

            <FormField label="Description" error={errors.description} required>
              <textarea
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                rows={4}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  errors.description ? 'border-red-500' : ''
                }`}
                disabled={loading}
                required
              />
            </FormField>
          </div>
        </FormSection>

        {/* Images */}
        <FormSection title="Images">
          <ImageUpload 
            images={formData.images}
            onImagesChange={(images) => updateFormData('images', images)}
            loading={loading}
          />
        </FormSection>

        {/* Location */}
        <FormSection title="Location">
          <div className="space-y-4">
            <FormField label="Address" error={errors.address} required>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => updateFormData('address', e.target.value)}
                  className={`block w-full pl-10 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                    errors.address ? 'border-red-500' : ''
                  }`}
                  disabled={loading}
                  required
                />
              </div>
            </FormField>

            <FormField label="Getting There" error={errors.directions}>
              <textarea
                value={formData.directions}
                onChange={(e) => updateFormData('directions', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={2}
                disabled={loading}
              />
            </FormField>
          </div>
        </FormSection>

        {/* Contact Details */}
        <FormSection title="Contact Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Phone Number" error={errors.phone}>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  className={`block w-full pl-10 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                    errors.phone ? 'border-red-500' : ''
                  }`}
                  placeholder="+1 (555) 000-0000"
                  disabled={loading}
                />
              </div>
            </FormField>

            <FormField label="Website" error={errors.website}>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => updateFormData('website', e.target.value)}
                  className={`block w-full pl-10 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                    errors.website ? 'border-red-500' : ''
                  }`}
                  placeholder="https://example.com"
                  disabled={loading}
                />
              </div>
            </FormField>
          </div>
        </FormSection>

        {/* Operating Details */}
        <FormSection title="Operating Details">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Operating Hours" error={errors.hours}>
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
                    disabled={loading}
                  />
                </div>
              </FormField>

              <FormField label="Price Range" error={errors.price_range}>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.price_range}
                    onChange={(e) => updateFormData('price_range', e.target.value)}
                    className="block w-full pl-10 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="e.g., $10 - $50"
                    disabled={loading}
                  />
                </div>
              </FormField>
            </div>

            <FormField label="Status" error={errors.status}>
              <div className="mt-2 flex space-x-4">
                {['open', 'closed', 'seasonal'].map((status) => (
                  <label key={status} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={formData.status === status}
                      onChange={(e) => updateFormData('status', e.target.value)}
                      disabled={loading}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
            </FormField>
          </div>
        </FormSection>

        {/* Categories */}
        <FormSection title="Categories">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm
                    ${formData.categories.includes(category.id)
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-700'
                    } cursor-pointer hover:bg-opacity-80 transition-colors`}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={formData.categories.includes(category.id)}
                        onChange={(e) => {
                          const newCategories = e.target.checked
                            ? [...formData.categories, category.id]
                            : formData.categories.filter(id => id !== category.id);
                          updateFormData('categories', newCategories);
                        }}
                        disabled={loading}
                      />
                      {category.name}
                    </label>
                  ))}
                </div>
                {errors.categories && (
                  <p className="text-sm text-red-500">{errors.categories}</p>
                )}
              </div>
            </FormSection>
    
            {/* Statistics */}
            <FormSection title="Statistics">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField label="Rating (0-5)" error={errors.rating}>
                  <input
                    type="number"
                    value={formData.rating || ''}
                    onChange={(e) => updateFormData('rating', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="0"
                    max="5"
                    step="0.1"
                    disabled={loading}
                  />
                </FormField>
    
                <FormField label="Review Count" error={errors.review_count}>
                  <input
                    type="number"
                    value={formData.review_count || ''}
                    onChange={(e) => updateFormData('review_count', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="0"
                    disabled={loading}
                  />
                </FormField>
    
                <FormField label="Monthly Visitors" error={errors.monthly_visitors}>
                  <input
                    type="number"
                    value={formData.monthly_visitors || ''}
                    onChange={(e) => updateFormData('monthly_visitors', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="0"
                    disabled={loading}
                  />
                </FormField>
              </div>
            </FormSection>
    
            {/* Form Actions */}
            <div className="flex flex-col space-y-4">
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-sm text-red-600">{errors.submit}</p>
                </div>
              )}
    
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {mode === 'create' ? 'Create Attraction' : 'Update Attraction'}
                </button>
              </div>
            </div>
          </form>
        </div>
      );
    };
    
    export default AttractionForm;