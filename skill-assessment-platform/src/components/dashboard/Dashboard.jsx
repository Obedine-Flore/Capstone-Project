import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Search, ChevronDown, Award, TrendingUp, BookOpen } from 'lucide-react';
import axios from "axios";
import Navbar from '../Navbar';
//import { useTranslation } from "react-i18next";
//import LanguageSwitcher from "../LanguageSwitcher";

const Dashboard = () => {
  //const { t } = useTranslation();
  // State management
  const [userName, setUserName] = useState('');
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  //const [assessment, setAssessments] = useState([]);
  
  // Separate states for all skills and recommended skills
  const [allSkills, setAllSkills] = useState([]);
  const [recommendedSkills, setRecommendedSkills] = useState([]);
  const [assessmentHistory, setAssessmentHistory] = useState([]);
  const [relevantSkillIds, setRelevantSkillIds] = useState([]);
  
  // Pagination states
  const [allSkillsPage, setAllSkillsPage] = useState(1);
  const [recommendedSkillsPage, setRecommendedSkillsPage] = useState(1);
  const [hasMoreAllSkills, setHasMoreAllSkills] = useState(true);
  const [hasMoreRecommended, setHasMoreRecommended] = useState(true);

  // Fetch initial data
  useEffect(() => {
    fetchUserData();
    fetchUserProfile();
  }, []);

  // Debounce search term changes
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Re-fetch skills when search or category changes
  useEffect(() => {
    setAllSkillsPage(1);
    fetchSkills(1);
    
    if (relevantSkillIds.length > 0) {
      setRecommendedSkillsPage(1);
      fetchRecommendedSkills(relevantSkillIds, 1);
    }
  }, [debouncedSearchTerm, selectedCategory]);

  const fetchUserData = () => {
    const storedName = localStorage.getItem('user');
    if (storedName) {
      try {
        const userData = JSON.parse(storedName);
        setUserName(userData.name || 'Guest');
      } catch (error) {
        console.error('Error parsing user data:', error);
        setUserName('Guest');
      }
    }
  };

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await axios.get("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(response.data);
      fetchAssessmentHistory(response.data.id);
      fetchSkills(1);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch skills with pagination and search
  const fetchSkills = async (page = 1) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:5000/api/all-skills`, {
        params: {
          page,
          limit: 10,
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          search: debouncedSearchTerm || undefined
        }
      });

      const { skills, hasMore } = response.data;
      
      if (page === 1) {
        setAllSkills(skills);
      } else {
        setAllSkills(prev => [...prev, ...skills]);
      }
      
      setHasMoreAllSkills(hasMore);
    } catch (error) {
      console.error("Error fetching skills:", error);
      setError("Failed to load skills");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch assessment history and generate recommendations
  const fetchAssessmentHistory = async (userId) => {
    if (!userId) return;
    
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const response = await axios.get(`http://localhost:5000/api/user-assessments/history?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAssessmentHistory(response.data);
      generateRecommendations(response.data);
    } catch (error) {
      console.error("Error fetching assessment history:", error);
    }
  };

  {/*// Generate recommendations based on assessment history
  const generateRecommendations = (history) => {
    // Logic to generate recommendations:
    // 1. Skills with low scores that need improvement
    // 2. Skills related to ones the user has shown interest in
    // 3. Popular skills the user hasn't tried yet
    // 4. Skills that complement user's strengths

    const lowScoreSkills = history
      .filter(assessment => assessment.score < 70)
      .map(assessment => assessment.skillId);

    setRelevantSkillIds(lowScoreSkills);
    
    // Fetch recommended skills based on the analysis
    fetchRecommendedSkills(lowScoreSkills, 1);
  }; */}

  const generateRecommendations = (history) => {
    // Group assessments by skill and calculate average score for each skill
    const skillScores = {};
    const skillAttempts = {};
    const userInterests = new Set(); // Track categories user has shown interest in
    
    history.forEach(assessment => {
      // Add category to user interests
      if (assessment.category) {
        userInterests.add(assessment.category);
      }
      
      if (assessment.skillId) {
        // Track total score and count for each skill
        if (!skillScores[assessment.skillId]) {
          skillScores[assessment.skillId] = 0;
          skillAttempts[assessment.skillId] = 0;
        }
        
        skillScores[assessment.skillId] += assessment.score;
        skillAttempts[assessment.skillId]++;
      }
    });
    
    // Calculate average scores and identify areas for improvement
    const lowScoreSkills = [];
    const completedSkills = new Set();
    
    Object.keys(skillScores).forEach(skillId => {
      const averageScore = skillScores[skillId] / skillAttempts[skillId];
      completedSkills.add(parseInt(skillId));
      
      // Skills with low scores need improvement
      if (averageScore < 70) {
        lowScoreSkills.push({
          skillId: parseInt(skillId),
          averageScore,
          attempts: skillAttempts[skillId],
          priority: calculatePriority(averageScore, skillAttempts[skillId])
        });
      }
    });
    
    // Sort low score skills by priority (higher priority first)
    lowScoreSkills.sort((a, b) => b.priority - a.priority);
    
    // Extract just the skill IDs from the sorted array
    const prioritizedLowScoreSkillIds = lowScoreSkills.map(skill => skill.skillId);
    
    // Add metadata to help with recommendations
    const recommendationMetadata = {
      userInterests: Array.from(userInterests),
      completedSkillIds: Array.from(completedSkills),
      recentAssessments: history.slice(0, 5).map(a => a.skillId).filter(Boolean),
      lowScoreData: lowScoreSkills
    };
    
    console.log('Recommendation metadata:', recommendationMetadata);
    setRelevantSkillIds(prioritizedLowScoreSkillIds);
    
    // Fetch recommended skills based on the analysis
    fetchRecommendedSkills(prioritizedLowScoreSkillIds, 1, recommendationMetadata);
  };
  
  // Helper function to calculate priority for recommendations
  const calculatePriority = (score, attempts) => {
    // Lower scores get higher priority
    const scoreFactor = Math.max(0, (70 - score) / 70);
    
    // More attempts = user is struggling and really trying to improve
    const attemptFactor = Math.min(1, attempts / 3);
    
    // Combined priority score (0-1 range)
    return (scoreFactor * 0.7) + (attemptFactor * 0.3);
  };

  const fetchRecommendedSkills = async (skillIds, page = 1, metadata = {}) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
  
      const response = await axios.get("http://localhost:5000/api/recommended-skills", {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          skillIds: skillIds?.join(',') || '',
          page,
          limit: 6,
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          search: debouncedSearchTerm || undefined,
          userInterests: metadata.userInterests?.join(','),
          recentAssessments: metadata.recentAssessments?.join(',')
        }
      });
  
      const { skills, hasMore } = response.data;
  
      // Create a Map to store unique skills by ID
      const uniqueSkillsMap = new Map();
  
      // Process each skill from the API response
      skills.forEach(skill => {
        // Find if this is a low score skill
        const lowScoreData = metadata.lowScoreData?.find(ls => ls.skillId === skill.id);
        
        const enhancedSkill = {
          ...skill,
          // If this is a low score skill, add recommendation reason and progress data
          ...(lowScoreData ? {
            recommendationReason: `Needs improvement (${lowScoreData.averageScore.toFixed(1)}% average score)`,
            attempts: lowScoreData.attempts,
            improvementPriority: lowScoreData.priority,
            proficiency: lowScoreData.averageScore // Use the actual average score as proficiency
          } : {
            // For new skills, add recommendation reason based on relation to existing skills
            recommendationReason: skill.relatedToCompleted 
              ? 'Related to skills you\'ve mastered' 
              : skill.popularInCategory 
                ? 'Popular in ' + skill.category 
                : 'Recommended for you'
          })
        };
  
        // Only add or update the skill if it's not already in our map,
        // or if it has higher priority than an existing entry
        if (!uniqueSkillsMap.has(skill.id) || 
            (enhancedSkill.improvementPriority && 
             enhancedSkill.improvementPriority > uniqueSkillsMap.get(skill.id).improvementPriority)) {
          uniqueSkillsMap.set(skill.id, enhancedSkill);
        }
      });
  
      // Convert map values back to an array
      const uniqueSkills = Array.from(uniqueSkillsMap.values());
  
      // Sort enhanced skills by priority
      const sortedSkills = [...uniqueSkills].sort((a, b) => {
        // Low score skills first
        if (a.improvementPriority && !b.improvementPriority) return -1;
        if (!a.improvementPriority && b.improvementPriority) return 1;
        if (a.improvementPriority && b.improvementPriority) return b.improvementPriority - a.improvementPriority;
        
        // Then by relation to completed skills
        if (a.relatedToCompleted && !b.relatedToCompleted) return -1;
        if (!a.relatedToCompleted && b.relatedToCompleted) return 1;
        
        // Finally by popularity
        return (b.assessmentCount || 0) - (a.assessmentCount || 0);
      });
  
      if (page === 1) {
        setRecommendedSkills(sortedSkills);
      } else {
        // For pagination, we need to merge without duplicating
        const existingIds = new Set(recommendedSkills.map(s => s.id));
        const newSkills = sortedSkills.filter(s => !existingIds.has(s.id));
        setRecommendedSkills(prev => [...prev, ...newSkills]);
      }
  
      setHasMoreRecommended(hasMore && uniqueSkills.length > 0);
    } catch (error) {
      console.error("Error fetching recommended skills:", error);
    }
  };
  
  // Load more skills
  const loadMoreAllSkills = () => {
    const nextPage = allSkillsPage + 1;
    setAllSkillsPage(nextPage);
    fetchSkills(nextPage);
  };

  const loadMoreRecommended = () => {
    const nextPage = recommendedSkillsPage + 1;
    setRecommendedSkillsPage(nextPage);
    fetchRecommendedSkills(relevantSkillIds, nextPage);
  };

  // Helper function to determine progress bar color based on proficiency level
  const getProgressBarColor = (proficiency) => {
    if (proficiency < 40) return 'bg-red-500';
    if (proficiency < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Helper function to get icon based on category
  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Soft Skills':
        return <Award className="text-purple-500" size={18} />;
      case 'Technical':
        return <TrendingUp className="text-blue-500" size={18} />;
      case 'Cognitive':
        return <BookOpen className="text-orange-500" size={18} />;
      default:
        return <Award className="text-green-500" size={18} />;
    }
  };

