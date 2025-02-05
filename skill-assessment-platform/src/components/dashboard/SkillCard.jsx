import React from 'react';
import ProgressBar from '../shared/ProgressBar';

const SkillCard = ({ skill, value, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-lg border ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
      }`}
    >
      <h3 className="text-lg font-medium capitalize mb-2">
        {skill.replace(/([A-Z])/g, ' $1').trim()}
      </h3>
      <ProgressBar value={value} />
      <p className="mt-2 text-sm text-gray-600">{value}% Proficiency</p>
    </button>
  );
};

export default SkillCard;
