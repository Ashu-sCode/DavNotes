import React from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";

const ProfileFab = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/profile");
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Go to Profile"
      title="Profile"
      className="
        fixed
        right-6
        bottom-20
        z-50
        bg-indigo-600 hover:bg-indigo-700
        text-white
        p-4
        rounded-full
        shadow-lg
        flex
        items-center
        justify-center
        transition-all duration-300 ease-in-out
        transform hover:scale-110 active:scale-95
        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-indigo-400
        focus-visible:ring-offset-2
        dark:bg-indigo-500 dark:hover:bg-indigo-600
      "
    >
      <User size={24} />
    </button>
  );
};

export default ProfileFab;
