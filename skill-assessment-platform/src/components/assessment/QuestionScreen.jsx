import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';

const QuestionScreen = () => {
  const { user } = useAuth();
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  //const TEMP_USER_ID = 13;

  console.log("Auth context user:", user);
  console.log("localStorage user:", JSON.parse(localStorage.getItem('user')));
  console.log("localStorage token:", localStorage.getItem('token'));
  
  useEffect(() => {
    fetch(`http://localhost:5000/api/assessments/${assessmentId}/questions`)
      .then(response => response.json())
      .then(data => {
        console.log("Fetched Questions:", data);
        setQuestions(data || []);
      })
      .catch(error => console.error("Error fetching questions:", error));
  }, [assessmentId]);
  
  const handleAnswerSelect = (questionId, selectedIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: selectedIndex
    });
  };

  const isLastQuestion = currentQuestion === questions.length - 1;
  
  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmitAssessment();
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach(question => {
      const selectedIndex = selectedAnswers[question.id];
      if (selectedIndex !== undefined) {
        const selectedOption = question.options[selectedIndex];
        if (selectedOption === question.correct_answer) {
          correctCount++;
        }
      }
    });
    
    const percentage = Math.round((correctCount / questions.length) * 100);
    
    // Return only what we need
    return {
      percentage: percentage,
      total_questions: questions.length
    };
  };

// In your React component or API service
const handleSubmitAssessment = async () => {
  try {
    setIsSubmitting(true);

    if (!user || !user.id) {
      console.error("User not found! Unable to submit assessment.");
      setIsSubmitting(false);
      return;
    }

    // Calculate score including percentage
    const result = calculateScore();
    setScore(result);

    const response = await fetch(`http://localhost:5000/api/assessments/${assessmentId}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        userId: user.id,
        assessmentId: parseInt(assessmentId),
        score: result.percentage, // Send percentage instead of raw score
        total_questions: result.total // Keeping total for reference
      })
    });

    const data = await response.json();
    console.log("Assessment submitted:", data);

    setScore(result);
    setIsSubmitting(false);
  } catch (error) {
    console.error("Error submitting assessment:", error);
    setIsSubmitting(false);
  }
};

  
  if (questions.length === 0) {
    return <div className="text-center p-8">Loading questions...</div>;
  }
  
  if (score !== null) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-6">Assessment Complete!</h1>
        <div className={`bg-white shadow-md rounded-lg p-8 mb-6 ${
                      reportData.assessmentDetails.passed
                        ? "text-green-600"
                        : "text-red-500"
                    }`}>
          <div className="text-5xl font-bold text-green-600 mb-4">{score.percentage}%</div>
          <p className=" text-xl mb-2">You scored {score.percentage}% out of a hundred</p>
          <p className="text-gray-600">
            {score.percentage >= 70 ? "Great job! You passed the assessment." : "Keep studying and try again!"}
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }
  
  const currentQuestionData = questions[currentQuestion];
  
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between mb-6">
        <span>Question {currentQuestion + 1} of {questions.length}</span>
        <span>Time Remaining: 15:00</span>
      </div>
      <div className="w-full bg-gray-300 h-2 mb-6 rounded-2xl">
        <div className="bg-green-600 h-2 rounded-2xl" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}>
        </div>
      </div>

      
      {/* Question */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <div className="mb-8">
        <div className="text-sm text-gray-500 mb-2">
          {currentQuestionData.type ? currentQuestionData.type.toUpperCase() : 'MULTIPLE-CHOICE'}
        </div>
        <h2 className="text-xl font-semibold mb-4">{currentQuestionData.question_text}</h2>
      </div>
      
      {/* Options */}
      <div className="space-y-3 mb-8">
        {currentQuestionData.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(currentQuestionData.id, index)}
            className={`w-full text-left p-4 rounded-lg border ${
              selectedAnswers[currentQuestionData.id] === index
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
          onClick={handleNext}
          disabled={isSubmitting || selectedAnswers[currentQuestionData.id] === undefined}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {isLastQuestion ? "Submit Assessment" : "Next"}
        </button>
      </div>
      </div>
    </div>
  );
};

export default QuestionScreen;