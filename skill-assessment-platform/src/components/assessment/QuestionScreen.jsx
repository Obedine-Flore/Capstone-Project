import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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

  const TOTAL_TIME = 10 * 60; // 10 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);

  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Create a direct mapping from assessment IDs to blog post recommendations
  // This eliminates the need for the assessment details API endpoint
  const assessmentBlogMap = {
    "1": { id: 7, title: "Building Technical Skills in the Digital Age" },
    "2": { id: 12, title: "Developing Curiosity: A Path to Continuous Learning" },
    "3": { id: 11, title: "Effective Communication Strategies for the Workplace" },
    "4": { id: 10, title: "Leadership Skills That Drive Success" },
    "5": { id: 8, title: "Advanced Problem Solving Techniques" },
    "6": { id: 16, title: "Why Soft Skills Matter in Today's Workplace" },
    "7": { id: 15, title: "Enhancing Cognitive Abilities Through Practice" },
    "8": { id: 9, title: "Enhancing Cognitive Abilities Through Practice" },
    "9": { id: 13, title: "Enhancing Cognitive Abilities Through Practice" },
    "10": { id: 14, title: "Enhancing Cognitive Abilities Through Practice" },
    "default": { id: 5, title: "Developing Curiosity: A Path to Continuous Learning" } // A safe default that exists
  };

  useEffect(() => {
    fetch(`http://localhost:5000/api/assessments/${assessmentId}/questions`)
      .then(response => response.json())
      .then(data => setQuestions(data || []))
      .catch(error => console.error("Error fetching questions:", error));
  }, [assessmentId]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmitAssessment(); // Auto-submit when time runs out
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer); // Cleanup interval on unmount
  }, [timeLeft]);

  useEffect(() => {
    setStartTime(Date.now()); // Capture the start time
  }, []);  

  useEffect(() => {
    const timer = setInterval(() => {
      if (startTime) {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000)); // Convert to seconds
      }
    }, 1000);
  
    return () => clearInterval(timer); // Cleanup on unmount
  }, [startTime]);  

  // Function to get the recommended blog post based on assessment ID
  const getRecommendedBlogPost = () => {
    // Use the direct mapping by assessment ID
    return assessmentBlogMap[assessmentId] || assessmentBlogMap.default;
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleAnswerSelect = (questionId, selectedIndex) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: selectedIndex });
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
      if (selectedIndex !== undefined && question.options[selectedIndex] === question.correct_answer) {
        correctCount++;
      }
    });
    return {
      percentage: Math.round((correctCount / questions.length) * 100),
      total_questions: questions.length
    };
  };

  const handleSubmitAssessment = async () => {
    try {
      setIsSubmitting(true);
  
      const result = calculateScore();
      console.log("Submitting assessment with time taken:", elapsedTime);
  
      const response = await fetch(`http://localhost:5000/api/assessments/${assessmentId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId: user.id,
          assessmentId: parseInt(assessmentId),
          score: result.percentage,
          total_questions: result.total_questions,
          time_taken: elapsedTime, // Add elapsed time here
        }),
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

  if (questions.length === 0) return <div className="text-center p-8">Loading questions...</div>;

  if (score !== null) {
    const isPassing = score.percentage >= 70;
    const recommendedBlog = !isPassing ? getRecommendedBlogPost() : null;
    
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-6">Assessment Complete!</h1>
        <div className="bg-white shadow-md rounded-lg p-8 mb-6">
          <div
            className={`text-5xl font-bold mb-4 ${
              isPassing ? "text-green-600" : "text-red-600"
            }`}
          >
            {score.percentage}%
          </div>
          <p className="text-xl mb-2">You scored {score.percentage}% out of a hundred</p>
          
          {isPassing ? (
            <p className="text-green-600 mb-4">
              Great job! You passed the assessment.
            </p>
          ) : (
            <div className="space-y-4">
              <p className="text-red-600 mb-2">
                Keep studying and try again! You need 70% to pass this assessment.
              </p>
              
              {/* Blog recommendation section */}
              {recommendedBlog && (
                <div className="mt-4 bg-green-50 p-4 rounded-lg text-left">
                  <h3 className="text-green-800 font-medium text-lg mb-2">
                    Recommended Resource
                  </h3>
                  <p className="text-green-700 mb-3">
                    We recommend checking out this article to help improve your skills:
                  </p>
                  <Link 
                    to={`/blog/${recommendedBlog.id}`} 
                    className="inline-flex items-center bg-green-100 hover:bg-green-200 text-green-800 font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    {recommendedBlog.title}
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex justify-center space-x-4">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Return to Dashboard
          </button>
          
          {!isPassing && (
            <button 
              onClick={() => navigate(`/assessments`)} 
              className="px-6 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between mb-6">
        <span>Question {currentQuestion + 1} of {questions.length}</span>
        {/*<span className="text-red-600 font-bold">Time Remaining: {formatTime(timeLeft)}</span>*/}
        <span className="text-red-600 font-bold">Time Taken: {Math.floor(elapsedTime / 60)} min {elapsedTime % 60} sec</span>
      </div>
      <div className="w-full bg-gray-300 h-2 mb-6 rounded-2xl">
        <div className="bg-green-600 h-2 rounded-2xl" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }} />
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
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button onClick={() => setCurrentQuestion(prev => prev - 1)} disabled={currentQuestion === 0} className="px-6 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50">
            Previous
          </button>
          <button onClick={handleNext} disabled={isSubmitting || selectedAnswers[currentQuestionData.id] === undefined} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
            {isLastQuestion ? "Submit Assessment" : "Next"}
          </button>
        </div>
      </div>
      <div className="text-center">
        <button onClick={() => navigate('/assessments')} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          Cancel Assessment
        </button>
      </div>
    </div>
  );
};

export default QuestionScreen;