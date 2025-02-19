import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const QuestionScreen = () => {
  const { assessmentId } = useParams(); // Get the assessment ID from the URL
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  
  useEffect(() => {
    fetch(`http://localhost:5000/api/assessments/${assessmentId}/questions`)
      .then(response => response.json())
      .then(data => {
        console.log("Fetched Questions:", data); // Check what is returned
        setQuestions(data || []); // Ensure it's an array
      })
      .catch(error => console.error("Error fetching questions:", error));
  }, [assessmentId]);
  
  if (questions.length === 0) {
    return <div className="text-center p-8">Loading questions...</div>;
  }
  
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
      <div className="mb-8">
        <div className="text-sm text-gray-500 mb-2">
          {questions[currentQuestion].type ? questions[currentQuestion].type.toUpperCase() : 'MULTIPLE-CHOICE'}
        </div>
        <h2 className="text-xl font-semibold mb-4">{questions[currentQuestion].question_text}</h2>
      </div>
      
      {/* Options */}
      <div className="space-y-3 mb-8">
        {questions[currentQuestion].options.map((option, index) => (
          <button
            key={index}
            onClick={() => setSelectedAnswer(index)}
            className={`w-full text-left p-4 rounded-lg border ${
              selectedAnswer === index
                ? "border-green-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      
      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentQuestion(prev => prev - 1)}
          disabled={currentQuestion === 0}
          className="px-6 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentQuestion(prev => prev + 1)}
          disabled={currentQuestion >= questions.length - 1}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default QuestionScreen;