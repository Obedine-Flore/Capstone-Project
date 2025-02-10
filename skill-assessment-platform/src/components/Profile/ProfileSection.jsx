import React from "react";

const ProfileSection = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full text-center">
        <h2 className="text-green-700 text-xl font-bold text-left">Profile</h2>
        <div className="flex flex-col items-center mt-4">
          <img
            src="https://source.unsplash.com/150x150/?mint" // Replace with user's profile image
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
          />
          <h3 className="mt-4 text-lg font-bold">John Doe</h3>
          <p className="text-gray-600">johndoe@example.com</p>
          <p className="text-gray-500 text-sm mt-2">
            Aspiring Software Developer passionate about AI and Web Development
          </p>
        </div>

        <div className="mt-6 text-left">
          <h4 className="text-lg font-bold">Skills</h4>
          <div className="flex flex-wrap gap-3 mt-2">
            {["React", "Node.js", "Problem-Solving", "Communication"].map(
              (skill) => (
                <span
                  key={skill}
                  className="bg-green-500 text-white px-4 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              )
            )}
          </div>
        </div>

        <button className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileSection;
