import React, { useEffect, useState } from 'react';
import api from '../utils/axios'; 
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { token, logout } = useAuth();
  const [profile, setProfile] = useState({ name: '', email: '', address: '', phone: '', createdAt: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;

      try {
        const response = await api.get('/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Profile Data:', response);
        setProfile(response.data);
      } catch (err) {
        console.error('Profile fetch error:', err);
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const response = await api.put('/api/user/profile', profile, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Profile updated:', response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold">Profile</h2>

      <div className="space-y-2">
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Joined:</strong> {new Date(profile.createdAt).toLocaleDateString()}</p>

        {isEditing ? (
          <>
            <div>
              <label className="block">Address:</label>
              <input
                type="text"
                name="address"
                value={profile.address}
                onChange={handleChange}
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label className="block">Phone:</label>
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="border p-2 w-full"
              />
            </div>
          </>
        ) : (
          <>
            <p><strong>Address:</strong> {profile.address || 'N/A'}</p>
            <p><strong>Phone:</strong> {profile.phone || 'N/A'}</p>
          </>
        )}
      </div>

      <div className="flex justify-between">
        {isEditing ? (
          <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded-md">Save</button>
        ) : (
          <button onClick={handleEditToggle} className="bg-green-500 text-white px-4 py-2 rounded-md">Edit</button>
        )}
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md">Logout</button>
      </div>
    </div>
  );
};

export default ProfilePage;