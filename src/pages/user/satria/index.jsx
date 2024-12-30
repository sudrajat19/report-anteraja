import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../../components/navbar/navbar";
import { useNavigate } from "react-router-dom";

export default function Satria() {
  const [gallery, setGallery] = useState([]);
  const [filteredGallery, setFilteredGallery] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/");
      return;
    }
  }, [navigate]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get("http://localhost:3020/tampil");
        const sortedGallery = response.data.sort((a, b) => a.staging - b.staging);
        setGallery(sortedGallery);
        setFilteredGallery(sortedGallery);
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    const results = gallery.filter((member) => member.nama.toLowerCase().includes(searchQuery.toLowerCase()) || member.staging.toString().includes(searchQuery));
    setFilteredGallery(results);
  }, [searchQuery, gallery]);

  const handleMemberClick = async (id_users) => {
    try {
      const response = await axios.get(`http://localhost:3020/tampilreportusers/${id_users}`);
      setSelectedMember(response.data.data[0]);
      console.log(response.data.data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const closeDetail = () => {
    setSelectedMember(null);
  };

  return (
    <>
      <Navbar />
      <div className="container pt-[100px] mx-auto h-screen mb-20">
        <div className="py-8 px-4 sm:px-[100px]">
          <div className="flex justify-between mb-6">
            <h2 className="text-2xl font-bold capitalize text-black">All Satria</h2>
          </div>

          <div className="mb-4">
            <input type="text" placeholder="Cari anggota..." className="w-full px-3 py-2 border rounded" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {filteredGallery.map((glr) => (
              <div key={glr.id_users} id="kartu" className="card w-56 block bg-white hover:bg-neutral-200 transition duration-200 ease-in-out rounded-lg shadow-md p-2 cursor-pointer" onClick={() => handleMemberClick(glr.id_users)}>
                <img src={"http://localhost:3020/" + glr.photo} className="mx-auto mb-4 rounded-full w-24 h-24 object-cover" alt={glr.nama} />
                <p className="text-center font-semibold">{glr.nama}</p>
              </div>
            ))}
          </div>

          {selectedMember && (
            <div className="fixed inset-0 flex pt-[100px] items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <img src={"http://localhost:3020/" + selectedMember.photo} className="mx-auto mb-4 rounded-full w-32 h-32 object-cover" alt={selectedMember.nama} />
                <h3 className="text-xl font-bold text-center mb-2">{selectedMember.nama}</h3>
                <p>
                  <strong>NIK:</strong> {selectedMember.nik}
                </p>
                <p>
                  <strong>Role:</strong> {selectedMember.role}
                </p>
                <p>
                  <strong>staging:</strong> {selectedMember.staging}
                </p>
                <p>
                  <strong>total_pickup:</strong> {selectedMember.total_pickup}
                </p>
                <p>
                  <strong>total_delivery:</strong> {selectedMember.total_delivery}
                </p>
                <p>
                  <strong>pending_pickup:</strong> {selectedMember.pending_pickup}
                </p>
                <p>
                  <strong>pending_delivery:</strong> {selectedMember.pending_delivery}
                </p>
                <button className="mt-4 bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600" onClick={closeDetail}>
                  Tutup
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
