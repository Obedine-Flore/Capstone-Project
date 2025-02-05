import React, { useState } from 'react';
import SkillCard from './SkillCard';

const Dashboard = () => {
  const [selectedSkill, setSelectedSkill] = useState('communication');
  
  const skills = {
    communication: 75,
    criticalThinking: 60,
    problemSolving: 85,
    teamwork: 70,
    digitalLiteracy: 90
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Skills Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {Object.entries(skills).map(([skill, value]) => (
          <SkillCard
            key={skill}
            skill={skill}
            value={value}
            isSelected={selectedSkill === skill}
            onClick={() => setSelectedSkill(skill)}
          />
        ))}
      </div>

    </>
  );
};

export default Dashboard;
