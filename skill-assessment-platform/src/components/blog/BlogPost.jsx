import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import blogPic from "../../assets/blogimage.jpeg";

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/blog-posts/${id}`);
        setPost(response.data);
      } catch (err) {
        setError('Failed to load blog post');
        console.error('Error fetching blog post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl text-red-600">{error}</h2>
          <Link to="/blog" className="text-green-600 hover:text-green-700 mt-4 inline-block">
            Return to Blog
          </Link>
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/blog" className="flex items-center text-green-600 hover:text-green-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Blog
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Blog Content */}
      <article className="max-w-3xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <div className="flex items-center text-sm text-gray-500">
            <span>
                <p className="text-green-600">
                {post.date.split('T')[0]}
                </p>
            </span>
            <span className="mx-2">•</span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
              {post.category}
            </span>
          </div>
        </header>

        <div className="mb-8">
          <img
            src={post.image_path?.startsWith('http') ? post.image_path : `http://localhost:5000/${post.image_path}`}
            alt={post.title}
            className="w-full h-96 object-cover rounded-lg shadow-lg"
            onError={(e) => {
              console.log("Blog image failed to load");
              e.target.src = blogPic;
            }}
          />
        </div>

        <div className="prose prose-green max-w-none">
          {post.content}
        </div>

        <footer className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex items-center">
            <img
              src={post.authorImage || blogPic}
              alt={post.author}
              className="h-12 w-12 rounded-full"
            />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">{post.author}</p>
              <p className="text-sm text-gray-500">{post.authorBio || 'Contributing Writer'}</p>
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
};

export default BlogPost;