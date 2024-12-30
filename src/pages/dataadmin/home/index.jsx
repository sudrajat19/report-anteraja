import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Layout from "../layout";

export default function Home() {
  const [reports, setReports] = useState([]);
  const [staging, setStaging] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const reportsPerPage = 10;
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
          navigate("/admin");
        } else {
          navigate("/home");
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        alert("Terjadi kesalahan saat memuat data user.");
      }
    };

    fetchUserRole();
  }, [navigate]);

  useEffect(() => {
    let isMounted = true;
    const fetchReports = async () => {
      try {
        const res = await axios.get(`http://localhost:3020/tampiluserstaging/${staging}?page=${currentPage}&limit=${reportsPerPage}`);
        if (isMounted) {
          setReports(res.data.report || []);
          setTotalPages(res.data.totalPages);
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    if (staging) fetchReports();
    return () => (isMounted = false);
  }, [staging, currentPage]);

  const handleReset = async () => {
    try {
      await axios.delete(`http://localhost:3020/resetreport`);
      window.location.reload();
    } catch (error) {
      console.error("Error resetting report:", error);
      alert("Gagal mereset report.");
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <Layout>
      <main className="p-4 mt-[100px] md:p-8 font-nunito md:w-3/4 lg:w-full">
        <div className="flex justify-between">
          {reports && reports.length > 0 && reports[0] && <h2 className="text-lg md:text-xl font-bold">Report {reports[0].staging}</h2>}
          <div className="flex gap-2">
            <a className="text-white font-semibold bg-pink-500 rounded p-1" href={`http://localhost:3020/downloadlaporanpdf/${staging}`}>
              Download Report
            </a>
            <p onClick={handleReset} className="bg-pink-500 cursor-pointer p-1 font-semibold text-white rounded">
              Reset Report
            </p>
          </div>
        </div>
        <div className="mt-8 md:mt-12 rounded-lg overflow-auto">
          <table className="w-full text-left border-2 min-w-[600px]">
            <thead className="bg-secondary-5">
              <tr>
                {["No", "Nama", "NIK", "Staging", "Role", "Photo", "Total Pickup", "Total Delivery", "Pending Pickup", "Pending Delivery"].map((header, index) => (
                  <th key={index + 1} className="p-4 border-b">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => (
                <tr key={report.id_report} className="hover:bg-gray-100">
                  <td className="p-4 border-b">{(currentPage - 1) * reportsPerPage + index + 1}</td>
                  <td className="p-4 border-b">{report.nama}</td>
                  <td className="p-4 border-b">{report.nik}</td>
                  <td className="p-4 border-b">{report.staging}</td>
                  <td className="p-4 border-b">{report.role}</td>
                  <td className="p-4 border-b">
                    <img src={`http://localhost:3020/${report.image}`} alt={report.photo} className="w-full md:w-32 md:h-32 object-cover rounded" />
                  </td>
                  <td className="p-4 border-b">{report.total_pickup}</td>
                  <td className="p-4 border-b">{report.total_delivery}</td>
                  <td className="p-4 border-b">{report.pending_pickup}</td>
                  <td className="p-4 border-b">{report.pending_delivery}</td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr>
                  <td colSpan="10" className="p-4 text-center">
                    Tidak ada report untuk ditampilkan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
      </main>
    </Layout>
  );
}
