// src/components/assessment/QuestionScreen.jsx
import React, { useState } from 'react';

const QuestionScreen = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const questions = [
    {
      id: 1,
      type: 'multiple-choice',
      question: 'Which approach would be most effective for resolving a conflict within a team?',
      options: [
        'Immediately escalate to management',
        'Ignore the conflict to maintain harmony',
        'Facilitate a discussion between involved parties',
        'Make a unilateral decision'
      ],
      skill: 'Communication'
    }
    // Add more questions here
  ];

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>Time Remaining: 15:00</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-600 rounded-full h-2 transition-all"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="mb-2 text-md font-medium text-green-600">
          {questions[currentQuestion].skill}
        </div>
        <h2 className="text-lg font-medium mb-6">
          {questions[currentQuestion].question}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => setSelectedAnswer(index)}
              className={`w-full text-left p-4 rounded-lg border ${
                selectedAnswer === index
                  ? 'border-green-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          disabled={currentQuestion === 0}
          onClick={() => setCurrentQuestion(prev => prev - 1)}
          className="px-6 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentQuestion(prev => prev + 1)}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default QuestionScreen;