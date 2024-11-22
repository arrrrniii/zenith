// components/dashboard/blog/categories/CategoryList.js
import React from 'react';
import { 

  Edit,
  Trash2,
  FolderPlus,

  FileText
} from 'lucide-react';

const CategoryItem = ({ category, onEdit, onDelete, onAddSubcategory, level = 0 }) => (
  <div className="border-b border-gray-200 last:border-b-0">
    <div 
      className={`flex items-center justify-between py-3 hover:bg-gray-50 ${
        level > 0 ? 'pl-' + (level * 8) : ''
      }`}
    >
      <div className="flex items-center flex-1">
        <div className="flex items-center">
          <FileText className="w-4 h-4 text-gray-400 mr-3" />
          <div>
            <span className="text-sm font-medium text-gray-900">
              {category.name}
            </span>
            <span className="ml-2 text-xs text-gray-500">
              ({category.postsCount} posts)
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <span className="text-sm text-gray-500 mr-4">
          Slug: {category.slug}
        </span>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onAddSubcategory(category)}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            title="Add Subcategory"
          >
            <FolderPlus className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(category)}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            title="Edit Category"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(category)}
            className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100"
            title="Delete Category"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
    {category.subcategories?.map((subcategory) => (
      <CategoryItem
        key={subcategory.id}
        category={subcategory}
        onEdit={onEdit}
        onDelete={onDelete}
        onAddSubcategory={onAddSubcategory}
        level={level + 1}
      />
    ))}
  </div>
);

const CategoryList = ({ categories, onEdit, onDelete, onAddSubcategory }) => (
  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
    <div className="divide-y divide-gray-200">
      {categories.map((category) => (
        <CategoryItem
          key={category.id}
          category={category}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddSubcategory={onAddSubcategory}
        />
      ))}
    </div>
  </div>
);

export default CategoryList;





