// pages/dashboard/blog/categories/index.js
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import CategoriesPage from '@/components/dashboard/blog/categories/CategoriesPage';

const Categories = () => {
  return (
    <DashboardLayout pageTitle="Blog Categories">
      <CategoriesPage />
    </DashboardLayout>
  );
};

export default Categories;