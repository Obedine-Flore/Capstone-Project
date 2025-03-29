import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  FileText,
  List,
  BarChart2,
  Settings,
  Eye,
  Edit,
  Trash,
  Search,
  Plus,
  AlertCircle
} from "lucide-react";
import axios from "axios";
import profilePic from "../../assets/profile.jpg";
//import ReactQuill from 'react-quill';
//import 'react-quill/dist/quill.snow.css';
import SimpleHtmlEditor from '../SimpleHtmlEditor';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Data states
  const [users, setUsers] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalAssessments: 0,
    totalBlogPosts: 0,
    averageScore: 0,
    recentRegistrations: [],
    skillDistribution: []
  });

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalData, setModalData] = useState(null);
  
  // Confirmation dialog state
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  useEffect(() => {
    // Check if user is admin
    checkAdminStatus();
    
    // Fetch data based on active tab
    if (activeTab === "overview") {
      fetchAnalytics();
    } else if (activeTab === "users") {
      fetchUsers();
    } else if (activeTab === "assessments") {
      fetchAssessments();
    } else if (activeTab === "blog") {
      fetchBlogPosts();
    }
  }, [activeTab]);

  const checkAdminStatus = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get("http://localhost:5000/api/admin/check-status", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.data.isAdmin) {
        navigate("/dashboard");
        return;
      }

      setUserData(response.data.user);
    } catch (error) {
      console.error("Error checking admin status:", error);
      navigate("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await axios.get("http://localhost:5000/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAssessments = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await axios.get("http://localhost:5000/api/admin/assessments", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setAssessments(response.data);
    } catch (error) {
      console.error("Error fetching assessments:", error);
      setError("Failed to load assessments data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBlogPosts = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await axios.get("http://localhost:5000/api/admin/blog-posts", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setBlogPosts(response.data);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      setError("Failed to load blog posts data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await axios.get("http://localhost:5000/api/admin/analytics", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setAnalytics(response.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setError("Failed to load analytics data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Filter data based on activeTab and searchTerm
    if (activeTab === "users") {
      fetchUsers();
    } else if (activeTab === "assessments") {
      fetchAssessments();
    } else if (activeTab === "blog") {
      fetchBlogPosts();
    }
  };

  const openModal = (type, data = null) => {
    setModalType(type);
    setModalData(data);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalData(null);
  };

  const confirmAction = (action, message, data = null) => {
    setConfirmationAction(() => action);
    setConfirmationMessage(message);
    setModalData(data);
    setShowConfirmation(true);
  };

  const cancelConfirmation = () => {
    setShowConfirmation(false);
    setConfirmationAction(null);
    setModalData(null);
  };

  const deleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Refresh user list
      fetchUsers();
      
      // Show success message
      alert("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  const deleteAssessment = async (assessmentId) => {
    try {
      const token = localStorage.getItem("token");
      
      await axios.delete(`http://localhost:5000/api/admin/assessments/${assessmentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Refresh assessment list
      fetchAssessments();
      
      // Show success message
      alert("Assessment deleted successfully");
    } catch (error) {
      console.error("Error deleting assessment:", error);
      alert("Failed to delete assessment");
    }
  };

  const deleteBlogPost = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      
      await axios.delete(`http://localhost:5000/api/admin/blog-posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Refresh blog post list
      fetchBlogPosts();
      
      // Show success message
      alert("Blog post deleted successfully");
    } catch (error) {
      console.error("Error deleting blog post:", error);
      alert("Failed to delete blog post");
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  const renderTabContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-10">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      );
    }

    switch (activeTab) {
      case "overview":
        return renderOverviewTab();
      case "users":
        return renderUsersTab();
      case "assessments":
        return renderAssessmentsTab();
      case "blog":
        return renderBlogTab();
      case "settings":
        return renderSettingsTab();
      default:
        return null;
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">{analytics.totalUsers}</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Total Assessments</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">{analytics.totalAssessments}</h3>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <FileText className="text-green-600" size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Blog Posts</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">{analytics.totalBlogPosts}</h3>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <List className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Average Score</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">{analytics.averageScore}%</h3>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <BarChart2 className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Registrations */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Recent Registrations</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analytics.recentRegistrations.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full overflow-hidden">
                        <img 
                          src={user.profile_picture ? `http://localhost:5000/${user.profile_picture}` : profilePic} 
                          alt={user.name} 
                          className="h-10 w-10 object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Skill Distribution */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Skill Distribution</h3>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {analytics.skillDistribution.map((skill) => (
              <div key={skill.name} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                  <span className="text-sm font-medium text-gray-700">{skill.count} users</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div 
                    className="bg-green-600 h-2.5 rounded-full" 
                    style={{ width: `${(skill.count / analytics.totalUsers) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsersTab = () => (
    <div className="space-y-6">
      {/* Search and Add User */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <form onSubmit={handleSearch} className="w-full md:w-auto flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <button 
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Search
          </button>
        </form>
        
        <button
          onClick={() => openModal("createUser")}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} className="mr-2" />
          Add User
        </button>
      </div>
      
      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full overflow-hidden">
                        <img 
                          src={user.profile_picture ? `http://localhost:5000/${user.profile_picture}` : profilePic} 
                          alt={user.name} 
                          className="h-10 w-10 object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${user.is_admin ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}
                    >
                      {user.is_admin ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => openModal("viewUser", user)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => openModal("editUser", user)}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => confirmAction(
                          () => deleteUser(user.id), 
                          `Are you sure you want to delete the user "${user.name}"?`
                        )}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAssessmentsTab = () => (
    <div className="space-y-6">
      {/* Search and Add Assessment */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <form onSubmit={handleSearch} className="w-full md:w-auto flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search assessments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <button 
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Search
          </button>
        </form>
        
        <button
          onClick={() => openModal("createAssessment")}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus size={18} className="mr-2" />
          Add Assessment
        </button>
      </div>
      
      {/* Assessments Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Questions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time Limit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assessments.map((assessment) => (
                <tr key={assessment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{assessment.title}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{assessment.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {assessment.category || "General"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {assessment.num_questions || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {assessment.time || 0} min
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => openModal("viewAssessment", assessment)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => openModal("editAssessment", assessment)}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => confirmAction(
                          () => deleteAssessment(assessment.id), 
                          `Are you sure you want to delete the assessment "${assessment.title}"?`
                        )}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderBlogTab = () => (
    <div className="space-y-6">
      {/* Search and Add Blog Post */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <form onSubmit={handleSearch} className="w-full md:w-auto flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search blog posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <button 
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Search
          </button>
        </form>
        
        <button
          onClick={() => openModal("createBlogPost")}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus size={18} className="mr-2" />
          Add Blog Post
        </button>
      </div>
      
      {/* Blog Posts Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Published
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {blogPosts.map((post) => (
                <tr key={post.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{post.title}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{post.excerpt}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {post.author}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(post.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => openModal("viewBlogPost", post)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => openModal("editBlogPost", post)}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => confirmAction(
                          () => deleteBlogPost(post.id), 
                          `Are you sure you want to delete the blog post "${post.title}"?`
                        )}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Admin Settings</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-1">
              Site Name
            </label>
            <input
              type="text"
              id="siteName"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              defaultValue="SkillsAssess"
            />
          </div>
          
          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              id="contactEmail"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              defaultValue="admin@skillsassess.com"
            />
          </div>
          
          <div>
            <label htmlFor="defaultUserRole" className="block text-sm font-medium text-gray-700 mb-1">
              Default User Role
            </label>
            <select
              id="defaultUserRole"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              defaultValue="user"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <div className="pt-4">
            <button 
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">System Information</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Application Version</span>
            <span className="font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Node.js Version</span>
            <span className="font-medium">16.x</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Database</span>
            <span className="font-medium">MySQL</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Last Backup</span>
            <span className="font-medium">Never</span>
          </div>
        </div>
        
        <div className="mt-4 flex space-x-4">
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Backup Database
          </button>
          <button 
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            System Check
          </button>
        </div>
      </div>
    </div>
  );

  // Modal components for each action
  const renderModal = () => {
    if (!showModal) return null;
  
    let modalTitle = "";
    let modalContent = null;
  
    switch (modalType) {
      case "createUser":
        modalTitle = "Create New User";
        modalContent = <UserForm onSubmit={(data) => {
          if (data) {
            // Refresh user list
            fetchUsers();
            alert("User created successfully");
          }
          closeModal();
        }} />;
        break;
      case "viewUser":
        modalTitle = "User Details";
        modalContent = <UserDetails user={modalData} />;
        break;
      case "editUser":
        modalTitle = "Edit User";
        modalContent = <UserForm user={modalData} onSubmit={(data) => {
          if (data) {
            // Refresh user list
            fetchUsers();
            alert("User updated successfully");
          }
          closeModal();
        }} />;
        break;
      case "createAssessment":
        modalTitle = "Create New Assessment";
        modalContent = <AssessmentForm onSubmit={(data) => {
          if (data) {
            // Refresh assessment list
            fetchAssessments();
            alert("Assessment created successfully");
          }
          closeModal();
        }} />;
        break;
      case "viewAssessment":
        modalTitle = "Assessment Details";
        modalContent = <AssessmentDetails assessment={modalData} />;
        break;
        case "editAssessment":
          modalTitle = "Edit Assessment";
          
          modalContent = <AssessmentForm assessment={modalData} onSubmit={(data) => {
            if (data) {
              // Refresh assessment list
              fetchAssessments();
              alert("Assessment updated successfully");
            }
            closeModal();
          }} />;
          break;
      case "createBlogPost":
        modalTitle = "Create New Blog Post";
        modalContent = <BlogPostForm onSubmit={(data) => {
          if (data) {
            // Refresh blog post list
            fetchBlogPosts();
            alert("Blog post created successfully");
          }
          closeModal();
        }} />;
        break;
      case "viewBlogPost":
        modalTitle = "Blog Post Details";
        modalContent = <BlogPostDetails post={modalData} />;
        break;
      case "editBlogPost":
        modalTitle = "Edit Blog Post";
        modalContent = <BlogPostForm post={modalData} onSubmit={(data) => {
          if (data) {
            // Refresh blog post list
            fetchBlogPosts();
            alert("Blog post updated successfully");
          }
          closeModal();
        }} />;
        break;
      default:
        return null;
    }
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-auto">
          <div className="flex justify-between items-center p-6 border-b">
            <h3 className="text-xl font-semibold text-gray-800">{modalTitle}</h3>
            <button 
              onClick={closeModal}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-6">
        {isLoading ? (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
          </div>
        ) : (
          modalContent
        )}
      </div>
        </div>
      </div>
    );
  };

  // Add this outside renderModal, as a separate function in your component
const fetchFullAssessment = async (assessmentId) => {
  try {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    
    const response = await axios.get(
      `http://localhost:5000/api/admin/assessments/${assessmentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    // Update modal data with full assessment details
    setModalData(response.data);
    setIsLoading(false);
  } catch (error) {
    console.error("Error fetching assessment details:", error);
    alert("Error loading assessment details");
    setIsLoading(false);
  }
};

// Add this useEffect to your component
useEffect(() => {
  if (showModal && modalType === "editAssessment" && modalData && modalData.id) {
    fetchFullAssessment(modalData.id);
  }
}, [showModal, modalType, modalData?.id]);

  // Confirmation dialog
  const renderConfirmationDialog = () => {
    if (!showConfirmation) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <AlertCircle className="text-red-500 mr-3" size={24} />
              <h3 className="text-lg font-semibold text-gray-800">Confirm Action</h3>
            </div>
            <p className="text-gray-600 mb-6">{confirmationMessage}</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelConfirmation}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  confirmationAction();
                  setShowConfirmation(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Form components (placeholder)
  const UserForm = ({ user, onSubmit }) => (
    <form className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          defaultValue={user?.name || ""}
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          defaultValue={user?.email || ""}
        />
      </div>
      
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
          Role
        </label>
        <select
          id="role"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          defaultValue={user?.is_admin ? "admin" : "user"}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          {user ? "New Password (leave blank to keep current)" : "Password"}
        </label>
        <input
          type="password"
          id="password"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      
      <div className="pt-4 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onSubmit}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          {user ? "Update User" : "Create User"}
        </button>
      </div>
    </form>
  );

  const UserDetails = ({ user }) => (
    <div className="space-y-6">
      <div className="flex items-center">
        <div className="w-20 h-20 rounded-full overflow-hidden">
          <img
            src={user.profile_picture ? `http://localhost:5000/${user.profile_picture}` : profilePic}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="ml-6">
          <h4 className="text-xl font-semibold text-gray-800">{user.name}</h4>
          <p className="text-gray-600">{user.email}</p>
          <span 
            className={`mt-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
            ${user.is_admin ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}
          >
            {user.is_admin ? 'Admin' : 'User'}
          </span>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <dl className="divide-y divide-gray-200">
          <div className="py-3 grid grid-cols-3">
            <dt className="text-sm font-medium text-gray-500">User ID</dt>
            <dd className="text-sm text-gray-900 col-span-2">{user.id}</dd>
          </div>
          <div className="py-3 grid grid-cols-3">
            <dt className="text-sm font-medium text-gray-500">Registration Date</dt>
            <dd className="text-sm text-gray-900 col-span-2">{formatDate(user.created_at)}</dd>
          </div>
          <div className="py-3 grid grid-cols-3">
            <dt className="text-sm font-medium text-gray-500">Last Login</dt>
            <dd className="text-sm text-gray-900 col-span-2">{formatDate(user.last_login_at) || "Never"}</dd>
          </div>
          <div className="py-3 grid grid-cols-3">
            <dt className="text-sm font-medium text-gray-500">Bio</dt>
            <dd className="text-sm text-gray-900 col-span-2">{user.bio || "No bio provided"}</dd>
          </div>
        </dl>
      </div>
      
      {user.skills && user.skills.length > 0 && (
        <div className="border-t border-gray-200 pt-4">
          <h5 className="text-sm font-medium text-gray-500 mb-2">Skills</h5>
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill, index) => (
              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const AssessmentForm = ({ assessment, onSubmit }) => {
    const [formData, setFormData] = useState({
      title: assessment?.title || "",
      description: assessment?.description || "",
      category: assessment?.category || "",
      level: assessment?.level || "",
      time: assessment?.time || "",
      attempts_allowed: assessment?.attempts_allowed || "unlimited"
    });
    const [questions, setQuestions] = useState(assessment?.questions || []);
    const [currentQuestion, setCurrentQuestion] = useState({
      question_text: "",
      correct_answer: "",
      options: ["", "", "", ""],
      type: "multiple-choice"
    });
    const [isEditingQuestion, setIsEditingQuestion] = useState(false);
    const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [showQuestionForm, setShowQuestionForm] = useState(false);

    useEffect(() => {
      // If editing an existing assessment with questions, load them
      if (assessment && assessment.questions) {
        setQuestions(assessment.questions.map(q => ({
          ...q,
          // Ensure options is an array, not a JSON string
          options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
        })));
      }
    }, [assessment]);
  
    const handleChange = (e) => {
      const { id, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [id]: value
      }));
    };
  
    const handleQuestionChange = (e) => {
      const { id, value } = e.target;
      setCurrentQuestion(prev => ({
        ...prev,
        [id]: value
      }));
    };
  
    const handleOptionChange = (index, value) => {
      const newOptions = [...currentQuestion.options];
      newOptions[index] = value;
      setCurrentQuestion(prev => ({
        ...prev,
        options: newOptions
      }));
    };
  
    const addOption = () => {
      setCurrentQuestion(prev => ({
        ...prev,
        options: [...prev.options, ""]
      }));
    };
  
    const removeOption = (index) => {
      if (currentQuestion.options.length <= 2) return; // Keep at least 2 options
      const newOptions = [...currentQuestion.options];
      newOptions.splice(index, 1);
      setCurrentQuestion(prev => ({
        ...prev,
        options: newOptions
      }));
    };
  
    const addQuestion = () => {
      // Validate question
      if (!currentQuestion.question_text.trim()) {
        setError("Question text is required");
        return;
      }
      if (!currentQuestion.correct_answer.trim()) {
        setError("Correct answer is required");
        return;
      }
      if (currentQuestion.options.some(option => !option.trim())) {
        setError("All options must be filled");
        return;
      }
  
      if (isEditingQuestion) {
        // Update existing question
        const newQuestions = [...questions];
        newQuestions[editingQuestionIndex] = currentQuestion;
        setQuestions(newQuestions);
        setIsEditingQuestion(false);
        setEditingQuestionIndex(null);
      } else {
        // Add new question
        setQuestions(prev => [...prev, currentQuestion]);
      }
  
      // Reset form
      setCurrentQuestion({
        question_text: "",
        correct_answer: "",
        options: ["", "", "", ""],
        type: "multiple-choice"
      });
      setError(null);
      setShowQuestionForm(false);
    };
  
    const editQuestion = (index) => {
      setCurrentQuestion(questions[index]);
      setIsEditingQuestion(true);
      setEditingQuestionIndex(index);
      setShowQuestionForm(true);
    };
  
    const removeQuestion = (index) => {
      const newQuestions = [...questions];
      newQuestions.splice(index, 1);
      setQuestions(newQuestions);
    };
  
    const cancelQuestionEdit = () => {
      setCurrentQuestion({
        question_text: "",
        correct_answer: "",
        options: ["", "", "", ""],
        type: "multiple-choice"
      });
      setIsEditingQuestion(false);
      setEditingQuestionIndex(null);
      setShowQuestionForm(false);
      setError(null);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError(null);
      
      try {
        // Validate form
        if (!formData.title.trim()) {
          throw new Error("Title is required");
        }
        if (!formData.description.trim()) {
          throw new Error("Description is required");
        }
        if (!formData.category) {
          throw new Error("Category is required");
        }
        if (!formData.level) {
          throw new Error("Difficulty level is required");
        }
        if (!formData.time || isNaN(formData.time)) {
          throw new Error("Valid time limit is required");
        }
        
        if (questions.length === 0) {
          throw new Error("At least one question is required");
        }
  
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token not found");
        }
  
        // Prepare data for API
        const assessmentData = {
          ...formData,
          attempts_allowed: formData.attempts_allowed === "unlimited" ? null : formData.attempts_allowed,
          questions: questions
        };
        
        // Set the URL based on whether we're creating or updating
        const url = assessment 
          ? `http://localhost:5000/api/admin/assessments/${assessment.id}`
          : 'http://localhost:5000/api/admin/assessments';
        
        // Make the API request
        const response = await axios({
          method: assessment ? 'PUT' : 'POST',
          url: url,
          data: assessmentData,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        // Call the onSubmit callback with the response data
        onSubmit(response.data);
        
      } catch (error) {
        console.error('Error submitting assessment:', error);
        setError(error.response?.data?.message || error.message || 'Error submitting assessment');
      } finally {
        setIsSubmitting(false);
      }
    };
  
    return (
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800">Basic Information</h3>
          
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.category}
                onChange={handleChange}
                //required
              >
                <option value="">Select Category</option>
                <option value="Technical">Technical</option>
                <option value="Soft Skills">Soft Skills</option>
                <option value="Cognitive">Cognitive</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty Level
              </label>
              <select
                id="level"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.level}
                onChange={handleChange}
                required
              >
                <option value="">Select Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                Time Limit (minutes)
              </label>
              <input
                type="number"
                id="time"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="attempts_allowed" className="block text-sm font-medium text-gray-700 mb-1">
                Attempts Allowed
              </label>
              <select
                id="attempts_allowed"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.attempts_allowed}
                onChange={handleChange}
              >
                <option value="unlimited">Unlimited</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="5">5</option>
                <option value="10">10</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-800">Questions ({questions.length})</h3>
            <button
              type="button"
              onClick={() => setShowQuestionForm(true)}
              className="px-3 py-1.5 bg-green-500 text-white text-sm rounded hover:bg-green-700 transition-colors"
            >
              Add Question
            </button>
          </div>
          
          {questions.length === 0 ? (
            <div className="bg-gray-50 p-4 rounded-md text-center text-gray-500">
              No questions added yet. Click "Add Question" to start creating your assessment.
            </div>
          ) : (
            <div className="space-y-3">
              {questions.map((question, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-md">
                  <div className="flex justify-between">
                    <h4 className="font-medium">Question {index + 1}</h4>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => editQuestion(index)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => removeQuestion(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="mt-2">{question.question_text}</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-500">Options:</p>
                    <ul className="list-disc pl-5">
                      {question.options.map((option, optIndex) => (
                        <li key={optIndex} className={optIndex === question.options.indexOf(question.correct_answer) ? "text-green-600 font-medium" : ""}>
                          {option} {optIndex === question.options.indexOf(question.correct_answer) && "(Correct)"}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {showQuestionForm && (
            <div className="border border-gray-200 rounded-md p-4 mt-4 space-y-4">
              <h4 className="font-medium text-gray-800">
                {isEditingQuestion ? `Edit Question ${editingQuestionIndex + 1}` : "Add New Question"}
              </h4>
              
              <div>
                <label htmlFor="question_text" className="block text-sm font-medium text-gray-700 mb-1">
                  Question Text
                </label>
                <textarea
                  id="question_text"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={currentQuestion.question_text}
                  onChange={handleQuestionChange}
                  required
                ></textarea>
              </div>
              
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Question Type
                </label>
                <select
                  id="type"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={currentQuestion.type}
                  onChange={handleQuestionChange}
                >
                  <option value="multiple-choice">Multiple Choice</option>
                </select>
              </div>
              
              <div>
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700">Options</label>
                  <button
                    type="button"
                    onClick={addOption}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Add Option
                  </button>
                </div>
                
                <div className="space-y-2 mt-2">
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="correct_answer"
                        checked={currentQuestion.correct_answer === option}
                        onChange={() => setCurrentQuestion(prev => ({...prev, correct_answer: option}))}
                        className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                      />
                      <input
                        type="text"
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-1">Select the radio button for the correct answer</p>
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={cancelQuestionEdit}
                  className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                >
                  {isEditingQuestion ? "Update Question" : "Add Question"}
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="pt-4 flex justify-end space-x-3 border-t">
          <button
            type="button"
            onClick={() => onSubmit()}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                {assessment ? "Updating Assessment" : "Create Assessment"}
              </div>
            ) : (
              assessment ? "Update Assessment" : "Create Assessment"
            )}
          </button>
        </div>
      </form>
    );
  };

  const AssessmentDetails = ({ assessment }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [detailedAssessment, setDetailedAssessment] = useState(assessment);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      // Fetch detailed assessment data if questions are not included
      if (!assessment.questions) {
        fetchAssessmentDetails();
      }
    }, [assessment.id]);

    useEffect(() => {
      // If editing an existing assessment with questions, load them
      if (assessment && assessment.questions) {
        setQuestions(assessment.questions.map(q => ({
          ...q,
          // Ensure options is an array, not a JSON string
          options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
        })));
      }
    }, [assessment]);
  
    const fetchAssessmentDetails = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        
        const response = await axios.get(
          `http://localhost:5000/api/admin/assessments/${assessment.id}`, 
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        setDetailedAssessment(response.data);
      } catch (error) {
        console.error("Error fetching assessment details:", error);
        setError("Failed to load assessment details");
      } finally {
        setIsLoading(false);
      }
    };
  
    if (isLoading) {
      return (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      );
    }
  
    return (
      <div className="space-y-6">
        <div>
          <h4 className="text-xl font-semibold text-gray-800">{detailedAssessment.title}</h4>
          <div className="flex items-center mt-2 space-x-2">
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
              {detailedAssessment.category || "General"}
            </span>
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
              {detailedAssessment.level || "Intermediate"} Level
            </span>
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
              {detailedAssessment.time || 0} min
            </span>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <p className="text-gray-600">{detailedAssessment.description}</p>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <dl className="divide-y divide-gray-200">
            <div className="py-3 grid grid-cols-3">
              <dt className="text-sm font-medium text-gray-500">Number of Questions</dt>
              <dd className="text-sm text-gray-900 col-span-2">
                {detailedAssessment.questions?.length || detailedAssessment.num_questions || 0}
              </dd>
            </div>
            <div className="py-3 grid grid-cols-3">
              <dt className="text-sm font-medium text-gray-500">Time Limit</dt>
              <dd className="text-sm text-gray-900 col-span-2">{detailedAssessment.time || 0} minutes</dd>
            </div>
            <div className="py-3 grid grid-cols-3">
              <dt className="text-sm font-medium text-gray-500">Attempts Allowed</dt>
              <dd className="text-sm text-gray-900 col-span-2">
                {detailedAssessment.attempts_allowed ? detailedAssessment.attempts_allowed : "Unlimited"}
              </dd>
            </div>
            <div className="py-3 grid grid-cols-3">
              <dt className="text-sm font-medium text-gray-500">Created</dt>
              <dd className="text-sm text-gray-900 col-span-2">{formatDate(detailedAssessment.created_at)}</dd>
            </div>
          </dl>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <h5 className="text-sm font-medium text-gray-500 mb-4">Assessment Statistics</h5>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <p className="text-sm text-gray-500">Total Attempts</p>
              <p className="text-lg font-semibold text-gray-800">{detailedAssessment.total_attempts || 0}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <p className="text-sm text-gray-500">Average Score</p>
              <p className="text-lg font-semibold text-gray-800">{detailedAssessment.average_score || 0}%</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <p className="text-sm text-gray-500">Pass Rate</p>
              <p className="text-lg font-semibold text-gray-800">{detailedAssessment.pass_rate || 0}%</p>
            </div>
          </div>
        </div>
        
        {detailedAssessment.questions && (
          <div className="border-t border-gray-200 pt-4">
            <h5 className="text-sm font-medium text-gray-500 mb-4">Questions</h5>
            <div className="space-y-4">
              {detailedAssessment.questions.map((question, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-md">
                  <h6 className="font-medium">Question {index + 1}</h6>
                  <p className="mt-1">{question.question_text}</p>
                  
                  <div className="mt-3">
                    <p className="text-sm text-gray-500">Options:</p>
                    <ul className="list-disc pl-5 mt-1">
                      {Array.isArray(question.options) 
                        ? question.options.map((option, optIndex) => (
                            <li key={optIndex} className={option === question.correct_answer ? "text-green-600 font-medium" : ""}>
                              {option} {option === question.correct_answer && "(Correct)"}
                            </li>
                          ))
                        : JSON.parse(question.options || '[]').map((option, optIndex) => (
                            <li key={optIndex} className={option === question.correct_answer ? "text-green-600 font-medium" : ""}>
                              {option} {option === question.correct_answer && "(Correct)"}
                            </li>
                          ))
                      }
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const BlogPostForm = ({ post, onSubmit }) => {
    const [formData, setFormData] = useState({
      title: post?.title || "",
      excerpt: post?.excerpt || "",
      author: post?.author || "",
      category: post?.category || "",
      read_time: post?.read_time || "",
      featured: post?.featured ? "1" : "0"
    });
    
    // Separate state for content because ReactQuill handles it differently
    const [content, setContent] = useState(post?.content || "");
    const [image, setImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
  
    const handleChange = (e) => {
      const { id, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [id]: value
      }));
    };
  
    const handleContentChange = (value) => {
      setContent(value);
    };
  
    const handleFileChange = (e) => {
      if (e.target.files && e.target.files[0]) {
        setImage(e.target.files[0]);
      }
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError(null);
      
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token not found");
        }
  
        // Create a FormData object to handle file upload
        const formDataToSend = new FormData();
        
        // Append all form fields
        Object.keys(formData).forEach(key => {
          formDataToSend.append(key, formData[key]);
        });
        
        // Append content from the rich text editor
        formDataToSend.append('content', content);
        
        // Append image if selected
        if (image) {
          formDataToSend.append('image', image);
        }
        
        // Set the URL based on whether we're creating or updating
        const url = post 
          ? `http://localhost:5000/api/admin/blog-posts/${post.id}`
          : 'http://localhost:5000/api/admin/blog-posts';
        
        // Make the API request
        const response = await axios({
          method: post ? 'PUT' : 'POST',
          url: url,
          data: formDataToSend,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        
        // Call the onSubmit callback with the response data
        onSubmit(response.data);
        
      } catch (error) {
        console.error('Error submitting blog post:', error);
        setError(error.response?.data?.message || 'Error submitting blog post');
      } finally {
        setIsSubmitting(false);
      }
    };
  
    // Rich text editor toolbar configuration
    const modules = {
      toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}],
        ['link', 'image'],
        ['clean']
      ],
    };
  
    const formats = [
      'header',
      'bold', 'italic', 'underline', 'strike', 'blockquote',
      'list', 'bullet',
      'link', 'image'
    ];
  
    return (
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}
        
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={formData.excerpt}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        
        <div>
  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
    Content
  </label>
  <SimpleHtmlEditor 
    value={content}
    onChange={handleContentChange}
  />
  <p className="mt-1 text-xs text-gray-500">
    Use the toolbar to format your content. Select text first, then apply formatting.
  </p>
</div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
              Author
            </label>
            <input
              type="text"
              id="author"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formData.author}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="Company">Company</option>
              <option value="Design">Design</option>
              <option value="Technology">Technology</option>
              <option value="Crypto">Crypto</option>
              <option value="Artificial Intelligence">Artificial Intelligence</option>
              <option value="Work">Work</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="read_time" className="block text-sm font-medium text-gray-700 mb-1">
              Read Time
            </label>
            <input
              type="text"
              id="read_time"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formData.read_time}
              onChange={handleChange}
              placeholder="e.g. 5 min read"
              required
            />
          </div>
          
          <div>
            <label htmlFor="featured" className="block text-sm font-medium text-gray-700 mb-1">
              Featured Post?
            </label>
            <select
              id="featured"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formData.featured}
              onChange={handleChange}
            >
              <option value="0">No</option>
              <option value="1">Yes</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Featured Image
          </label>
          <div className="flex items-center space-x-4">
            {post?.image_path && !image && (
              <div className="w-24 h-24 rounded-md overflow-hidden">
                <img 
                  src={post.image_path.startsWith('http') ? post.image_path : `http://localhost:5000/${post.image_path}`} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {image && (
              <div className="w-24 h-24 rounded-md overflow-hidden">
                <img 
                  src={URL.createObjectURL(image)} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <label className="cursor-pointer bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors">
              <span className="text-sm text-gray-600">
                {post?.image_path || image ? "Change Image" : "Upload Image"}
              </span>
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
              />
            </label>
          </div>
        </div>
        
        <div className="pt-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => onSubmit()}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                {post ? "Updating..." : "Creating..."}
              </div>
            ) : (
              post ? "Update Blog Post" : "Create Blog Post"
            )}
          </button>
        </div>
      </form>
    );
  };

  const BlogPostDetails = ({ post }) => (
    <div className="space-y-6">
      <div>
        <h4 className="text-xl font-semibold text-gray-800">{post.title}</h4>
        <div className="flex items-center mt-2">
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            {post.category}
          </span>
          <span className="ml-4 text-sm text-gray-500">
            {post.read_time}
          </span>
          {post.featured && (
            <span className="ml-4 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
              Featured
            </span>
          )}
        </div>
      </div>
      
      {post.image_path && (
        <div className="rounded-lg overflow-hidden h-60">
          <img 
            src={post.image_path.startsWith('http') ? post.image_path : `http://localhost:5000/${post.image_path}`} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="border-t border-gray-200 pt-4">
        <p className="text-gray-600 font-medium">{post.excerpt}</p>
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <div className="prose prose-green max-w-none" dangerouslySetInnerHTML={{ __html: post.content }}></div>
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <dl className="divide-y divide-gray-200">
          <div className="py-3 grid grid-cols-3">
            <dt className="text-sm font-medium text-gray-500">Author</dt>
            <dd className="text-sm text-gray-900 col-span-2">{post.author}</dd>
          </div>
          <div className="py-3 grid grid-cols-3">
            <dt className="text-sm font-medium text-gray-500">Published Date</dt>
            <dd className="text-sm text-gray-900 col-span-2">{formatDate(post.date)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-bold text-green-700">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-green-500">
                <img 
                  src={userData?.profile_picture ? `http://localhost:5000/${userData.profile_picture}` : profilePic} 
                  alt="Admin profile" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <span className="font-medium text-gray-700">{userData?.name || 'Admin'}</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 bg-white rounded-xl shadow-sm p-4">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("overview")}
                className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                  activeTab === "overview"
                    ? "bg-green-50 text-green-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <BarChart2 className={`mr-3 ${activeTab === "overview" ? "text-green-700" : "text-gray-400"}`} size={20} />
                Overview
              </button>
              
              <button
                onClick={() => setActiveTab("users")}
                className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                  activeTab === "users"
                    ? "bg-green-50 text-green-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Users className={`mr-3 ${activeTab === "users" ? "text-green-700" : "text-gray-400"}`} size={20} />
                Users
              </button>
              
              <button
                onClick={() => setActiveTab("assessments")}
                className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                  activeTab === "assessments"
                    ? "bg-green-50 text-green-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FileText className={`mr-3 ${activeTab === "assessments" ? "text-green-700" : "text-gray-400"}`} size={20} />
                Assessments
              </button>
              
              <button
                onClick={() => setActiveTab("blog")}
                className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                  activeTab === "blog"
                    ? "bg-green-50 text-green-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <List className={`mr-3 ${activeTab === "blog" ? "text-green-700" : "text-gray-400"}`} size={20} />
                Blog Posts
              </button>
              
              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                  activeTab === "settings"
                    ? "bg-green-50 text-green-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Settings className={`mr-3 ${activeTab === "settings" ? "text-green-700" : "text-gray-400"}`} size={20} />
                Settings
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              {activeTab === "overview" && "Dashboard Overview"}
              {activeTab === "users" && "User Management"}
              {activeTab === "assessments" && "Assessment Management"}
              {activeTab === "blog" && "Blog Management"}
              {activeTab === "settings" && "Admin Settings"}
            </h2>
            
            {renderTabContent()}
          </main>
        </div>
      </div>

      {/* Render modal if open */}
      {renderModal()}
      
      {/* Render confirmation dialog if open */}
      {renderConfirmationDialog()}
    </div>
  );
};

export default AdminDashboard;