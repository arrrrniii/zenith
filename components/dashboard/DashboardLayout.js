import Link from 'next/link';
import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import { ChevronRight, Home } from 'lucide-react';
import Sidebar from './Sidebar';

const Breadcrumb = ({ items }) => (
  <nav className="flex" aria-label="Breadcrumb">
    <ol className="flex items-center space-x-2">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
          )}
          <li className="flex items-center">
            {index === 0 ? (
              <Link
                href="/dashboard"
                className="flex items-center text-sm text-gray-500 hover:text-gray-700"
              >
                <Home className="h-4 w-4 mr-1" />
                <span>{item}</span>
              </Link>
            ) : (
              <span
                className={`text-sm ${
                  index === items.length - 1
                    ? 'text-gray-700 font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {item}
              </span>
            )}
          </li>
        </React.Fragment>
      ))}
    </ol>
  </nav>
);

const PageHeader = ({ title, actions }) => (
  <div className="flex items-center justify-between mb-6">
    <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
    {actions && <div className="flex items-center space-x-4">{actions}</div>}
  </div>
);

const DashboardLayout = ({ children, pageTitle, actions }) => {
  const router = useRouter();

  const breadcrumbItems = useMemo(() => {
    const path = router.pathname;
    const segments = path.split('/').filter(Boolean);
    
    return ['Dashboard', ...segments.slice(1).map(segment => 
      segment.charAt(0).toUpperCase() + segment.slice(1)
    )];
  }, [router.pathname]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 flex flex-col overflow-hidden transition-all duration-300">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200">
          {/* Breadcrumb */}
          <div className="px-6 py-3 border-b border-gray-200">
            <Breadcrumb items={breadcrumbItems} />
          </div>
          
          {/* Page Title and Actions
          {(pageTitle || actions) && (
            <div className="px-6 py-4">
              <PageHeader title={pageTitle} actions={actions} />
            </div>
          )} */}
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;