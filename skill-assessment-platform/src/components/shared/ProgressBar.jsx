import React from 'react';

const ProgressBar = ({ value }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className="bg-blue-600 rounded-full h-2"
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

export default ProgressBar;
