

// components/dashboard/attractions/Form/parts/CategoriesSection.js
import React from 'react';
import { FormSection } from '../FormComponents';

const CategoriesSection = ({ formData, updateFormData, categories, errors, loading }) => (
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
);