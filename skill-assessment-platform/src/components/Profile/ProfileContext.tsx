import React, { createContext, useState, ReactNode } from "react";

interface Profile {
  name: string;
  email: string;
  bio: string;
  profilePic: string;
  skills: string[];
}

interface ProfileContextType {
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
  updateProfile: (profile: Profile) => void;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const [profile, setProfile] = useState<Profile>({
    name: "Marry Doe",
    email: "marrydoe@example.com",
    bio: "Aspiring Software Developer passionate about AI and Web Development",
    profilePic: "/path/to/default/image.jpg",
    skills: ["React", "Node.js", "Problem-Solving", "Communication"],
  });

  const updateProfile = (newProfile: Profile) => {
    setProfile(newProfile);
  };

  return (
    <ProfileContext.Provider value={{ profile, setProfile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

console.log({ ProfileContext, ProfileProvider });
