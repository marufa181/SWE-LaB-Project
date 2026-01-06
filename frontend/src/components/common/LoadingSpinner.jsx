import React from 'react';


const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-[calc(100vh-100px)] w-full bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
        
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
        
        <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
          Loading Vehicle Details...
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;