// components/dashboard/blog/categories/CategoriesPage.js
import React, { useState } from 'react';
import { FolderPlus } from 'lucide-react';
import CategoryList from './CategoryList';
import CategoryForm from './CategoryForm';

const CategoriesPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [parentCategory, setParentCategory] = useState(null);

  // Sample data
  const categories = [
    {
      id: 1,
      name: 'Travel Tips',
      slug: 'travel-tips',
      description: 'Essential travel tips and advice',
      postsCount: 15,
      subcategories: [
        {
          id: 4,
          name: 'Packing Tips',
          slug: 'packing-tips',
          description: 'Tips for efficient packing',
          postsCount: 5
        }
      ]
    },
    {
      id: 2,
      name: 'Destinations',
      slug: 'destinations',
      description: 'Travel destination guides',
      postsCount: 25,
      subcategories: [
        {
          id: 5,
          name: 'Europe',
          slug: 'europe',
          description: 'European destinations',
          postsCount: 12
        }
      ]
    }
  ];

  const handleEdit = (category) => {
    setEditingCategory(category);
    setParentCategory(null);
    setIsFormOpen(true);
  };

  const handleAddSubcategory = (parent) => {
    setEditingCategory(null);
    setParentCategory(parent);
    setIsFormOpen(true);
  };

  const handleSubmit = (data) => {
    console.log('Submitting:', data);
    // Handle category creation/update
    setIsFormOpen(false);
    setEditingCategory(null);
    setParentCategory(null);
  };

  const handleDelete = (category) => {
    // Handle category deletion
    console.log('Deleting category:', category);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your blog categories and subcategories
          </p>
        </div>
        <button
          onClick={() => {
            setEditingCategory(null);
            setParentCategory(null);
            setIsFormOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FolderPlus className="w-5 h-5 mr-2" />
          Add Category
        </button>
      </div>

      {/* Categories List */}
      <CategoryList
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddSubcategory={handleAddSubcategory}
      />

      {/* Category Form Modal */}
      <CategoryForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCategory(null);
          setParentCategory(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingCategory}
        categories={categories}
        parentCategory={parentCategory}
      />
    </div>
  );
};

export default CategoriesPage;