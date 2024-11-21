// components/tours/LoadingOverlay.jsx
export const LoadingOverlay = ({ message }) => (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 flex items-center space-x-3">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
        <span className="text-sm font-medium text-gray-900">{message}</span>
      </div>
    </div>
  );