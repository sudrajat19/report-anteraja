import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Layout from "../layout";

export default function TerminateEmployee() {
  const [showUser, setShowUser] = useState([]);
  const [staging, setStaging] = useState("");
  const [terminate, setTerminate] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/");
      return;
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUserRole = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      try {
        const decoded = jwtDecode(token);
        const res = await axios.get(`http://localhost:3020/tampil/${decoded.id}`);
        const { role, staging } = res.data || {};

        setStaging(staging || "");
        if (role === "admin" || role === "leader") {
          navigate("/terminate");
        } else {
          navigate("/home");
        }
      } catch (error) {
        console.error("Error fetching user role:", error.response?.data || error.message);
        alert("Terjadi kesalahan saat memuat data user.");
      }
    };

    fetchUserRole();
  }, [navigate]);

  useEffect(() => {
    if (!staging) return;

    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3020/tampiluserstaging/${staging}`);
        setShowUser(data.report || []);
      } catch (error) {
        console.error("Error fetching users:", error.response?.data || error.message);
      }
    };

    fetchUsers();
  }, [staging]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTerminate((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    if (!terminate.nama || !terminate.nik) {
      alert("Harap pilih nama dan NIK untuk dihapus.");
      return;
    }

    try {
      await axios.delete("http://localhost:3020/deleteusersbynameandnik", {
        data: terminate,
      });
      alert("User berhasil dihapus.");
      window.location.reload();
      setShowUser((prev) => prev.filter((user) => user.nik !== terminate.nik));
    } catch (error) {
      console.error("Ada kesalahan dalam menghapus data:", error.response?.data || error.message);
      alert("Gagal menghapus user.");
    }
  };

  return (
    <Layout>
      <div className="p-8 w-full pt-[100px]">
        <h2 className="text-xl font-nunito">Terminate Employee</h2>
        <form className="mt-4 border p-8 grid gap-4" onSubmit={handleDelete}>
          <div className="flex gap-4 mb-2">
            <label htmlFor="nama" className="w-24 font-semibold">
              Nama:
            </label>
            <select name="nama" id="nama" className="p-2 border rounded-lg w-full" onChange={handleChange} required>
              <option value="">Pilih Nama</option>
              {showUser.length > 0 ? (
                showUser.map((user, index) => (
                  <option key={index} value={user.nama}>
                    {user.id_users} - {user.nama}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Tidak ada data
                </option>
              )}
            </select>
          </div>

          <div className="flex gap-4 mb-2">
            <label htmlFor="nik" className="w-24 font-semibold">
              NIK:
            </label>
            <select name="nik" id="nik" className="p-2 border rounded-lg w-full" onChange={handleChange} required>
              <option value="">Pilih NIK</option>
              {showUser.length > 0 ? (
                showUser.map((user, index) => (
                  <option key={index} value={user.nik}>
                    {user.id_users} - {user.nik}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Tidak ada data
                </option>
              )}
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex gap-8 justify-end">
            <button type="submit" className="bg-pink-500 text-white p-2 w-[100px] rounded-md hover:bg-pink-600">
              Delete
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
