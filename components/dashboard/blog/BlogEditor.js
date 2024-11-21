// components/dashboard/blog/BlogEditor.js
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { 
  ArrowLeft,
  Image as ImageIcon,
  Link,
  List,
  ListOrdered,
  Bold,
  Italic,
  Heading,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Upload,
  X,
  Save,
  Eye
} from 'lucide-react';

const FormSection = ({ title, children }) => (
  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-200">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
    </div>
    <div className="px-6 py-4">
      {children}
    </div>
  </div>
);

const Toolbar = ({ onAction }) => (
  <div className="flex items-center space-x-2 border-b border-gray-200 p-2">
    <button 
      onClick={() => onAction('heading')}
      className="p-2 hover:bg-gray-100 rounded"
    >
      <Heading className="w-5 h-5" />
    </button>
    <button 
      onClick={() => onAction('bold')}
      className="p-2 hover:bg-gray-100 rounded"
    >
      <Bold className="w-5 h-5" />
    </button>
    <button 
      onClick={() => onAction('italic')}
      className="p-2 hover:bg-gray-100 rounded"
    >
      <Italic className="w-5 h-5" />
    </button>
    <div className="w-px h-6 bg-gray-200" />
    <button 
      onClick={() => onAction('link')}
      className="p-2 hover:bg-gray-100 rounded"
    >
      <Link className="w-5 h-5" />
    </button>
    <button 
      onClick={() => onAction('image')}
      className="p-2 hover:bg-gray-100 rounded"
    >
      <ImageIcon className="w-5 h-5" />
    </button>
    <div className="w-px h-6 bg-gray-200" />
    <button 
      onClick={() => onAction('bullet-list')}
      className="p-2 hover:bg-gray-100 rounded"
    >
      <List className="w-5 h-5" />
    </button>
    <button 
      onClick={() => onAction('numbered-list')}
      className="p-2 hover:bg-gray-100 rounded"
    >
      <ListOrdered className="w-5 h-5" />
    </button>
    <div className="w-px h-6 bg-gray-200" />
    <button 
      onClick={() => onAction('align-left')}
      className="p-2 hover:bg-gray-100 rounded"
    >
      <AlignLeft className="w-5 h-5" />
    </button>
    <button 
      onClick={() => onAction('align-center')}
      className="p-2 hover:bg-gray-100 rounded"
    >
      <AlignCenter className="w-5 h-5" />
    </button>
    <button 
      onClick={() => onAction('align-right')}
      className="p-2 hover:bg-gray-100 rounded"
    >
      <AlignRight className="w-5 h-5" />
    </button>
  </div>
);

const FeaturedImage = ({ image, onImageChange, onRemoveImage }) => (
  <div className="relative">
    {image ? (
      <div className="relative aspect-[2/1] rounded-lg overflow-hidden">
        <Image
          src={image}
          alt="Featured image"
          fill
          className="object-cover"
        />
        <button
          onClick={onRemoveImage}
          className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    ) : (
      <button
        onClick={onImageChange}
        className="w-full aspect-[2/1] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-gray-400"
      >
        <Upload className="w-8 h-8 text-gray-400" />
        <span className="mt-2 text-sm text-gray-500">Add Featured Image</span>
      </button>
    )}
  </div>
);

const BlogEditor = ({ initialData = {} }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    featuredImage: null,
    status: 'draft',
    categories: [],
    tags: [],
    seoTitle: '',
    seoDescription: '',
    ...initialData
  });

  const handleSave = async (status) => {
    const data = { ...formData, status };
    console.log('Saving post:', data);
    // Handle save logic
    router.push('/dashboard/blog');
  };

  const handlePreview = () => {
    // Handle preview logic
    console.log('Preview post:', formData);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={() => router.back()}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Posts
        </button>
        <div className="flex items-center space-x-3">
          <button
            onClick={handlePreview}
            className="flex items-center px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </button>
          <button
            onClick={() => handleSave('draft')}
            className="flex items-center px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </button>
          <button
            onClick={() => handleSave('published')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Publish
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Editor Column */}
        <div className="col-span-2 space-y-6">
          {/* Title & Content */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <input
              type="text"
              placeholder="Post title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="block w-full px-6 py-4 text-2xl font-medium border-b border-gray-200 focus:outline-none"
            />
            
            <Toolbar onAction={console.log} />
            
            <textarea
              placeholder="Start writing your post..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="block w-full px-6 py-4 h-[500px] resize-none focus:outline-none"
            />
          </div>

          {/* Excerpt */}
          <FormSection title="Excerpt">
            <textarea
              placeholder="Write a short excerpt..."
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
            />
          </FormSection>

          {/* SEO Settings */}
          <FormSection title="SEO Settings">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">SEO Title</label>
                <input
                  type="text"
                  value={formData.seoTitle}
                  onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">SEO Description</label>
                <textarea
                  value={formData.seoDescription}
                  onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </FormSection>
        </div>

        {/* Settings Column */}
        <div className="space-y-6">
          {/* Featured Image */}
          <FormSection title="Featured Image">
            <FeaturedImage
              image={formData.featuredImage}
              onImageChange={() => console.log('Change image')}
              onRemoveImage={() => setFormData({ ...formData, featuredImage: null })}
            />
          </FormSection>

          {/* Categories */}
          <FormSection title="Categories">
            <div className="space-y-2">
              {['Travel Tips', 'Destinations', 'Guides', 'Culture'].map((category) => (
                <label key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.categories.includes(category)}
                    onChange={(e) => {
                      const newCategories = e.target.checked
                        ? [...formData.categories, category]
                        : formData.categories.filter(c => c !== category);
                      setFormData({ ...formData, categories: newCategories });
                    }}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">{category}</span>
                </label>
              ))}
            </div>
          </FormSection>

          {/* Tags */}
          <FormSection title="Tags">
            <div>
              <input
                type="text"
                placeholder="Add tags..."
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value) {
                    e.preventDefault();
                    setFormData({
                      ...formData,
                      tags: [...formData.tags, e.target.value]
                    });
                    e.target.value = '';
                  }
                }}
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                    <button
                      onClick={() => {
                        const newTags = formData.tags.filter((_, i) => i !== index);
                        setFormData({ ...formData, tags: newTags });
                      }}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </FormSection>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;

