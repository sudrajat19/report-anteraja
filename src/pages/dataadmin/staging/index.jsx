/* eslint-disable */
import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Layout from "../layout";

export default function Staging() {
  const [staging, setStaging] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const stagingPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchUserRole = async () => {
      try {
        const decoded = jwtDecode(token);
        const resLogin = await axios.get(`http://localhost:3020/tampil/${decoded.id}`);

        const userRole = resLogin.data.role;
        if (userRole === "admin" || userRole === "leader") {
          navigate("/allstaging");
        } else {
          navigate("/home");
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, [navigate]);

  const fetchStaging = async () => {
    try {
      const res = await axios.get(`http://localhost:3020/tampilusersemuastaging/?page=${currentPage}&limit=${stagingPerPage}&search=${search}`);
      setStaging(res.data.staging);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Error fetching staging data:", error);
    }
  };

  useEffect(() => {
    fetchStaging();
  }, [currentPage, search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchStaging();
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <Layout>
      <main className="p-4 mt-[100px] md:p-8 font-nunito md:w-3/4 lg:w-full">
        <h2 className="text-lg md:text-xl font-bold">All Staging</h2>
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2 items-stretch">
          <input className="p-2 border rounded-lg border-secondary-10 w-full md:w-96" placeholder="Search" type="text" id="search" name="search" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button type="submit" className="bg-pink-500 p-2 rounded-lg flex items-center justify-center">
            <img src="/images/search.png" alt="search" className="w-4 h-4" />
          </button>
        </form>
        <div className="mt-8 md:mt-12 rounded-lg overflow-auto">
          <table className="w-full text-left border-2 min-w-[600px]">
            <thead className="bg-secondary-5">
              <tr>
                <th className="p-4 border-b">No</th>
                <th className="p-4 border-b">Nama</th>
                <th className="p-4 border-b">NIK</th>
                <th className="p-4 border-b">Staging</th>
                <th className="p-4 border-b">Role</th>
                <th className="p-4 border-b">Photo</th>
                <th className="p-4 border-b">Total Pickup</th>
                <th className="p-4 border-b">Total Delivery</th>
                <th className="p-4 border-b">Pending Pickup</th>
                <th className="p-4 border-b">Pending Delivery</th>
              </tr>
            </thead>
            <tbody>
              {staging.map((report, index) => (
                <tr key={index + 1} className="hover:bg-gray-100">
                  <td className="p-4 border-b">{(currentPage - 1) * stagingPerPage + index + 1}</td>
                  <td className="p-4 border-b">{report.nama}</td>
                  <td className="p-4 border-b">{report.nik}</td>
                  <td className="p-4 border-b uppercase">{report.staging}</td>
                  <td className="p-4 border-b">{report.role}</td>
                  <td className="p-4 border-b">
                    <img src={report.photo ? `http://localhost:3020/${report.photo}` : "/gambar/default.png"} alt={report.nama} className="w-full md:w-32 md:h-32 object-cover rounded" />
                  </td>
                  <td className="p-4 border-b">{report.total_pickup}</td>
                  <td className="p-4 border-b">{report.total_delivery}</td>
                  <td className="p-4 border-b">{report.pending_pickup}</td>
                  <td className="p-4 border-b">{report.pending_delivery}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex overflow-x-auto min-w-full items-center justify-center gap-2 mt-4 p-4 bg-gray-100 rounded-lg">
            {totalPages > 1 && (
              <button className={`text-blue-500 hover:underline ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`} onClick={handlePrevious} disabled={currentPage === 1}>
                Previous
              </button>
            )}
            {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => {
              const page = index + 1;
              return (
                <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1 border rounded-lg ${currentPage === page ? "bg-gray-300" : "hover:bg-gray-200"}`}>
                  {page}
                </button>
              );
            })}
            {totalPages > 1 && (
              <button className={`text-blue-500 hover:underline ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`} onClick={handleNext} disabled={currentPage === totalPages}>
                Next
              </button>
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
}
