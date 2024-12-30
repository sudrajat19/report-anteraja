import { useEffect, useState } from "react";
import Navbar from "../../../components/navbar/navbar";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [showFullImage, setShowFullImage] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/");
    } else {
      fetchUserData(token);
    }
  }, [navigate]);

  const fetchUserData = async (token) => {
    try {
      const decoded = jwtDecode(token);
      const res = await axios.get(`http://localhost:3020/tampil/${decoded.id}`);
      setUser(res.data);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to load user data. Please try again.");
    }
  };

  const handleOpenPasswordModal = () => setShowPasswordModal(true);
  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
    setNewPassword("");
    setConfirmPassword("");
  };
  const handleImageClick = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleCloseFullImage = () => setShowFullImage(false);
  const handleViewImage = () => {
    setShowFullImage(true);
    handleCloseModal();
  };

  const handleImageChange = (event) => {
    setNewImage(event.target.files[0]);
  };

  const handleReplaceImage = async () => {
    if (!newImage) {
      alert("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("photo", newImage);

    try {
      const token = localStorage.getItem("accessToken");
      const decoded = jwtDecode(token);
      await axios.put(`http://localhost:3020/updateusers/${decoded.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Profile image updated successfully!");

      setUser((prevUser) => ({
        ...prevUser,
        photo: URL.createObjectURL(newImage),
      }));

      setNewImage(null);
      handleCloseModal();
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile image:", error.response || error);
      alert("Failed to update profile image.");
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const decoded = jwtDecode(token);
      await axios.put(
        `http://localhost:3020/updatepassword/${decoded.id}`,
        { password: newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Password changed successfully!");
      handleClosePasswordModal();
    } catch (error) {
      console.error("Error changing password:", error.response || error);
      alert("Failed to change password.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="pt-[100px] px-4 md:px-[100px]">
        <div className="p-5 rounded shadow w-1/2 mx-auto mt-[100px] bg-white">
          <h1 className="font-bold text-2xl text-center mb-6">Profile</h1>

          {error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : !user ? (
            <p className="text-center">Loading...</p>
          ) : (
            <div className="relative">
              <img
                src={user.photo ? `http://localhost:3020/${user.photo}` : "https://via.placeholder.com/150"}
                alt="Foto Profil"
                className="w-32 h-32 border-2 border-pink-500 cursor-pointer rounded-full mx-auto mb-4"
                onClick={handleImageClick}
              />
              <h2 className="text-xl text-center">
                <span className="font-semibold">Nama:</span> {user.nama}
              </h2>
              <p className="text-center">
                <span className="font-semibold">NIK:</span> {user.nik}
              </p>
              <p className="text-center font-semibold">
                Role:<span className=" uppercase"> {user.role}</span>
              </p>
              <p className="text-center font-bold">
                Staging: <span className="uppercase">{user.staging}</span>
              </p>
              <button onClick={handleOpenPasswordModal} className="mt-4 w-full bg-pink-500 text-white rounded p-2 hover:bg-pink-600 transition">
                Change Password
              </button>
            </div>
          )}
        </div>
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
              <h2 className="text-lg font-bold mb-4">Options</h2>
              <button className="block w-full bg-green-500 text-white rounded p-2 mb-2" onClick={handleViewImage}>
                View Full Image
              </button>
              <input type="file" onChange={handleImageChange} className="block w-full mb-2" />
              <button className="block w-full bg-pink-500 text-white rounded p-2" onClick={handleReplaceImage}>
                Change Image
              </button>
              <button className="block w-full bg-gray-500 text-white rounded p-2 mt-2" onClick={handleCloseModal}>
                Cancel
              </button>
            </div>
          </div>
        )}
        {showFullImage && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
            <div className="relative">
              <img src={`http://localhost:3020/${user.photo}`} alt="Foto Profil Penuh" className="w-96 h-96 mx-auto rounded-lg" />
              <button onClick={handleCloseFullImage} className="absolute top-0 right-0 m-4 bg-gray-800 text-white rounded-full p-2">
                Close
              </button>
            </div>
          </div>
        )}
        {showPasswordModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
              <h2 className="text-lg font-bold mb-4">Change Password</h2>
              <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="border rounded p-2 mb-2 w-full" />
              <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="border rounded p-2 mb-2 w-full" />
              <button onClick={handleChangePassword} className="block w-full bg-pink-500 text-white rounded p-2">
                Submit
              </button>
              <button onClick={handleClosePasswordModal} className="block w-full bg-gray-500 text-white rounded p-2 mt-2">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
