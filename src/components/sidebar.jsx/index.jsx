import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Sidebar() {
  const [active, setActive] = useState(false);
  const [staging, setStaging] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setActive(token);
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/");
      return;
    }

    const decoded = jwtDecode(token);
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`http://localhost:3020/tampil/${decoded.id}`);
        const { staging } = res.data;
        setStaging(staging);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [navigate]);
  const links = [
    {
      to: "/allstaging",
      text: "All Staging",
    },
    {
      to: "/admin",
      text: `Staging ${staging}`,
    },
    {
      to: "/employee",
      text: "Add Employee",
    },
    {
      to: "/terminate",
      text: "To Terminate Employee",
    },
  ];

  return (
    <>
      {active ? (
        <div className="md:min-w-[243px] text-black min-w-32 min-h-screen pt-[100px] shadow-lg p-6 gap-8">
          <div className={`gap-6 grid p-1 font-semibold`}>
            {links.map((link, index) => (
              <div key={index}>
                <p className={`p-2 hover:bg-pink-500 hover:text-white rounded  ${"bg-primary-50 rounded"}`}>
                  <a href={link.to}>{link.text}</a>
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