// Updated renderSkillCard function that only shows proficiency for skills with assessment history
const renderSkillCard = (skill, showProficiency = false) => {
  // Only show proficiency if the skill has been assessed (has attempts)
  const shouldShowProficiency = showProficiency && (skill.attempts > 0 || skill.proficiency);
  
  return (
    <div 
      className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 group-hover:text-green-600 transition-colors">
              {skill.name}
            </h4>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              {getCategoryIcon(skill.category)}
              <span className="ml-1">{skill.category}</span>
            </div>
          </div>
          
          {/* Display assessment count or recommendation badge */}
          {skill.assessmentCount ? (
            <span className="text-sm font-medium px-3 py-1 bg-green-50 text-green-600 rounded-full">
              {skill.assessmentCount} assessments
            </span>
          ) : (
            // Show different badge styles based on recommendation reason
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${
              skill.needs_improvement 
                ? 'bg-amber-50 text-amber-600' 
                : skill.related_to_completed
                  ? 'bg-blue-50 text-blue-600'
                  : 'bg-purple-50 text-purple-600'
            }`}>
              {skill.needs_improvement 
                ? 'Needs Work' 
                : skill.related_to_completed
                  ? 'Related Skill'
                  : 'Recommended'}
            </span>
          )}
        </div>
        
        <p className="text-sm text-gray-600 mb-5 line-clamp-2">{skill.description}</p>
        
        {/* Recommendation reason */}
        {skill.recommendationReason && (
          <div className="mb-3 flex items-start">
            <div className={`text-xs py-1 px-2 rounded ${
              skill.needs_improvement 
                ? 'bg-amber-50 text-amber-700' 
                : skill.related_to_completed
                  ? 'bg-blue-50 text-blue-700'
                  : 'bg-purple-50 text-purple-700'
            }`}>
              {skill.recommendationReason}
            </div>
          </div>
        )}
        
        {/* Proficiency bar - only shown for skills with actual assessment data */}
        {shouldShowProficiency && (
          <div className="mb-5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Proficiency</span>
              <span className="text-sm font-medium text-gray-700">
                {skill.proficiency.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div 
                className={`${getProgressBarColor(skill.proficiency)} h-2.5 rounded-full transition-all duration-500`} 
                style={{ width: `${skill.proficiency}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {/* If there are attempts, show them */}
        {skill.attempts > 0 && (
          <div className="text-xs text-gray-500 mb-3">
            You've attempted this {skill.attempts} time{skill.attempts > 1 ? 's' : ''}
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-100">
        <span className="text-sm font-medium px-3 py-1 bg-gray-200 text-gray-700 rounded-full">{skill.difficulty}</span>
        <Link
          to={`/assessments/${skill.id}/questions`}
          className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 hover:shadow-lg transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Start Assessment
        </Link>
      </div>
    </div>
  );
};
  
// Fixed renderSkillsGrid function to ensure unique keys
const renderSkillsGrid = (skills, onLoadMore, hasMore, showProficiency = false) => (
  <div className="px-2">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {skills.map((skill, index) => {
        // Create a truly unique key by combining skill ID and array index
        const uniqueKey = `skill-${skill.id || 'missing'}-${index}`;
        return (
          <div 
            key={uniqueKey}
            className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 group-hover:text-green-600 transition-colors">
                    {skill.name}
                  </h4>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    {getCategoryIcon(skill.category)}
                    <span className="ml-1">{skill.category}</span>
                  </div>
                </div>
                
                {/* Display assessment count or recommendation badge */}
                {skill.assessmentCount ? (
                  <span className="text-sm font-medium px-3 py-1 bg-green-50 text-green-600 rounded-full">
                    {skill.assessmentCount} assessments
                  </span>
                ) : (
                  // Show different badge styles based on recommendation reason
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                    skill.needs_improvement 
                      ? 'bg-amber-50 text-amber-600' 
                      : skill.related_to_completed
                        ? 'bg-blue-50 text-blue-600'
                        : 'bg-purple-50 text-purple-600'
                  }`}>
                    {skill.needs_improvement 
                      ? 'Needs Work' 
                      : skill.related_to_completed
                        ? 'Related Skill'
                        : 'Recommended'}
                  </span>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-5 line-clamp-2">{skill.description}</p>
              
              {/* Recommendation reason */}
              {skill.recommendationReason && (
                <div className="mb-3 flex items-start">
                  <div className={`text-xs py-1 px-2 rounded ${
                    skill.needs_improvement 
                      ? 'bg-amber-50 text-amber-700' 
                      : skill.related_to_completed
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-purple-50 text-purple-700'
                  }`}>
                    {skill.recommendationReason}
                  </div>
                </div>
              )}
              
              {/* Proficiency bar for recommended skills */}
              {showProficiency && (
                <div className="mb-5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Proficiency</span>
                    <span className="text-sm font-medium text-gray-700">
                      {(() => {
                        // Generate a consistent proficiency based on skill ID and index
                        const seedValue = (skill.id || 0) * 17 + index * 13;
                        const defaultProficiency = seedValue % 100;
                        return skill.proficiency || defaultProficiency;
                      })()}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div 
                      className={`${getProgressBarColor(skill.proficiency || ((skill.id || 0) * 17 + index * 13) % 100)} h-2.5 rounded-full transition-all duration-500`} 
                      style={{ width: `${skill.proficiency || ((skill.id || 0) * 17 + index * 13) % 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {/* If there are attempts, show them */}
              {skill.attempts > 0 && (
                <div className="text-xs text-gray-500 mb-3">
                  You've attempted this {skill.attempts} time{skill.attempts > 1 ? 's' : ''}
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-100">
              <span className="text-sm font-medium px-3 py-1 bg-gray-200 text-gray-700 rounded-full">{skill.difficulty}</span>
              <Link
                to={`/assessments/${skill.id}/questions`}
                className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 hover:shadow-lg transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              >
                Start Assessment
              </Link>
            </div>
          </div>
        );
      })}
    </div>
    {hasMore && (
      <div className="flex justify-center mt-10">
        <button
          onClick={onLoadMore}
          className="flex items-center px-8 py-3 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-colors border border-green-300 hover:border-green-400 shadow-sm hover:shadow"
        >
          See More <ChevronDown className="ml-2" size={16} />
        </button>
      </div>
    )}
  </div>
);

  const handleSearch = (e) => {
    e.preventDefault();
    setAllSkillsPage(1);
    fetchSkills(1);
    
    if (relevantSkillIds.length > 0) {
      setRecommendedSkillsPage(1);
      fetchRecommendedSkills(relevantSkillIds, 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      {/* Navbar */}
      <Navbar userData={userData}/>
      
      <main className="container mx-auto max-w-7xl py-10 px-4 sm:px-6 lg:px-8 flex-grow">
        {/* Welcome section */}
        <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-8 mb-10 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
            {/*<h1>{t("dashboard")}</h1>*/}
              <h2 className="text-2xl font-semibold text-gray-800">Hello {userName || 'Guest'},</h2>
              <p className="text-lg text-green-700 font-medium mt-2">
                Ready to enhance your skills today?
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <div className="text-sm text-gray-600">Assessments completed</div>
                <div className="text-2xl font-bold text-green-600 mt-1">{assessmentHistory.length || 0}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-12">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3.5 rounded-xl w-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm w-full md:w-auto"
            >
              <option value="All">All Categories</option>
              <option value="Soft Skills">Soft Skills</option>
              <option value="Technical">Technical</option>
              <option value="Cognitive">Cognitive</option>
            </select>
            <button 
              type="submit"
              className="px-8 py-3.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-sm hover:shadow w-full md:w-auto"
            >
              Search
            </button>
          </form>
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-10 shadow-sm">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Recommended Skills Section */}
        <section className="mb-16">
          <div className="flex items-center mb-6">
            <h3 className="text-2xl font-semibold text-green-700">
              Recommended for You
            </h3>
            <div className="h-px flex-grow bg-gray-200 ml-4"></div>
          </div>
          {!isLoading && (
            recommendedSkills.length > 0 ? (
              renderSkillsGrid(recommendedSkills, loadMoreRecommended, hasMoreRecommended, true)
            ) : (
              <div className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm">
                <p className="text-gray-600">Complete some assessments to get personalized recommendations!</p>
              </div>
            )
          )}
        </section>

        {/* All Skills Section */}
        <section className="mb-10">
          <div className="flex items-center mb-6">
            <h3 className="text-2xl font-semibold text-green-700">
              All Skills
            </h3>
            <div className="h-px flex-grow bg-gray-200 ml-4"></div>
          </div>
          {!isLoading && allSkills.length > 0 ? (
            renderSkillsGrid(allSkills, loadMoreAllSkills, hasMoreAllSkills)
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm">
              <p className="text-gray-600">No skills found matching your criteria.</p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white text-center p-10 mt-auto border-t border-gray-200">
        <h1 className="text-xl font-bold text-green-700 mb-2">SkillsAssess</h1>
        <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} SkillsAssess. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;