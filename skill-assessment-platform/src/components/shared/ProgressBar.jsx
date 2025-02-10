import React from 'react';

const ProgressBar = ({ value }) => {
  return (
    <div className="w-full bg-gray-300 rounded-full h-3">
      <div 
        className="bg-blue-600 rounded-full h-3 transition-all duration-500"
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

export default ProgressBar;
