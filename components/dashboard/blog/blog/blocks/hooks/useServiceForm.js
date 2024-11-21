//components/admin/dashboard/service/blocks/hooks/useServiceForm.js
import { useState, useEffect } from 'react';
import { generateSlug } from '../../utils/slugUtils';
import { SERVICE_STATUS } from '../components/SettingsTab/PublishingStatus';

export const useServiceForm = (initialService) => {
  const [formData, setFormData] = useState({
    title: '',
    titletag: '',
    slug: '',
    description: '',
    keywords: '',
    thumbnail: '',
    thumbnailUrl: '',
    business_goal: '',
    status: SERVICE_STATUS.DRAFT,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (initialService) {
      setFormData({
        title: initialService.title || '',
        titletag: initialService.titletag || '',
        slug: initialService.slug || '',
        description: initialService.description || '',
        keywords: initialService.keywords || '',
        thumbnail: '',
        thumbnailUrl: initialService.thumbnail_url || '',
        business_goal: initialService?.business_goal || '',
        status: (initialService.status || SERVICE_STATUS.DRAFT).toLowerCase(),
      });

      if (initialService.thumbnail_url) {
        setImagePreview(initialService.thumbnail_url);
      }
    }
  }, [initialService]);

  const handleFormChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev };
      
      if (field === 'title') {
        newData.slug = generateSlug(value);
        newData[field] = value;
      } else if (field === 'status') {
        newData[field] = value.toLowerCase();
      } else {
        newData[field] = value;
      }
      
      return newData;
    });
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Please upload a valid image file (JPG, PNG, or WebP)');
    }

    if (file.size > 2 * 1024 * 1024) {
      throw new Error('File size should be less than 2MB');
    }

    try {
      setIsUploading(true);

      // Create FormData
      const formData = new FormData();
      formData.append('files', file);

      // Upload to API
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload image');
      }

      const data = await response.json();
      
      // Get the first file path since we're only uploading one file
      const uploadedUrl = data.filePaths[0];
      console.log('Image uploaded successfully:', uploadedUrl);

      // Set preview using uploaded URL
      setImagePreview(uploadedUrl);

      // Update form data with the new URL
      setFormData(prev => ({
        ...prev,
        thumbnail: file,
        thumbnailUrl: uploadedUrl
      }));

      return uploadedUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageRemove = () => {
    setImagePreview(null);
    setFormData(prev => ({
      ...prev,
      thumbnail: '',
      thumbnailUrl: ''
    }));
  };

  return {
    formData,
    handleFormChange,
    handleImageUpload,
    handleImageRemove,
    imagePreview,
    setImagePreview,
    isUploading
  };
};