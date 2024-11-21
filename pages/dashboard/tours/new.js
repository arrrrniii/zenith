import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import TourForm from '@/components/dashboard/tour/TourForm';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/router';

const NewTourPage = () => {
  const router = useRouter();

  return (
    <DashboardLayout activeSection="tours">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => router.back()}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Tours
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">Create New Tour</h1>
          <p className="mt-2 text-sm text-gray-600">
            Fill in the information below to create a new tour package.
          </p>
        </div>

        {/* Form */}
        <TourForm 
          onSubmit={async (data) => {
            // Handle form submission
            console.log('Form submitted:', data);
            // Redirect back to tours list
            router.push('/dashboard/tours');
          }}
          onCancel={() => router.back()}
        />
      </div>
    </DashboardLayout>
  );
};

export default NewTourPage;