import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/dashboard/Dashboard';
import AssessmentHub from './components/assessment/AssessmentHub';
import QuestionScreen from './components/assessment/QuestionScreen';
import AssessmentReport from './components/assessment/AssessmentReport';
import ProfileSection from "./components/Profile/ProfileSection";
import BlogLandingPage from "./components/blog/BlogLandingPage";

const App = () => {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/assessments" element={<AssessmentHub />} />
          <Route path="/assessments/QuestionScreen" element={<QuestionScreen />} />
          <Route path="/assessments/AssessmentReport" element={<AssessmentReport />} />
          <Route path="/Profile" element={<ProfileSection />} />
          <Route path="/blog" element={<BlogLandingPage />} />
          {/* Add other routes if needed */}
        </Routes>
    </Router>
  );
};

export default App;
