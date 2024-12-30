import axios from "axios";
import Navbar from "../../../components/navbar/navbar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
const ReportForm = () => {
  const [report, setReport] = useState([]);
  const [user, setUser] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  console.log("check", report);
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const decode = jwtDecode(token);
    console.log(decode);
    const fetchUser = async () => {
      const user = await axios.get(`http://localhost:3020/tampil/${decode.id}`);
      setUser(user.data);
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.preventDefault();
    const formData = new FormData();
    formData.append("id_users", user.id_users);
    formData.append("total_pickup", report.total_pickup ? report.total_pickup : 0);
    formData.append("total_delivery", report.total_delivery);
    formData.append("pending_pickup", report.pending_pickup ? report.pending_pickup : 0);
    formData.append("pending_delivery", report.pending_delivery ? report.pending_delivery : 0);
    formData.append("image", selectedFile);
    formData.forEach((value, key) => {
      console.log(`ini yang saya check :${key}:`, value);
    });
    try {
      await axios.post("http://localhost:3020/addreport", formData);
      navigate("/home");
    } catch (error) {
      console.error("Error saat mengirim data:", error);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setReport((prev) => ({ ...prev, [name]: value }));
  };
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center pt-[100px] min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center uppercase text-gray-800 mb-6">Report SS {user.staging}</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="font-semibold block text-gray-700">Nama</label>
              <input type="text" name="nama" value={user.nama} className="w-full px-4 py-2 font-semibold rounded-md focus:ring focus:ring-indigo-200" required readOnly />
            </div>

            <div>
              <label className="font-semibold block text-gray-700">NIK Satria</label>
              <input type="text" name="nik" value={user.nik} className="w-full px-4 py-2  rounded-md focus:ring focus:ring-indigo-200" required readOnly />
            </div>

            <div className="font-semibold block text-gray-700">
              <label htmlFor="total delivery" className="w-24">
                Total Delivery:
              </label>
              <input
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-indigo-200"
                id="total delivery"
                placeholder="Total delivery"
                type="number"
                name="total_delivery"
                value={report.total_delivery}
                onChange={handleChange}
                required
              />
            </div>
            <div className="font-semibold block text-gray-700">
              <label htmlFor="total pickup" className="w-24">
                Total Pickup:
              </label>
              <input className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-indigo-200" id="total pickup" placeholder="Total pickup" type="number" name="total_pickup" value={report.total_pickup} onChange={handleChange} />
            </div>

            <div className="font-semibold block text-gray-700">
              <label htmlFor="pending pickup" className="w-24">
                Pending Pickup:
              </label>
              <input
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-indigo-200"
                id="pending pickup"
                placeholder="Pending pickup"
                type="number"
                name="pending_pickup"
                value={report.pending_pickup}
                onChange={handleChange}
              />
            </div>
            <div className="font-semibold block text-gray-700">
              <label htmlFor="pending delivery" className="w-24">
                Pending Delivery:
              </label>
              <input
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-indigo-200"
                id="pending delivery"
                placeholder="Pending delivery"
                type="number"
                name="pending_delivery"
                value={report.pending_delivery}
                onChange={handleChange}
              />
            </div>
            <div className="flex gap-4 mb-2">
              <label htmlFor="photo" className="w-24">
                photo:
              </label>
              <input className="border rounded-lg border-secondary-10 w-full h-8" id="photo" placeholder="URL photo" type="file" name="photo" onChange={handleFileChange} required />
            </div>

            {selectedFile && (
              <div className="flex gap-4 mb-2">
                <label className="w-24">Preview:</label>
                <img src={"http://localhost:3020/" + selectedFile} className="mx-auto" />
              </div>
            )}

            <button
              type="submit"
              className={`w-full px-4 py-2 font-bold text-white bg-pink-600 rounded-md "opacity-50"
            }`}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ReportForm;
