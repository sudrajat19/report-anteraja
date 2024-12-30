import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Layout from "../layout";
import { useNavigate } from "react-router-dom";

export default function AddKategori() {
  const [employee, setEmployee] = useState({
    nama: "",
    password: "",
    nik: "",
    role: "",
    staging: "",
  });
  const [staging, setStaging] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const { data } = await axios.get(`http://localhost:3020/tampil/${decoded.id}`);
        setStaging(data.staging);
        setRole(data.role);

        if (data.role === "satria") {
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching user data:", error.response?.data || error.message);
        navigate("/");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!employee.nama || !employee.password || !employee.nik || !employee.role) {
      alert("Harap isi semua field!");
      return;
    }

    try {
      await axios.post("http://localhost:3020/addusers", { ...employee, staging });
      alert("Data berhasil ditambahkan!");
      window.location.reload();
    } catch (error) {
      console.error("Error submitting data:", error.response?.data || error.message);
      alert("Terjadi kesalahan, silakan coba lagi.");
    }
  };

  return (
    <Layout>
      <div className="p-8 w-full mt-[50px]">
        <h2 className="text-xl font-bold font-nunito">Add Employee</h2>
        <form className="mt-4 border p-8 grid gap-4" onSubmit={handleSubmit}>
          {/* Staging */}
          <div className="flex gap-4 mb-2">
            <label htmlFor="staging" className="w-24 font-semibold">
              Staging:
            </label>
            <input
              className={`p-2 rounded-lg w-full h-8 ${role === "admin" ? "border" : "uppercase font-semibold text-black"}`}
              id="staging"
              name="staging"
              value={role === "admin" ? employee.staging : staging}
              onChange={role === "admin" ? handleChange : undefined}
              readOnly={role !== "admin"}
              placeholder={role !== "admin" ? "" : "staging"}
              required
            />
          </div>

          {/* Nama */}
          <div className="flex gap-4 mb-2">
            <label htmlFor="nama" className="w-24 font-semibold">
              Nama:
            </label>
            <input className="p-2 border rounded-lg border-secondary-10 w-full h-8" id="nama" placeholder="Nama" type="text" name="nama" value={employee.nama} onChange={handleChange} required />
          </div>

          {/* Password */}
          <div className="flex gap-4 mb-2">
            <label htmlFor="password" className="w-24 font-semibold">
              Password:
            </label>
            <input className="p-2 border rounded-lg border-secondary-10 w-full h-8" id="password" placeholder="Password" type="password" name="password" value={employee.password} onChange={handleChange} required />
          </div>

          {/* NIK */}
          <div className="flex gap-4 mb-2">
            <label htmlFor="nik" className="w-24 font-semibold">
              NIK:
            </label>
            <input className="p-2 border rounded-lg border-secondary-10 w-full h-8" id="nik" placeholder="NIK" type="text" name="nik" value={employee.nik} onChange={handleChange} required />
          </div>

          {/* Role */}
          <div className="flex gap-4 mb-2">
            <label htmlFor="role" className="w-24 font-semibold">
              Role:
            </label>
            <select name="role" id="role" className="p-2 border rounded-lg w-full" onChange={handleChange} required>
              <option value="">Pilih role</option>
              {role === "admin" ? <option value="admin">Admin</option> : ""}
              <option value="leader">Leader</option>
              <option value="satria">Satria</option>
            </select>
          </div>

          {/* Button */}
          <div className="flex gap-8 justify-end">
            <button type="submit" className="bg-pink-500 text-white font-semibold p-2 w-[100px] rounded-md">
              Simpan
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
