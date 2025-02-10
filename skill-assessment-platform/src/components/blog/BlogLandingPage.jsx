import { useState } from "react";

const BlogLandingPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-green-600 text-xl font-bold">SkillsAssess</h1>
        <ul className="flex space-x-6 text-gray-700">
          <li><a href="/">Dashboard</a></li>
          <li><a href="/assessments">Assessments</a></li>
          <li><a href="#">Peer Reviews</a></li>
          <li className="text-green-600 font-bold">Blog</li>
        </ul>
      </nav>

      {/* Hero Section */}
      <header className="p-8 text-left">
        <h2 className="text-green-600 text-2xl font-semibold">Insights from our team</h2>
        <p className="text-gray-600">Advanced Assessment Tools and Features for Skill-Driven Learners</p>
        <input
          type="text"
          placeholder="🔍 Most in-demand skills..."
          className="mt-4 w-full max-w-md border p-2 rounded-lg"
        />
      </header>

      <div className="container mx-auto flex gap-8 p-8">
        {/* Sidebar */}
        <aside className="w-1/4 space-y-6">
          <div>
            <h3 className="font-semibold text-gray-700">Blog Topics</h3>
            <ul className="space-y-2 text-gray-600">
              <li>Company</li>
              <li>Design</li>
              <li>Technology</li>
              <li>Crypto</li>
              <li>Artificial Intelligence</li>
              <li>Work</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700">Guide and Tools</h3>
            <ul className="space-y-2 text-gray-600">
              <li>Guidelines</li>
              <li>Mentorship</li>
              <li>Tutorial</li>
              <li>Training</li>
              <li>Career</li>
              <li>Self Care</li>
            </ul>
          </div>
        </aside>

        {/* Blog Section */}
        <main className="w-3/4">
          {[1, 2, 3].map((item) => (
            <article key={item} className="flex gap-4 mb-8 bg-white p-4 rounded-lg shadow">
              <div className="w-1/4 bg-green-500 h-32 rounded-lg"></div>
              <div className="w-3/4">
                <p className="text-green-600">Mar 1</p>
                <h3 className="text-xl font-bold">Advanced Skill Assessment Tools and Features for Ambitious Learners</h3>
                <p className="text-gray-600 text-sm">I’m always exploring new and innovative ways to enhance learning experiences...</p>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <span className="px-2 py-1 bg-gray-200 rounded">Tools</span>
                  <span className="ml-4">By Anissa Tegawe</span>
                  <span className="ml-4 text-green-600">● 7 min read</span>
                </div>
              </div>
            </article>
          ))}
          <button className="bg-green-600 text-white py-2 px-4 rounded-lg">See More</button>
        </main>
      </div>

      {/* Newsletter */}
      <section className="bg-green-100 p-8 text-center">
        <h3 className="text-lg font-semibold text-green-700">Stay up to date</h3>
        <p className="text-gray-700 text-xl font-bold">Join Our Newsletter</p>
        <div className="mt-4 flex justify-center">
          <input type="email" placeholder="Enter your email.." className="border p-2 rounded-l-lg w-1/3" />
          <button className="bg-green-600 text-white p-2 rounded-r-lg">Submit</button>
        </div>
        <p className="text-xs text-gray-500 mt-2">*You can unsubscribe anytime</p>
      </section>

      {/* Footer */}
      <footer className="text-center p-4 bg-gray-200 text-gray-600">
        <h2 className="text-green-600 font-bold">SkillsAssess</h2>
        <p className="text-xs">© 2023 Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </footer>
    </div>
  );
};

export default BlogLandingPage;
