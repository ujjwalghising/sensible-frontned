import React, { useEffect, useState } from "react";
import api from "../utils/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/user/profile");
        setProfile(res.data);
      } catch (err) {
        setError("Not logged in");
        navigate("/login"); // redirect if unauthorized
      }
    };
  
    fetchProfile();
  }, []);
  

  const handleEditToggle = () => setIsEditing((prev) => !prev);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await api.put("/api/user/profile", profile);
      setProfile(response.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold">Profile</h2>

      {profile ? (
        <>

          <div className="space-y-2">
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Role:</strong> {profile.role}</p>
            <p><strong>Joined:</strong> {new Date(profile.createdAt).toLocaleDateString()}</p>

            {isEditing ? (
              <>
                <label>
                  Address:
                  <input
                    type="text"
                    name="address"
                    value={profile.address || ""}
                    onChange={handleChange}
                    className="border p-2 w-full"
                  />
                </label>
                <label>
                  Phone:
                  <input
                    type="text"
                    name="phone"
                    value={profile.phone || ""}
                    onChange={handleChange}
                    className="border p-2 w-full"
                  />
                </label>
              </>
            ) : (
              <>
                <p><strong>Address:</strong> {profile.address || "N/A"}</p>
                <p><strong>Phone:</strong> {profile.phone || "N/A"}</p>
              </>
            )}
          </div>

          <div className="flex justify-between mt-4">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Save
              </button>
            ) : (
              <button
                onClick={handleEditToggle}
                className="bg-green-500 text-white px-4 py-2 rounded-md"
              >
                Edit
              </button>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Logout
            </button>
          </div>
        </>
      ) : (
        <p>Loading ...</p>
      )}
    </div>
  );
};

export default ProfilePage;
