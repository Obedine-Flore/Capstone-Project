import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/dashboard/Dashboard';
import AssessmentHub from './components/assessment/AssessmentHub';
import QuestionScreen from './components/assessment/QuestionScreen';
import AssessmentReport from './components/assessment/AssessmentReport';
import ProfileSection from "./components/Profile/ProfileSection";
import BlogLandingPage from "./components/blog/BlogLandingPage";
import LandingPage from "./components/landing/LandingPage";
import ContactUs from "./components/landing/ContactUs";
import AboutUs from "./components/landing/AboutUs";
import SignIn from "./components/landing/SignIn";
import SignUp from "./components/landing/SignUp";

const App = () => {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/assessments" element={<AssessmentHub />} />
          <Route path="/assessments/QuestionScreen" element={<QuestionScreen />} />
          <Route path="/assessments/AssessmentReport" element={<AssessmentReport />} />
          <Route path="/ContactUs" element={<ContactUs />} />
          <Route path="/AboutUs" element={<AboutUs />} />
          <Route path="/Profile" element={<ProfileSection />} />
          <Route path="/blog" element={<BlogLandingPage />} />
          {/* Add other routes if needed */}
        </Routes>
    </Router>
  );
};

export default App;
